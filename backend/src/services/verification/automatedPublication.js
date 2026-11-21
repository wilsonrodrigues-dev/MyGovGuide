import mongoose from 'mongoose';
import {models} from '../../models/index.js';
import {AIArtifact,AIJob,ContentApproval,ContentPublication,SchemeSearchDocument} from '../../models/content.js';
import {createAutomatedValidation,automatedActor,publicArtifactSubject,machinePublicEvidence,machineSchemeFacts,machinePublicArtifact} from './automatedPolicy.js';
import {noticePreview} from '../notices/publicWorkflow.js';
import {scamPreview} from '../scams/workflow.js';
import {currentApproval} from '../content/workflow.js';
import {validateOutput,searchTokens,words} from '../content/contracts.js';
import {hash} from '../../utils/hash.js';
const fail=code=>{throw Object.assign(Error(code),{safe:true,status:409,code});};
const checks={officialSource:true,sourceVersionIntegrity:true,coverage:true,factualConsistency:true,privacy:true,conflictsResolved:true};
function artifactCertificate(a,expiresAt){return createAutomatedValidation({kind:'PUBLIC_ARTIFACT',id:a._id,subjectHash:publicArtifactSubject(a),sourceBindings:[{versionId:a.sourceVersionId,contentHash:a.sourceHash}],checks,scope:'SOURCE_GROUNDED_PUBLIC_INFORMATION_NOT_GOVERNMENT_CERTIFICATION',expiresAt});}
export async function automaticallyPublishPublic(type,id){
 if(!['Notice','ScamAlert'].includes(type))fail('UNSUPPORTED_AUTOMATED_PUBLICATION_TYPE');const read=type==='Notice'?noticePreview:scamPreview,session=await mongoose.startSession();
 try{return await session.withTransaction(async()=>{
  const p=await read(id,{session}),entity=p.notice||p.entity;if(!p.ready||!p.automated||!machinePublicEvidence(type,entity,p.version)||p.input.dataClass==='SYNTHETIC')fail('SOURCE_BOUND_PUBLIC_INFORMATION_INCOMPLETE');
  const artifactIds=p.languages.map(a=>a._id),expiresAt=entity.automatedValidation.expiresAt;
  for(const a of p.languages)if(a.state!=='APPROVED')await AIArtifact.updateOne({_id:a._id,stale:false},{$set:{state:'AUTOMATED_VALIDATED',automatedValidation:artifactCertificate(a,expiresAt)}},{session});
  const evidence={mode:'AUTOMATED_VALIDATION',validator:automatedActor,policy:entity.automatedValidation.policy,sourceVersionId:p.version.id,artifactIds,at:new Date(),humanReviewed:false,governmentCertified:false};
  await models[type].updateOne({_id:id,currentVersionId:p.version.id},{$set:{publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT',cacheStale:false,approvedVersionId:p.version.id,publicationEvidence:evidence}},{session});
  const eventId=hash(['AUTOMATED_PUBLISH',type,id,p.version.id,artifactIds]);if(!await models.ReviewEvent.exists({_id:eventId}).session(session))await models.ReviewEvent.create([{_id:eventId,id:eventId,entityType:type,entityId:id,versionId:p.version.id,previousStatus:entity.status,nextStatus:'SOURCE_VERIFIED_FACT',reviewer:automatedActor,evidence:JSON.stringify(evidence),notes:'AUTOMATED_VALIDATION; not a human editorial event',original:{humanReviewed:false,governmentCertified:false,policy:entity.automatedValidation.policy}}],{session});
  return {id,type,published:true,verification:'AUTOMATED_SOURCE_VALIDATION',humanApproval:false};
 });}finally{await session.endSession();}
}
export async function automaticallyPublishScheme(schemeId){
 const session=await mongoose.startSession();try{return await session.withTransaction(async()=>{
  const pending=await models.Scheme.findById(schemeId).session(session).lean();const {scheme,approval}=await currentApproval(schemeId,pending?.normalized?.citizenPreparedContent?.approvalId||null,session);if(!machineSchemeFacts(approval)||approval.dataClass==='SYNTHETIC'||approval.facts?.observedFacts?.publicationBlocked===true)fail('SCHEME_AUTOMATED_EVIDENCE_REQUIRED');
  const version=await models.SourceVersion.findById(approval.sourceVersionId).session(session).lean();if(!version||hash(version.payload)!==version.contentHash)fail('SOURCE_VERSION_INTEGRITY_FAILED');
  const candidates=await AIArtifact.find({schemeId,approvalId:approval._id,sourceVersionId:approval.sourceVersionId,stale:false,state:{$in:['REVIEW_PENDING','APPROVED','AUTOMATED_VALIDATED']}}).sort({revision:-1}).session(session).lean();
  const artifacts=['en','hi','kn'].map(l=>candidates.find(a=>a.language===l&&a.validation?.ok&&a.sourceHash===approval.sourceHash&&validateOutput(a.output,approval,l).ok));if(artifacts.some(a=>!a))fail('THREE_VALIDATED_SCHEME_LANGUAGES_REQUIRED');
  for(const a of artifacts){if(a.state!=='APPROVED'&&!machinePublicArtifact(a))await AIArtifact.updateOne({_id:a._id},{$set:{state:'AUTOMATED_VALIDATED',automatedValidation:artifactCertificate(a,approval.validUntil)}},{session});const o=a.output;await SchemeSearchDocument.updateOne({schemeId,language:a.language},{$set:{sourceVersionId:version.id,approvalId:approval._id,title:o.title,aliases:o.aliases,keywords:o.keywords,romanized:o.romanized,tokens:searchTokens([o.title,...o.aliases,...o.keywords,...o.romanized]),titleTokens:words(o.title),state:approval.facts.state,categories:approval.facts.beneficiaryCategories,artifactId:a._id,dataClass:approval.dataClass,published:true,publishedAt:new Date()},$setOnInsert:{_id:hash(['scheme-index',schemeId,a.language])}},{upsert:true,session});}
  const artifactIds=artifacts.map(a=>a._id),evidence={mode:'AUTOMATED_VALIDATION',validator:automatedActor,policy:approval.automatedValidation.policy,sourceVersionId:version.id,artifactIds,at:new Date(),humanReviewed:false,governmentCertified:false};
  const facts=approval.facts;
  const prior=scheme.contentApprovalId&&await ContentApproval.findById(scheme.contentApprovalId).session(session).lean();
  const verificationExpiry=!scheme.effectiveUntil||prior?.validUntil&&+new Date(prior.validUntil)===+new Date(scheme.effectiveUntil)?{effectiveUntil:approval.validUntil}:{};
  await models.Scheme.updateOne({_id:schemeId},{$set:{...verificationExpiry,currentVersionId:version.id,contentHash:version.contentHash,contentApprovalId:approval._id,approvedVersionId:version.id,status:'SOURCE_VERIFIED_FACT',publicationStatus:'PUBLISHED',schemeStatus:'ACTIVE',cacheStale:false,sourceUrl:approval.evidenceUrl,department:facts.department,state:facts.state,beneficiaryCategories:facts.beneficiaryCategories,benefits:facts.benefits,requiredDocuments:facts.requiredDocuments,applicationInfo:facts.applicationInfo,'normalized.citizenFacts':facts,publicationEvidence:evidence,lastCheckedAt:new Date()}},{session});
  const eventId=hash(['AUTOMATED_PUBLISH','Scheme',schemeId,version.id,artifactIds]);if(!await ContentPublication.exists({_id:eventId}).session(session))await ContentPublication.create([{_id:eventId,schemeId,approvalId:approval._id,sourceVersionId:version.id,artifactIds,action:'AUTOMATED_VALIDATED_PUBLISH',evidence:JSON.stringify(evidence),dataClass:approval.dataClass}],{session});
  await AIJob.updateMany({schemeId,approvalId:approval._id,artifactId:{$in:artifactIds},state:'REVIEW_PENDING'},{$set:{state:'AUTOMATED_VALIDATED'}},{session});
  return {schemeId,published:true,humanApproval:false,artifactIds};
 });}finally{await session.endSession();}
}
