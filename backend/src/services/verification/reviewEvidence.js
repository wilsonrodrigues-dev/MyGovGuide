import mongoose from 'mongoose';
import {z} from 'zod';
import {models} from '../../models/index.js';
import {ContentApproval,AIArtifact} from '../../models/content.js';
import {FormDocument,FormGuidanceArtifact} from '../../models/forms.js';
import {ReviewEvidenceAssessment,ReviewTriageEvent} from '../../models/reviewEvidence.js';
import {ruleVersion,fingerprint,dependencySnapshot,iso,safeUrl,checkVersion,noticeHistory,classifyEvidence,approvedObservationHistory} from './evidenceRules.js';
import {hash} from '../../utils/hash.js';
import {canonicalFacts,validateOutput} from '../content/contracts.js';
import {validateFormOutput} from '../forms/contracts.js';
import {bindingMatches,validateDraft} from '../forms/drafts.js';
import {factChanges} from '../changeDetection/material.js';
const fail=(message,status=409)=>{throw Object.assign(new Error(message),{safe:true,status});};
const id=x=>x?.id||x?._id;
const rank={ROUTINE:0,HISTORICAL:1,BLOCKED:2,REVIEW_REQUIRED:3};
export const workloadQuery=z.object({page:z.coerce.number().int().min(1).default(1),limit:z.coerce.number().int().min(1).max(100).default(20),type:z.enum(['Scheme','FormTemplate','Notice','ScamAlert','SchemeFact','EligibilityRuleSet']).optional(),risk:z.enum(['ROUTINE','HISTORICAL','BLOCKED','REVIEW_REQUIRED']).optional(),reason:z.string().max(160).optional(),q:z.string().max(160).optional(),handled:z.enum(['all','active','handled']).default('active'),attentionOnly:z.enum(['true','false']).default('false')}).strict();
async function graph(session){
 const records=await models.ReviewItem.find({queueStatus:'PENDING'}).sort({_id:1}).limit(10001).session(session).lean();if(records.length>10000)fail('Review workload exceeds this bounded scan; use a narrower operational partition.',422);
 const entities={};for(const type of ['Scheme','FormTemplate','Notice','ScamAlert','SchemeFact','EligibilityRuleSet']){const ids=records.filter(r=>r.entityType===type).map(r=>r.entityId);entities[type]=await models[type].find({_id:{$in:ids}}).session(session).lean();}
 const versionIds=records.map(r=>r.versionId).concat(Object.values(entities).flat().flatMap(e=>[e.currentVersionId,e.sourceVersionId,...(e.sourceVersionIds||[])])).filter(Boolean);
 const forms=await FormDocument.find({formId:{$in:entities.FormTemplate.map(id)}}).sort({retrievedAt:-1,_id:-1}).session(session).lean();
 versionIds.push(...forms.map(f=>f.sourceVersionId).filter(Boolean));
 const versions=await models.SourceVersion.find({_id:{$in:versionIds}}).session(session).lean();
 const sourceIds=[...new Set(Object.values(entities).flat().flatMap(e=>e.sourceIds||[e.sourceId]).filter(Boolean))];
 const [sources,approvals,artifacts,formArtifacts,changes,events,facts]=await Promise.all([
  models.Source.find({_id:{$in:sourceIds}}).session(session).lean(),ContentApproval.find({_id:{$in:entities.Scheme.map(e=>e.contentApprovalId).filter(Boolean)}}).session(session).lean(),
  AIArtifact.find({schemeId:{$in:entities.Scheme.map(id)}}).sort({revision:-1,createdAt:-1}).session(session).lean(),FormGuidanceArtifact.find({formId:{$in:entities.FormTemplate.map(id)}}).session(session).lean(),
  models.ChangeEvent.find({entityId:{$in:records.map(r=>r.entityId)}}).session(session).lean(),models.ReviewEvent.find({entityId:{$in:records.map(r=>r.entityId)}}).session(session).lean(),
  models.SchemeFact.find({schemeId:{$in:entities.Scheme.map(id)}}).sort({createdAt:-1}).session(session).lean()
 ]);
 // Conflict fact versions are dependencies too, even when no longer current.
 const extra=await models.SourceVersion.find({_id:{$in:[...facts.map(f=>f.sourceVersionId),...changes.flatMap(c=>[c.oldVersionId,c.newVersionId])].filter(v=>v&&!versions.some(x=>id(x)===v))}}).session(session).lean();versions.push(...extra);
 return{records,entities,versions,sources,approvals,artifacts,forms,formArtifacts,changes,events,facts};
}
function packetFor(records,g,now){
 const type=records[0].entityType,entityId=records[0].entityId,entity=g.entities[type]?.find(e=>id(e)===entityId),form=type==='FormTemplate'?g.forms.find(f=>f.formId===entityId):null;
 const currentVersionId=form?.sourceVersionId||entity?.currentVersionId||entity?.sourceVersionId;
 const version=g.versions.find(v=>id(v)===currentVersionId),versionType=form?'FormDocument':type;
 const hashValid=checkVersion(version,versionType,entityId),blocked=[],missing=[];
 if(!safeUrl(form?.url||entity?.sourceUrl))blocked.push('Official HTTPS source URL is missing or invalid.');
 const sources=(entity?.sourceIds||[entity?.sourceId]).filter(Boolean).map(sourceId=>g.sources.find(s=>id(s)===sourceId)).filter(Boolean);
 const approval=type==='Scheme'?g.approvals.find(a=>id(a)===entity?.contentApprovalId):null;
 const reusable=Boolean(approval&&hashValid&&entity.status==='SOURCE_VERIFIED_FACT'&&entity.approvedVersionId===currentVersionId&&approval.sourceVersionId===currentVersionId&&approval.sourceHash===version.contentHash&&entity.contentHash===version.contentHash&&approval.reviewer&&approval.evidence&&approval.rightsBasis&&hash(approval.facts)===approval.factsHash&&iso(approval.verifiedAt)&&new Date(approval.verifiedAt)<=now&&iso(approval.validUntil)&&new Date(approval.validUntil)>now&&approval.dataClass!=='SYNTHETIC');
 const formReusable=Boolean(form&&hashValid&&form.status==='FACTS_APPROVED'&&form.factReview?.at&&form.factReview.actor&&form.factReview.evidence&&form.factReview.rightsBasis&&iso(form.expiresAt)&&new Date(form.expiresAt)>now&&form.sha256===version?.payload?.sha256&&fingerprint(form.fields)===fingerprint(version?.payload?.fields));
 const humanEvents=g.events.filter(e=>e.entityType===type&&e.entityId===entityId&&e.versionId===currentVersionId);
 const explicitReviewed=Boolean(hashValid&&entity?.approvedVersionId===currentVersionId&&entity?.status==='SOURCE_VERIFIED_FACT'&&humanEvents.some(e=>e.nextStatus==='SOURCE_VERIFIED_FACT'&&e.evidence&&e.reviewer)&&iso(entity.effectiveUntil)&&new Date(entity.effectiveUntil)>now);
 const authority=entity?.authority||entity?.department||entity?.publishingAuthority||version?.original?.publisher||sources.find(s=>s.organization)?.organization||'Issuing authority not established';
 const sourceViews=sources.map(s=>({id:id(s),title:s.title,authority:s.organization||null,url:safeUrl(s.url),collectionMethod:s.collectionMethod,authorization:s.authorizationStatus==='APPROVED'&&iso(s.approval?.approvalExpiry)&&new Date(s.approval.approvalExpiry)>now?'APPROVED_CURRENT_SCOPE':s.authorizationStatus==='APPROVED'?'EXPIRED_OR_UNDATED':s.authorizationStatus,scope:s.approval?.approvedPaths||[],expiresAt:iso(s.approval?.approvalExpiry),rightsBasis:s.approval?.rightsBasis||null}));
 const curatedRights=reusable||formReusable||explicitReviewed;
 if(!curatedRights)blocked.push('Human fact/rights/currentness scope is not established for this exact evidence.');
 if(approval?.facts?.observedFacts?.publicationBlocked===true||version?.payload?.observedFacts?.publicationBlocked===true)blocked.push('This packet is explicitly blocked for current publication until operative evidence is refreshed.');
 if(sourceViews.some(s=>s.authorization!=='APPROVED_CURRENT_SCOPE'))blocked.push('No automated-access permission for these referenced endpoints; a reviewed curated-document path is separate.');
 // Valid curated approvals remain usable without inventing a scraping grant.
 if(curatedRights)for(let n=blocked.length-1;n>=0;n--)if(blocked[n].startsWith('No automated-access'))blocked.splice(n,1);
 if(!sources.length)blocked.push('Source identity/evidence is missing.');
 if(form){if(!iso(form.expiresAt)||new Date(form.expiresAt)<=now)blocked.push('Form inspection expired; current edition needs review.');if(form.warnings.length)missing.push(...form.warnings);if(!form.fields.length)missing.push('No usable field extraction; OCR or a verified digital document is needed.');}
 const facts=form?{fields:form.fields,documents:form.documents,purpose:form.purpose}:canonicalFacts(version?.payload||{});
 if(!form&&!(facts.requiredDocuments||[]).length)missing.push('Document requirements not established; an empty list is not a waiver.');
 if(type==='Scheme'&&!version?.payload?.eligibilityConditions)missing.push('Complete legal eligibility clauses are not established.');
 const changes=g.changes.filter(e=>e.entityType===type&&e.entityId===entityId&&e.newVersionId===currentVersionId);
 const differentials=changes.flatMap(change=>{const old=g.versions.find(v=>id(v)===change.oldVersionId);return change.factChanges?.length?change.factChanges:old?factChanges(old.payload,version?.payload):[];});
 const materialChange=differentials.some(c=>!/(?:^|\.)(?:lastCheckedAt|fetchedAt|retrievedAt|etag|lastModified|collectionProvenance)(?:\.|$)/.test(c.field));
 const conflictRecords=records.filter(r=>r.reason.startsWith('CONFLICTING_OFFICIAL_EVIDENCE'));
 const conflictFacts=conflictRecords.length?g.facts.filter(f=>f.schemeId===entityId&&conflictRecords.some(r=>r.reason.split(':')[1]===f.field)).map(f=>({id:id(f),field:f.field,value:f.normalizedValue,createdAt:f.createdAt,sourceId:f.sourceId,versionId:f.sourceVersionId,reference:f.sourceSection,versionHashValid:checkVersion(g.versions.find(v=>id(v)===f.sourceVersionId),'Scheme',entityId)})):[];
 const history=type==='Notice'?noticeHistory(entity,version,now):{};
 const covers=Boolean(reusable&&records.every(r=>r.versionId===currentVersionId&&r.original?.approvalId===id(approval)&&r.original?.scopeHash===approval.factsHash));
 const metadataOnly=records.every(r=>r.versionId===currentVersionId&&['UNCHANGED_RECHECK','METADATA_ONLY'].includes(r.reason)&&(!r.original?.scopeHash||r.original.scopeHash===approval?.factsHash||form&&r.original.scopeHash===fingerprint(form.fields)));
 const classification=classifyEvidence({type,entity,version,hashValid,approvalReusable:reusable||formReusable||explicitReviewed,approvalCoversReview:covers,metadataOnly,conflict:!!conflictRecords.length,materialChange,missing,blocked,history});
 const synthetic=Boolean(hashValid&&sources.length&&sources.every(s=>s.original?.synthetic===true)&&entity?.publicationStatus==='INTERNAL'&&entity?.title?.startsWith('SYNTHETIC ')&&safeUrl(entity.sourceUrl)&&new URL(entity.sourceUrl).hostname==='example.test');
 if(synthetic){classification.risk='ROUTINE';classification.basis='INTERNAL_SYNTHETIC_TEST_OBSERVATION_NOT_GOVERNMENT_REVIEW';}
 const ai=[];
 const superseded=new Set(g.artifacts.filter(a=>a.schemeId===entityId&&a.approvalId===id(approval)&&a.sourceVersionId===currentVersionId&&!a.stale).map(a=>a.previousArtifactId).filter(Boolean));
 if(type==='Scheme')for(const a of g.artifacts.filter(a=>a.schemeId===entityId&&a.sourceVersionId===currentVersionId&&a.approvalId===id(approval)&&!a.stale&&!superseded.has(id(a)))){const validation=approval?validateOutput(a.output,approval,a.language):{ok:false,errors:['NO_CURRENT_APPROVAL']};ai.push({id:id(a),language:a.language,state:a.state,model:a.model,output:a.output,validation,approvalReusable:reusable,stale:!reusable,preservedFactComparison:(a.output?.preservedFacts||[]).map(f=>({id:f.id,approvedValue:approval?.facts?.[f.id]??null,modelValue:f.value,equal:f.value===(typeof approval?.facts?.[f.id]==='string'?approval.facts[f.id]:JSON.stringify(approval?.facts?.[f.id]))})),affectedByChanges:differentials.map(c=>c.field)});}
 if(form)for(const a of g.formArtifacts.filter(a=>a.documentId===id(form))){ai.push({id:id(a),language:a.language,state:a.status,model:a.model,output:a.output,validation:a.binding?(bindingMatches(a.binding,form)?validateDraft(a.output,form,a.language):{ok:false,errors:['INVENTORY_VERSION_MISMATCH']}):validateFormOutput(a.output,form,a.language),approvalReusable:formReusable,stale:!formReusable,affectedByChanges:differentials.map(c=>c.field)});}
 if(ai.some(a=>!a.validation.ok)&&classification.risk!=='HISTORICAL'){classification.risk='REVIEW_REQUIRED';classification.basis='AI_FACT_MISMATCH_REQUIRES_REVIEW';}
 const unresolved=[...blocked,...missing];if(conflictRecords.length)unresolved.push('Compare conflicting source facts; existing limited approvals do not silently settle this conflict.');if(materialChange)unresolved.push('Review changed facts and affected explanations; no eligibility or publication decision is automated.');
 const packetKey=type+':'+entityId;
 const reviewedBaseline=reusable&&hash(canonicalFacts(version?.payload||{}))===approval.factsHash;
 const rows=records.map((r,index)=>{const archived=type==='Scheme'?approvedObservationHistory({row:r,approval,version,entityId,reviewed:reviewedBaseline,conflicts:conflictFacts,versions:g.versions,changes}):null;const duplicate=records.slice(0,index).find(p=>p.reason===r.reason&&p.versionId===r.versionId&&fingerprint(p.original)===fingerprint(r.original));const safeDuplicate=duplicate&&hashValid&&['INITIAL_RESEARCH_REVIEW','UNCHANGED_RECHECK','METADATA_ONLY'].includes(r.reason);return{id:id(r),reason:r.reason,versionId:r.versionId||null,versionIsCurrent:r.versionId===currentVersionId,risk:archived?(archived.startsWith('CHANGE_')?'ROUTINE':'HISTORICAL'):safeDuplicate?'ROUTINE':classification.risk,basis:archived|| (safeDuplicate?'DUPLICATE_QUEUE_OBSERVATION_PRIMARY_REVIEW_RETAINED':classification.basis),duplicateOf:safeDuplicate?id(duplicate):null};});
 const packet={packetKey,synthetic,entityType:type,entityId,title:entity?.title||entity?.field||'Missing record: '+entityId,sourceUrl:safeUrl(form?.url||entity?.sourceUrl),authority,version:{id:currentVersionId||null,hash:version?.contentHash||null,hashValid,edition:form?.edition||version?.payload?.sourceEdition||null,documentSha256:form?.sha256||null,capturedAt:iso(version?.retrievedAt)},sources:sourceViews,originalPassage:approval?.excerpt||version?.original?.curationEvidence?.quote||version?.original?.description||null,researchSummary:!approval?.excerpt&&!version?.original?.curationEvidence?.quote?version?.payload?.description||version?.original?.summaryForResearch||null:null,clauseRefs:approval?.clauseRefs||[],facts,missingEvidence:[...new Set(missing)],changes:differentials,conflictingFacts:conflictFacts,ai,approval:{reusable:reusable||formReusable||explicitReviewed,id:id(approval)||null,scope:approval?.facts||null,evidence:approval?.evidence||form?.factReview?.evidence||null,rightsBasis:approval?.rightsBasis||form?.factReview?.rightsBasis||null,validUntil:iso(approval?.validUntil||form?.expiresAt)},history,risk:rows.reduce((risk,r)=>rank[r.risk]>rank[risk]?r.risk:risk,'ROUTINE'),basis:classification.basis,unresolvedQuestions:[...new Set(unresolved)],records:rows,ruleVersion,publicationActions:0,permissionActions:0};
 // Include all dependency state, but exclude transient timestamps such as last
 // checked. Expiry transitions are represented by the booleans above.
 packet.snapshot=dependencySnapshot({ruleVersion,packetKey,entity,sources,version,approval,form,records,conflictFacts,differentials,events:humanEvents,checks:{reusable,formReusable,explicitReviewed,hashValid,classification,history},artifacts:ai.map(a=>({id:a.id,validation:a.validation,state:a.state,output:a.output}))});return packet;
}
export async function buildReviewPackets({session=null,now=new Date()}={}){
 const g=await graph(session),groups=new Map();for(const record of g.records){const key=record.entityType+':'+record.entityId;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(record);}
 return[...groups.values()].map(records=>packetFor(records,g,now)).sort((a,b)=>rank[b.risk]-rank[a.risk]||a.title.localeCompare(b.title));
}
export async function reviewWorkload(input={}){
 const query=workloadQuery.parse(input),packets=await buildReviewPackets();const events=await ReviewTriageEvent.find({snapshot:{$in:packets.map(p=>p.snapshot)}}).lean();
 const counts={ROUTINE:0,HISTORICAL:0,BLOCKED:0,REVIEW_REQUIRED:0},byType={},byReason={};let handled=0;
 for(const packet of packets){for(const row of packet.records){row.handled=events.some(e=>e.reviewItemId===row.id&&e.snapshot===packet.snapshot);if(row.handled)handled++;counts[row.risk]++;byType[packet.entityType]=(byType[packet.entityType]||0)+1;byReason[row.reason]=(byReason[row.reason]||0)+1;}packet.handled=packet.records.every(r=>r.handled);packet.activeRecords=packet.records.filter(r=>!r.handled).length;}
 const matching=packets.filter(p=>(query.attentionOnly!=='true'||['BLOCKED','REVIEW_REQUIRED'].includes(p.risk))&&(!query.type||p.entityType===query.type)&&(!query.risk||p.records.some(r=>r.risk===query.risk))&&(!query.reason||p.records.some(r=>r.reason===query.reason))&&(!query.q||(p.title+' '+p.entityId).toLowerCase().includes(query.q.toLowerCase()))&&(query.handled==='all'||query.handled==='handled'&&p.handled||query.handled==='active'&&!p.handled));
 const start=(query.page-1)*query.limit,items=matching.slice(start,start+query.limit);
 const compact=items.map(p=>({...p,ai:p.ai.map(({output,preservedFactComparison,...a})=>a),facts:undefined,originalPassage:undefined,conflictingFacts:undefined}));
 const bySource={};for(const p of packets)for(const source of p.sources){bySource[source.id]??={title:source.title,authorization:source.authorization,records:0};bySource[source.id].records+=p.records.length;}
 return{summary:{rawPendingRecords:packets.reduce((n,p)=>n+p.records.length,0),automaticallyHandledRecords:handled,activeRecords:packets.reduce((n,p)=>n+p.activeRecords,0),pendingPackets:packets.length,activePackets:packets.filter(p=>!p.handled).length,humanDecisionPackets:packets.filter(p=>p.risk==='REVIEW_REQUIRED'&&!p.handled).length,counts,byType,byReason,bySource,duplicateRecords:packets.flatMap(p=>p.records).filter(r=>r.duplicateOf).length,syntheticRecords:packets.filter(p=>p.synthetic).reduce((n,p)=>n+p.records.length,0)},items:compact,total:matching.length,page:query.page,limit:query.limit,hasNext:start+query.limit<matching.length,ruleVersion,approvalActions:0,publicationActions:0};
}
export async function refreshReviewEvidence(){const packets=await buildReviewPackets();for(const packet of packets)await ReviewEvidenceAssessment.updateOne({_id:packet.packetKey+':'+packet.snapshot},{$setOnInsert:{packetKey:packet.packetKey,snapshot:packet.snapshot,ruleVersion,entityType:packet.entityType,entityId:packet.entityId,risk:packet.risk,recordIds:packet.records.map(r=>r.id),packet,createdAt:new Date(),updatedAt:new Date()}},{upsert:true,timestamps:false});return{packets:packets.length,approvalActions:0};}
export async function triageReviewPackets(input,actor){
 const value=z.object({selections:z.array(z.object({packetKey:z.string().max(250),snapshot:z.string().regex(/^[a-f0-9]{64}$/)}).strict()).min(1).max(200)}).strict().parse(input);
 if(new Set(value.selections.map(s=>s.packetKey)).size!==value.selections.length)fail('Select each packet once.');
 const session=await mongoose.startSession();try{return await session.withTransaction(async()=>{
  const packets=await buildReviewPackets({session});let handled=0;
  for(const selection of value.selections){const packet=packets.find(p=>p.packetKey===selection.packetKey);if(!packet||packet.snapshot!==selection.snapshot)fail('Evidence/dependencies changed. Refresh before triage.');
   const safe=packet.records.filter(r=>['ROUTINE','HISTORICAL'].includes(r.risk));if(!safe.length)fail('Only routine observations or historical snapshots can be handled. No approval is granted.');
   for(const row of safe){const result=await ReviewTriageEvent.updateOne({_id:row.id+':'+packet.snapshot},{$setOnInsert:{reviewItemId:row.id,packetKey:packet.packetKey,snapshot:packet.snapshot,risk:row.risk,disposition:row.risk==='HISTORICAL'?'ARCHIVED_HISTORICAL':'HANDLED_ROUTINE',ruleVersion,actor,reason:row.basis,approvalActions:0,createdAt:new Date(),updatedAt:new Date()}},{upsert:true,session,timestamps:false});handled+=result.upsertedCount;}
  }return{handledRecords:handled,approvalActions:0,publicationActions:0,permissionActions:0,reviewHistoryRewritten:false};
 });}finally{await session.endSession();}
}

export async function processAdministrativeObservations(actor='system:administrative-triage'){const packets=await buildReviewPackets(),safe=packets.filter(p=>p.records.some(r=>['ROUTINE','HISTORICAL'].includes(r.risk)));let handledRecords=0;for(let n=0;n<safe.length;n+=100){const r=await triageReviewPackets({selections:safe.slice(n,n+100).map(p=>({packetKey:p.packetKey,snapshot:p.snapshot}))},actor);handledRecords+=r.handledRecords;}return{handledRecords,approvalActions:0,publicationActions:0,permissionActions:0};}
