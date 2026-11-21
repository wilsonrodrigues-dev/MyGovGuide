import {createHash} from 'node:crypto';
import {connectDB,disconnectDB} from '../src/config/db.js';
import {models} from '../src/models/index.js';
import {schemeUrl} from '../src/services/ingestion/schemeIdentity.js';
import {normalizeSearch} from '../src/services/content/contracts.js';
const digest=items=>createHash('sha256').update(JSON.stringify(items)).digest('hex');
const omitMetadata=s=>Object.fromEntries(Object.entries(s).filter(([k])=>!['canonicalId','identityName','identityUrls','updatedAt'].includes(k)));
const apply=process.argv.includes('--apply');
try{await connectDB();const schemes=await models.Scheme.find().sort({_id:1}).lean();const before=digest(schemes.map(omitMetadata));let changed=0;
 if(apply){for(const name of ['SchemeIdentity','IdentityReviewCandidate','CollectionObservation']){await models[name].createCollection();await models[name].createIndexes();}await models.Scheme.createIndexes();}
 for(const s of schemes){if(s.canonicalId&&s.canonicalId!==s.id)throw Error('Canonical ID conflict requires explicit review');const fields={canonicalId:s.id,identityName:normalizeSearch(s.title),identityUrls:[...new Set([...(s.identityUrls||[]),schemeUrl(s.sourceUrl)])]};if(s.canonicalId!==fields.canonicalId||s.identityName!==fields.identityName||JSON.stringify(s.identityUrls||[])!==JSON.stringify(fields.identityUrls)){changed++;if(apply)await models.Scheme.updateOne({_id:s.id},{$set:fields},{runValidators:true});}}
 const after=digest((await models.Scheme.find().sort({_id:1}).lean()).map(omitMetadata));if(after!==before)throw Error('Existing scheme content changed unexpectedly');console.log(JSON.stringify({mode:apply?'APPLIED_METADATA_ONLY':'DRY_RUN',schemes:schemes.length,metadataRows:changed,originalSchemeContentUnchanged:before===after,officialIdMappingsCreated:0,crossSourceMappingsApproved:0,publicationActions:0,generationCalls:0}));
}finally{await disconnectDB();}
