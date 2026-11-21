import mongoose from 'mongoose';
import { models } from '../../models/index.js';
import { requireTransactions } from '../../config/db.js';
import { AIArtifact, AIJob, SchemeSearchDocument } from '../../models/content.js';

async function references(store, value, session) {
  const links = { sourceId: 'Source', sourceIds: 'Source', schemeId: 'Scheme', relatedSchemeId: 'Scheme', linkedSchemeIds: 'Scheme',
    sourceVersionId: 'SourceVersion', sourceVersionIds: 'SourceVersion', currentVersionId: 'SourceVersion',
    previousVersionId: 'SourceVersion', approvedVersionId: 'SourceVersion', oldVersionId: 'SourceVersion', newVersionId: 'SourceVersion', versionId: 'SourceVersion', runId: 'IngestionRun' };
  for (const [field, type] of Object.entries(links)) {
    const ids = value[field] == null ? [] : Array.isArray(value[field]) ? value[field] : [value[field]];
    for (const id of ids) if (!await store.get(type, id, session)) throw new Error(`Missing ${field} reference`);
  }
}
export function scopedStore(store, session) {
  return { get: (type, id) => store.get(type, id, session), list: (type, filter) => store.list(type, filter, session),
    put: (type, value) => store.put(type, value, session), touch: (type,id,fields)=>store.touch(type,id,fields,session), findSchemes:args=>store.findSchemes(args,session), transaction: work => work(session) };
}

export class MongoStore {
  async get(type, id, session) { return models[type].findById(id).session(session || null).lean(); }
  async list(type, filter = {}, session) { return models[type].find(filter).session(session || null).lean(); }
  async findSchemes({id,url,name,title},session){return models.Scheme.find({$or:[{_id:id},{identityUrls:url},{sourceUrl:url},{identityName:name},{title}]}).session(session||null).lean();}
  async touch(type,id,fields,session){
    if(!Object.keys(fields).every(k=>['lastCheckedAt','lastChangedAt','lastCollectionStatus','lastCollectionSourceId','lastCollectionRunId','canonicalId','identityName','identityUrls'].includes(k)))throw Error('Metadata update is outside allowed fields');
    await models[type].updateOne({_id:id},{$set:fields},{session,runValidators:true});
  }
  async put(type, value, session) {
    if (['SourceVersion', 'ReviewEvent','CollectionObservation'].includes(type) && await this.get(type, value.id, session)) throw new Error('Historical versions and review events are immutable');
    if(type==='SchemeIdentity'){const old=await this.get(type,value.id,session);if(old&&old.schemeId!==value.schemeId)throw Error('Canonical identity is already bound to another scheme');}
    const doc = new models[type]({ ...value, _id: value.id });
    await doc.validate();
    await references(this, value, session);
    const data = doc.toObject();
    delete data.__v;
    await models[type].replaceOne({ _id: value.id }, data, { upsert: true, session });
    if (type === 'Scheme' && (value.cacheStale || value.publicationStatus !== 'PUBLISHED')) {
      await AIArtifact.updateMany({ schemeId: value.id, stale: false }, { $set: { stale: true } }, { session });
      await SchemeSearchDocument.updateMany({ schemeId: value.id, published: true }, { $set: { published: false } }, { session });
      await AIJob.updateMany({ schemeId: value.id, state: { $in: ['QUEUED','DEFERRED'] }, sourceVersionId: { $ne: value.currentVersionId } }, { $set: { state: 'STALE', errorCode: 'SOURCE_CHANGED' } }, { session });
    }
    return value;
  }
  async transaction(work) {
    await requireTransactions();
    const session = await mongoose.startSession();
    try { let result; await session.withTransaction(async () => { result = await work(session); }); return result; }
    finally { await session.endSession(); }
  }
}
// Independent tests use this explicit test double; CLI commands always use MongoDB.
export class MemoryStore {
  constructor() { this.tables = {}; }
  async get(type, id) { return structuredClone(this.tables[type]?.[id] || null); }
  async findSchemes({id,url,name,title}){return structuredClone(Object.values(this.tables.Scheme||{}).filter(s=>s.id===id||s.identityUrls?.includes(url)||s.sourceUrl===url||s.identityName===name||s.title===title));}
  async list(type, filter = {}) {
    return structuredClone(Object.values(this.tables[type] || {}).filter(v => Object.entries(filter).every(([k, val]) => Array.isArray(v[k])?v[k].includes(val):v[k] === val)));
  }
  async touch(type,id,fields){const old=await this.get(type,id);if(old)this.tables[type][id]={...old,...structuredClone(fields)};}
  async put(type, value) {
    if (['SourceVersion', 'ReviewEvent','CollectionObservation'].includes(type) && await this.get(type, value.id)) throw new Error('Historical versions and review events are immutable');
    if(type==='SchemeIdentity'){const old=await this.get(type,value.id);if(old&&old.schemeId!==value.schemeId)throw Error('Canonical identity is already bound to another scheme');}
    await new models[type]({ ...value, _id: value.id }).validate();
    await references(this, value);
    this.tables[type] ||= {}; this.tables[type][value.id] = structuredClone(value); return value;
  }
  async transaction(work) {
    const before = structuredClone(this.tables);
    try { return await work(); } catch (error) { this.tables = before; throw error; }
  }
}
