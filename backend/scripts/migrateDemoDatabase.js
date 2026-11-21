// Additive, idempotent demo migration. Reads the legacy database and inserts
// missing records into the explicitly configured demo database. It never
// deletes, replaces or writes to the legacy database.
import fs from 'node:fs/promises';
import path from 'node:path';
import dns from 'node:dns';
import mongoose from 'mongoose';
import {MongoClient} from 'mongodb';
import {connectDB,disconnectDB,databaseTarget} from '../src/config/db.js';
import {env,projectRoot} from '../src/config/env.js';
import {initModels} from '../src/models/index.js';
import {initAdminModels} from '../src/models/admin.js';
import {migrationFilters} from '../src/services/ingestion/demoMigration.js';

const apply=process.argv.includes('--apply');
const selectedIds=[...new Set(process.argv.filter(v=>v.startsWith('--scheme-id=')).map(v=>v.slice(12)))];
if(apply&&(!selectedIds.length||selectedIds.length>10))throw Error('Targeted migration requires 1–10 explicit --scheme-id=ID arguments. Operational queues and historical observations are excluded.');
const sourceName=env.LEGACY_MONGODB_DB_NAME||'mygovguide_dev';
const sourceUri=process.env.LEGACY_MONGODB_URI||env.MONGODB_URI;
const targetName=databaseTarget().name;
if(targetName===sourceName)throw new Error('Source and target databases must differ.');
if(targetName!=='mygovguide_demo_v2')throw Error('Migration target must be mygovguide_demo_v2.');
if(env.MONGODB_DNS_SERVERS.trim())dns.setServers(env.MONGODB_DNS_SERVERS.split(',').map(v=>v.trim()));
const client=new MongoClient(sourceUri,{serverSelectionTimeoutMS:10000,connectTimeoutMS:5000});
let sourceDb,targetDb;
try{
 await client.connect();
 sourceDb=client.db(sourceName);
 const selected=await sourceDb.collection('schemes').find({publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT',cacheStale:false,...(selectedIds.length?{_id:{$in:selectedIds}}:{})}).sort({_id:1}).limit(10).toArray();
 if(selectedIds.length&&selected.length!==selectedIds.length)throw Error('Every selected ID must have an existing reviewed publication.');
 const forms=await sourceDb.collection('formtemplates').find({linkedSchemeIds:{$in:selected.map(s=>s.id)}}).toArray();
 const versions=await sourceDb.collection('sourceversions').find({entityId:{$in:[...selected.map(s=>s.id),...forms.map(f=>f.id)]}}).toArray();
 const filters=migrationFilters(selected,forms,versions);
 await connectDB();
 targetDb=mongoose.connection.db;
 if(targetDb.databaseName!==targetName)throw new Error('Connected target does not match configured target.');
 if(apply){await initModels();await initAdminModels();}
 const manifest={at:new Date().toISOString(),apply,source:sourceName,target:targetName,selectedSchemes:selected.map(s=>s.id),excludedOperationalHistory:true,collections:{},totals:{read:0,inserted:0,existing:0,failed:0}};
 for(const [name,filter] of Object.entries(filters)){
  const stats={read:0,inserted:0,existing:0,failed:0,error:null};
  try{
   const cursor=sourceDb.collection(name).find(filter).batchSize(200);
   let ops=[];
   const flush=async()=>{
    if(!ops.length)return;
    const result=await targetDb.collection(name).bulkWrite(ops,{ordered:false});
    stats.inserted+=result.upsertedCount||0;
    stats.existing+=result.matchedCount||0;
    ops=[];
   };
   for await(const doc of cursor){
    stats.read++;manifest.totals.read++;
    if(apply)ops.push({updateOne:{filter:{_id:doc._id},update:{$setOnInsert:doc},upsert:true}});
    if(ops.length>=500)await flush();
   }
   if(apply)await flush();
  }catch(error){stats.failed++;stats.error=error.code||error.name||'COPY_FAILED';}
  manifest.totals.inserted+=stats.inserted;manifest.totals.existing+=stats.existing;manifest.totals.failed+=stats.failed;
  manifest.collections[name]=stats;
 }
 const directory=path.join(projectRoot,'.local');
 await fs.mkdir(directory,{recursive:true});
 const file=path.join(directory,`demo-migration-${Date.now()}.json`);
 await fs.writeFile(file,JSON.stringify(manifest,null,2));
 console.log(JSON.stringify({file,...manifest},null,2));
}finally{await client.close().catch(()=>{});await disconnectDB();}
