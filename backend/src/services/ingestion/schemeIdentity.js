import {z} from 'zod';
import {record} from '../../validators/contracts.js';
import {canonicalUrl} from '../normalization/index.js';
import {normalizeSearch,syntheticEvidence} from '../content/contracts.js';
import {hash,stableId} from '../../utils/hash.js';
import {ingest,counters} from '../changeDetection/ingest.js';
import {materialFacts,factChanges} from '../changeDetection/material.js';
import {scopedStore} from './store.js';
import {assertPublicResearch} from '../../validators/privacy.js';

export function schemeUrl(value){const u=new URL(canonicalUrl(value));if(u.pathname!=='/')u.pathname=u.pathname.replace(/\/+$/,'');return u.href;}
const syntheticScheme=s=>syntheticEvidence(s.original)||/^synthetic-|^fixture-/.test(s.id)||s.sourceIds.some(id=>/^synthetic-|^fixture-/.test(id));
const jurisdiction=s=>s.normalized?.state||s.state;
const policySchema=z.object({namespace:z.string().min(1).max(180),officialIdField:z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/).max(80),documentationUrl:z.string().url(),reviewedBy:z.string().min(1).max(180),evidence:z.string().min(10).max(2000),verifiedAt:z.iso.datetime()}).strict();
export function candidateIdentity(source,value){
 const url=schemeUrl(value.sourceUrl),recordKey=String(value.original.id??value.id);
 const keys=[{kind:'SOURCE_RECORD',key:'source:'+JSON.stringify([source.sourceId,recordKey])},{kind:'URL',key:'url:'+url}];
 if(source.adapterOptions?.identityPolicy){const p=policySchema.parse(source.adapterOptions.identityPolicy),u=new URL(p.documentationUrl);if(u.protocol!=='https:'||u.username||u.password||new Date(p.verifiedAt)>new Date())throw Error('Identity policy requires reviewed public documentation');const official=value.original[p.officialIdField];if(official!==undefined&&official!==null){if(!['string','number'].includes(typeof official)||typeof official==='number'&&!Number.isSafeInteger(official))throw Error('Official scheme identity must be a stable scalar');const id=String(official).trim();if(!id||id.length>120||/[\r\n]/.test(id))throw Error('Invalid official scheme identity');keys.unshift({kind:'OFFICIAL_ID',key:'official:'+JSON.stringify([p.namespace,id])});}}
 const synthetic=syntheticScheme(value);return{keys:keys.map(k=>({...k,key:(synthetic?'synthetic:':'')+k.key})),url,name:normalizeSearch(value.title),recordKey,synthetic};
}
async function bind(store,keys,schemeId,sourceId,review={},policy){for(const k of keys){const id=stableId('scheme-key',k.key),old=await store.get('SchemeIdentity',id);if(old&&old.schemeId!==schemeId)throw Error('Conflicting canonical identity requires review');if(!old)await store.put('SchemeIdentity',{id,original:{bindingBasis:review.reviewer?'HUMAN_VERIFIED_CROSS_SOURCE_MAPPING':k.kind==='OFFICIAL_ID'?'REVIEWED_OFFICIAL_ID_CONTRACT':'SOURCE_LOCAL_OR_EXACT_NORMALIZED_URL',...(k.kind==='OFFICIAL_ID'&&policy?{identityPolicy:policy}:{})},...k,schemeId,sourceId,...review});}}
export async function ingestCollectedScheme(store,source,input,extra={}){
 const value=record.parse(input);assertPublicResearch(value);const identity=candidateIdentity(source,value),provenance=value.original.collectionProvenance;
 if(!provenance?.runId)throw Error('Collected scheme requires durable run provenance');
 return store.transaction(async session=>{
  const scoped=scopedStore(store,session),bindings=(await Promise.all(identity.keys.map(k=>scoped.get('SchemeIdentity',stableId('scheme-key',k.key))))).filter(Boolean),boundIds=[...new Set(bindings.map(b=>b.schemeId))];
  const allCandidates=await scoped.findSchemes({id:value.id,url:identity.url,name:identity.name,title:value.title}),candidates=allCandidates.filter(s=>syntheticScheme(s)===identity.synthetic);let existing=boundIds.length===1?await scoped.get('Scheme',boundIds[0]):null,reason=allCandidates.some(s=>s.id===value.id&&syntheticScheme(s)!==identity.synthetic)?'Synthetic and real scheme identities must remain separate.':'';
  if(boundIds.length>1)reason='Official/source/URL identity keys point to different canonical schemes.';
  if(existing&&bindings.every(b=>b.kind==='URL')&&normalizeSearch(existing.title)!==identity.name)reason='A shared URL alone cannot establish a differently named scheme identity.';
  if(existing&&bindings.every(b=>b.kind==='URL')&&jurisdiction(existing)&&value.normalized.state&&jurisdiction(existing)!==value.normalized.state)reason='A shared URL with different jurisdiction requires identity review.';
  const officialClaim=identity.keys.find(k=>k.kind==='OFFICIAL_ID');if(existing&&officialClaim&&!bindings.some(b=>b.key===officialClaim.key)){const previous=await scoped.list('SchemeIdentity',{schemeId:existing.id});if(previous.some(k=>k.kind==='OFFICIAL_ID'&&k.original?.identityPolicy?.namespace===source.adapterOptions?.identityPolicy?.namespace&&k.key!==officialClaim.key))reason='Official scheme ID changed within its namespace; verify identity before attaching new evidence.';}
  if(!boundIds.length){const sameSource=candidates.filter(s=>s.id===value.id&&s.sourceIds.includes(source.sourceId));const exactUrl=candidates.filter(s=>(s.identityUrls?.includes(identity.url)||schemeUrl(s.sourceUrl)===identity.url)&&normalizeSearch(s.title)===identity.name);
   if(sameSource.length===1)existing=sameSource[0];else if(exactUrl.length===1&&candidates.filter(s=>schemeUrl(s.sourceUrl)===identity.url).length===1&&(!jurisdiction(exactUrl[0])||!value.normalized.state||jurisdiction(exactUrl[0])===value.normalized.state))existing=exactUrl[0];else if(candidates.length)reason='Possible duplicate, shared URL or unverified cross-source identity; explicit mapping is required.';
  }
  const observationId=stableId('observation',[provenance.runId,source.sourceId,identity.recordKey,hash(value.original)]),checkedAt=new Date().toISOString();
  if(await scoped.get('CollectionObservation',observationId))return{...counters(),classification:'UNCHANGED',schemeId:existing?.id};
  if(reason){const reviewId=stableId('identity-review',[source.sourceId,identity.recordKey]);await scoped.put('IdentityReviewCandidate',{id:reviewId,original:{},sourceId:source.sourceId,recordKey:identity.recordKey,title:value.title,candidate:value,proposedKeys:identity.keys,possibleSchemeIds:[...new Set([...boundIds,...candidates.map(s=>s.id)])],reason,lastCheckedAt:checkedAt,observationId,queueStatus:'PENDING'});
   await scoped.put('CollectionObservation',{id:observationId,original:value,sourceId:source.sourceId,runId:provenance.runId,title:value.title,recordKey:identity.recordKey,classification:'NEEDS_IDENTITY_REVIEW',sourceUrl:value.sourceUrl,checkedAt,identityReviewId:reviewId});return{...counters(),read:1,identityReview:1,pendingReview:1,classification:'NEEDS_IDENTITY_REVIEW',identityReviewId:reviewId};}
  const canonicalId=existing?.id||value.id,prior=existing?.currentVersionId?await scoped.get('SourceVersion',existing.currentVersionId):null;
  const incoming={...value.normalized,title:value.title,...extra},same=Boolean(prior&&hash(materialFacts(prior.payload))===hash(materialFacts(incoming)));
  const tally=same?{...counters(),read:1,unchanged:1}:await ingest(scoped,'Scheme',{...value,id:canonicalId},extra);
  const classification=same||tally.unchanged?'UNCHANGED':existing?'UPDATED':'NEW',scheme=await scoped.get('Scheme',canonicalId);
  await bind(scoped,identity.keys,canonicalId,source.sourceId,{},source.adapterOptions?.identityPolicy);
  await scoped.touch('Scheme',canonicalId,{canonicalId,identityName:normalizeSearch(scheme.title),identityUrls:[...new Set([...(scheme.identityUrls||[]),identity.url])],lastCheckedAt:checkedAt,lastCollectionStatus:classification,lastCollectionSourceId:source.sourceId,lastCollectionRunId:provenance.runId});
  const changes=classification==='UPDATED'?factChanges(materialFacts(prior?.payload||{}),materialFacts(incoming)):[];
  await scoped.put('CollectionObservation',{id:observationId,original:value,sourceId:source.sourceId,runId:provenance.runId,schemeId:canonicalId,title:value.title,recordKey:identity.recordKey,classification,sourceUrl:value.sourceUrl,sourceVersionId:scheme.currentVersionId,checkedAt,factChanges:changes});
  return{...tally,classification,schemeId:canonicalId,sourceVersionId:scheme.currentVersionId,factChanges:changes};
 });
}
export async function verifyIdentityMapping(store,id,{schemeId,evidence,confirmed,observationId},reviewer){
 if(confirmed!==true||!reviewer||typeof evidence!=='string'||evidence.trim().length<10)throw Error('Explicit named identity decision and evidence are required');
 return store.transaction(async session=>{const scoped=scopedStore(store,session),candidate=await scoped.get('IdentityReviewCandidate',id),scheme=await scoped.get('Scheme',schemeId);if(!candidate||candidate.queueStatus!=='PENDING'||!scheme)throw Error('Pending identity candidate and existing canonical scheme are required');if(syntheticScheme(candidate.candidate)!==syntheticScheme(scheme))throw Error('Synthetic and real scheme identities must remain separate.');if(observationId&&candidate.observationId!==observationId)throw Error('Identity evidence changed; inspect the latest observation');
  await bind(scoped,candidate.proposedKeys,schemeId,candidate.sourceId,{reviewer,evidence:evidence.trim(),verifiedAt:new Date().toISOString()});await scoped.put('IdentityReviewCandidate',{...candidate,queueStatus:'RESOLVED',resolvedSchemeId:schemeId,reviewer,evidence:evidence.trim(),resolvedAt:new Date().toISOString()});const source=await scoped.get('Source',candidate.sourceId);if(source)await scoped.put('Source',{...source,httpCache:undefined,incrementalState:undefined});return{schemeId,identityReviewId:id,status:'MAPPING_VERIFIED',publicationActions:0};});
}
