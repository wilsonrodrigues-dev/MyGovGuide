// Explicit curated-document operation, not an authorized live scraper. Takes
// already downloaded blank government PDFs only, never citizen upload paths.
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {connectDB,disconnectDB,requireTransactions} from '../src/config/db.js';
import {models} from '../src/models/index.js';
import {initFormModels,FormDocument} from '../src/models/forms.js';
import {extractDocument} from '../src/services/forms/extraction.js';
import {hash} from '../src/utils/hash.js';
const root=fileURLToPath(new URL('../../',import.meta.url));
const packet=JSON.parse(await fs.readFile(new URL('../review-packets/forms-document-fields.json',import.meta.url),'utf8'));
const directory=path.join(root,'.local/forms-milestone');
const receipts=JSON.parse(await fs.readFile(path.join(directory,'download-receipts.json'),'utf8'));
const commit=process.argv.includes('--store');
await connectDB();
try{
 if(commit){await requireTransactions();await initFormModels();}
 const audit=[];
 for(const candidate of packet.documents){
  const form=await models.FormTemplate.findById(candidate.formId).lean();if(!form)throw Error('FORM_REFERENCE_MISSING');
  const bytes=await fs.readFile(path.join(directory,candidate.formId+'.pdf'));
  let extracted;try{extracted=await extractDocument(bytes,'application/pdf');}finally{bytes.fill(0);}
  const receipt=receipts.find(r=>r.formId===form.id&&r.url===form.sourceUrl&&r.sha256===extracted.sha256&&r.httpStatus===200&&r.method==='GET');
  if(!receipt)throw Error('MATCHING_MANUAL_DOWNLOAD_RECEIPT_REQUIRED');
  const fields=candidate.fields.map(([label,page],index)=>{
   if(!extracted.text.includes(label))throw Error(candidate.formId+': FIELD_QUOTE_NOT_IN_DOCUMENT: '+label);
   if(candidate.instruction&&!extracted.text.includes(candidate.instruction))throw Error('INSTRUCTION_NOT_IN_DOCUMENT');
   return{id:'field-'+(index+1),label,page,requirement:'UNKNOWN',instruction:candidate.instruction||'',sourceQuote:label};
  });
  const id=candidate.formId+'-'+extracted.sha256.slice(0,20),retrievedAt=new Date(receipt.fetchedAt);
  const doc={_id:id,formId:form.id,url:form.sourceUrl,sha256:extracted.sha256,textHash:createHash('sha256').update(extracted.text).digest('hex'),edition:candidate.edition,pages:extracted.pages,retrievedAt,expiresAt:new Date(Date.now()+14*86400000),httpStatus:200,fields,warnings:candidate.warnings,purpose:candidate.purpose,applicationUrl:form.id==='FORM-02'?undefined:'https://pmuy.gov.in/ujjwala2.html',documents:candidate.documents,status:'DOCUMENT_CHECKED'};
  let outcome='CHECKED_NOT_STORED';
  if(commit){const session=await models.FormTemplate.db.startSession();try{await session.withTransaction(async()=>{
   if(await FormDocument.exists({_id:id}).session(session)){outcome='UNCHANGED';return;}
   const previous=await FormDocument.findOne({formId:form.id}).sort({retrievedAt:-1}).session(session).lean();
   const revision=await models.SourceVersion.countDocuments({entityType:'FormDocument',entityId:form.id}).session(session)+1;
   const payload={...candidate,fields,sha256:doc.sha256,sourceUrl:doc.url,textHash:doc.textHash,provenance:{method:'OWNER_REQUESTED_MANUAL_DOCUMENT_INSPECTION',liveCollection:false,httpStatus:200}};
   const versionId='form-document-version-'+id;
   await models.SourceVersion.create([{_id:versionId,id:versionId,sourceId:form.sourceIds[0],sourceIds:form.sourceIds,entityType:'FormDocument',entityId:form.id,contentHash:hash(payload),payload,original:payload,normalized:{},revision,retrievedAt}],{session});
   await FormDocument.create([{...doc,sourceVersionId:versionId,previousDocumentId:previous?._id}],{session});outcome=previous?'UPDATED':'NEW';
  });}finally{await session.endSession();}}
  audit.push({formId:form.id,url:doc.url,httpStatus:200,sha256:doc.sha256,pages:doc.pages,fields:fields.length,ocr:extracted.ocr,outcome,warnings:doc.warnings});
 }
 await fs.writeFile(path.join(directory,'staging-receipt.json'),JSON.stringify({at:new Date(),commit,audit,publications:0,modelRequests:0},null,2));console.log(JSON.stringify(audit));
}finally{await disconnectDB();}
