import {models} from '../../models/index.js';
import {inspectRules} from './service.js';
import {fingerprint} from '../verification/evidenceRules.js';
import {attachedEvidence} from '../verification/attachedEvidence.js';
export async function ruleWorkbenchRows(session=null){
 const rows=[],seen=new Set();
 for(const rule of await models.EligibilityRuleSet.find().sort({revision:-1,updatedAt:-1,_id:-1}).session(session).lean()){
  if(seen.has(rule.schemeId))continue;seen.add(rule.schemeId);
  const inspection=await inspectRules(rule,{session,requireApproved:false}),approved=inspection.ok&&rule.status==='RULES_APPROVED_CURRENT'&&rule.review?.humanCurated&&rule.review.reviewedBy&&rule.review.approvedAt&&rule.review.evidence;
  rows.push({packetKey:'EligibilityRuleSet:'+rule.id,type:'EligibilityRuleSet',id:rule.id,title:(inspection.scheme?.title||rule.schemeId)+' — eligibility rules',sourceUrl:inspection.scheme?.sourceUrl,snapshot:fingerprint({rule,versions:inspection.versions,schemeVersion:inspection.scheme?.currentVersionId,errors:inspection.errors}),category:approved?'PUBLISHED':inspection.ok?'READY':'BLOCKED',reason:approved?'Reviewed rule set available to the deterministic questionnaire. This is not an eligibility guarantee.':inspection.ok?'Complete current operative clauses and translated questions; one grouped human rules decision required.':inspection.errors.join('; '),preview:{ruleSet:rule,sourceEvidence:{excerpt:inspection.bindings?.map(b=>b.quote).join('\n'),bindings:inspection.bindings},uncertainties:inspection.errors,languages:[],versions:inspection.versions},observationIds:[]});
 }return rows;
}
export async function approveRules(row,actor,session){
 const rule=await models.EligibilityRuleSet.findById(row.id).session(session).lean(),check=await inspectRules(rule,{session,requireApproved:false});
 if(!check.ok)throw Object.assign(Error('Complete current rules evidence is required'),{safe:true,status:409});
 const evidence=attachedEvidence({entityType:'EligibilityRuleSet',entityId:rule.id,sourceUrl:row.sourceUrl,versionId:rule.sourceVersionIds.join(','),clauseRefs:check.bindings.map(b=>b.clauseRef)},'Grouped exact operative-rule and translated-question review.');
 await models.EligibilityRuleSet.updateOne({_id:rule.id},{$set:{status:'RULES_APPROVED_CURRENT',cacheStale:false,review:{reviewedBy:actor,humanCurated:true,evidence,approvedAt:new Date()},lastHumanReviewAt:new Date()},$push:{revisionHistory:{revision:rule.revision,previousStatus:rule.status,at:new Date(),actor,decision:'APPROVE_EXACT_RULE_SET',snapshot:row.snapshot}}},{session});
}
