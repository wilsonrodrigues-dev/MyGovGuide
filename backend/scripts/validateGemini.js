// Manual free-only live diagnostic. Never imported or run by npm test/worker/startup.
import {readFile,writeFile,mkdtemp} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
process.env.NODE_ENV='test';
const {env,phase1Dir}=await import('../src/config/env.js');
const {connectDB,disconnectDB,requireTransactions}=await import('../src/config/db.js');
const {models,initModels}=await import('../src/models/index.js');
const {initAdminModels}=await import('../src/models/admin.js');
const {AIArtifact,AIJob,ContentPublication,SchemeSearchDocument}=await import('../src/models/content.js');
const {MongoStore}=await import('../src/services/ingestion/store.js');
const {collect}=await import('../src/services/ingestion/collect.js');
const {approveFacts,enqueueAI,runAIOnce}=await import('../src/services/content/workflow.js');
const {AIProviderRouter,categorize}=await import('../src/services/content/providers.js');
const {validateOutput}=await import('../src/services/content/contracts.js');
const {hash}=await import('../src/utils/hash.js');
const report={at:new Date().toISOString(),mode:'REAL_GEMINI_WITH_ISOLATED_SYNTHETIC_TEST_COPY',requestedModel:env.GEMINI_MODEL||null,realGenerationCalls:0,paidGenerationRequests:0,languages:[],published:0};
const output=new URL('../reports/gemini-generation-validation.json',import.meta.url);
try{
 if(env.GEMINI_FREE_TIER_CONFIRMED!=='true'||env.AI_PAID_USE_APPROVED!=='false'||env.AI_MAX_COST_PER_DAY!==0)throw Object.assign(new Error('Free-only confirmation with paid mode disabled is required'),{code:'FREE_ONLY_GATE'});
 if(!env.GEMINI_MODEL||!env.GEMINI_API_KEY_PRIMARY)throw Object.assign(new Error('Model/key missing'),{code:'PROVIDER_NOT_CONFIGURED'});
 if(!env.MONGODB_TEST_URI)throw Object.assign(new Error('Explicit isolated test URI required'),{code:'TEST_DATABASE_REQUIRED'});
 const u=new URL(env.MONGODB_TEST_URI);if(!/^\/mygovguide_phase2_test(?:_[\w-]+)?$/.test(u.pathname))throw Object.assign(new Error('Isolated test database required'),{code:'TEST_DATABASE_REQUIRED'});
 u.pathname=`/mygovguide_phase2_test_gemini_${Date.now()}`;report.database=u.pathname.slice(1);
 report.stage='TEST_DATABASE';await connectDB(u.href);await requireTransactions();await initModels();await initAdminModels();
 report.stage='SYNTHETIC_TEST_COPY';
 const pack=JSON.parse(await readFile(path.join(phase1Dir,'VERIFIED_SCHEMES.json'),'utf8'));
 const research=pack.schemes.find(s=>s.id==='IN-FA-01');assert.equal(research.keyFacts.annualBenefitINR,6000);
 // This is a labeled test COPY of historical public research, not a new fact approval.
 const referenceDate='2026-11-18',sourceId='synthetic-gemini-validation-source',schemeId='synthetic-gemini-pmkisan-validation';
 const excerpt=`SYNTHETIC VALIDATION COPY of historical public PM-KISAN research, not a current eligibility assessment. The research records INR 6000 per year for eligible landholding farmer families. Test reference date ${referenceDate}; this is NOT an application deadline. Application deadline and required documents are not stated in this sample.`;
 const candidate={id:schemeId,title:research.title,sourceUrl:research.officialSourceUrl,sourceIds:[sourceId],state:'India',category:'Farmer',department:research.responsibleAuthority,description:excerpt,benefits:'INR 6000 per year',requiredDocuments:[],applicationInfo:{url:research.officialSourceUrl},original:{synthetic:true},keyFacts:{annualBenefitINR:6000,testReferenceDate:referenceDate}};
 const dir=await mkdtemp(path.join(os.tmpdir(),'mygovguide-gemini-'));await writeFile(path.join(dir,'sample.json'),JSON.stringify([candidate]));
 const store=new MongoStore();const collected=await collect(store,[{sourceId,title:'SYNTHETIC validation copy only',url:research.officialSourceUrl,method:'api',entityType:'Scheme',fixture:'sample.json'}],{offline:true,fixtureRoot:dir});
 assert.equal(collected.counters.created,1);
 const scheme=await store.get('Scheme',schemeId),version=await store.get('SourceVersion',scheme.currentVersionId);const originalHash=hash(version.original);
 const approval=await approveFacts(schemeId,{sourceVersionId:version.id,excerpt,clauseRefs:['Synthetic test copy of IN-FA-01; reference date is not a deadline'],evidenceUrl:research.officialSourceUrl,rightsBasis:'Isolated test copy of non-sensitive public research; no production rights approval',evidence:'Simulated test review only. Not current official facts, not a production approval.',verifiedAt:new Date().toISOString(),validUntil:new Date(Date.now()+3600000).toISOString(),publicNonSensitive:true,factsChecked:true,rightsChecked:true},'gemini-validation-test');
 const config={...env,AI_MAX_RETRIES:0,AI_MAX_CONCURRENT_JOBS:1};
 // Count router attempts exactly; no automatic quota/auth retries or second-key use in this diagnostic.
 const state={get:async()=>null,set:async()=>{}};
 const router=new AIProviderRouter({config,state,reserve:async()=>{report.realGenerationCalls++;}});
 for(const language of ['en','hi','kn']){
   report.stage=`GENERATION_${language}`;
   await enqueueAI(schemeId,[language],'gemini-validation-test',{config});
   const job=await runAIOnce({config,router});
   const artifact=job?.artifactId?await AIArtifact.findById(job.artifactId).lean():null;
   report.languages.push({language,status:job?.state||'NO_JOB',errorCode:job?.errorCode||null,artifactId:artifact?._id||null,model:artifact?.model||null,usage:artifact?.usage||job?.usage||{},validation:artifact?.validation||null,keywords:artifact?.output?.keywords||[],summary:artifact?.output?.summary||null});
   // Keep all outputs internal, including invalid outputs, for inspection. Never approve/publish.
   if(!artifact||!artifact.validation.ok){report.status='GENERATION_OR_VALIDATION_FAILED';break;}
   const checked=validateOutput(artifact.output,approval,language);assert.equal(checked.ok,true);assert.equal(artifact.state,'REVIEW_PENDING');
   const tampered=structuredClone(artifact.output);tampered.benefits=['INR 7000 per year'];assert.equal(validateOutput(tampered,approval,language).ok,false);
   const wrongDate=structuredClone(artifact.output);wrongDate.summary+=' 2027-01-01';assert.equal(validateOutput(wrongDate,approval,language).ok,false);
 }
 report.rawEvidencePreserved=hash((await store.get('SourceVersion',version.id)).original)===originalHash;
 report.published=await SchemeSearchDocument.countDocuments({published:true});report.publicationEvents=await ContentPublication.countDocuments();
 report.schemePublicationStatus=(await store.get('Scheme',schemeId)).publicationStatus;
 report.artifactsStored=await AIArtifact.countDocuments();report.jobs=await AIJob.countDocuments();report.costUsd=0;
 assert.equal(report.published,0);assert.equal(report.publicationEvents,0);assert.equal(report.schemePublicationStatus,'INTERNAL');assert.equal(report.rawEvidencePreserved,true);
 report.status ||= report.languages.length===3?'ALL_LANGUAGES_REVIEW_PENDING':'INCOMPLETE';
}catch(error){report.status='BLOCKED_OR_FAILED';report.errorCode=error.category||error.code||categorize(error).code;report.httpStatus=Number(error.status||0);}
finally{await disconnectDB();const data=JSON.stringify(report,null,2);await writeFile(output,data);await writeFile(new URL(`../reports/gemini-generation-${Date.now()}.json`,import.meta.url),data);console.log(JSON.stringify(report));if(report.status!=='ALL_LANGUAGES_REVIEW_PENDING')process.exitCode=1;}
