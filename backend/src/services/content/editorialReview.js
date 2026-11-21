import {createHash,randomUUID} from 'node:crypto';
import {z} from 'zod';
import {models} from '../../models/index.js';
import {AIArtifact,AIJob,ContentApproval} from '../../models/content.js';
import {canonicalFacts,contentOutput,syntheticEvidence,validateOutput} from './contracts.js';
import {reviewArtifact,publishContent,isolatedTestDatabase,classification} from './workflow.js';
import mongoose from 'mongoose';
import {hash} from '../../utils/hash.js';
import {checkVersion} from '../verification/evidenceRules.js';
import {attachedEvidence} from '../verification/attachedEvidence.js';
import {AdminContentDecision} from '../../models/reviewEvidence.js';

export const reviewStates=['READY_FOR_EDITORIAL_REVIEW','CORRECTIONS_REQUIRED','FACT_REVIEW_REQUIRED','PREPARATION_REQUIRED','BLOCKED_CURRENT_EVIDENCE'];
const querySchema=z.object({page:z.coerce.number().int().min(1).max(10000).default(1),limit:z.coerce.number().int().min(1).max(100).default(25),readiness:z.enum(reviewStates).optional()}).strict();
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
export async function editorialRow(scheme,session=null){
 const [approval,version,artifacts,jobs]=await Promise.all([
  scheme.contentApprovalId?ContentApproval.findById(scheme.contentApprovalId).session(session).lean():null,
  models.SourceVersion.findById(scheme.currentVersionId).session(session).lean(),
  AIArtifact.find({schemeId:scheme.id,sourceVersionId:scheme.currentVersionId,stale:false}).sort({createdAt:-1,revision:-1,_id:1}).session(session).lean(),
  AIJob.find({schemeId:scheme.id,sourceVersionId:scheme.currentVersionId}).select('language state errorCode model').session(session).lean()
 ]);
 const dataClass=version?await classification(scheme,version,session):'CURATED_PUBLIC';
 const facts=approval?.sourceVersionId===scheme.currentVersionId?approval.facts:canonicalFacts(version?.payload||{});
 const current=Boolean(checkVersion(version,'Scheme',scheme.id)&&approval&&hash(approval.facts)===approval.factsHash&&scheme.contentApprovalId===approval._id&&scheme.status==='SOURCE_VERIFIED_FACT'&&scheme.approvedVersionId===scheme.currentVersionId&&approval.sourceVersionId===scheme.currentVersionId&&approval.sourceHash===scheme.contentHash&&approval.reviewer&&approval.evidence&&approval.rightsBasis&&new Date(approval.verifiedAt)<=new Date()&&new Date(approval.validUntil)>new Date()&&(approval.dataClass!=='SYNTHETIC'||isolatedTestDatabase()));
 const blocked=facts.observedFacts?.publicationBlocked===true;
 const bound=artifacts.filter(a=>a.approvalId===approval?._id);
 const superseded=new Set(bound.map(a=>a.previousArtifactId).filter(Boolean));
 const languages=['en','hi','kn'].map(language=>{
  const artifact=bound.find(a=>a.language===language&&!superseded.has(a._id));
  if(!artifact)return{language,state:'MISSING',validation:{ok:false,errors:['LANGUAGE_ARTIFACT_MISSING']}};
  const validation=approval?validateOutput(artifact.output,approval,language):{ok:false,errors:['CURRENT_FACT_APPROVAL_MISSING']};
  const structured=contentOutput.safeParse(artifact.output);
  return{language,artifactId:artifact._id,sourceVersionId:artifact.sourceVersionId,sha256:sha(artifact.output),state:artifact.state,validation:{ok:validation.ok,errors:validation.errors,warnings:validation.warnings},output:structured.success?structured.data:null,...(!structured.success?{rawOutput:artifact.output}:{}),previousArtifactId:artifact.previousArtifactId||null};
 });
 const corrections=languages.some(a=>a.artifactId&&(!a.validation.ok||!['REVIEW_PENDING','APPROVED'].includes(a.state)));
 const complete=languages.every(a=>a.artifactId&&a.validation.ok&&['REVIEW_PENDING','APPROVED'].includes(a.state));
 const readiness=blocked?'BLOCKED_CURRENT_EVIDENCE':!current?'FACT_REVIEW_REQUIRED':corrections?'CORRECTIONS_REQUIRED':!complete?'PREPARATION_REQUIRED':'READY_FOR_EDITORIAL_REVIEW';
 const uncertainties=[...(facts.observedFacts?.sourceGaps||[])];
 if(!(facts.requiredDocuments||[]).length)uncertainties.push('Document requirements are unverified; an empty list does not mean no documents are required.');
 if(!current)uncertainties.push('A current human fact/rights/currentness review is required before AI preparation or publication.');
 if(blocked)uncertainties.push('Historical-only evidence: refresh and review current operative evidence before publication.');
 const row={schemeId:scheme.id,name:scheme.title,sourceUrl:approval?.evidenceUrl||scheme.sourceUrl,sourceVersionId:scheme.currentVersionId,sourceHash:scheme.contentHash,publicationStatus:scheme.publicationStatus,benefits:facts.benefits||scheme.benefits||'Not verified',documents:facts.requiredDocuments||[],facts,sourceEvidence:{excerpt:approval?.excerpt||scheme.originalText||version?.original?.curationEvidence?.quote||null,clauseRefs:approval?.clauseRefs||[],verifiedAt:approval?.verifiedAt||null,validUntil:approval?.validUntil||null,rightsBasis:approval?.rightsBasis||null},uncertainties:[...new Set(uncertainties)],readiness,readyForEditorialReview:readiness==='READY_FOR_EDITORIAL_REVIEW',publicationReady:readiness==='READY_FOR_EDITORIAL_REVIEW'&&languages.every(a=>a.state==='APPROVED'),languages,jobs};
 row.factApprovalValid=current;row.dataClass=dataClass;row.preparationOrigin=current?dataClass:'RESEARCH';row.synthetic=dataClass==='SYNTHETIC';
 row.snapshot=sha({schemeId:row.schemeId,sourceVersionId:row.sourceVersionId,sourceHash:row.sourceHash,approvalId:approval?._id,readiness:row.readiness,languages:languages.map(a=>({language:a.language,artifactId:a.artifactId,sha256:a.sha256,state:a.state}))});
 return row;
}
export async function consolidatedEditorialReview(input={}){
 const query=querySchema.parse(input),counts=Object.fromEntries(reviewStates.map(s=>[s,0])),matches=[];
 const cursor=models.Scheme.find({publicationStatus:{$ne:'PUBLISHED'}}).sort({title:1,_id:1}).lean().cursor({batchSize:50});
 for await(const scheme of cursor){if(!isolatedTestDatabase()&&(syntheticEvidence(scheme.original)||/^synthetic-|^fixture-/.test(scheme.id)))continue;const row=await editorialRow(scheme);if(row.synthetic&&!isolatedTestDatabase())continue;counts[row.readiness]++;if(!query.readiness||row.readiness===query.readiness)matches.push(row);}
 const offset=(query.page-1)*query.limit;
 return{items:matches.slice(offset,offset+query.limit),total:matches.length,pendingTotal:Object.values(counts).reduce((a,b)=>a+b,0),counts,page:query.page,limit:query.limit,totalPages:Math.ceil(matches.length/query.limit),hasNext:offset+query.limit<matches.length,publicationActions:0,generationCalls:0};
}
export async function decideConsolidatedReview(input,actor,{session:outerSession=null}={}){
 const value=z.object({action:z.literal('APPROVE_AND_PUBLISH'),selections:z.array(z.object({schemeId:z.string().min(1).max(180),snapshot:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).min(1).max(100),evidence:z.string().trim().max(3000).optional(),personallyReviewed:z.literal(true)}).strict().parse(input);
 const reject=message=>{throw Object.assign(new Error(message),{status:409,safe:true});};
 if(new Set(value.selections.map(s=>s.schemeId)).size!==value.selections.length)reject('Select each scheme once.');
 const ready=[];
 // Preflight all explicit snapshots before recording any editorial decision.
 for(const selection of value.selections){const scheme=await models.Scheme.findById(selection.schemeId).lean();if(!scheme||scheme.publicationStatus==='PUBLISHED')reject('The selected pending catalog changed; refresh before deciding.');const row=await editorialRow(scheme);if(row.snapshot!==selection.snapshot||!row.readyForEditorialReview)reject('A selected revision, review status or source changed or is blocked; refresh and inspect the current consolidated review.');ready.push(row);}
 const session=outerSession||await mongoose.startSession();const perform=async()=>{const items=[];
 for(const prior of ready){const scheme=await models.Scheme.findById(prior.schemeId).session(session).lean(),row=await editorialRow(scheme,session);if(row.snapshot!==prior.snapshot||!row.readyForEditorialReview)reject('The exact source or revisions changed; no selected content was published.');
 const evidence=attachedEvidence({entityType:'Scheme',entityId:row.schemeId,versionId:row.sourceVersionId,sourceUrl:row.sourceUrl,artifactIds:row.languages.map(a=>a.artifactId),clauseRefs:row.sourceEvidence.clauseRefs,factsHash:hash(row.facts)});
 for(const a of row.languages)if(a.state!=='APPROVED'){const changed=await AIArtifact.updateOne({_id:a.artifactId,state:'REVIEW_PENDING',stale:false},{$set:{state:'APPROVED',editor:actor,reviewEvidence:evidence,reviewedAt:new Date()}},{session});if(!changed.matchedCount)reject('A selected revision changed.');}
 await publishContent(row.schemeId,row.languages.map(a=>a.artifactId),undefined,actor,{session});
 await AdminContentDecision.create([{_id:randomUUID(),packetKey:'Scheme:'+row.schemeId,snapshot:prior.snapshot,action:'APPROVE_AND_PUBLISH',actor,note:value.evidence||'',evidence:{sourceUrl:row.sourceUrl,sourceVersionId:row.sourceVersionId,sourceHash:row.sourceHash,facts:row.facts,sourceEvidence:row.sourceEvidence,languages:row.languages.map(a=>({language:a.language,artifactId:a.artifactId,sha256:a.sha256}))}}],{session});items.push({schemeId:row.schemeId,status:'PUBLISHED'});
 }return{items,complete:true,requested:ready.length,publicationActions:items.length,generationCalls:0};};try{return outerSession?await perform():await session.withTransaction(perform);}finally{if(!outerSession)await session.endSession();}
}
