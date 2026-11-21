import {z} from 'zod';
import {rule as legacyRule} from '../../validators/contracts.js';
import {hash} from '../../utils/hash.js';
import {machineRuleValidated} from '../verification/automatedPolicy.js';
export const outcomes=['MET','UNMET','MISSING','UNKNOWN'];
export const expression=z.lazy(()=>z.union([
 z.object({id:z.string().min(1).max(100),logic:z.enum(['AND','OR','NOT']),children:z.array(expression).min(1).max(40),clauseRefs:z.array(z.string()).min(1)}).strict().refine(v=>v.logic!=='NOT'||v.children.length===1),
 z.object({id:z.string().min(1).max(100),logic:z.literal('IF'),condition:expression,then:expression,otherwise:expression,clauseRefs:z.array(z.string()).min(1)}).strict(),
 z.object({id:z.string().min(1).max(100),logic:z.literal('UNKNOWN'),reason:z.string().min(1).max(1000),clauseRefs:z.array(z.string()).default([])}).strict(),
 legacyRule.refine(v=>!v.logic)
]));
export const combine=(logic,states)=>{if(!states.length)return'UNKNOWN';if(logic==='NOT')return states[0]==='MET'?'UNMET':states[0]==='UNMET'?'MET':states[0];if(logic==='AND'){if(states.includes('UNMET'))return'UNMET';if(states.includes('UNKNOWN'))return'UNKNOWN';if(states.includes('MISSING'))return'MISSING';return'MET';}if(states.includes('MET'))return'MET';if(states.includes('UNKNOWN'))return'UNKNOWN';if(states.includes('MISSING'))return'MISSING';return'UNMET';};
const validDate=v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(+new Date(v))&&new Date(v).toISOString().slice(0,10)===v;
function typed(value,type){return type==='number'?typeof value==='number'&&Number.isFinite(value):type==='date'?validDate(value):type==='array'?Array.isArray(value)&&value.length<=30&&value.every(v=>typeof v==='string'&&v.length<100):typeof value===type;}
export function evaluateExpression(node,answers,depth=0){
 if(depth>12)return{id:node?.id,status:'UNKNOWN',reason:'RULE_DEPTH_LIMIT',clauseRefs:[]};const base={id:node.id,clauseRefs:node.clauseRefs||[]};
 if(node.logic==='UNKNOWN')return{...base,status:'UNKNOWN',reason:'UNVERIFIED_REQUIREMENT'};
 if(node.logic==='IF'){const condition=evaluateExpression(node.condition,answers,depth+1);if(!['MET','UNMET'].includes(condition.status))return{...base,status:condition.status,reason:'CONDITION_NOT_KNOWN',children:[condition]};const branch=evaluateExpression(condition.status==='MET'?node.then:node.otherwise,answers,depth+1);return{...base,status:branch.status,reason:'CONDITIONAL_BRANCH',children:[condition,branch]};}
 if(node.logic){const children=node.children.map(c=>evaluateExpression(c,answers,depth+1));return{...base,status:combine(node.logic,children.map(c=>c.status)),reason:'RULE_COMBINATION',logic:node.logic,children};}
 const value=answers[node.field];if(value===undefined||value===null||value===''||value==='__UNKNOWN__')return{...base,field:node.field,status:'MISSING',reason:'ANSWER_NOT_SUPPLIED'};
 if(!typed(value,node.dataType))return{...base,field:node.field,status:'UNKNOWN',reason:'ANSWER_TYPE_INVALID'};
 let met;switch(node.operator){case'eq':met=JSON.stringify(value)===JSON.stringify(node.value);break;case'ne':met=JSON.stringify(value)!==JSON.stringify(node.value);break;case'lt':met=value<node.value;break;case'lte':met=value<=node.value;break;case'gt':met=value>node.value;break;case'gte':met=value>=node.value;break;case'in':met=node.value.some(x=>JSON.stringify(x)===JSON.stringify(value));break;case'between':met=(node.inclusiveMin===false?value>node.value[0]:value>=node.value[0])&&(node.inclusiveMax===false?value<node.value[1]:value<=node.value[1]);break;default:return{...base,field:node.field,status:'UNKNOWN',reason:'UNSUPPORTED_OPERATOR'};}
 return{...base,field:node.field,status:met?'MET':'UNMET',reason:'DETERMINISTIC_COMPARISON',operator:node.operator,expected:node.value,supplied:value,unit:node.unit,currency:node.currency,inclusiveMin:node.inclusiveMin!==false,inclusiveMax:node.inclusiveMax!==false};
}
export function leafFields(nodes){return[...new Set(nodes.flatMap(n=>n.logic==='IF'?[...leafFields([n.condition]),...leafFields([n.then,n.otherwise])]:n.children?leafFields(n.children):n.field?[n.field]:[]))];}
export function relevantFields(nodes,answers){return[...new Set(nodes.flatMap(n=>{if(n.logic==='IF'){const c=evaluateExpression(n.condition,answers);return[...relevantFields([n.condition],answers),...(['MET','UNMET'].includes(c.status)?relevantFields([c.status==='MET'?n.then:n.otherwise],answers):[])];}if(n.children)return relevantFields(n.children,answers);return n.field?[n.field]:[];}))];}
export function ruleVersion(ruleSet){return hash({id:ruleSet.id||ruleSet._id,revision:ruleSet.revision,rules:ruleSet.rules,exceptions:ruleSet.exceptions,questions:ruleSet.questions,sourceVersionIds:ruleSet.sourceVersionIds,status:ruleSet.status,completeness:ruleSet.completeness,missingInformation:ruleSet.missingInformation,effectiveFrom:ruleSet.effectiveFrom,effectiveUntil:ruleSet.effectiveUntil,review:ruleSet.review,sourceBindings:ruleSet.sourceBindings});}
export const unresolved=n=>n.logic==='UNKNOWN'||(n.children||[]).some(unresolved)||n.logic==='IF'&&[n.condition,n.then,n.otherwise].some(unresolved);
// Detect incompatible bounds in conjunctions. OR alternatives never intersect.
export function conflictingRules(nodes){
 const leaves=n=>n.logic==='AND'?n.children.flatMap(leaves):!n.logic?[n]:[],groups=new Map();
 for(const n of nodes.flatMap(leaves)){const list=groups.get(n.field)||[];list.push(n);groups.set(n.field,list);}
 for(const rules of groups.values()){
  let lower=null,upper=null,lowerInclusive=true,upperInclusive=true,allowed=null;const excluded=[];
  const equal=(a,b)=>JSON.stringify(a)===JSON.stringify(b),low=(v,inclusive)=>{if(lower===null||v>lower){lower=v;lowerInclusive=inclusive;}else if(v===lower)lowerInclusive&&=inclusive;},high=(v,inclusive)=>{if(upper===null||v<upper){upper=v;upperInclusive=inclusive;}else if(v===upper)upperInclusive&&=inclusive;};
  for(const r of rules){if(['eq','in'].includes(r.operator)){const values=r.operator==='in'?r.value:[r.value];allowed=allowed===null?values:allowed.filter(v=>values.some(x=>equal(x,v)));}if(r.operator==='ne')excluded.push(r.value);if(['gt','gte'].includes(r.operator))low(r.value,r.operator==='gte');if(['lt','lte'].includes(r.operator))high(r.value,r.operator==='lte');if(r.operator==='between'){low(r.value[0],r.inclusiveMin!==false);high(r.value[1],r.inclusiveMax!==false);}}
  if(lower!==null&&upper!==null&&(lower>upper||lower===upper&&(!lowerInclusive||!upperInclusive)))return true;
  if(allowed!==null&&!allowed.some(v=>!excluded.some(x=>equal(x,v))&&(lower===null||(lowerInclusive?v>=lower:v>lower))&&(upper===null||(upperInclusive?v<=upper:v<upper))))return true;
 }
 return nodes.some(n=>n.logic==='IF'?[n.condition,n.then,n.otherwise].some(c=>conflictingRules([c])):n.children?.some(c=>conflictingRules([c]))||false);
}
export function evaluateRuleSet(ruleSet,answers,{sourceValid=false,now=new Date(),demo=false}={}){
 const decision=ruleSet?.status==='RULES_VALIDATED_CURRENT'&&machineRuleValidated(ruleSet)||ruleSet?.status==='RULES_APPROVED_CURRENT'&&ruleSet.review?.humanCurated&&ruleSet.review.reviewedBy&&ruleSet.review.approvedAt&&ruleSet.review.evidence;
 const parsed=z.array(expression).min(1).max(80).safeParse(ruleSet?.rules),reviewed=decision&&ruleSet?.completeness==='COMPLETE'&&!ruleSet.missingInformation?.length&&ruleSet.effectiveFrom&&new Date(ruleSet.effectiveFrom)<=now&&ruleSet.effectiveUntil&&new Date(ruleSet.effectiveUntil)>now&&sourceValid&&!ruleSet.exceptions?.length&&!ruleSet.original?.conflicts?.length&&!ruleSet.normalized?.conflicts?.length;
 if(!reviewed||!parsed.success||parsed.data.some(unresolved)||conflictingRules(parsed.data))return{status:'CANNOT_DETERMINE',conditions:[],reason:!parsed.success?'EMPTY_OR_UNSUPPORTED_RULES':conflictingRules(parsed.data)?'CONFLICTING_RULE_CONDITIONS':'RULES_UNAPPROVED_INCOMPLETE_STALE_OR_EXPIRED',eligibilityGuaranteed:false,missingInformation:ruleSet?.missingInformation||[],demo};
 const conditions=parsed.data.map(n=>evaluateExpression(n,answers)),status=combine('AND',conditions.map(c=>c.status));return{status:status==='MET'?'MEETS_RECORDED_RULES':status==='UNMET'?'DOES_NOT_MEET_RECORDED_RULES':'CANNOT_DETERMINE',conditions,reason:status==='MISSING'?'MORE_ANSWERS_NEEDED':status==='UNKNOWN'?'REQUIREMENT_UNKNOWN':'VERIFIED_RULE_COMPARISON',eligibilityGuaranteed:false,authorityDecisionRequired:true,demo,ruleVersion:ruleVersion(ruleSet)};
}
