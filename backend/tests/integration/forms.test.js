process.env.ADMIN_USERNAME='forms-editor';process.env.ADMIN_PASSWORD='forms-test-only-password';
import test from 'node:test';import assert from 'node:assert/strict';
import {connectDB,disconnectDB} from '../../src/config/db.js';
import {models,initModels} from '../../src/models/index.js';
import {FormDocument,FormGuidanceArtifact,FormPreparationJob,FormReviewEvent} from '../../src/models/forms.js';
import {reviewFormFacts,enqueueFormPreparation,runFormAIOnce,publishFormGuidance} from '../../src/services/forms/workflow.js';
import {formCatalog,formDetail} from '../../src/services/forms/catalog.js';
import {formOutputFixture,testPDF} from '../support/formFixture.js';
import {app} from '../../src/app.js';
const uri=process.env.MONGODB_TEST_URI;
test('forms source → human review → cached trilingual preparation → editorial publication → evidence update, isolated database',{skip:!uri},async()=>{
 const u=new URL(uri);assert.match(u.pathname,/^\/mygovguide_phase2_test(?:_[\w-]+)?$/);u.pathname='/mygovguide_phase2_test_forms_'+Date.now();await connectDB(u.href);await initModels();
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port;let calls=0;
 try{
  await models.FormTemplate.create({_id:'TEST-FORM',id:'TEST-FORM',original:{synthetic:true},title:'SYNTHETIC TEST form',formKind:'PDF_FORM',sourceIds:['TEST-SOURCE'],sourceUrl:'https://example.test/blank.pdf',linkedSchemeIds:['TEST-SCHEME']});
  const doc=await FormDocument.create({_id:'TEST-DOC',formId:'TEST-FORM',url:'https://example.test/blank.pdf',sha256:'a'.repeat(64),edition:'TEST ONLY',pages:1,retrievedAt:new Date(),expiresAt:new Date(Date.now()+86400000),warnings:[],fields:[{id:'field-1',label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',instruction:''}]});
  await assert.rejects(enqueueFormPreparation('TEST-FORM','TEST_EDITOR'),{code:'HUMAN_FACT_RIGHTS_CURRENTNESS_REVIEW_REQUIRED'});
  assert.equal((await formDetail('TEST-FORM','kn')).guidance,null);
  await reviewFormFacts('TEST-FORM',{documentId:doc.id,factsChecked:true,rightsChecked:true,currentnessChecked:true,evidence:'SYNTHETIC TEST human-review simulation, never a government approval.',rightsBasis:'TEST ONLY internally authored synthetic evidence for regression coverage.'},'TEST_EDITOR');
  const jobs=await enqueueFormPreparation('TEST-FORM','TEST_EDITOR');assert.equal(jobs.length,3);await enqueueFormPreparation('TEST-FORM','TEST_EDITOR');assert.equal(await FormPreparationJob.countDocuments(),3);
  const router={generate:async(document,language)=>{calls++;return{output:formOutputFixture(document,language),provider:'synthetic-test-adapter',model:'TEST-NO-NETWORK',usage:{}};}};
  for(const job of jobs)assert.equal((await runFormAIOnce({router,jobId:job._id})).status,'REVIEW_PENDING');assert.equal(calls,3);
  assert.equal((await formDetail('TEST-FORM','en')).guidance,null);
  const artifacts=await FormGuidanceArtifact.find().lean();await assert.rejects(publishFormGuidance('TEST-FORM',{documentId:doc.id,artifactIds:[artifacts[0]._id,artifacts[0]._id,artifacts[0]._id],decision:'APPROVE_AND_PUBLISH',evidence:'TEST ONLY invalid duplicate editorial selection'},'TEST_EDITOR'),{code:'THREE_VALID_CURRENT_LANGUAGE_ARTIFACTS_REQUIRED'});
  await publishFormGuidance('TEST-FORM',{documentId:doc.id,artifactIds:artifacts.map(a=>a._id),decision:'APPROVE_AND_PUBLISH',evidence:'TEST ONLY simulated editorial approval of these exact synthetic revisions.'},'TEST_EDITOR');
  for(const language of ['en','hi','kn']){const detail=await formDetail('TEST-FORM',language);assert.equal(detail.guidance.language,language);assert.equal(detail.guidanceStatus,'PUBLISHED');}
  await FormPreparationJob.updateOne({_id:jobs[0]._id},{$set:{state:'RUNNING',leaseUntil:new Date(0)}});await runFormAIOnce({router,jobId:jobs[0]._id});assert.equal(calls,3);assert.equal(await FormGuidanceArtifact.countDocuments(),3);
  const counts=await Promise.all([models.FormTemplate.countDocuments(),FormDocument.countDocuments(),FormGuidanceArtifact.countDocuments(),FormReviewEvent.countDocuments()]);
  const response=await fetch(base+'/api/forms/uploads/extract?consent=local-only',{method:'POST',headers:{'Content-Type':'application/pdf'},body:testPDF('Name: PRIVATE SAMPLE\nMobile: 9999999999')});assert.equal(response.status,200);assert.ok(!JSON.stringify(await response.json()).includes('PRIVATE SAMPLE'));assert.deepEqual(await Promise.all([models.FormTemplate.countDocuments(),FormDocument.countDocuments(),FormGuidanceArtifact.countDocuments(),FormReviewEvent.countDocuments()]),counts);assert.equal(calls,3);
  assert.equal((await formCatalog({schemeId:'TEST-SCHEME'})).total,1);assert.equal((await formCatalog({schemeId:'OTHER'})).total,0);assert.equal((await fetch(base+'/api/admin/forms')).status,401);
  await FormDocument.create({...doc.toObject(),_id:'TEST-DOC-NEW',sha256:'b'.repeat(64),retrievedAt:new Date(Date.now()+1000),status:'DOCUMENT_CHECKED',factReview:undefined});
  assert.equal((await formDetail('TEST-FORM','en')).guidance,null);assert.equal(await FormGuidanceArtifact.countDocuments(),3);await assert.rejects(enqueueFormPreparation('TEST-FORM','TEST_EDITOR'));
  await FormPreparationJob.updateOne({_id:jobs[0]._id},{$set:{state:'QUEUED',nextRetryAt:new Date(0)}});assert.equal((await runFormAIOnce({router,jobId:jobs[0]._id})).error,'SOURCE_CHANGED_OR_UNREVIEWED');assert.equal(calls,3);
  await FormDocument.updateOne({_id:'TEST-DOC-NEW'},{$set:{status:'REJECTED'}});assert.equal((await formDetail('TEST-FORM','en')).guidance,null);
  // A larger form persists validated chunks across quota/interruption; successful
  // fields are never sent for regeneration on the next worker claim.
  await models.FormTemplate.create({_id:'TEST-BATCH-FORM',id:'TEST-BATCH-FORM',original:{synthetic:true},title:'SYNTHETIC chunk test',formKind:'PDF_FORM',sourceIds:['TEST-SOURCE'],sourceUrl:'https://example.test/chunk.pdf'});
  const batchDoc=await FormDocument.create({_id:'TEST-BATCH-DOC',formId:'TEST-BATCH-FORM',url:'https://example.test/chunk.pdf',sha256:'c'.repeat(64),pages:1,retrievedAt:new Date(),expiresAt:new Date(Date.now()+86400000),warnings:[],fields:Array.from({length:5},(_,i)=>({id:'field-'+i,label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',instruction:''}))});
  await reviewFormFacts('TEST-BATCH-FORM',{documentId:batchDoc.id,factsChecked:true,rightsChecked:true,currentnessChecked:true,evidence:'TEST ONLY source facts for chunk recovery coverage.',rightsBasis:'Internally authored synthetic document; test rights only.'},'TEST_EDITOR');
  const [batchJob]=await enqueueFormPreparation('TEST-BATCH-FORM','TEST_EDITOR');let partCalls=0;const successful=[];
  const chunkRouter={generate:async(document,language)=>{partCalls++;if(partCalls===2)throw Object.assign(Error('TEST QUOTA'),{code:'PROVIDER_QUOTA',retryAfterMs:60000});successful.push(document.fields.map(f=>f.id));return{output:formOutputFixture(document,language),provider:'MOCK_OFFLINE',model:'TEST_NO_NETWORK',usage:{}};}};
  assert.equal((await runFormAIOnce({router:chunkRouter,jobId:batchJob._id})).preparedFields,4);
  await FormPreparationJob.updateOne({_id:batchJob._id},{$set:{nextRetryAt:new Date(0)}});assert.equal((await runFormAIOnce({router:chunkRouter,jobId:batchJob._id})).error,'PROVIDER_QUOTA');assert.equal((await FormPreparationJob.findById(batchJob._id).lean()).parts.length,1);
  await FormPreparationJob.updateOne({_id:batchJob._id},{$set:{nextRetryAt:new Date(0)}});const assembled=await runFormAIOnce({router:chunkRouter,jobId:batchJob._id});assert.equal(assembled.status,'REVIEW_PENDING');assert.equal(assembled.output.fields.length,5);assert.deepEqual(successful,[['field-0','field-1','field-2','field-3'],['field-4']]);
  const pending=await FormPreparationJob.find({formId:'TEST-BATCH-FORM',language:{$in:['hi','kn']}}).sort({language:1}).lean();
  const invalid=await runFormAIOnce({jobId:pending[0]._id,router:{generate:async()=>({output:{language:'hi',fields:[]}})}});assert.equal(invalid.error,'FORM_OUTPUT_VALIDATION_FAILED');assert.equal((await FormPreparationJob.findById(pending[0]._id).lean()).state,'FAILED');
  const lost=await runFormAIOnce({jobId:pending[1]._id,router:{generate:async(document,language)=>{await FormPreparationJob.updateOne({_id:pending[1]._id},{$set:{leaseToken:'replacement-worker',state:'RUNNING'}});return{output:formOutputFixture(document,language)};}}});assert.equal(lost.error,'WORKER_LEASE_LOST');assert.equal((await FormPreparationJob.findById(pending[1]._id).lean()).leaseToken,'replacement-worker');assert.equal(await FormGuidanceArtifact.countDocuments({documentId:batchDoc.id,language:'kn'}),0);
 }finally{await new Promise(r=>server.close(r));await disconnectDB();}
});
