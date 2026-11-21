process.env.ADMIN_USERNAME='monitor-editor';process.env.ADMIN_PASSWORD='isolated-monitor-password';
import test from 'node:test';import assert from 'node:assert/strict';import {once} from 'node:events';import {spawn} from 'node:child_process';import {io} from 'socket.io-client';
import {connectDB,disconnectDB} from '../../src/config/db.js';
import {initAdminModels,AdminEvent,CollectionJob} from '../../src/models/admin.js';
import {publish,recentEvents,subscribe,sanitizeEvent} from '../../src/services/realtime/events.js';
import {createSession,revokeSession,cookieName} from '../../src/services/admin/auth.js';
import {app} from '../../src/app.js';import {attachRealtime,realtimePath} from '../../src/realtime.js';
const uri=process.env.MONGODB_TEST_URI;
test('committed monitor replay, cross-process streaming and revoked session isolation',{skip:!uri,timeout:30000},async()=>{
 const u=new URL(uri);assert.match(u.pathname,/^\/mygovguide_phase2_test(?:_[\w-]+)?$/);u.pathname='/mygovguide_phase2_test_monitor_'+Date.now();await connectDB(u.href);await initAdminModels();
 const server=app.listen(0,'127.0.0.1');await once(server,'listening');const realtime=attachRealtime(server);let client,unsubscribe;
 try{
  const delivered=[];unsubscribe=subscribe(e=>delivered.push(e));
  const first=await publish('job:progress',{jobId:'test-run',stage:'FETCHING',sourceUrl:'https://example.test/feed?api_key=private-value',prompt:'PRIVATE'});
  assert.equal(await AdminEvent.countDocuments({_id:first.id}),1);assert.equal(delivered[0].sequence,first.sequence);assert.equal(first.payload.prompt,'[REDACTED]');assert.ok(!first.payload.sourceUrl.includes('private-value'));assert.equal(sanitizeEvent({password:'hidden'}).password,'[REDACTED]');
  await CollectionJob.create({_id:'test-run',sourceId:'TEST',mode:'FIXTURE',state:'QUEUED'});
  const token=createSession();client=io('http://127.0.0.1:'+server.address().port,{path:realtimePath,transports:['websocket'],forceNew:true,reconnection:false,extraHeaders:{Cookie:cookieName+'='+token}});
  await once(client,'admin:ready');
  const replay=await client.timeout(3000).emitWithAck('run:subscribe',{runId:'test-run',afterSequence:0});assert.equal(replay.items[0].id,first.id);
  // A fresh process has no access to the API's in-memory event listeners.
  const nextEvent=new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('No cross-process event')),8000);client.on('admin:event',e=>{if(e.type==='worker:test'){clearTimeout(timer);resolve(e);}});});
  const child=spawn(process.execPath,['--input-type=module','-e',`import {connectDB,disconnectDB} from './backend/src/config/db.js';import {publish} from './backend/src/services/realtime/events.js';await connectDB(process.env.MONITOR_TEST_URI);await publish('worker:test',{jobId:'test-run',stage:'SAVED'});await disconnectDB();`],{cwd:new URL('../../../',import.meta.url),env:{...process.env,MONITOR_TEST_URI:u.href},stdio:'ignore'});
  const [code]=await once(child,'exit');assert.equal(code,0);const received=await nextEvent;assert.ok(received.sequence>first.sequence);
  const history=await recentEvents({runId:'test-run',afterSequence:first.sequence});assert.deepEqual(history.map(e=>e.id),[received.id]);
  const disconnected=once(client,'disconnect');revokeSession(token);await disconnected;assert.equal(client.connected,false);
 }finally{unsubscribe?.();client?.close();realtime.close();await new Promise(r=>server.close(r));await disconnectDB();}
});
