import {machineSchemeFacts,machinePublicArtifact} from '../verification/automatedPolicy.js';
import { z } from 'zod';
import { models } from '../../models/index.js';
import { SchemeSearchDocument, AIArtifact, ContentApproval } from '../../models/content.js';
import { words, normalizeSearch } from './contracts.js';
import {validateOutput} from './contracts.js';
import { isolatedTestDatabase } from './workflow.js';
export const searchQuery=z.object({q:z.string().trim().max(120).default(''),language:z.enum(['en','hi','kn']).default('en'),state:z.string().max(80).optional(),category:z.string().max(80).optional(),limit:z.coerce.number().int().min(1).max(30).default(10),page:z.coerce.number().int().min(1).max(10000).default(1)}).strict();
async function executableRules(schemeId){
  const rule=await models.EligibilityRuleSet.findOne({schemeId}).sort({revision:-1,updatedAt:-1,_id:-1}).lean();
  if(!rule||!['RULES_APPROVED_CURRENT','RULES_VALIDATED_CURRENT'].includes(rule.status))return false;
  const {inspectRules}=await import('../eligibility/service.js');return (await inspectRules(rule)).ok;
}
export async function searchContent(input,{syntheticPreview=false}={}) {
  const query=searchQuery.parse(input),tokens=[...new Set(words(query.q))].slice(0,12);
  const filter={language:query.language==='en'?'en':{$in:[query.language,'en']},published:true,dataClass:syntheticPreview&&isolatedTestDatabase()?{$in:['SYNTHETIC','CURATED_PUBLIC','LIVE']}:{$in:['CURATED_PUBLIC','LIVE']}};
  if(tokens.length)filter.tokens={$all:tokens};
  if(query.state)filter.state={$in:[query.state,'All India']};
  if(query.category&&query.category!=='General')filter.categories={$in:[query.category,'General']};
  // Stream matching publication indexes without a silent200-candidate cutoff.
  // Publication/fact/artifact gates still run before pagination and totals.
  const docs=SchemeSearchDocument.find(filter).sort({publishedAt:-1,schemeId:1}).lean().cursor({batchSize:50});
  const items=[];
  for await(const doc of docs){
    const [scheme,approval,artifact]=await Promise.all([models.Scheme.findOne({_id:doc.schemeId,publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT',cacheStale:false,schemeStatus:'ACTIVE',currentVersionId:doc.sourceVersionId,approvedVersionId:doc.sourceVersionId,contentApprovalId:doc.approvalId}).lean(),ContentApproval.findOne({_id:doc.approvalId,validUntil:{$gt:new Date()}}).lean(),AIArtifact.findOne({_id:doc.artifactId,state:{$in:['APPROVED','AUTOMATED_VALIDATED']},stale:false,sourceVersionId:doc.sourceVersionId,approvalId:doc.approvalId}).lean()]);
    if(!scheme||!approval||!artifact||artifact.state==='AUTOMATED_VALIDATED'&&!machinePublicArtifact(artifact))continue;
    if(approval.facts.observedFacts?.publicationBlocked===true)continue;
    if(approval.sourceHash!==scheme.contentHash||artifact.dataClass!==doc.dataClass||approval.dataClass!==doc.dataClass||!approval.rightsBasis||!approval.evidence||!(approval.reviewer||machineSchemeFacts(approval)))continue;
    if(!validateOutput(artifact.output,approval,doc.language).ok)continue;
    if(scheme.effectiveFrom&&new Date(scheme.effectiveFrom)>new Date())continue;
    if(scheme.effectiveUntil&&new Date(scheme.effectiveUntil)<new Date())continue;
    const normalized=normalizeSearch(query.q),title=normalizeSearch(doc.title);
    const score=(title===normalized&&normalized?100:0)+tokens.reduce((sum,t)=>sum+(doc.titleTokens.includes(t)?10:doc.aliases.some(a=>words(a).includes(t))?6:3),0)+(scheme.state===query.state?2:0);
    items.push({id:scheme.id,state:scheme.state,categories:scheme.beneficiaryCategories,title:doc.title,summary:artifact.output.summary,language:doc.language,requestedLanguage:query.language,translationUnavailable:doc.language!==query.language,sourceUrl:scheme.sourceUrl,sourceVersionId:doc.sourceVersionId,reviewedAt:approval.verifiedAt,dataClass:doc.dataClass,synthetic:doc.dataClass==='SYNTHETIC',verification:machineSchemeFacts(approval)?'AUTOMATED_SOURCE_VALIDATION':'SOURCE_REVIEWED',eligibilityAvailable:false,matching:'May be relevant to your interests',rankingScore:score,rankingReason:tokens.length?'Indexed title, approved alias and keyword matches':'Published reviewed content',artifactId:doc.artifactId});
  }
  const preferred=new Map();
  for(const item of items){const old=preferred.get(item.id);if(!old||old.translationUnavailable&&!item.translationUnavailable)preferred.set(item.id,item);}
  const ranked=[...preferred.values()].sort((a,b)=>b.rankingScore-a.rankingScore||a.id.localeCompare(b.id));
  const offset=(query.page-1)*query.limit,total=ranked.length;
  const pageItems=ranked.slice(offset,offset+query.limit);for(const item of pageItems)item.eligibilityAvailable=await executableRules(item.id);
  return {items:pageItems,reason:total?null:'NO_PUBLISHED_CONTENT',language:query.language,page:query.page,limit:query.limit,total,totalPages:Math.ceil(total/query.limit),hasNext:offset+query.limit<total,source:'MongoDB source-bound artifacts; no request-time model call'};
}
export async function readPublished(schemeId,language='en'){
  z.enum(['en','hi','kn']).parse(language);
  let index=await SchemeSearchDocument.findOne({schemeId,language,published:true,dataClass:{$in:['CURATED_PUBLIC','LIVE']}}).lean(),fallback=false;
  if(!index&&language!=='en'){index=await SchemeSearchDocument.findOne({schemeId,language:'en',published:true,dataClass:{$in:['CURATED_PUBLIC','LIVE']}}).lean();fallback=Boolean(index);}
  if(!index)return null;
  const [artifact,approval,scheme]=await Promise.all([AIArtifact.findOne({_id:index.artifactId,approvalId:index.approvalId,sourceVersionId:index.sourceVersionId,state:{$in:['APPROVED','AUTOMATED_VALIDATED']},stale:false}).lean(),ContentApproval.findOne({_id:index.approvalId,validUntil:{$gt:new Date()}}).lean(),models.Scheme.findOne({_id:schemeId,contentApprovalId:index.approvalId,approvedVersionId:index.sourceVersionId,currentVersionId:index.sourceVersionId,publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT',schemeStatus:'ACTIVE',cacheStale:false}).lean()]);
  if(!artifact||!approval||!scheme||artifact.state==='AUTOMATED_VALIDATED'&&!machinePublicArtifact(artifact)||!approval.rightsBasis||!approval.evidence||!(approval.reviewer||machineSchemeFacts(approval))||!approval.verifiedAt||new Date(approval.verifiedAt)>new Date()||artifact.dataClass!==index.dataClass||approval.dataClass!==index.dataClass||approval.sourceHash!==scheme.contentHash||!validateOutput(artifact.output,approval,index.language).ok)return null;
  if(approval.facts.observedFacts?.publicationBlocked===true)return null;
  if((scheme.effectiveUntil&&new Date(scheme.effectiveUntil)<new Date())||(scheme.effectiveFrom&&new Date(scheme.effectiveFrom)>new Date()))return null;
  const eligibilityAvailable=await executableRules(schemeId);
  return {schemeId,requestedLanguage:language,language:index.language,translationUnavailable:fallback,translationNotice:fallback?'Requested translation is unavailable; showing reviewed English.':machineSchemeFacts(approval)?'AI-assisted explanation checked against official evidence; not government certification.':'AI-assisted explanation reviewed by an editor; original source remains authoritative.',explanation:artifact.output,scheme:{id:schemeId,authority:approval.facts.department,state:approval.facts.state,categories:approval.facts.beneficiaryCategories},source:{url:approval.evidenceUrl,excerpt:approval.excerpt,clauses:approval.clauseRefs,version:approval.sourceVersionId,verifiedAt:approval.verifiedAt,publishedAt:approval.facts.dates?.sourcePublication?.value||null,reviewValidUntil:approval.validUntil},eligibilityAvailable,eligibilityStatus:eligibilityAvailable?'VERIFIED_RULES_AVAILABLE':'OPERATIVE_RULES_INCOMPLETE',applicationInfo:approval.facts.applicationInfo,coverage:scheme.normalized?.citizenPreparedContent?.sourceVersionId===scheme.currentVersionId?scheme.normalized.citizenPreparedContent.coverage:null};
}
