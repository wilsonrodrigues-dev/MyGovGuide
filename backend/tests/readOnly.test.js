import test from 'node:test';
import assert from 'node:assert/strict';
import {guardReadOnlyDatabase} from '../src/config/readOnly.js';
test('legacy guard permits reads and denies driver mutations, commands and write aggregation',()=>{
 const collection={find:()=>['preserved'],insertOne:()=>assert.fail('write reached driver'),aggregate:()=>['read aggregate']};
 const db=guardReadOnlyDatabase({collection:()=>collection,command:command=>command});
 assert.deepEqual(db.collection('schemes').find(),['preserved']);
 assert.deepEqual(db.collection('schemes').aggregate([{$match:{}}]),['read aggregate']);
 for(const action of [()=>db.collection('schemes').insertOne({}),()=>db.collection('schemes').bulkWrite([]),()=>db.collection('schemes').aggregate([{$merge:'schemes'}]),()=>db.dropDatabase(),()=>db.command({insert:'schemes',documents:[]}),()=>db.command({aggregate:'schemes',pipeline:[{$out:'copy'}]})])assert.throws(action,{category:'LEGACY_DATABASE_WRITE_DENIED'});
 assert.deepEqual(db.command({ping:1}),{ping:1});
});
