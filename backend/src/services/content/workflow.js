import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { models } from '../../models/index.js';
import { ContentApproval, AIJob, AIArtifact, SchemeSearchDocument, ContentPublication, AIDailyBudget, AIWorkerSlot } from '../../models/content.js';
import { MongoStore, scopedStore } from '../ingestion/store.js';
import { review } from '../verification/review.js';
import { audit } from '../admin/auth.js';
import { env } from '../../config/env.js';
import { hash } from '../../utils/hash.js';
import { canonicalFacts, validateOutput, languages, promptVersion, words, searchTokens, syntheticEvidence } from './contracts.js';
import { AIProviderRouter, AIError, providerHealth } from './providers.js';

function reject(message, status = 409) { throw Object.assign(new Error(message), { status, safe: true }); }
export function isolatedTestDatabase() { return env.NODE_ENV === 'test' && /^mygovguide_phase2_test(?:_[\w-]+)?$/.test(mongoose.connection.name || ''); }
export async function classification(scheme, version, session) {
  const sources = await models.Source.find({ _id: { $in: scheme.sourceIds } }).session(session || null).lean();
  const evidence=[scheme.original,version.original,...sources.map(s=>s.original)],host=new URL(scheme.sourceUrl).hostname;
  if (scheme.id.startsWith('synthetic-') || scheme.sourceIds.some(id=>/^fixture-|^synthetic-/.test(id)) || syntheticEvidence(evidence) || /^(?:example\.(?:test|com|org)|.*\.example\.test)$/.test(host)) return 'SYNTHETIC';
  const provenance=version.original?.collectionProvenance;
  if(provenance?.mode==='LIVE'&&provenance.runId&&version.sourceIds?.includes(provenance.sourceId)){
    const run=await models.IngestionRun.findOne({_id:provenance.runId,mode:'ONLINE',outcome:{$in:['SUCCESS','PARTIAL']},sources:{$elemMatch:{sourceId:provenance.sourceId,status:'SUCCESS'}}}).session(session||null).lean();
    if(run)return 'LIVE';
  }
  return 'CURATED_PUBLIC';
}
export const approvalInput = z.object({ sourceVersionId: z.string().min(1).max(180), excerpt: z.string().trim().min(40).max(12000), clauseRefs: z.array(z.string().trim().min(1).max(180)).min(1).max(20),
  evidenceUrl: z.string().url(), rightsBasis: z.string().trim().min(10).max(2000), evidence: z.string().trim().min(10).max(3000),
  verifiedAt: z.iso.datetime(), validUntil: z.iso.datetime(), publicNonSensitive: z.literal(true), factsChecked: z.literal(true), rightsChecked: z.literal(true) }).strict();
export async function approveFacts(schemeId, input, actor) {
  const data = approvalInput.parse(input);
  if (new Date(data.verifiedAt) > new Date() || new Date(data.validUntil) <= new Date() || new Date(data.validUntil) <= new Date(data.verifiedAt)) reject('Review dates must be current and have a future validity limit',400);
  const store = new MongoStore();
  return store.transaction(async session => {
    const scheme = await store.get('Scheme', schemeId, session); if (!scheme) reject('Scheme not found',404);
    if (scheme.currentVersionId !== data.sourceVersionId) reject('Review the current source version');
    const version = await store.get('SourceVersion', data.sourceVersionId, session); if (!version || version.entityType !== 'Scheme' || version.entityId !== schemeId) reject('Scheme evidence version mismatch');
    if (new URL(data.evidenceUrl).href !== new URL(version.payload.sourceUrl).href || new URL(data.evidenceUrl).protocol !== 'https:' || new URL(data.evidenceUrl).username || new URL(data.evidenceUrl).password) reject('Use the exact credential-free HTTPS source URL of this version',400);
    const dataClass = await classification(scheme,version,session);
    if (dataClass === 'SYNTHETIC' && !isolatedTestDatabase()) reject('Synthetic fact approval is allowed only in an isolated test database');
    if (/\b(?:\d[ -]?){12}\b|AIza[\w-]{20,}|mongodb(?:\+srv)?:\/\//i.test(data.excerpt)) reject('Do not include private identifiers or credentials in public evidence',400);
    const facts = canonicalFacts(version.payload);
    if (!facts.title || !facts.description) reject('Reviewed source must contain a title and source-grounded description');
    const _id = hash([schemeId, version.id, facts, data]);
    let approval = await ContentApproval.findById(_id).session(session).lean();
    if(approval&&scheme.contentApprovalId===_id)return approval;
    if (!approval) {
      [approval] = await ContentApproval.create([{ _id, schemeId, sourceVersionId: version.id, sourceHash: version.contentHash, factsHash: hash(facts), facts, ...data, publicNonSensitive: undefined, factsChecked: undefined, rightsChecked: undefined, dataClass, sourceIds: scheme.sourceIds, reviewer: actor }].map(({ publicNonSensitive, factsChecked, rightsChecked, ...v })=>v), { session });
    }
    if (scheme.status !== 'SOURCE_VERIFIED_FACT') await review(scopedStore(store,session), 'Scheme', schemeId, { status:'SOURCE_VERIFIED_FACT', reviewer:actor, evidence:data.evidence, versionId:version.id, clauseRefs:data.clauseRefs });
    await models.Scheme.updateOne({ _id:schemeId, currentVersionId:version.id }, { $set:{ contentApprovalId:_id, approvedVersionId:version.id, status:'SOURCE_VERIFIED_FACT', publicationStatus:'INTERNAL', cacheStale:true, lastHumanReviewAt:new Date(), effectiveUntil:new Date(data.validUntil) } }, { session });
    // A renewed fact review invalidates any derivatives of a different approval snapshot.
    await AIArtifact.updateMany({ schemeId, approvalId:{$ne:_id} }, {$set:{stale:true}}, {session});
    await SchemeSearchDocument.updateMany({schemeId},{$set:{published:false}},{session});
    await audit(actor,'SOURCE_FACTS_APPROVED',schemeId,{approvalId:_id,sourceVersionId:version.id,dataClass},session);
    return approval;
  });
}
export async function currentApproval(schemeId, approvalId, session) {
  const scheme = await models.Scheme.findById(schemeId).session(session || null).lean();
  const approval = scheme && await ContentApproval.findById(approvalId || scheme.contentApprovalId).session(session || null).lean();
  if (!scheme || !approval || scheme.contentApprovalId !== approval._id || scheme.currentVersionId !== approval.sourceVersionId || scheme.contentHash !== approval.sourceHash || scheme.approvedVersionId !== approval.sourceVersionId || scheme.status !== 'SOURCE_VERIFIED_FACT' || new Date(approval.validUntil) <= new Date()) reject('Current human-approved facts and unexpired rights/evidence are required');
  if (approval.dataClass === 'SYNTHETIC' && !isolatedTestDatabase()) reject('Synthetic data cannot enter the real content pipeline');
  return {scheme,approval};
}
export async function enqueueAI(schemeId, languageList, actor, { config = env } = {}) {
  z.array(z.enum(languages)).min(1).max(3).parse(languageList);
  const {approval} = await currentApproval(schemeId);
  if (!config.GEMINI_MODEL) reject('Set GEMINI_MODEL after checking provider capability; no model is assumed');
  const jobs=[];
  for (const language of [...new Set(languageList)]) {
    const dedupeKey=hash([schemeId,approval._id,approval.sourceHash,language,'PREPARE_CONTENT',promptVersion,'gemini',config.GEMINI_MODEL]);
    const job = await AIJob.findOneAndUpdate({dedupeKey},{$setOnInsert:{_id:randomUUID(),schemeId,approvalId:approval._id,sourceVersionId:approval.sourceVersionId,sourceHash:approval.sourceHash,language,task:'PREPARE_CONTENT',promptVersion,provider:'gemini',model:config.GEMINI_MODEL,dedupeKey,state:'QUEUED',nextRetry:new Date(),requestedBy:actor,dataClass:approval.dataClass}},{upsert:true,new:true});
    jobs.push(job.toObject());
  }
  await audit(actor,'AI_PREPARATION_QUEUED',schemeId,{languages:languageList,approvalId:approval._id}); return jobs;
}
export async function reserveBudget(amount, config=env) {
  if (amount === 0) return;
  if (!(amount>0) || config.AI_PAID_USE_APPROVED !== 'true' || !config.AI_MAX_COST_PER_DAY) throw Object.assign(new Error('Budget denied'),{code:'BUDGET_DENIED'});
  const id = new Date().toISOString().slice(0,10);
  await AIDailyBudget.updateOne({_id:id},{$setOnInsert:{committedUsd:0,requests:0}},{upsert:true});
  const result=await AIDailyBudget.updateOne({_id:id,committedUsd:{$lte:config.AI_MAX_COST_PER_DAY-amount}},{$inc:{committedUsd:amount,requests:1}});
  if (!result.modifiedCount) throw Object.assign(new Error('Daily budget reached'),{code:'BUDGET_DENIED'});
}
export async function retryAI(id,actor) {
  const job=await AIJob.findById(id).lean(); if(!job || !['FAILED','BLOCKED','DEFERRED'].includes(job.state)) reject('Only failed, blocked or deferred jobs can be retried');
  await currentApproval(job.schemeId,job.approvalId);
  await AIJob.updateOne({_id:id,state:job.state},{$set:{state:'QUEUED',nextRetry:new Date()},$unset:{error:'',errorCode:''}});
  await audit(actor,'AI_RETRY_REQUESTED',id); return {ok:true};
}
export async function runAIOnce({ router, config=env }={}) {
  const token=randomUUID(), now=new Date(), leaseUntil=new Date(Date.now()+90000);
  let slot;
  for(let i=0;i<config.AI_MAX_CONCURRENT_JOBS;i++) {
    try { slot=await AIWorkerSlot.findOneAndUpdate({_id:String(i),$or:[{leaseUntil:{$lt:now}},{token:{$exists:false}}]},{$set:{token,leaseUntil}},{upsert:true,new:true}); } catch(e){if(e.code!==11000)throw e;}
    if(slot)break;
  }
  if(!slot)return null;
  let job,heartbeat;
  try {
    await AIJob.updateMany({state:'RUNNING',leaseUntil:{$lt:now},attempts:{$lt:3}},{$set:{state:'QUEUED',nextRetry:now},$unset:{leaseToken:'',leaseUntil:''}});
    await AIJob.updateMany({state:'RUNNING',leaseUntil:{$lt:now},attempts:{$gte:3}},{$set:{state:'FAILED',errorCode:'WORKER_RETRY_LIMIT',finishedAt:now},$unset:{leaseToken:'',leaseUntil:''}});
    job=await AIJob.findOneAndUpdate({state:{$in:['QUEUED','DEFERRED']},nextRetry:{$lte:now}},{$set:{state:'RUNNING',leaseToken:token,leaseUntil},$inc:{attempts:1}},{sort:{createdAt:1},new:true}).lean();
    if(!job)return null;
    const owned={_id:job._id,state:'RUNNING',leaseToken:token}; let lost=false;
    heartbeat=setInterval(async()=>{try{const until=new Date(Date.now()+90000);const r=await AIJob.updateOne({...owned,leaseUntil:{$gt:new Date()}},{$set:{leaseUntil:until}});const s=await AIWorkerSlot.updateOne({_id:slot._id,token,leaseUntil:{$gt:new Date()}},{$set:{leaseUntil:until}});if(!r.matchedCount||!s.matchedCount)lost=true;}catch{lost=true;}},15000);heartbeat.unref();
    try {
      const {approval}=await currentApproval(job.schemeId,job.approvalId);
      const providerRouter=router||new AIProviderRouter({config:{...config,GEMINI_MODEL:job.model},reserve:amount=>reserveBudget(amount,config)});
      const generated=await providerRouter.generate(approval,job.language);
      await AIJob.updateOne(owned,{$set:{usage:generated.usage,providerAttempts:generated.attempts,costBoundUsd:generated.costUsd,actualProvider:generated.provider,actualModel:generated.model}});
      const validation=validateOutput(generated.output,approval,job.language);
      await new MongoStore().transaction(async session=>{
        if(lost)reject('Worker lease lost');
        const fence=await AIJob.updateOne({...owned,leaseUntil:{$gt:new Date()}},{$set:{leaseUntil:new Date(Date.now()+90000)}},{session});if(!fence.matchedCount)reject('Worker lease lost');
        const {scheme}=await currentApproval(job.schemeId,job.approvalId,session);
        const locked=await models.Scheme.updateOne({_id:scheme.id,currentVersionId:job.sourceVersionId,contentApprovalId:job.approvalId},{$set:{updatedAt:new Date()}},{session});if(!locked.matchedCount)reject('Source changed');
        const artifactId=randomUUID();
        await AIArtifact.create([{_id:artifactId,schemeId:job.schemeId,jobId:job._id,approvalId:job.approvalId,sourceVersionId:job.sourceVersionId,sourceHash:job.sourceHash,language:job.language,task:job.task,promptVersion:job.promptVersion,provider:generated.provider,model:generated.model,dataClass:approval.dataClass,output:generated.output,validation:{ok:validation.ok,errors:validation.errors,warnings:validation.warnings},usage:generated.usage,attempts:generated.attempts,costUsd:generated.costUsd,state:validation.ok?'REVIEW_PENDING':'VALIDATION_FAILED'}],{session});
        await AIJob.updateOne(owned,{$set:{state:validation.ok?'REVIEW_PENDING':'FAILED',artifactId,finishedAt:new Date(),...(validation.ok?{}:{errorCode:'FACT_VALIDATION_FAILED',error:'Output did not preserve approved facts; inspect validation errors.'})},$unset:{leaseToken:'',leaseUntil:''}},{session});
        await audit('ai-worker','AI_CONTENT_PREPARED',artifactId,{language:job.language,provider:generated.provider,model:generated.model,validationPassed:validation.ok,dataClass:approval.dataClass},session);
      });
    } catch(error) {
      const code=error.code||'SOURCE_OR_WORKER_GATE';
      const retryable=['PROVIDER_QUOTA','PROVIDER_COOLDOWN','PROVIDER_TEMPORARY','PROVIDERS_UNAVAILABLE'].includes(code)&&job.attempts<3;
      const blocked=['AI_SPENDING_NOT_AUTHORIZED','BUDGET_DENIED','PRICE_CONFIGURATION_REQUIRED','PROVIDER_NOT_CONFIGURED','PROVIDER_CREDENTIAL_DISABLED','PROVIDER_AUTHORIZATION'].includes(code);
      await AIJob.updateOne(owned,{$set:{state:retryable?'DEFERRED':blocked?'BLOCKED':'FAILED',nextRetry:new Date(Date.now()+Math.max(60000,error.retryAfterMs||0)),errorCode:code,error:'Preparation stopped safely. Check source review, provider health, entitlement and budget.',finishedAt:new Date()},$unset:{leaseToken:'',leaseUntil:''}});
      await audit('ai-worker','AI_PREPARATION_STOPPED',job._id,{code,attempts:error.attempts||[]});
    }
    return AIJob.findById(job._id).lean();
  } finally { if(heartbeat)clearInterval(heartbeat);await AIWorkerSlot.updateOne({_id:slot._id,token},{$unset:{token:'',leaseUntil:''}}); }
}
export async function reviewArtifact(id,decision,actor) {
  const value=z.object({action:z.enum(['APPROVE','REJECT','EDIT']),evidence:z.string().trim().min(10).max(3000),output:z.unknown().optional()}).strict().parse(decision);
  return new MongoStore().transaction(async session=>{
    const artifact=await AIArtifact.findById(id).session(session).lean();if(!artifact)reject('Artifact not found',404);
    if(artifact.stale)reject('Artifact is stale; prepare from current approved evidence');
    const {approval,scheme}=await currentApproval(artifact.schemeId,artifact.approvalId,session);
    const output=value.action==='EDIT'?value.output:artifact.output, validation=validateOutput(output,approval,artifact.language);
    if(value.action!=='REJECT'&&!validation.ok)reject(`Factual validation failed: ${validation.errors.join(', ')}`,400);
    // Once reviewed/published, an artifact is immutable. Edits produce a new draft revision.
    if(value.action==='EDIT') {
      const {_id,createdAt,updatedAt,__v,...copy}=artifact;
      const next={...copy,_id:randomUUID(),output,validation:{ok:true,errors:[],warnings:validation.warnings},state:'REVIEW_PENDING',revision:artifact.revision+1,previousArtifactId:id,editor:actor,reviewEvidence:value.evidence,reviewedAt:null};
      await AIArtifact.create([next],{session});await audit(actor,'AI_ARTIFACT_EDITED',next._id,{previousArtifactId:id},session);return next;
    }
    if(!['REVIEW_PENDING','VALIDATION_FAILED'].includes(artifact.state))reject('Artifact is already reviewed; edit into a new revision');
    const state=value.action==='APPROVE'?'APPROVED':'REJECTED';
    await models.Scheme.updateOne({_id:scheme.id,currentVersionId:approval.sourceVersionId},{$set:{updatedAt:new Date()}},{session});
    await AIArtifact.updateOne({_id:id,state:artifact.state},{$set:{state,editor:actor,reviewEvidence:value.evidence,reviewedAt:new Date()}},{session});
    await audit(actor,`AI_ARTIFACT_${state}`,id,{language:artifact.language,approvalId:approval._id},session);return {ok:true,state};
  });
}
export async function publishContent(schemeId,artifactIds,evidence,actor,{withdraw=false}={}) {
  z.string().trim().min(10).max(3000).parse(evidence);
  return new MongoStore().transaction(async session=>{
    const {scheme,approval}=await currentApproval(schemeId,undefined,session);
    if(!withdraw&&approval.facts.observedFacts?.publicationBlocked===true)reject('Publication requires refreshed current official evidence; this fact packet is explicitly blocked');
    if(withdraw){await models.Scheme.updateOne({_id:schemeId},{$set:{publicationStatus:'WITHDRAWN',cacheStale:true}},{session});await SchemeSearchDocument.updateMany({schemeId},{$set:{published:false}},{session});}
    else {
      z.array(z.string()).min(1).max(3).parse(artifactIds);
      const artifacts=await AIArtifact.find({_id:{$in:artifactIds},schemeId,approvalId:approval._id,sourceVersionId:scheme.currentVersionId,state:'APPROVED',stale:false}).session(session).lean();
      if(artifacts.length!==artifactIds.length||new Set(artifacts.map(a=>a.language)).size!==artifacts.length||!artifacts.some(a=>a.language==='en'))reject('Select current editor-approved English and at most one reviewed artifact per available language');
      if(approval.dataClass==='SYNTHETIC'&&!isolatedTestDatabase())reject('Synthetic publication is forbidden outside isolated tests');
      await SchemeSearchDocument.updateMany({schemeId},{$set:{published:false}},{session});
      for(const a of artifacts){
        const v=validateOutput(a.output,approval,a.language);if(!v.ok)reject('Artifact validation failed at publication');
        const o=a.output;
        await SchemeSearchDocument.updateOne({schemeId,language:a.language},{$set:{sourceVersionId:scheme.currentVersionId,approvalId:approval._id,title:o.title,aliases:o.aliases,keywords:o.keywords,romanized:o.romanized,tokens:searchTokens([o.title,...o.aliases,...o.keywords,...o.romanized]),titleTokens:words(o.title),state:scheme.state,categories:scheme.beneficiaryCategories,artifactId:a._id,dataClass:approval.dataClass,published:true,publishedAt:new Date()},$setOnInsert:{_id:randomUUID()}},{upsert:true,session});
      }
      await models.Scheme.updateOne({_id:schemeId,currentVersionId:approval.sourceVersionId},{$set:{publicationStatus:'PUBLISHED',cacheStale:false,schemeStatus:'ACTIVE',publicationEvidence:{reviewer:actor,evidence,rightsBasis:approval.rightsBasis},lastHumanReviewAt:new Date()}},{session});
    }
    const action=withdraw?'WITHDRAW':'PUBLISH';
    await ContentPublication.create([{_id:randomUUID(),schemeId,approvalId:approval._id,sourceVersionId:scheme.currentVersionId,artifactIds:artifactIds||[],action,reviewer:actor,evidence,dataClass:approval.dataClass}],{session});
    await audit(actor,`CONTENT_${action}`,schemeId,{artifactIds:artifactIds||[],sourceVersionId:scheme.currentVersionId,dataClass:approval.dataClass},session);return {ok:true,action};
  });
}
export async function contentMetrics() {
  const recordOrigins=[];
  for(const type of ['Scheme','FormTemplate','Notice','ScamAlert']){
    const groups=await models[type].aggregate([{$project:{origin:{$cond:[{$or:[{$eq:['$original.synthetic',true]},{$anyElementTrue:[{$map:{input:{$ifNull:['$sourceIds',[]]},as:'source',in:{$regexMatch:{input:'$$source',regex:'^(fixture-|synthetic-)'}}}}]},{$eq:['$original.packageMetadata.synthetic',true]},{$eq:['$original.collectionProvenance.mode','FIXTURE']},{$regexMatch:{input:{$ifNull:['$id','']},regex:'^(fixture-|synthetic-)'}}]},'SYNTHETIC',{$cond:[{$eq:['$original.collectionProvenance.mode','LIVE']},'LIVE','RESEARCH']}]}}},{$group:{_id:'$origin',count:{$sum:1}}}]);
    recordOrigins.push(...groups.map(g=>({entityType:type,origin:g._id,count:g.count})));
  }
  const [states,artifacts,published,approvals,budgets]=await Promise.all([AIJob.aggregate([{$group:{_id:{state:'$state',dataClass:'$dataClass'},count:{$sum:1}}}]),AIArtifact.aggregate([{$group:{_id:{language:'$language',state:'$state',dataClass:'$dataClass',stale:'$stale'},count:{$sum:1},inputTokens:{$sum:'$usage.inputTokens'},outputTokens:{$sum:'$usage.outputTokens'},costBoundUsd:{$sum:'$costUsd'}}}]),SchemeSearchDocument.aggregate([{$match:{published:true}},{$group:{_id:{dataClass:'$dataClass',language:'$language'},count:{$sum:1}}}]),ContentApproval.countDocuments(),AIDailyBudget.find().sort({_id:-1}).limit(7).lean()]);
  return {jobs:states,artifacts,published,approvals,factApprovals:approvals,approvalOrigins:await ContentApproval.aggregate([{$group:{_id:'$dataClass',count:{$sum:1}}}]),recordOrigins,budgets,providers:await providerHealth(),researchSchemes:await models.Scheme.countDocuments({status:'RESEARCH_ONLY'}),eligibilityRulesApproved:await models.EligibilityRuleSet.countDocuments({status:'RULES_APPROVED_CURRENT'}),collectionModes:await models.IngestionRun.aggregate([{$group:{_id:'$mode',runs:{$sum:1},recordsCreated:{$sum:'$counters.created'}}}])};
}
