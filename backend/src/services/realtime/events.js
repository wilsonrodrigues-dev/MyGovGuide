import {randomUUID} from 'node:crypto';
import mongoose from 'mongoose';
import {env} from '../../config/env.js';
import {AdminEvent,AdminEventCounter} from '../../models/admin.js';
const listeners=new Set(),retentionMs=7*24*3600000;
const configuredSecrets=Object.entries(env).filter(([key,v])=>/KEY|PASSWORD|TOKEN|SECRET/.test(key)&&typeof v==='string'&&v.length>=8).map(([,v])=>v);
export function sanitizeEvent(value,key=''){
 if(value instanceof Date)return Number.isFinite(+value)?value.toISOString():null;
 if(/key|token|password|secret|cookie|authorization|prompt|originalText|extractedText|lease/i.test(key))return '[REDACTED]';
 if(typeof value==='string'){let text=configuredSecrets.reduce((s,v)=>s.split(v).join('[REDACTED]'),value);text=text.replace(/(?:AIza|gsk_)[\w-]{15,}/g,'[REDACTED]').replace(/([?&](?:api[_-]?key|token|secret|signature|password)=)[^&\s]+/gi,'$1[REDACTED]');return text.slice(0,1500);}
 if(Array.isArray(value))return value.slice(0,50).map(v=>sanitizeEvent(v));if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).slice(0,50).map(([k,v])=>[k,sanitizeEvent(v,k)]));return value;
}
export function subscribe(listener){listeners.add(listener);return()=>listeners.delete(listener);}
const emit=event=>{for(const listener of listeners)try{listener(event);}catch{}return event;};
export function publish(type,payload={}, {persist=true}={}){
 const event={id:randomUUID(),type,at:new Date().toISOString(),payload:sanitizeEvent(payload),runId:payload.jobId||payload.job?._id||payload.runId||'operations'};
 if(!persist)return emit({...event,ephemeral:true});
 return persistEvent(event);
}
// Monitoring availability must not turn an already committed content result into
// a failed preparation or provoke a second model call.
export async function recordOperation(type,payload){try{return await publish(type,payload);}catch{process.stderr.write(JSON.stringify({event:'OPERATION_EVENT_NOT_RECORDED',type})+'\n');return null;}}
async function persistEvent(event){
 const session=await mongoose.startSession();try{await session.withTransaction(async()=>{const counter=await AdminEventCounter.findOneAndUpdate({_id:'global'},{$inc:{value:1}},{upsert:true,new:true,session});event.sequence=counter.value;await AdminEvent.create([{_id:event.id,type:event.type,payload:event.payload,runId:event.runId,sequence:event.sequence,at:new Date(event.at),expiresAt:new Date(Date.now()+retentionMs)}],{session});});return emit(event);}finally{await session.endSession();}
}
export async function recentEvents({after,afterSequence,runId,limit=50}={}){
 const filter={};if(runId)filter.runId=runId;if(afterSequence!==undefined)filter.sequence={$gt:Number(afterSequence)};else if(after){const date=new Date(after);if(Number.isFinite(+date))filter.at={$gt:date};}
 const size=Math.min(Math.max(Number(limit)||50,1),100),forward=afterSequence!==undefined;
 const rows=await AdminEvent.find(filter).sort(forward?{sequence:1}:{at:-1,_id:-1}).limit(size).lean();if(!forward)rows.reverse();return rows.map(({_id,...r})=>({id:_id,...r}));
}
