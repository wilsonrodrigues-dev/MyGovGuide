import {checkVersion} from './evidenceRules.js';
export const completenessVersion='demo-completeness-1';
const present=value=>typeof value==='string'?Boolean(value.trim())&&!/^(unknown|not specified|needs verification)$/i.test(value.trim()):Array.isArray(value)?value.length>0:value&&typeof value==='object'?Object.values(value).some(present):false;
// Presence is a staging aid; it never grants fact, rights, editorial or rule approval.
export function assessSchemeCompleteness(scheme,version){
 const evidenceValid=Boolean(version&&version.id===scheme.currentVersionId&&version.contentHash===scheme.contentHash&&checkVersion(version,'Scheme',scheme.id));const p=evidenceValid?version.payload:{};
 const values={officialName:p.title,department:p.department,benefits:p.benefits,eligibilityConditions:p.eligibilityConditions,documents:p.requiredDocuments,application:p.applicationInfo?.steps,applicationLink:p.applicationInfo?.url,officialSource:p.sourceUrl,effectiveDates:p.dates,amendmentReferences:p.documentReferences};
 const fields=Object.fromEntries(Object.entries(values).map(([key,value])=>[key,{state:present(value)?'RECORDED_REQUIRES_SCOPE_REVIEW':'MISSING',versionId:version?.id||null}]));
 return{version:completenessVersion,evidenceValid,fields,missing:Object.keys(fields).filter(key=>fields[key].state==='MISSING'),interpretation:'Recorded fields are not certified complete. Missing operative conditions, exceptions, dates and source rights require review; existing limited-summary publication is a separate decision.'};
}
