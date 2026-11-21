import {attachedEvidence} from '../verification/attachedEvidence.js';
import {recordOperation as publish} from '../realtime/events.js';
import {randomUUID} from 'node:crypto';
import mongoose from 'mongoose';
import {z} from 'zod';
import {models} from '../../models/index.js';
import {FormDocument,FormGuidanceArtifact,FormPreparationJob,FormReviewEvent} from '../../models/forms.js';
import {AIProviderRouter} from '../content/providers.js';
import {formContract,promptVersion,validateFormOutput} from './contracts.js';
import {formError} from './extraction.js';
import {hash} from '../../utils/hash.js';
import {createAutomatedValidation,automatedActor,formDocumentSubject,formArtifactSubject} from '../verification/automatedPolicy.js';
import {draftVersion,draftEligible,draftBinding,bindingMatches,evidenceBundleMatches,draftValidationFeedback,reusableDraftFields,draftContract,expandDraft,validateDraft} from './drafts.js';
const languages=['en','hi','kn'];
const current=doc=>doc&&doc.status!=='REJECTED'&&doc.expiresAt>new Date()&&!doc.warnings.includes('OCR_UNAVAILABLE');
export async function getCurrentDocument(formId,session=null){return FormDocument.findOne({formId}).sort({retrievedAt:-1,_id:-1}).session(session).lean();}
export async function automaticallyPublishForm(formId){
 const session=await mongoose.startSession();try{return await session.withTransaction(async()=>{
  const doc=await getCurrentDocument(formId,session),source=doc&&await models.SourceVersion.findById(doc.sourceVersionId).session(session).lean();
  if(!current(doc)||!draftEligible(doc)||!source||hash(source.payload)!==source.contentHash||!evidenceBundleMatches(doc,source))throw formError('CURRENT_ARCHIVED_FORM_EVIDENCE_REQUIRED',409);
  const candidates=await FormGuidanceArtifact.find({formId,documentId:doc._id,status:{$in:['REVIEW_PENDING','APPROVED','AUTOMATED_VALIDATED']}}).session(session).lean();
  const artifacts=languages.map(language=>candidates.find(a=>a.language===language&&a.validation?.ok&&bindingMatches(a.binding,doc)&&validateDraft(a.output,doc,language).ok));
  if(artifacts.some(a=>!a)||artifacts.some(a=>a.output.fields.some(f=>!f.meaning||!f.whatToEnter)))throw formError('THREE_COMPLETE_SOURCE_BOUND_FIELD_GUIDES_REQUIRED',409);
  const checks={officialSource:doc.httpStatus===200,sourceVersionIntegrity:true,coverage:true,factualConsistency:true,privacy:true,conflictsResolved:true};
  const sourceBindings=[{versionId:source._id,contentHash:source.contentHash}],scope='ROUTINE_FIELD_READING_NOT_ELIGIBILITY_OR_GOVERNMENT_APPROVAL',expiresAt=doc.expiresAt;
  const certificate=createAutomatedValidation({kind:'FORM_DOCUMENT',id:doc._id,subjectHash:formDocumentSubject(doc),sourceBindings,checks,scope,expiresAt,limitations:doc.preparation.blockers.filter(b=>!/^HUMAN_|EXACT_MULTILINGUAL_|OFFICIAL_PDF_EMBED/.test(b))});
  for(const a of artifacts)if(a.status!=='APPROVED')await FormGuidanceArtifact.updateOne({_id:a._id},{$set:{status:'AUTOMATED_VALIDATED',automatedValidation:createAutomatedValidation({kind:'FORM_GUIDANCE',id:a._id,subjectHash:formArtifactSubject(a),sourceBindings,checks,scope,expiresAt})}},{session});
  await FormDocument.updateOne({_id:doc._id},{$set:{automatedValidation:certificate}},{session});
  await models.FormTemplate.updateOne({_id:formId},{$set:{publicationStatus:'PUBLISHED',cacheStale:false,publicationEvidence:{mode:'AUTOMATED_VALIDATION',validator:automatedActor,policy:certificate.policy,humanReviewed:false,governmentCertified:false,scope,documentId:doc._id,sourceVersionId:source._id,artifactIds:artifacts.map(a=>a._id),at:new Date()}}},{session});
  const eventId=hash(['AUTOMATED_FIELD_GUIDANCE_RELEASED',doc._id,source._id,artifacts.map(a=>a._id)]);if(!await FormReviewEvent.exists({_id:eventId}).session(session))await FormReviewEvent.create([{_id:eventId,formId,documentId:doc._id,artifactIds:artifacts.map(a=>a._id),action:'AUTOMATED_FIELD_GUIDANCE_RELEASED',actor:automatedActor,evidence:JSON.stringify({policy:certificate.policy,sourceBindings,scope,humanReviewed:false})}],{session});
  return {formId,documentId:doc._id,languages:languages,verification:'AUTOMATED_SOURCE_VALIDATION',humanApproval:false,scope};
 });}finally{await session.endSession();}
}
export async function reviewFormFacts(formId,input,actor){
 const value=z.object({documentId:z.string(),factsChecked:z.literal(true),rightsChecked:z.literal(true),currentnessChecked:z.literal(true),evidence:z.string().trim().max(3000).default(''),rightsBasis:z.string().trim().min(20).max(3000)}).strict().parse(input);
 const session=await mongoose.startSession();let result;
 try{await session.withTransaction(async()=>{
  const doc=await getCurrentDocument(formId,session);if(!current(doc)||doc._id!==value.documentId||!doc.fields.length)throw formError('CURRENT_EXTRACTED_DOCUMENT_REQUIRED',409);
  if(!await models.FormTemplate.exists({_id:formId}).session(session))throw formError('FORM_NOT_FOUND',404);
  value.evidence=attachedEvidence({entityType:'FormTemplate',entityId:formId,versionId:doc._id,sourceUrl:doc.url,documentHash:doc.sha256},value.evidence);
  result=await FormDocument.findOneAndUpdate({_id:doc._id},{$set:{status:'FACTS_APPROVED',factReview:{actor,evidence:value.evidence,rightsBasis:value.rightsBasis,at:new Date()}}},{new:true,session});
  await FormReviewEvent.create([{_id:randomUUID(),formId,documentId:doc._id,action:'FACTS_AND_RIGHTS_APPROVED',actor,evidence:value.evidence+' | '+value.rightsBasis}],{session});
 });return result;}finally{await session.endSession();}
}
export async function enqueueFormPreparation(formId,actor){
 const doc=await getCurrentDocument(formId),draft=draftEligible(doc);if(!current(doc)||(!draft&&(doc.status!=='FACTS_APPROVED'||!doc.factReview?.at)))throw formError('HUMAN_FACT_RIGHTS_CURRENTNESS_REVIEW_REQUIRED',409);
 const version=draft?draftVersion+'-'+draftBinding(doc).inventoryHash.slice(0,16):promptVersion;
 const jobs=[];for(const language of languages){const id=`${doc._id}:${language}:${version}`;await FormPreparationJob.updateOne({_id:id},{$setOnInsert:{formId,documentId:doc._id,language,state:'QUEUED',nextRetryAt:new Date(),requestedBy:actor,promptVersion:version,...(draft?{generationMode:'SOURCE_GROUNDED_DRAFT',binding:draftBinding(doc)}:{})}},{upsert:true});jobs.push(await FormPreparationJob.findById(id).lean());}return jobs;
}
export async function runFormAIOnce({router=new AIProviderRouter(),jobId}={}){
 const now=new Date(),query={$or:[{state:{$in:['QUEUED','DEFERRED']},nextRetryAt:{$lte:now}},{state:'RUNNING',leaseUntil:{$lt:now}}]};if(jobId)query._id=jobId;
 const leaseToken=randomUUID(),leaseMs=120000;
 const job=await FormPreparationJob.findOneAndUpdate(query,{$set:{state:'RUNNING',leaseToken,leaseUntil:new Date(Date.now()+leaseMs)},$inc:{attempts:1}},{new:true,sort:{nextRetryAt:1}}).lean();if(!job)return null;
 const owned={_id:job._id,state:'RUNNING',leaseToken};let lost=false;
 const heartbeat=setInterval(async()=>{try{const r=await FormPreparationJob.updateOne({...owned,leaseUntil:{$gt:new Date()}},{$set:{leaseUntil:new Date(Date.now()+leaseMs)}});if(!r.matchedCount)lost=true;}catch{lost=true;}},15000);heartbeat.unref();
 const save=async(fields)=>{const r=await FormPreparationJob.updateOne({...owned,leaseUntil:{$gt:new Date()}},{$set:fields,$unset:{leaseToken:'',leaseUntil:''}});if(!r.matchedCount)throw formError('WORKER_LEASE_LOST',409);};
 try{
  const doc=await getCurrentDocument(job.formId),form=await models.FormTemplate.findById(job.formId).lean();
  const draft=job.generationMode==='SOURCE_GROUNDED_DRAFT',eligible=d=>current(d)&&d._id===job.documentId&&(draft?draftEligible(d)&&bindingMatches(job.binding,d):d.status==='FACTS_APPROVED'&&d.factReview?.at),version=job.promptVersion||promptVersion,validate=draft?validateDraft:validateFormOutput;
  if(!form||!eligible(doc))throw formError('SOURCE_CHANGED_OR_UNREVIEWED',409);
  if(draft&&!evidenceBundleMatches(doc,await models.SourceVersion.findById(doc.sourceVersionId).lean()))throw formError('ARCHIVED_FIELD_EVIDENCE_MISMATCH',409);
  const existing=await FormGuidanceArtifact.findOne({documentId:doc._id,language:job.language,promptVersion:version}).lean();
  if(existing){const ok=existing.status!=='REJECTED'&&existing.validation?.ok&&validate(existing.output,doc,job.language).ok&&(!draft||bindingMatches(existing.binding,doc));await save({state:ok?'REVIEW_PENDING':'FAILED',artifactId:existing._id});return existing;}
  // Small persisted batches keep Hindi/Kannada output within provider token
  // limits. A quota failure resumes after the last validated part, rather than
  // regenerating successful fields or rotating credentials.
  const parts=job.parts||[],offset=parts.reduce((n,p)=>n+p.output.fields.length,0);
  if(parts.some((p,i)=>!validate(p.output,{...doc,fields:doc.fields.slice(parts.slice(0,i).reduce((n,p)=>n+p.output.fields.length,0),parts.slice(0,i+1).reduce((n,p)=>n+p.output.fields.length,0))},job.language).ok))throw formError('PERSISTED_PART_INVALID',409);
  let cached=null,reusable=new Map();
  if(draft){for(const a of await FormGuidanceArtifact.find({documentId:doc._id,language:job.language,status:{$in:['REVIEW_PENDING','APPROVED']},binding:{$exists:true}}).sort({createdAt:-1}).limit(10).lean()){
   const oldVersion=await models.SourceVersion.findById(a.binding.sourceVersionId).lean(),oldDoc={...doc,fields:oldVersion?.payload?.fields||[],sourceVersionId:a.binding.sourceVersionId};
   if(!evidenceBundleMatches(oldDoc,oldVersion))continue;const available=reusableDraftFields(a,oldDoc,doc);if(available.size){cached=a;reusable=available;break;}
  }}
  const useCache=reusable.has(doc.fields[offset]?.id);let end=offset;
  if(useCache){while(end<doc.fields.length&&reusable.has(doc.fields[end].id))end++;}
  else{while(end<doc.fields.length&&end-offset<(draft?8:4)&&!reusable.has(doc.fields[end].id))end++;}
  const chunk={...doc,fields:doc.fields.slice(offset,end),title:form.title,dataClass:'CURATED_PUBLIC'};if(draft&&job.rejectedParts?.length)chunk.validationFeedback=draftValidationFeedback(job.rejectedParts.at(-1).output,chunk);
  await publish(useCache?'form-ai:cache-reused':'form-ai:generating',{runId:'form-ai:'+job._id,formId:job.formId,language:job.language,documentId:doc._id,completedFields:offset,totalFields:doc.fields.length});
  const result=useCache?{output:{...cached.output,fields:chunk.fields.map(f=>reusable.get(f.id))},provider:cached.provider,model:cached.model,usage:{inputTokens:0,outputTokens:0,totalTokens:0},attempts:[],reusedFrom:{artifactId:cached._id,sourceVersionId:cached.binding.sourceVersionId,fields:chunk.fields.map(f=>f.id)}}:await router.generate(chunk,job.language,draft?draftContract:formContract);
  if(draft&&!useCache)result.output=expandDraft(result.output,chunk,job.language);
  const partValidation=validate(result.output,chunk,job.language);
  await publish('form-ai:validated',{runId:'form-ai:'+job._id,formId:job.formId,language:job.language,provider:result.provider,model:result.model,usage:result.usage,validationPassed:partValidation.ok,fields:chunk.fields.length});
  if(!partValidation.ok)throw Object.assign(formError(draft?'FORM_OUTPUT_VALIDATION_FAILED_'+partValidation.errors.join('_'):'FORM_OUTPUT_VALIDATION_FAILED',422),{generationReceipt:{at:new Date(),provider:result.provider,model:result.model,usage:result.usage,attempts:result.attempts,output:result.output,validation:partValidation}});
  // Recheck after network generation: no artifact may become current after an evidence change.
  const latest=await getCurrentDocument(job.formId);if(!eligible(latest))throw formError('SOURCE_CHANGED_OR_UNREVIEWED',409);
  if(lost)throw formError('WORKER_LEASE_LOST',409);
  parts.push({output:result.output,provider:result.provider,model:result.model,usage:result.usage,attempts:result.attempts||[],latencyMs:result.latencyMs||0,...(result.reusedFrom?{reusedFrom:result.reusedFrom}:{})});
  if(offset+chunk.fields.length<doc.fields.length){await save({parts,state:'QUEUED',attempts:0,nextRetryAt:new Date(Date.now()+1000)});return{state:'QUEUED',preparedFields:offset+chunk.fields.length,totalFields:doc.fields.length};}
  const output={...parts[0].output,fields:parts.flatMap(p=>p.output.fields),limitations:[...new Set(parts.flatMap(p=>p.output.limitations))].slice(0,8)},validation=validate(output,doc,job.language);
  const usage=Object.fromEntries(['inputTokens','outputTokens','totalTokens'].map(k=>[k,parts.reduce((n,p)=>n+(p.usage?.[k]||0),0)]));
  const session=await mongoose.startSession();let artifact;
  try{await session.withTransaction(async()=>{
   const claim=await FormPreparationJob.updateOne({...owned,leaseUntil:{$gt:new Date()}},{$set:{parts,state:validation.ok?'REVIEW_PENDING':'FAILED',artifactId:job._id,error:validation.ok?'':'VALIDATION_FAILED'},$unset:{leaseToken:'',leaseUntil:''}},{session});if(!claim.matchedCount)throw formError('WORKER_LEASE_LOST',409);
   const currentDoc=await getCurrentDocument(job.formId,session);if(!eligible(currentDoc))throw formError('SOURCE_CHANGED_OR_UNREVIEWED',409);
   artifact=await FormGuidanceArtifact.findOneAndUpdate({_id:job._id},{$setOnInsert:{formId:job.formId,documentId:doc._id,language:job.language,promptVersion:version,...(draft?{binding:job.binding}:{}),provider:result.provider,model:result.model,output,validation,usage,generationParts:parts.map(({provider,model,usage,attempts,latencyMs,reusedFrom})=>({provider,model,usage,attempts,latencyMs,...(reusedFrom?{reusedFrom}:{})})),status:validation.ok?'REVIEW_PENDING':'VALIDATION_FAILED'}},{upsert:true,new:true,session});
  });}finally{await session.endSession();}return artifact;
 }catch(error){const code=error.code||'FORM_PREPARATION_FAILED';const retryable=/QUOTA|COOLDOWN|RATE_LIMIT|TIMEOUT|NETWORK|UNAVAILABLE|TEMPORARY/.test(code);await FormPreparationJob.updateOne(owned,{$set:{state:code==='SOURCE_CHANGED_OR_UNREVIEWED'?'STALE':retryable&&job.attempts<3?'DEFERRED':'FAILED',error:code,providerAttempts:error.attempts||[],nextRetryAt:new Date(Date.now()+Math.max(60000,error.retryAfterMs||0))},...(error.generationReceipt?{$push:{rejectedParts:error.generationReceipt}}:{}),$unset:{leaseToken:'',leaseUntil:''}});return{error:code};}finally{clearInterval(heartbeat);}
}
export async function publishFormGuidance(formId,input,actor,{session:outerSession=null}={}){
 const value=z.object({documentId:z.string(),artifactIds:z.array(z.string()).length(3),decision:z.enum(['APPROVE_AND_PUBLISH','REJECT']),evidence:z.string().trim().max(3000).default('')}).strict().parse(input);
 const session=outerSession||await mongoose.startSession();const perform=async()=>{
  const doc=await getCurrentDocument(formId,session);if(!current(doc)||doc._id!==value.documentId||doc.status!=='FACTS_APPROVED'||!doc.factReview?.at)throw formError('CURRENT_REVIEWED_DOCUMENT_REQUIRED',409);
  const artifacts=await FormGuidanceArtifact.find({_id:{$in:value.artifactIds},formId,documentId:doc._id}).session(session).lean();
  if(artifacts.some(a=>a.binding)&&!evidenceBundleMatches(doc,await models.SourceVersion.findById(doc.sourceVersionId).session(session).lean()))throw formError('ARCHIVED_FIELD_EVIDENCE_MISMATCH',409);
  if(artifacts.length!==3||new Set(artifacts.map(a=>a.language)).size!==3||artifacts.some(a=>!(a.binding?bindingMatches(a.binding,doc)&&validateDraft(a.output,doc,a.language).ok:validateFormOutput(a.output,doc,a.language).ok)||!a.validation?.ok))throw formError('THREE_VALID_CURRENT_LANGUAGE_ARTIFACTS_REQUIRED',409);
  value.evidence=attachedEvidence({entityType:'FormTemplate',entityId:formId,versionId:doc._id,sourceUrl:doc.url,documentHash:doc.sha256,artifactIds:value.artifactIds},value.evidence);
  await FormGuidanceArtifact.updateMany({_id:{$in:value.artifactIds}},{$set:{status:value.decision==='REJECT'?'REJECTED':'APPROVED',review:{actor,evidence:value.evidence,at:new Date()}}},{session});
  await FormReviewEvent.create([{_id:randomUUID(),formId,documentId:doc._id,artifactIds:value.artifactIds,action:value.decision,actor,evidence:value.evidence}],{session});
  return{formId,documentId:doc._id,status:value.decision==='REJECT'?'REJECTED':'PUBLISHED'};
 };try{return outerSession?await perform():await session.withTransaction(perform);}finally{if(!outerSession)await session.endSession();}
}
