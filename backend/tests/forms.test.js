import test from 'node:test';
import assert from 'node:assert/strict';
import {extractDocument,privateUploadResult,detectFileType} from '../src/services/forms/extraction.js';
import {validateFormOutput} from '../src/services/forms/contracts.js';
import {testPDF,formOutputFixture} from './support/formFixture.js';
import {app} from '../src/app.js';
test('digital PDFs yield structure without reflecting filled private values or inventing identity',async()=>{
 const extracted=await extractDocument(testPDF(),'application/pdf');assert.equal(extracted.pages,1);assert.equal(extracted.ocr,'NOT_NEEDED');const result=privateUploadResult(extracted);assert.equal(result.status,'UNIDENTIFIED_FORM');assert.ok(result.fields.some(f=>f.label==='Name'));assert.ok(!JSON.stringify(result).includes('TEST PERSON'));assert.ok(!JSON.stringify(result).includes('9999999999'));assert.equal(result.externalProcessing,false);assert.equal(result.rawTextReturned,false);
 const known={_id:'known',formId:'form',sha256:extracted.sha256,edition:'TEST',fields:[],identifiers:[]};assert.equal(privateUploadResult(extracted,[known]).match.method,'EXACT_DOCUMENT_SHA256');known.sha256='different';assert.equal(privateUploadResult(extracted,[known]).match,null);
 const hint=privateUploadResult({...extracted,text:'UJJWALA KYC Application\nVersion 5.0\nName\nMobile\nAadhaar' },[{_id:'official',formId:'FORM-01',sha256:'different',edition:'Version5.0',fields:[{label:'Name'},{label:'Mobile'},{label:'Aadhaar'}]}]);assert.equal(hint.match,null);assert.equal(hint.possibleMatches[0].status,'POSSIBLE_MATCH_NEEDS_VERIFICATION');
 const widgets=privateUploadResult({...extracted,text:'',acroFields:['FirstName','PRIVATE VALUE']});assert.ok(widgets.fields.some(f=>f.label==='First Name'));assert.ok(!JSON.stringify(widgets).includes('PRIVATE VALUE'));
});
test('blank scanned PDF and validated image explicitly report OCR unavailable',async()=>{
 const scanned=await extractDocument(testPDF(''),'application/pdf');assert.equal(privateUploadResult(scanned).status,'OCR_UNAVAILABLE');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nL8AAAAASUVORK5CYII=','base64');
 // Native image decoding also checks the complete file, beyond magic bytes.
 const image=await extractDocument(png,'image/png');assert.equal(image.ocr,'UNAVAILABLE');assert.equal(image.pages,1);
});
test('unsafe, malformed, spoofed, oversized and excessive-page documents fail closed',async()=>{
 assert.throws(()=>detectFileType(Buffer.from('<svg/>'),'image/png'),{code:'FILE_TYPE_MISMATCH'});assert.throws(()=>detectFileType(testPDF(),'image/png'),{code:'FILE_TYPE_MISMATCH'});assert.throws(()=>detectFileType(Buffer.alloc(5*1024*1024+1),'application/pdf'),{code:'FILE_SIZE_LIMIT'});
 await assert.rejects(extractDocument(testPDF('unsafe',{active:true}),'application/pdf'),{code:'UNSAFE_OR_ENCRYPTED_PDF'});await assert.rejects(extractDocument(testPDF('too many',{pages:11}),'application/pdf'),{code:'PAGE_LIMIT_EXCEEDED'});await assert.rejects(extractDocument(Buffer.from('%PDF-1.7 broken'),'application/pdf'),{code:'DOCUMENT_UNREADABLE'});
});
test('EN/HI/KN form contract preserves exact field evidence, uncertainty, dates and amounts',()=>{
 const doc={fields:[{id:'name',label:'Name',page:1,requirement:'UNKNOWN',sourceQuote:'Name',instruction:''}]};
 for(const language of ['en','hi','kn']){const output=formOutputFixture(doc,language);assert.equal(validateFormOutput(output,doc,language).ok,true);const changed=structuredClone(output);changed.fields[0].requirement='REQUIRED';assert.ok(validateFormOutput(changed,doc,language).errors.includes('FIELD_EVIDENCE_CHANGED'));changed.fields[0].explanation+=' INR 500 on 2026-12-01';assert.ok(validateFormOutput(changed,doc,language).errors.includes('UNSUPPORTED_NUMBER_OR_DATE'));const uncertain=structuredClone(output);uncertain.fields[0].needsVerification=false;assert.ok(validateFormOutput(uncertain,doc,language).errors.includes('UNCERTAINTY_REMOVED'));}
});
test('field examples must be exact source examples, never invented personal values',()=>{
 const doc={fields:[{id:'date',label:'Date',page:1,requirement:'UNKNOWN',sourceQuote:'Date (DD/MM/YYYY)',instruction:'Use DD/MM/YYYY'}]};const output=formOutputFixture(doc,'en');output.fields[0].meaning='The date field';output.fields[0].whatToEnter='Use the date format printed on the form';output.fields[0].example='DD/MM/YYYY';output.fields[0].exampleSourceQuote='Use DD/MM/YYYY';assert.equal(validateFormOutput(output,doc,'en').ok,true);output.fields[0].example='Sample citizen';assert.ok(validateFormOutput(output,doc,'en').errors.includes('EXAMPLE_NOT_IN_SOURCE'));
});
test('upload endpoint requires local-only consent, refuses external options and never retains request bytes',async()=>{
 const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const base='http://127.0.0.1:'+server.address().port+'/api/forms';try{
  const post=query=>fetch(base+'/uploads/extract'+query,{method:'POST',headers:{'Content-Type':'application/pdf'},body:testPDF()});
  assert.equal((await post('')).status,403);assert.equal((await post('?consent=local-only&externalProcessing=true')).status,403);
  const response=await post('?consent=local-only');assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store');const result=await response.json();assert.equal(result.retention,'NO_SERVER_STORAGE');assert.equal('uploadId'in result,false);assert.equal(JSON.stringify(result).includes('TEST PERSON'),false);assert.equal((await fetch(base+'/uploads/any-id')).status,404);
  const denied=await fetch(base+'/uploads/extract?consent=local-only',{method:'POST',headers:{'Content-Type':'application/pdf',Origin:'https://untrusted.example'},body:testPDF()});assert.equal(denied.status,403);
 }finally{await new Promise(r=>server.close(r));}
});
