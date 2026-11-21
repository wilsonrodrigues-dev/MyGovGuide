import test from 'node:test';import assert from 'node:assert/strict';
import {connectDB,disconnectDB} from '../../src/config/db.js';
import {models,initModels} from '../../src/models/index.js';
import {FormDocument,FormPreparationJob,FormGuidanceArtifact,FormReviewEvent} from '../../src/models/forms.js';
import {draftBinding} from '../../src/services/forms/drafts.js';
import {enqueueFormPreparation,runFormAIOnce,publishFormGuidance,reviewFormFacts} from '../../src/services/forms/workflow.js';
import {formDetail} from '../../src/services/forms/catalog.js';
test('evidence-bound drafts resume without human approval; publication and stale versions remain gated',{skip:!process.env.MONGODB_TEST_URI},async()=>{
 const u=new URL(process.env.MONGODB_TEST_URI);assert.match(u.pathname,/^\/mygovguide_phase2_test/);u.pathname='/mygovguide_phase2_test_drafts_'+Date.now();await connectDB(u.href);await initModels();
 try{
 await models.FormTemplate.create({_id:'DRAFT-TEST',id:'DRAFT-TEST',title:'SYNTHETIC blank form',original:{synthetic:true},sourceIds:['TEST'],sourceUrl:'https://example.test/blank.pdf',formKind:'PDF_FORM'});
 let doc=await FormDocument.create({_id:'DRAFT-DOC',formId:'DRAFT-TEST',url:'https://example.test/blank.pdf',sha256:'a'.repeat(64),sourceVersionId:'TEST-VERSION',httpStatus:200,pages:1,expiresAt:new Date(Date.now()+86400000),retrievedAt:new Date(),fields:Array.from({length:9},(_,i)=>({id:'f-'+i,label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',role:'APPLICANT',evidenceRefs:[{url:'https://example.test/blank.pdf',page:1}]}))});
 await FormDocument.updateOne({_id:doc._id},{$set:{'fields.$[].evidenceRefs':[{url:'https://example.test/blank.pdf',documentHash:'a'.repeat(64),page:1,quote:'Name'}]}});
 doc=await FormDocument.findById(doc._id);
 await models.SourceVersion.create({_id:'TEST-VERSION',id:'TEST-VERSION',sourceId:'TEST',entityType:'FormDocument',entityId:'DRAFT-TEST',original:{synthetic:true},contentHash:'b'.repeat(64),retrievedAt:new Date(),payload:{documentId:doc._id,sha256:doc.sha256,fields:doc.toObject().fields,originalPageTexts:[{page:1,text:'Name'}]}});
 await FormDocument.updateOne({_id:doc._id},{$set:{preparation:{mode:'SOURCE_GROUNDED_DRAFT',sourceVerified:true,...draftBinding(doc.toObject()),evidence:[{synthetic:true}]}}});
 const jobs=await enqueueFormPreparation('DRAFT-TEST','TEST_SYSTEM');let calls=0;const router={generate:async(d,l)=>{calls++;return{output:{fields:d.fields.map(f=>({id:f.id,meaning:{en:'The applicant name.',hi:'यह आवेदक का नाम है।',kn:'ಇದು ಅರ್ಜಿದಾರರ ಹೆಸರು.'}[l],whatToEnter:{en:'Use the name on the original.',hi:'मूल में दिया नाम लिखें।',kn:'ಮೂಲದಲ್ಲಿರುವ ಹೆಸರು ಬರೆಯಿರಿ.'}[l],needsVerification:true}))},provider:'SYNTHETIC_OFFLINE',model:'NO_NETWORK',usage:{}};}};
 assert.equal((await runFormAIOnce({jobId:jobs[0]._id,router})).preparedFields,8);assert.equal((await FormPreparationJob.findById(jobs[0]._id)).parts.length,1);
 await FormPreparationJob.updateOne({_id:jobs[0]._id},{$set:{state:'RUNNING',leaseUntil:new Date(0)}});
 assert.equal((await runFormAIOnce({jobId:jobs[0]._id,router})).status,'REVIEW_PENDING');assert.equal(calls,2);
 await FormPreparationJob.updateOne({_id:jobs[0]._id},{$set:{state:'QUEUED',nextRetryAt:new Date(0)}});await runFormAIOnce({jobId:jobs[0]._id,router});assert.equal(calls,2);assert.equal(await FormGuidanceArtifact.countDocuments(),1);assert.equal(await FormReviewEvent.countDocuments(),0);
 assert.equal((await formDetail('DRAFT-TEST')).guidance,null);
 await assert.rejects(publishFormGuidance('DRAFT-TEST',{documentId:doc._id,artifactIds:jobs.map(j=>j._id),decision:'APPROVE_AND_PUBLISH'},'TEST'),{code:'CURRENT_REVIEWED_DOCUMENT_REQUIRED'});
 for(const job of jobs.slice(1)){await runFormAIOnce({jobId:job._id,router});await FormPreparationJob.updateOne({_id:job._id},{$set:{nextRetryAt:new Date(0)}});await runFormAIOnce({jobId:job._id,router});}
 const pending=await formDetail('DRAFT-TEST','kn');assert.equal(pending.guidanceStatus,'VALIDATED_DRAFT_REVIEW_PENDING');assert.equal(pending.preparation.aiGuidancePrepared,true);assert.equal(pending.preparation.citizenReady,false);assert.equal(pending.guidance,null);assert.equal(calls,6);
 // Explicitly synthetic editorial decision proves the new contract can use
 // the existing publication path; never applied to the real Atlas records.
 await reviewFormFacts('DRAFT-TEST',{documentId:doc._id,factsChecked:true,rightsChecked:true,currentnessChecked:true,rightsBasis:'TEST ONLY internally authored synthetic form; not government rights.'},'SYNTHETIC_TEST_EDITOR');
 await publishFormGuidance('DRAFT-TEST',{documentId:doc._id,artifactIds:jobs.map(j=>j._id),decision:'APPROVE_AND_PUBLISH'},'SYNTHETIC_TEST_EDITOR');
 for(const language of ['en','hi','kn']){const d=await formDetail('DRAFT-TEST',language);assert.equal(d.guidance.language,language);assert.equal(d.preparation.citizenReady,true);assert.equal(d.guidance.fields[0].page,1);}
 await FormDocument.updateOne({_id:doc._id},{$set:{'fields.0.condition':'Changed evidence'}});
 assert.equal((await formDetail('DRAFT-TEST')).guidance,null);await FormPreparationJob.updateOne({_id:jobs[1]._id},{$set:{state:'QUEUED',nextRetryAt:new Date(0)}});
 assert.equal((await runFormAIOnce({jobId:jobs[1]._id,router})).error,'SOURCE_CHANGED_OR_UNREVIEWED');assert.equal(calls,6);
 const changed=await FormDocument.findById(doc._id).lean();changed.sourceVersionId='TEST-VERSION-2';changed.status='DOCUMENT_CHECKED';delete changed.factReview;changed.preparation={...changed.preparation,...draftBinding(changed)};
 await models.SourceVersion.create({_id:'TEST-VERSION-2',id:'TEST-VERSION-2',sourceId:'TEST',entityType:'FormDocument',entityId:'DRAFT-TEST',revision:2,original:{synthetic:true},contentHash:'c'.repeat(64),retrievedAt:new Date(),previousVersionId:'TEST-VERSION',payload:{documentId:changed._id,sha256:changed.sha256,fields:changed.fields,originalPageTexts:[{page:1,text:'Name'}]}});
 await FormDocument.updateOne({_id:changed._id},{$set:{sourceVersionId:changed.sourceVersionId,status:changed.status,preparation:changed.preparation},$unset:{factReview:''}});
 const [revised]=await enqueueFormPreparation('DRAFT-TEST','TEST_SYSTEM');assert.equal((await runFormAIOnce({jobId:revised._id,router})).preparedFields,1);assert.equal(calls,7);
 await FormPreparationJob.updateOne({_id:revised._id},{$set:{nextRetryAt:new Date(0)}});const reused=await runFormAIOnce({jobId:revised._id,router});assert.equal(reused.status,'REVIEW_PENDING');assert.equal(calls,7);assert.equal(reused.generationParts.at(-1).reusedFrom.fields.length,8);assert.equal(reused.review?.at,undefined);assert.equal((await formDetail('DRAFT-TEST')).guidance,null);
 }finally{await disconnectDB();}
});
