import {randomUUID} from 'node:crypto';
import {models} from '../../models/index.js';
import {AIJob,AIArtifact,AIWorkerSlot,ContentApproval} from '../../models/content.js';
import {AIProviderRouter} from '../content/providers.js';
import {env} from '../../config/env.js';
import {checkVersion,fingerprint,safeUrl,noticeHistory} from '../verification/evidenceRules.js';
import {extractNoticeFacts} from './extraction.js';
import {noticeContract,validateNoticeOutput} from './contract.js';
import {attachedEvidence} from '../verification/attachedEvidence.js';
import {machinePublicEvidence,machinePublicArtifact} from '../verification/automatedPolicy.js';
const fail=code=>{throw Object.assign(Error(code),{safe:true,status:409,code});};
export const noticePromptVersion='notice-grounded-1';
export async function publicNoticeCatalog(){
 const records=await models.Notice.find({publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT',cacheStale:false}).sort({publishedAt:-1,_id:1}).limit(100).lean(),items=[];
 for(const n of records){const p=await noticePreview(n.id),e=n.publicationEvidence;if(!p.ready||p.input.dataClass==='SYNTHETIC'||n.approvedVersionId!==p.version.id||!safeUrl(n.sourceUrl))continue;
  const decision=p.automated&&e?.mode==='AUTOMATED_VALIDATION'||p.review?.reviewer&&e?.reviewer&&e.rightsBasis&&e.evidence;if(!decision||!p.languages.every(a=>e.artifactIds?.includes(a._id)&&(machinePublicArtifact(a)||a.state==='APPROVED'&&a.editor&&a.reviewedAt)))continue;
  const history=noticeHistory(n,p.version),currentness=p.archive||history.historical||n.effectiveUntil&&new Date(n.effectiveUntil)<=new Date()?'HISTORICAL':p.limited?'OFFICIAL_FEED_SNAPSHOT':'CURRENT_VERIFIED';
  items.push({id:n.id,title:n.title,sourceUrl:n.sourceUrl,publishedAt:n.publishedAt||null,currentness,authority:n.publishingAuthority||null,description:p.version.payload?.description||'',explanations:p.languages.map(a=>({language:a.language,output:a.output})),verification:p.automated?'AUTOMATED_SOURCE_VALIDATION':'HUMAN_REVIEWED',humanReviewed:!p.automated,notice:currentness==='HISTORICAL'?'Dated announcement; check current instructions before acting.':null});
 }
 const sources=await models.Source.find({authorizationStatus:'APPROVED',collectionMethod:{$in:['rss','api']}}).select('id title url organization approval.approvalExpiry').limit(20).lean();
 return {items,sourceReferences:sources.filter(s=>safeUrl(s.url)&&s.approval?.approvalExpiry&&new Date(s.approval.approvalExpiry)>new Date()).map(s=>({id:s.id,title:s.title,url:s.url,authority:s.organization||null})),unreviewedRecordsExposed:0};
}
export async function publicNoticeEvidence(id,{session=null}={}){
 const notice=await models.Notice.findById(id).session(session).lean(),version=notice&&await models.SourceVersion.findById(notice.currentVersionId).session(session).lean(),approval=version&&await ContentApproval.findOne({entityType:'Notice',entityId:id,sourceVersionId:version.id,sourceHash:version.contentHash,validUntil:{$gt:new Date()}}).sort({verifiedAt:-1}).session(session).lean(),review=approval?{reviewer:approval.reviewer,rightsBasis:approval.rightsBasis,factsChecked:approval.facts?.confirmed,currentnessChecked:approval.facts?.confirmed,publicNonSensitive:approval.facts?.publicNonSensitive,sourceHash:approval.sourceHash,validUntil:approval.validUntil,scope:approval.facts?.scope}:version?.original?.noticeEvidenceReview,errors=[];
 if(!notice||!checkVersion(version,'Notice',id))errors.push('NOTICE_VERSION_UNAVAILABLE_OR_CHANGED');
 if(!safeUrl(notice?.sourceUrl))errors.push('OFFICIAL_SOURCE_URL_REQUIRED');
 const automated=machinePublicEvidence('Notice',notice,version),limited=review?.scope==='RSS_SUMMARY',archive=review?.scope==='HISTORICAL_ARCHIVE'||automated&&notice.normalized?.citizenClassification!=='CURRENT_ANNOUNCEMENT',text=version?.original?.originalText||version?.payload?.originalText||(limited?[version?.payload?.title,version?.payload?.description].filter(Boolean).join('\n'):''),history=noticeHistory(notice,version);
 if(!text||Buffer.byteLength(text)>18000)errors.push('COMPLETE_BOUNDED_PUBLIC_NOTICE_TEXT_REQUIRED');
 if(!automated&&(!review?.reviewer||!review.rightsBasis||review.factsChecked!==true||review.currentnessChecked!==true||review.publicNonSensitive!==true||review.sourceHash!==version?.contentHash||!review.validUntil||!Number.isFinite(+new Date(review.validUntil))||new Date(review.validUntil)<=new Date()))errors.push('SOURCE_FACT_CURRENTNESS_VALIDATION_REQUIRED');
 if(!archive&&!limited&&(history.historical||notice?.effectiveUntil&&new Date(notice.effectiveUntil)<=new Date()))errors.push('HISTORICAL_NOTICE_NOT_CURRENT_ACTION_GUIDANCE');
 if(!archive&&!limited&&(!notice?.effectiveUntil||new Date(notice.effectiveUntil)<=new Date()))errors.push('EXPLICIT_CURRENT_VALIDITY_REQUIRED');
 const input={text,analysis:extractNoticeFacts(text),dataClass:version?.original?.collectionProvenance?.synthetic===true?'SYNTHETIC':'CURATED_PUBLIC'};
 return{notice,version,review,input,limited,archive,automated,ok:!errors.length,errors};
}
export async function noticePreview(id,{session=null}={}){
 const e=await publicNoticeEvidence(id,{session}),artifacts=await AIArtifact.find({entityType:'Notice',entityId:id,sourceVersionId:e.version?.id,promptVersion:noticePromptVersion,stale:false}).sort({revision:-1,createdAt:-1,_id:-1}).session(session).lean();
 const languages=['en','hi','kn'].map(l=>artifacts.find(a=>a.language===l&&['REVIEW_PENDING','APPROVED','AUTOMATED_VALIDATED'].includes(a.state)&&a.validation?.ok&&validateNoticeOutput(a.output,e.input,l).ok)).filter(Boolean),ready=e.ok&&languages.length===3;
 return{...e,languages,ready,snapshot:fingerprint({notice:e.notice,version:e.version,errors:e.errors,artifacts:languages}),uncertainties:[...e.errors,...(languages.length!==3?['THREE_VALIDATED_LANGUAGE_REVISIONS_REQUIRED']:[])]};
}
export async function enqueuePublicNotice(id,actor){const p=await noticePreview(id);if(!p.ok)fail(p.errors.join('; '));const jobs=[];for(const language of ['en','hi','kn']){if(p.languages.some(a=>a.language===language))continue;const dedupeKey=fingerprint({entityType:'Notice',id,version:p.version.id,hash:p.version.contentHash,language,promptVersion:noticePromptVersion});const job=await AIJob.findOneAndUpdate({dedupeKey},{$setOnInsert:{_id:randomUUID(),entityType:'Notice',entityId:id,sourceVersionId:p.version.id,sourceHash:p.version.contentHash,language,task:'PREPARE_NOTICE',promptVersion:noticePromptVersion,dedupeKey,state:'QUEUED',nextRetry:new Date(),requestedBy:actor,dataClass:p.input.dataClass}},{upsert:true,new:true});jobs.push(job);}return{jobs:jobs.map(j=>({id:j._id,state:j.state,language:j.language})),publicationActions:0};}
export async function runNoticeAIOnce({router,config=env,entityType='Notice',evidenceReader=publicNoticeEvidence,contract=noticeContract,validator=validateNoticeOutput,promptVersion=noticePromptVersion,task='PREPARE_NOTICE'}={}){
 const token=randomUUID(),now=new Date();let slot,job;
 try{
  for(let i=0;i<config.AI_MAX_CONCURRENT_JOBS;i++){try{slot=await AIWorkerSlot.findOneAndUpdate({_id:String(i),$or:[{leaseUntil:{$lt:now}},{token:{$exists:false}}]},{$set:{token,leaseUntil:new Date(Date.now()+90000)}},{upsert:true,new:true});}catch(e){if(e.code!==11000)throw e;}if(slot)break;}if(!slot)return null;
  await AIJob.updateMany({entityType,state:'RUNNING',leaseUntil:{$lt:now},attempts:{$gte:3}},{$set:{state:'FAILED',errorCode:'INTERRUPTED_ATTEMPT_LIMIT'}});
  job=await AIJob.findOneAndUpdate({entityType,attempts:{$lt:3},$or:[{state:{$in:['QUEUED','DEFERRED']},nextRetry:{$lte:now}},{state:'RUNNING',leaseUntil:{$lt:now}}]},{$set:{state:'RUNNING',leaseToken:token,leaseUntil:new Date(Date.now()+90000)},$inc:{attempts:1}},{new:true,sort:{createdAt:1}}).lean();if(!job)return null;
  const e=await evidenceReader(job.entityId);if(!e.ok||e.version.id!==job.sourceVersionId||e.version.contentHash!==job.sourceHash)fail('NOTICE_EVIDENCE_CHANGED_OR_UNREVIEWED');
  const generated=await(router||new AIProviderRouter({config:{...config,AI_PAID_USE_APPROVED:'false',AI_MAX_COST_PER_DAY:0}})).generate(e.input,job.language,{...contract,privateNotice:false});
  const validation=validator(generated.output,e.input,job.language);if(!validation.ok)fail('NOTICE_OUTPUT_INVALID');
  const session=await models[entityType].startSession();try{await session.withTransaction(async()=>{
   const current=await evidenceReader(job.entityId,{session});if(!current.ok||current.version.id!==job.sourceVersionId||current.version.contentHash!==job.sourceHash)fail('NOTICE_EVIDENCE_CHANGED_DURING_GENERATION');
   const fence=await AIJob.updateOne({_id:job._id,state:'RUNNING',leaseToken:token,leaseUntil:{$gt:new Date()}},{$set:{state:'REVIEW_PENDING',finishedAt:new Date()}},{session});if(!fence.matchedCount)fail('NOTICE_LEASE_LOST');
   const artifactId=randomUUID();await AIArtifact.create([{_id:artifactId,entityType,entityId:job.entityId,jobId:job._id,sourceVersionId:job.sourceVersionId,sourceHash:job.sourceHash,language:job.language,task,promptVersion,provider:generated.provider,model:generated.model,dataClass:e.input.dataClass,output:generated.output,validation,usage:generated.usage,attempts:generated.attempts,costUsd:generated.costUsd,state:'REVIEW_PENDING'}],{session});await AIJob.updateOne({_id:job._id},{$set:{artifactId,actualProvider:generated.provider,actualModel:generated.model,usage:generated.usage},$unset:{leaseToken:'',leaseUntil:''}},{session});
  });}finally{await session.endSession();}return{state:'REVIEW_PENDING',id:job._id};
 }catch(error){if(!job)throw error;const deferred=['PROVIDER_QUOTA','PROVIDER_COOLDOWN','PROVIDER_TEMPORARY'].includes(error.code)&&job.attempts<3;await AIJob.updateOne({_id:job._id,leaseToken:token},{$set:{state:deferred?'DEFERRED':'FAILED',errorCode:error.code||'NOTICE_AI_UNAVAILABLE',nextRetry:new Date(Date.now()+Math.max(60000,error.retryAfterMs||0))},$unset:{leaseToken:'',leaseUntil:''}});return{state:deferred?'DEFERRED':'FAILED'};
 }finally{if(slot)await AIWorkerSlot.updateOne({_id:slot._id,token},{$unset:{token:'',leaseUntil:''}});}
}
export async function publishNotice(row,actor,session){const p=await noticePreview(row.id,{session});if(!p.ready||p.snapshot!==row.preview.noticeSnapshot)fail('NOTICE_PREVIEW_CHANGED_OR_INCOMPLETE');const evidence=attachedEvidence({entityType:'Notice',entityId:row.id,sourceUrl:p.notice.sourceUrl,versionId:p.version.id,artifactIds:p.languages.map(a=>a._id)},'Exact trilingual notice editorial decision.');await AIArtifact.updateMany({_id:{$in:p.languages.map(a=>a._id)}},{$set:{state:'APPROVED',editor:actor,reviewedAt:new Date(),reviewEvidence:evidence}},{session});await models.Notice.updateOne({_id:row.id},{$set:{status:'SOURCE_VERIFIED_FACT',publicationStatus:'PUBLISHED',cacheStale:false,approvedVersionId:p.version.id,publicationEvidence:{reviewer:actor,rightsBasis:p.review.rightsBasis,evidence,artifactIds:p.languages.map(a=>a._id),at:new Date()},lastHumanReviewAt:new Date()}},{session});}
