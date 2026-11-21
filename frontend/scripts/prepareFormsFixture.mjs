// Isolated browser fixture only. Never used by startup or Atlas operations.
import {createHash} from 'node:crypto';
import {models} from '../../backend/src/models/index.js';
import {FormDocument} from '../../backend/src/models/forms.js';
import {reviewFormFacts,enqueueFormPreparation,runFormAIOnce,publishFormGuidance} from '../../backend/src/services/forms/workflow.js';
import {testPDF,formOutputFixture} from '../../backend/tests/support/formFixture.js';
export async function prepareFormsFixture(){
 const formId='SYNTHETIC-FORM-FIXTURE',documentId='SYNTHETIC-FORM-DOCUMENT';
 await models.FormTemplate.create({_id:formId,id:formId,title:'SYNTHETIC TEST ONLY blank form',sourceIds:['synthetic-form-source'],sourceUrl:'https://example.test/blank.pdf',formKind:'PDF_FORM',original:{synthetic:true},linkedSchemeIds:[]});
 await FormDocument.create({_id:documentId,formId,url:'https://example.test/blank.pdf',sha256:createHash('sha256').update(testPDF()).digest('hex'),edition:'TEST ONLY synthetic edition',pages:1,retrievedAt:new Date(),expiresAt:new Date(Date.now()+86400000),warnings:['SYNTHETIC_TEST_NOT_GOVERNMENT_CONTENT'],purpose:'SYNTHETIC TEST ONLY guidance; no government approval or real AI generation.',applicationUrl:'https://example.test/apply',fields:[{id:'name',label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',instruction:''},{id:'mobile',label:'Mobile',page:1,requirement:'UNKNOWN',sourceQuote:'Mobile',instruction:''}]});
 await reviewFormFacts(formId,{documentId,factsChecked:true,rightsChecked:true,currentnessChecked:true,evidence:'SYNTHETIC TEST ONLY simulated source-fact review.',rightsBasis:'Internally authored synthetic test document; no government rights approval.'},'TEST_ONLY_FIXTURE');
 const jobs=await enqueueFormPreparation(formId,'TEST_ONLY_FIXTURE');const artifacts=[];
 for(const job of jobs)artifacts.push(await runFormAIOnce({jobId:job._id,router:{generate:async(document,language)=>({output:formOutputFixture(document,language),provider:'MOCK_OFFLINE',model:'NO_NETWORK_TEST',usage:{}})}}));
 await publishFormGuidance(formId,{documentId,artifactIds:artifacts.map(a=>a._id),decision:'APPROVE_AND_PUBLISH',evidence:'SYNTHETIC TEST ONLY simulated editorial publication, isolated database.'},'TEST_ONLY_FIXTURE');
}
