import {Server} from 'socket.io';
import mongoose from 'mongoose';
import {allowedOrigins} from './middleware/citizenSecurity.js';
import {adminFromToken,tokenFrom} from './services/admin/auth.js';
import {subscribe,recentEvents} from './services/realtime/events.js';
import {CollectionJob} from './models/admin.js';
export const realtimePath='/api/admin/realtime';
export function attachRealtime(server){
 const io=new Server(server,{path:realtimePath,serveClient:false,maxHttpBufferSize:8192,allowRequest(req,done){done(null,(!req.headers.origin||allowedOrigins.has(req.headers.origin))&&req.headers['sec-fetch-site']!=='cross-site');},cors:{origin:(origin,callback)=>callback(null,!origin||allowedOrigins.has(origin)),credentials:true,methods:['GET','POST']}});
 const valid=socket=>adminFromToken(tokenFrom(socket.request));
 io.use((socket,next)=>{const admin=valid(socket);if(!admin)return next(Object.assign(Error('Administrator sign-in required'),{data:{code:'ADMIN_AUTH_REQUIRED'}}));socket.data.admin=admin;next();});
 io.on('connection',socket=>{socket.join('admin');socket.emit('admin:ready',{user:{username:socket.data.admin.username},at:new Date().toISOString()});let lastSubscription=0;socket.on('run:subscribe',async(input,ack)=>{const reply=typeof ack==='function'?ack:()=>{};if(!valid(socket)){socket.disconnect(true);return;}if(Date.now()-lastSubscription<250)return reply({error:'RETRY_LATER'});lastSubscription=Date.now();if(typeof input?.runId!=='string'||input.runId.length>180||!Number.isSafeInteger(input.afterSequence??0)||(input.afterSequence??0)<0)return reply({error:'INVALID_RUN'});try{const job=await CollectionJob.findById(input.runId).lean();if(!job)return reply({error:'RUN_UNAVAILABLE'});socket.join('collection:run:'+job._id);const items=await recentEvents({runId:job._id,afterSequence:input.afterSequence??0,limit:100});reply({items});}catch{reply({error:'HISTORY_UNAVAILABLE'});}});});
 const seen=new Map();function deliver(event){if(seen.has(event.id))return;seen.set(event.id,Date.now());if(seen.size>1000)seen.delete(seen.keys().next().value);for(const socket of io.sockets.sockets.values()){if(!valid(socket)){socket.disconnect(true);continue;}socket.emit('admin:event',event);if(socket.rooms.has('collection:run:'+event.runId))socket.emit('collection:event',event);}}
 const unsubscribe=subscribe(deliver);let cursor=0,busy=false,stopped=false;
 // Worker and API run in separate processes: replay the committed database log.
 const timer=setInterval(async()=>{if(busy||stopped||mongoose.connection.readyState!==1||!io.sockets.sockets.size)return;busy=true;try{const rows=await recentEvents({afterSequence:cursor,limit:100});for(const event of rows){deliver(event);cursor=Math.max(cursor,event.sequence||0);}}catch{}finally{busy=false;}},750);timer.unref();
 const sessionTimer=setInterval(()=>{for(const s of io.sockets.sockets.values())if(!valid(s))s.disconnect(true);},1000);sessionTimer.unref();
 return{io,close(){stopped=true;clearInterval(timer);clearInterval(sessionTimer);unsubscribe();io.disconnectSockets(true);io.engine.close();}};
}
