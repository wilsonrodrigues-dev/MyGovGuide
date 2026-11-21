process.env.ADMIN_USERNAME='editor@example.test';process.env.ADMIN_PASSWORD='isolated-admin-test-password';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { mkdtemp,writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
process.env.NODE_ENV='test';const {connectDB,disconnectDB,requireTransactions}=await import('../../src/config/db.js');
const {models,initModels}=await import('../../src/models/index.js');
const {AdminUser,AdminAudit,initAdminModels}=await import('../../src/models/admin.js');
const {AIJob,AIArtifact,ContentApproval,SchemeSearchDocument,AIWorkerSlot,AIDailyBudget}=await import('../../src/models/content.js');
const {collect}=await import('../../src/services/ingestion/collect.js');
const {MongoStore}=await import('../../src/services/ingestion/store.js');
const {ingest}=await import('../../src/services/changeDetection/ingest.js');
const {approveFacts,enqueueAI,runAIOnce,reserveBudget}=await import('../../src/services/content/workflow.js');
const {fixtureScheme,fixtureOutput,mockRouter,translations,mockConfig}=await import('../support/contentFixture.js');
const {app}=await import('../../src/app.js');
const uri=process.env.MONGODB_TEST_URI;
test('review → EN/HI/KN preparation → editor → indexed search vertical slice (isolated synthetic)',{skip:!uri},async t=>{
 const u=new URL(uri);assert.match(u.pathname,/^\/mygovguide_phase2_test(?:_[\w-]+)?$/);u.pathname=`/mygovguide_phase2_test_content_${Date.now()}`;
 await connectDB(u.href);await requireTransactions();await initModels();await initAdminModels();
 const password=process.env.ADMIN_PASSWORD;
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base=`http://127.0.0.1:${server.address().port}`;let cookie;
 async function api(url,method='GET',body,anonymous=false){return fetch(base+url,{method,headers:{Origin:'http://127.0.0.1:5173','Content-Type':'application/json',...(!anonymous&&cookie?{Cookie:cookie}:{})},...(body?{body:JSON.stringify(body)}:{})});}
 const prefix='/api/admin/content',store=new MongoStore();let versionId,approval,original,artifactIds;
 try{
 await t.test('source parses and stages synthetic scheme, anonymous admin endpoints fail closed',async()=>{
  const dir=await mkdtemp(path.join(os.tmpdir(),'mygovguide-content-'));await writeFile(path.join(dir,'scheme.json'),JSON.stringify([fixtureScheme]));
  const source={sourceId:'synthetic-ai-source',title:'SYNTHETIC AI PIPELINE FIXTURE',url:fixtureScheme.sourceUrl,method:'api',entityType:'Scheme',fixture:'scheme.json'};
  const result=await collect(store,[source],{offline:true,fixtureRoot:dir});assert.equal(result.counters.created,1);assert.equal(result.counters.failed,0);
  const scheme=await store.get('Scheme',fixtureScheme.id);versionId=scheme.currentVersionId;original=await store.get('SourceVersion',versionId);
  assert.equal(scheme.status,'RESEARCH_ONLY');await assert.rejects(enqueueAI(scheme.id,['en'],'test'));
  for(const url of ['/metrics','/providers','/schemes','/jobs','/artifacts','/editorial-review'])assert.equal((await api(prefix+url,'GET',null,true)).status,401);
  const login=await api('/api/admin/auth/login','POST',{username:'editor@example.test',password},true);assert.equal(login.status,200);cookie=login.headers.get('set-cookie').split(';')[0];
  await ingest(store,'Notice',{id:'collected-legacy-fixture',title:'Legacy offline fixture',sourceIds:[source.sourceId],sourceUrl:fixtureScheme.sourceUrl,original:{legacyOfflineTest:true},normalized:{description:'Legacy fixture predates explicit provenance flags.'}});
  const origins=(await(await api(prefix+'/metrics')).json()).recordOrigins;
  assert.equal(origins.find(x=>x.entityType==='Notice'&&x.origin==='SYNTHETIC')?.count,1,'Legacy collected IDs must still use their fixture source identity for classification');
 });
 await t.test('explicit source fact approval is version/evidence bound and does not approve eligibility rules',async()=>{
  const data={sourceVersionId:versionId,excerpt:fixtureScheme.description,clauseRefs:['Synthetic clause 1'],evidenceUrl:fixtureScheme.sourceUrl,rightsBasis:'SYNTHETIC TEST rights only; not real government material',evidence:'Simulated human source review in an isolated test database only.',verifiedAt:new Date().toISOString(),validUntil:new Date(Date.now()+86400000).toISOString(),publicNonSensitive:true,factsChecked:true,rightsChecked:true};
  assert.equal((await api(`${prefix}/schemes/${fixtureScheme.id}/fact-review`,'POST',{...data,rightsChecked:false})).status,400);
  const r=await api(`${prefix}/schemes/${fixtureScheme.id}/fact-review`,'POST',data);assert.equal(r.status,200,await r.clone().text());approval=await r.json();assert.equal(approval.dataClass,'SYNTHETIC');
  assert.equal(await models.EligibilityRuleSet.countDocuments({status:'RULES_APPROVED_CURRENT'}),0);
  assert.equal((await store.get('Scheme',fixtureScheme.id)).publicationStatus,'INTERNAL');
 });
 await t.test('jobs deduplicate and worker produces all languages without replacing raw evidence',async()=>{
  const r=await api(`${prefix}/schemes/${fixtureScheme.id}/prepare`,'POST',{languages:['en','hi','kn']});assert.equal(r.status,202);
  assert.equal((await r.json()).items.length,3);await api(`${prefix}/schemes/${fixtureScheme.id}/prepare`,'POST',{languages:['en','hi','kn']});assert.equal(await AIJob.countDocuments(),3);
  const parallel=await Promise.all([runAIOnce({router:mockRouter(),config:mockConfig}),runAIOnce({router:mockRouter(),config:mockConfig}),runAIOnce({router:mockRouter(),config:mockConfig})]);
  while(await AIJob.exists({state:'QUEUED'}))await runAIOnce({router:mockRouter(),config:mockConfig});
  const artifacts=await AIArtifact.find().lean();assert.equal(artifacts.length,3);assert.deepEqual(new Set(artifacts.map(a=>a.language)),new Set(['en','hi','kn']));assert.ok(artifacts.every(a=>a.state==='REVIEW_PENDING'&&a.validation.ok&&a.provider==='MOCK_OFFLINE'));
  const batch=await api(`${prefix}/preparation-batches`,'POST',{schemeIds:[fixtureScheme.id,fixtureScheme.id],languages:['en','hi','kn']});assert.equal(batch.status,202);assert.equal((await batch.json()).items.length,1);assert.equal(await AIJob.countDocuments(),3,'Batch preparation reuses current jobs');
  assert.equal((await api(`${prefix}/preparation-batches`,'POST',{schemeIds:Array.from({length:6},(_,i)=>'unapproved-'+i),languages:['en']})).status,400);
  const blockedBatch=await api(`${prefix}/preparation-batches`,'POST',{schemeIds:['unapproved-missing'],languages:['en']});assert.equal(blockedBatch.status,409);assert.equal((await blockedBatch.json()).publicationActions,0);
  assert.equal(await SchemeSearchDocument.countDocuments({published:true}),0,'Generation and storage never publish content');
  assert.equal((await store.get('Scheme',fixtureScheme.id)).publicationStatus,'INTERNAL');
  assert.deepEqual((await store.get('SourceVersion',versionId)).original,original.original);assert.equal((await store.get('SourceVersion',versionId)).contentHash,original.contentHash);
  assert.equal((await (await api('/api/content/search?q=scholarship','GET',null,true)).json()).items.length,0);
  artifactIds=artifacts.map(a=>a._id);
 });
 await t.test('one consolidated review classifies current revisions and rejects missing attestation, stale snapshots and blocked evidence without decisions',async()=>{
  const before=await AIArtifact.countDocuments({state:'APPROVED'}),result=await(await api(prefix+'/editorial-review')).json();assert.equal(result.total,1);const row=result.items[0];assert.equal(row.readiness,'READY_FOR_EDITORIAL_REVIEW');assert.equal(row.publicationReady,false);assert.equal(row.languages.length,3);assert.ok(row.languages.every(a=>a.validation.ok&&a.sha256&&a.output.keywords.length));assert.equal(result.publicationActions,0);
  const decision={action:'APPROVE_AND_PUBLISH',selections:[{schemeId:row.schemeId,snapshot:row.snapshot}],evidence:'Synthetic consolidated review decision in isolated database only.',personallyReviewed:true};
  assert.equal((await api(prefix+'/editorial-review/decisions','POST',{...decision,personallyReviewed:false})).status,400);
  assert.equal((await api(prefix+'/editorial-review/decisions','POST',{...decision,selections:[{schemeId:row.schemeId,snapshot:'0'.repeat(64)}]})).status,409);
  const currentFacts=structuredClone(approval.facts);await ContentApproval.updateOne({_id:approval._id},{$set:{'facts.observedFacts.publicationBlocked':true}});
  const blocked=(await(await api(prefix+'/editorial-review')).json()).items[0];assert.equal(blocked.readiness,'BLOCKED_CURRENT_EVIDENCE');assert.equal(blocked.readyForEditorialReview,false);assert.equal((await api(prefix+'/editorial-review/decisions','POST',decision)).status,409);
  await ContentApproval.updateOne({_id:approval._id},{$set:{facts:currentFacts}});
  const originalArtifact=await AIArtifact.findById(artifactIds[0]).lean(),bad=structuredClone(originalArtifact.output);bad.benefits=['INR 999999'];await AIArtifact.updateOne({_id:originalArtifact._id},{$set:{output:bad}});
  const invalid=(await(await api(prefix+'/editorial-review')).json()).items[0];assert.equal(invalid.readiness,'CORRECTIONS_REQUIRED');assert.equal(invalid.readyForEditorialReview,false);
  await AIArtifact.updateOne({_id:originalArtifact._id},{$set:{output:{language:originalArtifact.language,title:'Malformed isolated test output'}}});const malformed=(await(await api(prefix+'/editorial-review')).json()).items[0];assert.equal(malformed.readiness,'CORRECTIONS_REQUIRED');assert.equal(malformed.languages.find(a=>a.artifactId===originalArtifact._id).output,null,'Malformed structured output is retained as raw evidence, not rendered as a valid explanation');await AIArtifact.updateOne({_id:originalArtifact._id},{$set:{output:originalArtifact.output}});
  assert.equal(await AIArtifact.countDocuments({state:'APPROVED'}),before);assert.equal(await SchemeSearchDocument.countDocuments({published:true}),0);
 });
 await t.test('publication requires separate artifact review; edits retain history; rejection is audited',async()=>{
  assert.equal((await api(`${prefix}/schemes/${fixtureScheme.id}/publication`,'POST',{artifactIds,evidence:'Synthetic publish test evidence before editor approval.'})).status,409);
  const bad=structuredClone((await AIArtifact.findById(artifactIds[0]).lean()).output);bad.benefits=['INR 999999'];
  assert.equal((await api(`${prefix}/artifacts/${artifactIds[0]}/review`,'POST',{action:'EDIT',output:bad,evidence:'Test changed numeric fact must fail validation.'})).status,400);
  const first=await AIArtifact.findById(artifactIds[0]).lean();const edit=await api(`${prefix}/artifacts/${first._id}/review`,'POST',{action:'EDIT',output:first.output,evidence:'Synthetic editor copy preserves all source facts.'});assert.equal(edit.status,200);const edited=await edit.json();assert.equal(edited.previousArtifactId,first._id);
  assert.equal((await api(`${prefix}/artifacts/${edited._id}/review`,'POST',{action:'REJECT',evidence:'Synthetic duplicate editor draft rejected for test coverage.'})).status,200);
  for(const id of artifactIds)assert.equal((await api(`${prefix}/artifacts/${id}/review`,'POST',{action:'APPROVE',evidence:'Synthetic editor reviewed language, keywords and exact source facts.'})).status,200);
  const approvedArtifacts=await AIArtifact.find({_id:{$in:artifactIds}}).lean();
  const englishId=approvedArtifacts.find(a=>a.language==='en')._id,hindiId=approvedArtifacts.find(a=>a.language==='hi')._id;
  const factSnapshot=await ContentApproval.findById(approval._id).lean();await ContentApproval.updateOne({_id:approval._id},{$set:{'facts.observedFacts.publicationBlocked':true}});
  const blockedPublication=await api(`${prefix}/schemes/${fixtureScheme.id}/publication`,'POST',{artifactIds:[englishId],evidence:'Historical-only fact packet must never publish.'});assert.equal(blockedPublication.status,409);assert.match((await blockedPublication.json()).error.message,/refreshed current official evidence/);
  await ContentApproval.updateOne({_id:approval._id},{$set:{facts:factSnapshot.facts}});
  assert.equal((await api(`${prefix}/schemes/${fixtureScheme.id}/publication`,'POST',{artifactIds:[hindiId],evidence:'A translation alone must not bypass the reviewed English baseline.'})).status,409);
  assert.equal((await api(`${prefix}/schemes/${fixtureScheme.id}/publication`,'POST',{artifactIds:[englishId],evidence:'Synthetic reviewed English is available while translations remain unselected.'})).status,200);
  assert.equal(await SchemeSearchDocument.countDocuments({published:true}),1);
  assert.equal((await api(`${prefix}/schemes/${fixtureScheme.id}/publication`,'POST',{artifactIds,evidence:'Synthetic multilingual pipeline publication test only.'})).status,200);
  assert.equal(await SchemeSearchDocument.countDocuments({published:true}),3);
  assert.ok(await AdminAudit.countDocuments({action:'AI_ARTIFACT_REJECTED'}));
 });
 await t.test('AI failure preserves the previous publication and retry recovers an expired lease',async()=>{
  const before=await AIJob.countDocuments(),cached=await enqueueAI(fixtureScheme.id,['en'],'test-editor',{config:{GEMINI_MODEL:'different-model-must-not-regenerate-valid-output'}});assert.equal(cached[0].cached,true);assert.equal(await AIJob.countDocuments(),before);
  const [job]=await enqueueAI(fixtureScheme.id,['en'],'test-editor',{config:{GEMINI_MODEL:'mock-failure-model'},regenerate:true});
  const failed=await runAIOnce({router:{generate:async()=>{throw Object.assign(new Error('mock unavailable'),{code:'PROVIDER_TEMPORARY'});}}});
  assert.equal(failed.state,'DEFERRED');assert.equal((await store.get('Scheme',fixtureScheme.id)).publicationStatus,'PUBLISHED');assert.equal(await SchemeSearchDocument.countDocuments({published:true}),3);
  await AIJob.updateOne({_id:job._id},{$set:{state:'RUNNING',leaseUntil:new Date(0),leaseToken:'dead-worker',attempts:1}});
  const recovered=await runAIOnce({router:mockRouter()});assert.equal(recovered.state,'REVIEW_PENDING');assert.equal(recovered.attempts,2);
 });
 await t.test('30 language queries and romanized prefixes rank stored results; synthetic data never appears as official',async()=>{
  for(const [language,t]of Object.entries(translations))for(const q of t.keywords){const r=await api(`${prefix}/search-preview?q=${encodeURIComponent(q)}&language=${language}`);assert.equal(r.status,200);const data=await r.json();assert.equal(data.items[0]?.id,fixtureScheme.id,`${language}:${q}`);assert.equal(data.items[0].synthetic,true);}
  for(const q of ['scholar','vidyarthi sahaya']){const r=await api(`${prefix}/search-preview?q=${encodeURIComponent(q)}&language=en`);assert.equal((await r.json()).items[0].id,fixtureScheme.id);}
  for(const [language,q]of [['en','scholorship'],['hi','छात्रवृति'],['hi','विद्यार्थियों'],['kn','ವಿದ್ಯಾರ್ತಿ'],['kn','ವಿದ್ಯಾರ್ಥಿಗಳು']]){const r=await api(`${prefix}/search-preview?q=${encodeURIComponent(q)}&language=${language}`);assert.equal((await r.json()).items[0]?.id,fixtureScheme.id,`${language} reviewed variant: ${q}`);}
  for(const [language,q]of [['en','scholorship'],['hi','छात्रवृति'],['hi','विद्यार्थियों'],['kn','ವಿದ್ಯಾರ್ತಿ'],['kn','ವಿದ್ಯಾರ್ಥಿಗಳು']]){const r=await api(`${prefix}/search-preview?q=${encodeURIComponent(q)}&language=${language}`);assert.equal((await r.json()).items[0]?.id,fixtureScheme.id,`${language}:${q}`);}
  const filtered=await api(`${prefix}/search-preview?q=scholarship&language=en&state=Kerala`);assert.equal((await filtered.json()).items.length,0);
  assert.equal((await (await api('/api/content/search?q=scholarship','GET',null,true)).json()).items.length,0);
  assert.equal((await api(`/api/content/schemes/${fixtureScheme.id}`,'GET',null,true)).status,404);
  const metrics=await(await api(prefix+'/metrics')).json();assert.ok(metrics.artifacts.some(x=>x._id.language==='kn'));assert.equal(metrics.published.length,3);
 });
 await t.test('source change withdraws derived/search data and stale artifact approval cannot restore it',async()=>{
  const current=await store.get('Scheme',fixtureScheme.id);
  const update={id:current.id,title:current.title,sourceIds:current.sourceIds,sourceUrl:current.sourceUrl,original:{...current.original,update:'SYNTHETIC new source edition'},normalized:{...original.normalized,benefits:'INR 7000 per year'}};
  await enqueueAI(current.id,['en'],'test-editor',{config:{GEMINI_MODEL:'mock-inflight-change-model'},regenerate:true});
  const artifactsBefore=await AIArtifact.countDocuments();
  const inFlight=await runAIOnce({router:{generate:async(snapshot,language)=>{await ingest(store,'Scheme',update,{state:'Karnataka',beneficiaryCategories:['Student']});return mockRouter().generate(snapshot,language);}}});
  assert.equal(inFlight.state,'FAILED');assert.equal(await AIArtifact.countDocuments(),artifactsBefore,'Obsolete response cannot commit after source change');
  assert.ok(await AIArtifact.countDocuments({stale:true}));assert.equal(await SchemeSearchDocument.countDocuments({published:true}),0);
  assert.equal((await store.get('Scheme',current.id)).approvedVersionId,versionId);assert.deepEqual((await store.get('SourceVersion',versionId)).original,original.original);
  assert.equal((await api(`${prefix}/artifacts/${artifactIds[0]}/review`,'POST',{action:'APPROVE',evidence:'Stale output must remain unavailable.'})).status,409);
  assert.equal((await (await api(`${prefix}/search-preview?q=scholarship`)).json()).items.length,0);
 });
 await t.test('one explicit consolidated decision publishes multiple inspected synthetic schemes and excludes incomplete research',async()=>{
  const ids=['synthetic-consolidated-one','synthetic-consolidated-two'];
  for(const id of ids){await ingest(store,'Scheme',{id,title:fixtureScheme.title+' '+id,sourceIds:['synthetic-ai-source'],sourceUrl:fixtureScheme.sourceUrl,original:{...fixtureScheme,synthetic:true},normalized:{...original.normalized,description:fixtureScheme.description}},{state:'Karnataka',beneficiaryCategories:['Student'],schemeStatus:'ACTIVE'});const s=await store.get('Scheme',id);
   await approveFacts(id,{sourceVersionId:s.currentVersionId,excerpt:fixtureScheme.description,clauseRefs:['Synthetic clause 1'],evidenceUrl:fixtureScheme.sourceUrl,rightsBasis:'SYNTHETIC TEST rights only; no real government content',evidence:'Isolated synthetic human-fact decision for consolidated endpoint coverage.',verifiedAt:new Date().toISOString(),validUntil:new Date(Date.now()+86400000).toISOString(),publicNonSensitive:true,factsChecked:true,rightsChecked:true},'test-editor');
   await enqueueAI(id,['en','hi','kn'],'test-editor');while(await AIJob.exists({state:'QUEUED'}))await runAIOnce({router:mockRouter(),config:mockConfig});
  }
  const rows=(await(await api(prefix+'/editorial-review?limit=100')).json()).items;
  assert.equal(rows.find(r=>r.schemeId===fixtureScheme.id).readiness,'FACT_REVIEW_REQUIRED','Changed source requires fresh fact review, not old derivative approval');
  const selected=rows.filter(r=>ids.includes(r.schemeId));assert.equal(selected.length,2);assert.ok(selected.every(r=>r.readyForEditorialReview));
  const body={action:'APPROVE_AND_PUBLISH',selections:selected.map(r=>({schemeId:r.schemeId,snapshot:r.snapshot})),personallyReviewed:true,evidence:'Explicit simulated editorial approval of these two inspected synthetic schemes only.'};
  const decision=await api(prefix+'/editorial-review/decisions','POST',body);assert.equal(decision.status,200,await decision.clone().text());const result=await decision.json();assert.equal(result.complete,true);assert.equal(result.publicationActions,2);assert.equal(result.generationCalls,0);
  assert.equal(await AIArtifact.countDocuments({schemeId:{$in:ids},state:'APPROVED'}),6);assert.equal(await SchemeSearchDocument.countDocuments({schemeId:{$in:ids},published:true}),6);assert.equal((await(await api(prefix+'/editorial-review')).json()).items.some(r=>ids.includes(r.schemeId)),false);
  assert.equal((await api(prefix+'/editorial-review/decisions','POST',body)).status,409,'Replaying a stale pending decision must not create duplicate publication events');
 });
 await t.test('durable daily budget reservation is atomic across competing requests',async()=>{
  const config={AI_PAID_USE_APPROVED:'true',AI_MAX_COST_PER_DAY:0.01};const results=await Promise.allSettled([reserveBudget(0.006,config),reserveBudget(0.006,config)]);assert.equal(results.filter(x=>x.status==='fulfilled').length,1);assert.ok((await AIDailyBudget.findOne().lean()).committedUsd<=0.01);
  // No real model is invoked by a budget reservation test.
 });
 await writeFile(new URL('../../reports/phase36-content-integration.json',import.meta.url),JSON.stringify({at:new Date().toISOString(),database:u.pathname.slice(1),mode:'SYNTHETIC_ISOLATED_MOCK_PROVIDER',liveGovernmentRuns:0,realGenerationCalls:0,costUsd:0,languages:['en','hi','kn'],queries:37,artifacts:await AIArtifact.countDocuments(),audits:await AdminAudit.countDocuments(),rawEvidencePreserved:true,syntheticExcludedFromPublic:true},null,2));
 }finally{await new Promise(r=>server.close(r));await disconnectDB();}
});
