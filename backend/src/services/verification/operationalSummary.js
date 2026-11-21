import {models} from '../../models/index.js';
import {AIArtifact,AIJob} from '../../models/content.js';
import {FormPreparationJob} from '../../models/forms.js';
import {formCatalog} from '../forms/catalog.js';
import {inspectRules} from '../eligibility/service.js';
import {failedJobDispositions} from '../content/jobDisposition.js';
import {readPublished} from '../content/search.js';

export function enrichmentComplete(scheme,{publishedLanguages=false,executableRules=false,formGuide=false}={}){
 const app=scheme.applicationInfo||{},mode=app.mode;
 // An online scheme needs verified portal instructions, not an invented PDF.
 const application=app.verification?.status==='MACHINE_VALIDATED'&&app.steps?.length&&app.url&&['ONLINE','PDF_OFFLINE','BOTH','OTHER'].includes(mode);
 return Boolean(publishedLanguages&&(executableRules||app.eligibilityApplicable===false)&&application&&scheme.benefits&&(scheme.requiredDocuments?.length||app.documentsApplicable===false)&&!scheme.normalized?.observedFacts?.sourceGaps?.length&&(!['PDF_OFFLINE','BOTH'].includes(mode)||formGuide));
}
export async function operationalSummary(){
 const [schemes,forms,rules,failedJobs,allJobs,artifacts,lastScheme,lastDocument,lastNotice,lastSource,publicNotices,scams]=await Promise.all([
  models.Scheme.find().lean(),formCatalog(),models.EligibilityRuleSet.find({status:{$in:['RULES_APPROVED_CURRENT','RULES_VALIDATED_CURRENT']}}).lean(),AIJob.find({state:{$in:['FAILED','BLOCKED']}}).lean(),AIJob.find().select('_id artifactId state').lean(),AIArtifact.find({'validation.ok':true,state:{$in:['REVIEW_PENDING','APPROVED','AUTOMATED_VALIDATED']}}).select('_id').lean(),models.Scheme.findOne().sort({updatedAt:-1}).select('updatedAt').lean(),models.SourceVersion.findOne().sort({retrievedAt:-1}).select('retrievedAt').lean(),models.Notice.findOne().sort({updatedAt:-1}).select('updatedAt').lean(),models.Source.findOne({lastSuccessfulCollection:{$exists:true}}).sort({lastSuccessfulCollection:-1}).select('lastSuccessfulCollection').lean(),models.Notice.countDocuments({publicationStatus:'PUBLISHED',status:'SOURCE_VERIFIED_FACT'}),models.ScamAlert.countDocuments({'original.synthetic':{$ne:true},id:{$not:/^(fixture-|synthetic-)/},sourceUrl:{$not:/example\.test/}})
 ]);
 const executable=new Set();for(const r of rules)if((await inspectRules(r)).ok)executable.add(r.schemeId);
 const currentPublished=new Set();for(const s of schemes.filter(s=>s.publicationStatus==='PUBLISHED'))if((await Promise.all(['en','hi','kn'].map(l=>readPublished(s.id,l)))).every(p=>p&&!p.translationUnavailable))currentPublished.add(s.id);
 const dispositions=await failedJobDispositions(failedJobs),validIds=new Set(artifacts.map(a=>a._id));
 const dates=[lastScheme?.updatedAt,lastDocument?.retrievedAt,lastNotice?.updatedAt].filter(Boolean).map(d=>new Date(d));
 const formFailures=await FormPreparationJob.countDocuments({state:{$in:['FAILED','STALE']}});
 return{totalSchemes:schemes.length,publishedSchemes:currentPublished.size,fullyEnrichedSchemes:schemes.filter(s=>enrichmentComplete(s,{publishedLanguages:currentPublished.has(s.id),executableRules:executable.has(s.id),formGuide:forms.items.some(f=>f.schemeIds?.includes(s.id)&&f.guidanceStatus==='PUBLISHED')})).length,executableEligibilitySchemes:executable.size,availableForms:forms.total,checkedFormDocuments:forms.documentChecked,completeMultilingualFormGuides:forms.items.filter(f=>f.guidanceStatus==='PUBLISHED').length,publicNotices,scamAwarenessRecords:scams,successfulAIProcessingJobs:allJobs.filter(j=>validIds.has(j.artifactId)).length,failedProcessingJobs:dispositions.filter(d=>d.disposition==='ACTION_REQUIRED').length+formFailures,lastDataUpdate:dates.length?new Date(Math.max(...dates.map(Number))).toISOString():null,lastSuccessfulCollection:lastSource?.lastSuccessfulCollection||null,diagnostics:{rawHistoricalFailedAIJobs:failedJobs.length,supersededFailedAIJobs:dispositions.filter(d=>d.disposition!=='ACTION_REQUIRED').length,unresolvedFailures:dispositions.filter(d=>d.disposition==='ACTION_REQUIRED').map(d=>({jobId:d.jobId,reason:d.disposition})),note:'Machine validation, fact review and publication remain separate. Historical review observations stay in the existing audit workspace.'}};
}
