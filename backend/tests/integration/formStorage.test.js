import test from 'node:test';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
import {connectDB,disconnectDB} from '../../src/config/db.js';import {initModels,models} from '../../src/models/index.js';import {FormDocument,FormPreparationJob,FormGuidanceArtifact} from '../../src/models/forms.js';
import {hostOfficialPdf,reviewDisplayRights,viewerDelivery,imagekitHealth} from '../../src/services/forms/imagekit.js';
import {reviewFormFacts,enqueueFormPreparation,runFormAIOnce} from '../../src/services/forms/workflow.js';
import {AIProviderRouter,AIError} from '../../src/services/content/providers.js';
import {testPDF} from '../support/formFixture.js';
const uri=process.env.MONGODB_TEST_URI;
test('official blank storage rights/hash/dedup guards and full provider outage persist safely; synthetic isolated DB only',{skip:!uri},async()=>{
 const u=new URL(uri);assert.match(u.pathname,/^\/mygovguide_phase2_test(?:_[\w-]+)?$/);u.pathname='/mygovguide_phase2_test_form_storage_'+Date.now();await connectDB(u.href);await initModels();
 try{
  const bytes=testPDF('Name:'),sha=createHash('sha256').update(bytes).digest('hex'),formId='STORAGE-TEST',id='STORAGE-DOC';
  await models.FormTemplate.create({_id:formId,id:formId,original:{synthetic:true},title:'SYNTHETIC internally authored blank form',formKind:'PDF_FORM',sourceIds:['TEST'],sourceUrl:'https://example.test/blank.pdf'});
  await FormDocument.create({_id:id,formId,url:'https://example.test/blank.pdf',sha256:sha,edition:'SYNTHETIC TEST',pages:1,retrievedAt:new Date(),expiresAt:new Date(Date.now()+86400000),fields:[{id:'name',label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',instruction:''}]});
  let requests=0;const config={IMAGEKIT_API:'private_TEST_ONLY',IMAGEKIT_UPLOADS_ENABLED:'true',IMAGEKIT_FREE_TIER_CONFIRMED:'true',IMAGEKIT_URL_ENDPOINT:'https://ik.imagekit.io/test-account'};
  const opts={config,loadBytes:async()=>Buffer.from(bytes),transport:async(url,request)=>{requests++;assert.equal(url,'https://upload.imagekit.io/api/v1/files/upload');assert.equal(request.body.get('useUniqueFileName'),'false');return Response.json({fileId:'TEST-FILE',url:'https://ik.imagekit.io/test-account/mygovguide/official-forms/'+sha+'.pdf'});}};
  assert.equal(viewerDelivery(await FormDocument.findById(id).lean()).url,null);await assert.rejects(hostOfficialPdf(formId,id,'TEST',opts),{code:'REHOSTING_RIGHTS_REQUIRED'});assert.equal(requests,0);
  await reviewDisplayRights(formId,{documentId:id,sha256:sha,scope:'IMAGEKIT_REHOST',decision:'APPROVE',evidence:'SYNTHETIC internally authored test document; test-only rights decision.',validUntil:new Date(Date.now()+3600000).toISOString(),personallyReviewed:true},'SYNTHETIC TEST ACTOR');
  await assert.rejects(hostOfficialPdf(formId,id,'TEST',{...opts,config:{...config,IMAGEKIT_FREE_TIER_CONFIRMED:'false'}}),{code:'IMAGEKIT_CONFIGURATION_OR_FREE_ENTITLEMENT_REQUIRED'});
  await assert.rejects(hostOfficialPdf(formId,id,'TEST',{...opts,loadBytes:async()=>Buffer.from('%PDF-mismatch')}),{code:'OFFICIAL_DOCUMENT_HASH_MISMATCH'});assert.equal(requests,0);
  assert.equal((await hostOfficialPdf(formId,id,'TEST',opts)).reused,false);assert.equal((await hostOfficialPdf(formId,id,'TEST',opts)).reused,true);assert.equal(requests,1);
  assert.equal(viewerDelivery(await FormDocument.findById(id).lean()).mode,'RIGHTS_REVIEWED_IMAGEKIT');
  await reviewDisplayRights(formId,{documentId:id,sha256:sha,scope:'IMAGEKIT_REHOST',decision:'REVOKE',evidence:'SYNTHETIC revocation hides delivery without inventing deletion from the external account.',validUntil:new Date(Date.now()+3600000).toISOString(),personallyReviewed:true},'SYNTHETIC TEST ACTOR');assert.equal(viewerDelivery(await FormDocument.findById(id).lean()).url,null);
  assert.equal(imagekitHealth({IMAGEKIT_API:'ambiguous-token'}).ambiguousApiValue,true);
  await reviewFormFacts(formId,{documentId:id,factsChecked:true,rightsChecked:true,currentnessChecked:true,evidence:'SYNTHETIC public facts test, no government approval.',rightsBasis:'Internally authored test-only public blank form.'},'TEST');const [job]=await enqueueFormPreparation(formId,'TEST');
  const states=new Map();let calls=0;const unavailable=async()=>{calls++;throw new AIError('PROVIDER_TEMPORARY',{status:503});};
  const router=new AIProviderRouter({config:{GEMINI_API_KEY_PRIMARY:'TEST-P',GEMINI_API_KEY_SECONDARY:'TEST-S',GEMINI_SECONDARY_AUTHORIZED:'true',GEMINI_MODEL:'TEST',GEMINI_FREE_TIER_CONFIRMED:'true',GROQ_API_KEY_PRIMART:'TEST-G',GROQ_MODEL:'TEST',GROQ_FREE_TIER_CONFIRMED:'true',AI_MAX_RETRIES:0},state:{get:async id=>states.get(id),set:async(id,v)=>states.set(id,v)},adapters:{gemini:unavailable,groq:unavailable}});
  const result=await runFormAIOnce({router,jobId:job._id});assert.equal(result.error,'PROVIDER_TEMPORARY');assert.equal(calls,3);const deferred=await FormPreparationJob.findById(job._id).lean();assert.equal(deferred.state,'DEFERRED');assert.equal(deferred.providerAttempts.length,3);assert.equal(await FormGuidanceArtifact.countDocuments(),0);
 }finally{await disconnectDB();}
});
