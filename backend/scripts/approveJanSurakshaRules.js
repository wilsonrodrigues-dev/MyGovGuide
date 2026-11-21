// Records the repository owner's explicit approval of the exact PMJJBY/PMSBY
// demo rule packets. This does not approve APY or any other scheme.
import {connectDB,disconnectDB,requireTransactions} from '../src/config/db.js';
import {env} from '../src/config/env.js';
import {models} from '../src/models/index.js';
import {inspectRules} from '../src/services/eligibility/service.js';
const apply=process.argv.includes('--apply');
if(apply)throw Object.assign(Error('Historical approval receipt cannot approve a changed packet. Use the authenticated admin rule-review endpoint for an exact new revision.'),{code:'HISTORICAL_APPROVAL_REPLAY_DISABLED'});
const now=new Date();
const reviewedBy=env.ADMIN_USERNAME||'repo-owner';
const evidence='Repository owner explicitly approved the exact PMJJBY and PMSBY demo rule packets after being shown the age, participating-account and auto-debit rules and the DFS FAQ clause references. Approval is limited to these exact packets and is not an eligibility guarantee. Recorded 2026-11-20 via OpenCode question.';
await connectDB();
try{
 if(apply)await requireTransactions();
 const audit=[];
 for(const schemeId of ['IN-WK-02','IN-WK-03']){
  const current=await models.EligibilityRuleSet.findById('rules-'+schemeId).lean();
  if(!current)throw new Error(schemeId+': RULE_SET_MISSING');
  const review={reviewedBy,humanCurated:true,evidence,approvedAt:now};
  const candidate={...current,status:'RULES_APPROVED_CURRENT',cacheStale:false,review};
  const check=await inspectRules(candidate,{requireApproved:true});
  if(!check.ok)throw new Error(schemeId+': '+check.errors.join('; '));
  if(apply){
   const session=await models.EligibilityRuleSet.db.startSession();
   try{await session.withTransaction(async()=>{
    await models.EligibilityRuleSet.updateOne({_id:current._id},{$set:{status:'RULES_APPROVED_CURRENT',cacheStale:false,review,lastHumanReviewAt:now},$push:{revisionHistory:{revision:current.revision,previousStatus:current.status,at:now,actor:reviewedBy,decision:'APPROVE_EXACT_DEMO_RULE_PACKET',snapshot:current.contentHash}}},{session});
   });}finally{await session.endSession();}
  }
  audit.push({schemeId,status:'RULES_APPROVED_CURRENT',reviewedBy,outcome:apply?'APPROVED':'VALIDATED_NOT_STORED'});
 }
 console.log(JSON.stringify({at:now,apply,audit},null,2));
}finally{await disconnectDB();}
