import test from 'node:test';
import assert from 'node:assert/strict';
import {draftEligible,draftBinding,bindingMatches,inventoryHash,expandDraft,validateDraft,draftValidationFeedback,evidenceBundleMatches} from '../src/services/forms/drafts.js';
const document=()=>({sha256:'a'.repeat(64),sourceVersionId:'TEST-SOURCE-VERSION',httpStatus:200,pages:1,title:'TEST blank form',status:'DOCUMENT_CHECKED',expiresAt:new Date(Date.now()+86400000),warnings:[],fields:[{id:'aadhaar-alternative',label:'I do not have Aadhaar',page:1,requirement:'CONDITIONAL',condition:'If applicant has no Aadhaar',sourceQuote:'I do not have Aadhaar',role:'APPLICANT',evidenceRefs:[{url:'https://example.test/blank.pdf',page:1}]}]});
test('draft preparation binds the exact inventory without fabricating human review',()=>{
 const doc=document();assert.equal(draftEligible(doc),false);doc.preparation={mode:'SOURCE_GROUNDED_DRAFT',sourceVerified:true,...draftBinding(doc),evidence:[{type:'TEST_ONLY'}]};assert.equal(draftEligible(doc),true);assert.equal(doc.factReview,undefined);const binding=draftBinding(doc);doc.fields[0].condition='Changed official condition';assert.equal(bindingMatches(binding,doc),false);assert.equal(draftEligible(doc),false);
});
test('draft validation preserves page, conditional Aadhaar alternative, source references and native languages',()=>{
 for(const [language,meaning] of [['en','This is the alternative for someone without Aadhaar.'],['hi','यह आधार न होने का विकल्प है।'],['kn','ಇದು ಆಧಾರ್ ಇಲ್ಲದವರ ಆಯ್ಕೆ.']]){const doc=document(),out=expandDraft({fields:[{id:'aadhaar-alternative',meaning,whatToEnter:meaning,needsVerification:false}]},doc,language);assert.equal(validateDraft(out,doc,language).ok,true);out.fields[0].page=2;assert.equal(validateDraft(out,doc,language).ok,false);out.fields[0].page=1;out.fields[0].originalCondition='Mandatory Aadhaar';assert.equal(validateDraft(out,doc,language).ok,false);}
});
test('missing, duplicate, reordered fields and unsupported amounts fail closed',()=>{
 const doc=document();assert.throws(()=>expandDraft({fields:[]},doc,'en'));assert.throws(()=>expandDraft({fields:[{id:'wrong',meaning:'A test meaning',whatToEnter:'A test instruction',needsVerification:true}]},doc,'en'));
 const out=expandDraft({fields:[{id:doc.fields[0].id,meaning:'Pay INR 500 now.',whatToEnter:'A test instruction',needsVerification:true}]},doc,'en');assert.ok(validateDraft(out,doc,'en').errors.includes('UNSUPPORTED_NUMBER_OR_DATE'));
});
test('expired and OCR-unavailable evidence cannot enter draft generation',()=>{
 const doc=document();doc.preparation={mode:'SOURCE_GROUNDED_DRAFT',sourceVerified:true,...draftBinding(doc),evidence:[{}]};doc.expiresAt=new Date(0);assert.equal(draftEligible(doc),false);doc.expiresAt=new Date(Date.now()+86400000);doc.warnings=['OCR_UNAVAILABLE'];assert.equal(draftEligible(doc),false);assert.equal(inventoryHash(doc).length,64);
});
test('unsupported identifier lengths produce repair feedback, never an automatic source amendment',()=>{
 const doc=document(),out={fields:[{id:doc.fields[0].id,meaning:'An identifier',whatToEnter:'Enter the 12 digit number'}]};assert.deepEqual(draftValidationFeedback(out,doc)[0].unsupportedNumericAttributes,['12']);assert.equal(doc.fields[0].instruction,undefined);
});
test('an archived evidence bundle must include the exact primary page quote and inventory',()=>{
 const doc=document();doc._id='TEST-DOC';doc.url='https://example.test/blank.pdf';doc.fields[0].evidenceRefs=[{url:doc.url,documentHash:doc.sha256,page:1,quote:doc.fields[0].sourceQuote}];const version={_id:doc.sourceVersionId,payload:{documentId:doc._id,sha256:doc.sha256,fields:structuredClone(doc.fields),originalPageTexts:[{page:1,text:'I do not have Aadhaar'}]}};assert.equal(evidenceBundleMatches(doc,version),true);version.payload.originalPageTexts[0].text='Different source';assert.equal(evidenceBundleMatches(doc,version),false);
});
