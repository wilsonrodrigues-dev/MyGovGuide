import test from 'node:test';import assert from 'node:assert/strict';import {connectDB,disconnectDB} from '../../src/config/db.js';import {env} from '../../src/config/env.js';import {AdminEvent,initAdminModels} from '../../src/models/admin.js';import {app} from '../../src/app.js';
const uri=process.env.MONGODB_TEST_URI;
test('read-only rollback connection blocks actual Mongoose and driver writes and HTTP mutations',{skip:!uri},async()=>{
 const u=new URL(uri);assert.match(u.pathname,/^\/mygovguide_phase2_test(?:_[\w-]+)?$/);u.pathname='/mygovguide_phase2_test_readonly_'+Date.now();const previous=env.DATABASE_READ_ONLY;let server;
 try{await connectDB(u.href);await initAdminModels();await AdminEvent.create({_id:'preserved',type:'TEST',at:new Date()});await disconnectDB();env.DATABASE_READ_ONLY='true';const connection=await connectDB(u.href);assert.equal(connection.readOnly,true);assert.equal(await AdminEvent.countDocuments(),1);
  await assert.rejects(AdminEvent.create({_id:'denied',type:'TEST'}),{category:'LEGACY_DATABASE_WRITE_DENIED'});await assert.rejects(AdminEvent.updateOne({_id:'preserved'},{$set:{type:'CHANGED'}}),{category:'LEGACY_DATABASE_WRITE_DENIED'});assert.throws(()=>connection.db.collection('adminevents').insertOne({_id:'denied'}),{category:'LEGACY_DATABASE_WRITE_DENIED'});assert.equal((await AdminEvent.findById('preserved').lean()).type,'TEST');
  server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const response=await fetch('http://127.0.0.1:'+server.address().port+'/api/session',{method:'POST'});assert.equal(response.status,409);assert.equal((await response.json()).error.code,'READ_ONLY_DATABASE');
 }finally{if(server)await new Promise(r=>server.close(r));env.DATABASE_READ_ONLY=previous;await disconnectDB();}
});
