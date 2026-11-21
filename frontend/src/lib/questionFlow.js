// Visibility only. Eligibility decisions are always recalculated on the server.
function state(n,a){
 if(n.logic==='UNKNOWN')return null;
 if(n.logic==='IF'){const c=state(n.condition,a);return c===null?null:state(c?n.then:n.otherwise,a);}
 if(n.children){const states=n.children.map(c=>state(c,a));if(n.logic==='NOT')return states[0]===null?null:!states[0];if(n.logic==='AND')return states.includes(false)?false:states.includes(null)?null:true;return states.includes(true)?true:states.includes(null)?null:false;}
 const value=a[n.field];if(value===undefined||value===null||value===''||value==='__UNKNOWN__')return null;
 const eq=(x,y)=>JSON.stringify(x)===JSON.stringify(y);
 switch(n.operator){case'eq':return eq(value,n.value);case'ne':return!eq(value,n.value);case'lt':return value<n.value;case'lte':return value<=n.value;case'gt':return value>n.value;case'gte':return value>=n.value;case'in':return n.value.some(v=>eq(value,v));case'between':return(n.inclusiveMin===false?value>n.value[0]:value>=n.value[0])&&(n.inclusiveMax===false?value<n.value[1]:value<=n.value[1]);default:return null;}
}
export function visibleQuestions(detail,answers){const byField=new Map((detail.allQuestions||[]).map(q=>[q.field,q])),fields=[];const walk=n=>{if(n.logic==='IF'){walk(n.condition);const c=state(n.condition,answers);if(c!==null)walk(c?n.then:n.otherwise);}else if(n.children){for(const child of n.children){walk(child);if(n.logic==='OR'&&state(child,answers)===true)break;}}else if(n.field&&!fields.includes(n.field))fields.push(n.field);};(detail.ruleSet?.rules||[]).forEach(walk);return fields.map(f=>byField.get(f)).filter(Boolean);}
