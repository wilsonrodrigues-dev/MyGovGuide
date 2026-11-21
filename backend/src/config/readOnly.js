const mutations=new Set(['insertOne','insertMany','updateOne','updateMany','replaceOne','deleteOne','deleteMany','findOneAndUpdate','findOneAndReplace','findOneAndDelete','bulkWrite','createIndex','createIndexes','dropIndex','dropIndexes','drop','rename','findAndModify','findAndRemove','initializeOrderedBulkOp','initializeUnorderedBulkOp']);
const blocked=()=>{throw Object.assign(Error('Legacy database is read-only; mutation denied'),{category:'LEGACY_DATABASE_WRITE_DENIED'});};
export function guardReadOnlyDatabase(db){
 const collection=db.collection.bind(db),handles=new WeakMap();
 db.collection=(...args)=>{const c=collection(...args);if(handles.has(c))return handles.get(c);const proxy=new Proxy(c,{get(target,key){if(mutations.has(key))return blocked;if(key==='aggregate')return(pipeline,...rest)=>{if(pipeline.some(s=>s.$out||s.$merge))return blocked();return target.aggregate(pipeline,...rest);};const v=Reflect.get(target,key);return typeof v==='function'?v.bind(target):v;}});handles.set(c,proxy);return proxy;};
 for(const key of ['createCollection','dropCollection','dropDatabase','renameCollection','createIndex'])db[key]=blocked;
 const command=db.command.bind(db);db.command=(value,...args)=>{const allowed=['hello','isMaster','ping','buildInfo','listCollections','listIndexes','collStats','dbStats','count','find','getMore','killCursors','explain'];if(!allowed.some(k=>k in value)&&!(value.aggregate&&!value.pipeline?.some(s=>s.$out||s.$merge)))return blocked();return command(value,...args);};
 return db;
}
