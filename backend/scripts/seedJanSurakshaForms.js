// Curated blank-form operation for the three Jan Suraksha references.
// It reads only already-downloaded public PDFs and never accepts citizen data.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {connectDB,disconnectDB,requireTransactions} from '../src/config/db.js';
import {models} from '../src/models/index.js';
import {initModels} from '../src/models/index.js';
import {FormDocument} from '../src/models/forms.js';
import {extractDocument} from '../src/services/forms/extraction.js';
import {hash} from '../src/utils/hash.js';

const root=fileURLToPath(new URL('../../',import.meta.url));
const directory=path.join(root,'.local/forms-jansuraksha');
const apply=process.argv.includes('--apply');
const now=new Date();
const field=(id,label,page,sourceQuote,requirement='UNKNOWN',instruction='')=>({id,label,page,requirement,instruction,sourceQuote});
const pmjjyFields=[
 field('field-1','Name of the account holder',1,'Name of the account\nholder**'),
 field('field-2','Father’s / husband’s name',1,'Father’s / husband’s\nname**'),
 field('field-3','Bank / Post Office account number',1,'Bank/Post office\nAccount No.**'),
 field('field-4','IFSC code of bank branch',1,'IFSC Code of Bank\nBranch**'),
 field('field-5','PAN number, if available',1,'PAN Number, if\navailable**'),
 field('field-6','Aadhaar number, if available',1,'AADHAAR Number, if\navailable**'),
 field('field-7','Date of birth',1,'Date of birth **'),
 field('field-8','E-mail ID',1,'E-mail Id**'),
 field('field-9','Nominee name and address',1,'Name and address of\nnominee'),
 field('field-10','Nominee date of birth',1,'Date of Birth of nominee'),
 field('field-11','Nominee relationship with account holder',1,'Relationship of nominee\nwith the account holder'),
 field('field-12','Guardian/appointee name and address (if nominee is minor)',1,'Name and address of\nGuardian / appointee\n(if nominee is minor)'),
 field('field-13','Guardian/appointee relationship with nominee',1,'Relationship of the\nguardian / appointee\nwith the nominee'),
 field('field-14','Nominee mobile number',1,'Mobile number of\nnominee'),
 field('field-15','Guardian/appointee mobile number',1,'Mobile number of\nguardian / appointee'),
 field('field-16','Nominee email ID',1,'Email id of nominee'),
 field('field-17','Guardian/appointee email ID',1,'Email id of guardian /\nappointee'),
 field('field-18','Applicant signature',2,'Date: ____ Signature'),
 field('field-19','Applicant address',2,'Address:'),
 field('field-20','Bank/Post Office official signature',2,'Signature of the Bank / Post Office Official')
];
const pmsbyFields=[
 field('field-1','Name of the account holder',1,'Name of the account\nholder**'),
 field('field-2','Father’s / husband’s name',1,'Father’s / husband’s\nname**'),
 field('field-3','Bank / Post Office account number',1,'Bank / Post Office\nAccount No.**'),
 field('field-4','IFSC code of bank branch',1,'IFSC Code of Bank\nBranch**'),
 field('field-5','PAN number, if available',1,'PAN Number, if\navailable**'),
 field('field-6','Aadhaar number, if available',1,'AADHAAR Number, if\navailable**'),
 field('field-7','Date of birth',1,'Date of birth **'),
 field('field-8','E-mail ID',1,'E-mail Id**'),
 field('field-9','Whether suffering from any disability',1,'Whether suffering\nfrom any disability'),
 field('field-10','Disability details, if yes',1,'If yes, details thereof'),
 field('field-11','Nominee name and address',1,'Name and address of\nnominee'),
 field('field-12','Nominee date of birth',1,'Date of Birth of nominee'),
 field('field-13','Nominee relationship with account holder',1,'Relationship of nominee\nwith the account holder'),
 field('field-14','Guardian/appointee name and address (if nominee is minor)',1,'Name and address of\nGuardian / appointee\n(if nominee is minor)'),
 field('field-15','Guardian/appointee relationship with nominee',1,'Relationship of the\nguardian / appointee\nwith the nominee'),
 field('field-16','Nominee mobile number',1,'Mobile number of\nnominee'),
 field('field-17','Guardian/appointee mobile number',1,'Mobile number of\nguardian / appointee'),
 field('field-18','Nominee email ID',1,'Email id of nominee'),
 field('field-19','Guardian/appointee email ID',1,'Email id of guardian /\nappointee'),
 field('field-20','Applicant signature',2,'Date: ____ Signature'),
 field('field-21','Applicant address',2,'Address:'),
 field('field-22','Bank/Post Office official signature',2,'Signature of the Bank / Post Office Official')
];
const apyFields=[
 field('field-1','Bank account number',1,'Bank A/c Number*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-2','Bank name',1,'Bank Name*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-3','Bank branch',1,'Bank Branch*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-4','Full name',1,'Full Name*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-5','Date of birth',1,'Date of Birth*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-6','Age',1,'Age'),
 field('field-7','Mobile number',1,'Mobile No'),
 field('field-8','Email ID',1,'Email ID'),
 field('field-9','Aadhaar number',1,'Aadhaar*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-10','Married',1,'Married'),
 field('field-11','Spouse name',1,'Name of Spouse'),
 field('field-12','Spouse Aadhaar',1,'Name of Spouse \tAadhaar'),
 field('field-13','Nominee name',1,'Nominee’s Name*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-14','Nominee Aadhaar',1,'Nominee’s Name* \tAadhaar'),
 field('field-15','Nominee relationship with subscriber',1,'Nominee’s relationship with the subscriber'),
 field('field-16','Guardian name (if nominee is minor)',1,'Guardian’s Name*','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-17','Beneficiary of other statutory social security schemes',1,'Whether beneficiary of other statutory social security schemes'),
 field('field-18','Income tax payer',1,'Whether Income Tax Payer'),
 field('field-19','FATCA/CRS applicable',1,'Is FATCA/CRS* applicable','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-20','Contribution frequency',1,'Frequency of Contribution (Please tick(√)) *','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-21','Pension amount',1,'Pension Amount (Please tick(√)) *','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-22','Contribution amount (filled by bank)',1,'Contribution Amount\n(in Rs.)'),
 field('field-23','Subscriber signature/thumb impression',1,'Signature/Thumb Impression* of Subscriber','REQUIRED','* Indicates mandatory fields. Please fill the form in English and BLOCK letters'),
 field('field-24','Country of birth',2,'a) \tBirth'),
 field('field-25','Country of citizenship',2,'b) \tCitizenship'),
 field('field-26','Country of residence for tax purposes',2,'c) \tResidence for Tax Purposes'),
 field('field-27','US person',2,'US Person (Yes / No)'),
 field('field-28','TIN',2,'i) \tTIN'),
 field('field-29','Country of issue',2,'Country of Issue')
];
const definitions=[
 {
  formId:'FORM-10',schemeId:'IN-WK-02',file:'PMJJBY_Enrollment_Form.pdf',sha256:'34fc1d0ab4444407600839f5933546c166cec37358860e983f45863135deeb25',
  title:'PMJJBY consent-cum-declaration and auto-debit form',sourceUrl:'https://jansuraksha.gov.in/Files/PMJJBY/PMJJBY_Enrollment_Form.pdf',
  source:{_id:'form-source-jansuraksha-pmjjby',title:'Jan Suraksha — PMJJBY enrollment form',host:'jansuraksha.gov.in',organization:'Department of Financial Services, Government of India',contentCategory:'FORM',sourceType:'OFFICIAL_FORM'},
  edition:'Official consent-cum-declaration form PDF; printed annual premium Rs.330 is outdated (current DFS FAQ says Rs.436).',
  warnings:['CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION','PRINTED_PREMIUM_OUTDATED_RS330_CURRENT_FAQ_RS436','REUSE_BASIS_REQUIRES_HUMAN_REVIEW'],
  identifiers:['PRADHAN MANTRI JEEVAN JYOTI BIMA YOJANA','CONSENT-CUM-DECLARATION FORM','PMJJBY'],
  purpose:'Consent-cum-declaration form used to enrol in PMJJBY through a participating bank or post office, including auto-debit consent and nominee details. The printed premium is outdated; confirm the current premium with the bank or post office.',
  documents:['Aadhaar card, Electoral Photo Identity Card (EPIC), MGNREGA card, Driving License, PAN card or Passport as KYC proof','Nominee details; guardian/appointee details if the nominee is a minor'],
  description:'Official Jan Suraksha blank enrollment form for PMJJBY. The printed premium is outdated; current premium and eligibility must be confirmed with the bank or post office.',
  fields:pmjjyFields
 },
 {
  formId:'FORM-11',schemeId:'IN-WK-03',file:'PMSBY_Enrollment_Form.pdf',sha256:'3ff64f7db179322f9044a1a5684e6372364a7376e015d0a48a99564a6670896d',
  title:'PMSBY consent-cum-declaration and auto-debit form',sourceUrl:'https://jansuraksha.gov.in/Files/PMSBY/PMSBY_Enrollment_Form.pdf',
  source:{_id:'form-source-jansuraksha-pmsby',title:'Jan Suraksha — PMSBY enrollment form',host:'jansuraksha.gov.in',organization:'Department of Financial Services, Government of India',contentCategory:'FORM',sourceType:'OFFICIAL_FORM'},
  edition:'Official consent-cum-declaration form PDF; printed annual premium Rs.12 is outdated (current DFS FAQ says Rs.20).',
  warnings:['CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION','PRINTED_PREMIUM_OUTDATED_RS12_CURRENT_FAQ_RS20','REUSE_BASIS_REQUIRES_HUMAN_REVIEW'],
  identifiers:['PRADHAN MANTRI SURAKSHA BIMA YOJANA','CONSENT-CUM-DECLARATION FORM','PMSBY'],
  purpose:'Consent-cum-declaration form used to enrol in PMSBY through a participating bank or post office, including auto-debit consent, disability details and nominee details. The printed premium is outdated; confirm the current premium with the bank or post office.',
  documents:['Aadhaar card, Electoral Photo Identity Card (EPIC), MGNREGA card, Driving License, PAN card or Passport as KYC proof','Nominee details; guardian/appointee details if the nominee is a minor'],
  description:'Official Jan Suraksha blank enrollment form for PMSBY. The printed premium is outdated; current premium and eligibility must be confirmed with the bank or post office.',
  fields:pmsbyFields
 },
 {
  formId:'FORM-19',schemeId:'IN-WK-04',file:'APY_Subscriber_Registration_Form_English.pdf',sha256:'7673d3db86008658f8d23ebda80a7709d3f62d0f32c84eb452ecb92cd1df51d7',
  title:'APY subscriber registration form',sourceUrl:'https://pfrda.org.in/documents/33652/252002/APY+Subscriber+Registration+Form+-+English.pdf',
  source:{_id:'form-source-pfrda-apy',title:'PFRDA — APY subscriber registration form',host:'pfrda.org.in',organization:'Pension Fund Regulatory and Development Authority',contentCategory:'FORM',sourceType:'OFFICIAL_FORM'},
  edition:'PFRDA subscriber registration form PDF; currentness and current eligibility restrictions are not independently certified.',
  warnings:['CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION','REUSE_BASIS_REQUIRES_HUMAN_REVIEW','SCHEME_RESEARCH_ONLY_NOT_PUBLISHED'],
  identifiers:['ATAL PENSION YOJANA (APY)','SUBSCRIBER REGISTRATION FORM'],
  purpose:'PFRDA subscriber registration form for APY, including bank details, nominee details and FATCA/CRS declaration. APY remains research-only in this demo; confirm current eligibility and the current form with the bank or post office.',
  documents:['Aadhaar','Bank account details','Nominee details','FATCA/CRS declaration where applicable'],
  description:'Official PFRDA blank APY subscriber registration form. APY is not published in this demo; current eligibility and the current form must be confirmed with the bank or post office.',
  fields:apyFields
 }
];
await connectDB();
try{
 if(apply){await requireTransactions();await initModels();}
 const audit=[];
 for(const def of definitions){
  const bytes=await fs.readFile(path.join(directory,def.file));
  let extracted;try{extracted=await extractDocument(bytes,'application/pdf');}finally{bytes.fill(0);}
  if(extracted.sha256!==def.sha256)throw new Error(def.formId+': DOCUMENT_HASH_MISMATCH');
  for(const f of def.fields)if(!extracted.text.includes(f.sourceQuote))throw new Error(def.formId+': FIELD_QUOTE_NOT_IN_DOCUMENT: '+f.label);
  const documentId=def.formId+'-'+extracted.sha256.slice(0,20);
  const document={
   _id:documentId,formId:def.formId,url:def.sourceUrl,sha256:extracted.sha256,
   textHash:createHash('sha256').update(extracted.text).digest('hex'),edition:def.edition,
   identifiers:def.identifiers,pages:extracted.pages,retrievedAt:now,expiresAt:new Date(now.getTime()+14*86400000),
   httpStatus:200,fields:def.fields,warnings:def.warnings,purpose:def.purpose,documents:def.documents,status:'DOCUMENT_CHECKED'
  };
  const templatePayload={
   title:def.title,sourceUrl:def.sourceUrl,formKind:'PDF_FORM',linkedSchemeIds:[def.schemeId],
   observedFields:def.fields.map(f=>f.label),officialLinks:[def.sourceUrl],requiredDocuments:def.documents,
   description:def.description,provenance:{method:'OWNER_REQUESTED_MANUAL_DOCUMENT_INSPECTION',liveCollection:false,httpStatus:200,sha256:extracted.sha256}
  };
  if(!apply){audit.push({formId:def.formId,sha256:extracted.sha256,pages:extracted.pages,fields:def.fields.length,outcome:'VALIDATED_NOT_STORED'});continue;}
  const session=await models.FormTemplate.db.startSession();
  try{await session.withTransaction(async()=>{
   await models.Source.updateOne({_id:def.source._id},{$setOnInsert:{
    _id:def.source._id,id:def.source._id,...def.source,url:def.sourceUrl,collectionMethod:'offline',
    authorizationStatus:'NOT_AUTHORIZED_FOR_AUTOMATION',status:'RESEARCH_ONLY',publicationStatus:'INTERNAL',
    original:{synthetic:false,url:def.sourceUrl,retrievedAt:now,method:'OWNER_REQUESTED_MANUAL_DOCUMENT_INSPECTION',liveCollection:false,notes:'Downloaded and inspected manually; link rather than mirror.'},
    normalized:{},contentHash:hash({url:def.sourceUrl,title:def.source.title}),revision:1,lastCheckedAt:now,cacheStale:true
   }},{upsert:true,session});
   const existing=await models.FormTemplate.findById(def.formId).session(session).lean();
   const sourceIds=[def.source._id,...(existing?.sourceIds||[]).filter(id=>id!==def.source._id)];
   const versionHash=hash(templatePayload);
   const templateVersionId='form-template-version-'+def.formId+'-'+versionHash.slice(0,16);
   const versionExists=await models.SourceVersion.exists({_id:templateVersionId}).session(session);
   if(!versionExists){
    const revision=await models.SourceVersion.countDocuments({entityType:'FormTemplate',entityId:def.formId}).session(session)+1;
    await models.SourceVersion.create([{_id:templateVersionId,id:templateVersionId,sourceId:def.source._id,sourceIds,entityType:'FormTemplate',entityId:def.formId,contentHash:versionHash,payload:templatePayload,original:templatePayload,normalized:{},revision,previousVersionId:existing?.currentVersionId||null,retrievedAt:now}],{session});
   }
   const revision=versionExists?existing?.revision||1:(existing?.revision||0)+1;
   await models.FormTemplate.updateOne({_id:def.formId},{$set:{
    id:def.formId,title:def.title,sourceUrl:def.sourceUrl,sourceIds,formKind:'PDF_FORM',schemeId:def.schemeId,
    linkedSchemeIds:[def.schemeId],observedFields:templatePayload.observedFields,officialLinks:templatePayload.officialLinks,
    requiredDocuments:templatePayload.requiredDocuments,status:'RESEARCH_ONLY',publicationStatus:'INTERNAL',
    currentVersionId:templateVersionId,contentHash:versionHash,revision,lastCheckedAt:now,cacheStale:true,
    original:templatePayload,normalized:{title:def.title,sourceUrl:def.sourceUrl,description:def.description},
    reviewNotes:def.warnings
   }},{upsert:true,session});
   let outcome='UNCHANGED';
   if(!await FormDocument.exists({_id:documentId}).session(session)){
    const previous=await FormDocument.findOne({formId:def.formId}).sort({retrievedAt:-1}).session(session).lean();
    const revision=await models.SourceVersion.countDocuments({entityType:'FormDocument',entityId:def.formId}).session(session)+1;
    const documentPayload={...templatePayload,fields:def.fields,sha256:def.sha256,sourceUrl:def.sourceUrl,textHash:document.textHash,edition:def.edition,warnings:def.warnings,purpose:def.purpose,documents:def.documents,provenance:{method:'OWNER_REQUESTED_MANUAL_DOCUMENT_INSPECTION',liveCollection:false,httpStatus:200,sha256:def.sha256}};
    const documentVersionId='form-document-version-'+documentId;
    await models.SourceVersion.create([{_id:documentVersionId,id:documentVersionId,sourceId:def.source._id,sourceIds,entityType:'FormDocument',entityId:def.formId,contentHash:hash(documentPayload),payload:documentPayload,original:documentPayload,normalized:{},revision,retrievedAt:now}],{session});
    await FormDocument.create([{...document,sourceVersionId:documentVersionId,previousDocumentId:previous?._id}],{session});
    outcome=previous?'UPDATED':'NEW';
   }
   audit.push({formId:def.formId,sha256:def.sha256,pages:extracted.pages,fields:def.fields.length,outcome,warnings:def.warnings});
  });}finally{await session.endSession();}
 }
 const receipt={at:now,apply,audit,publications:0,modelRequests:0};
 await fs.writeFile(path.join(directory,'seed-receipt.json'),JSON.stringify(receipt,null,2));
 console.log(JSON.stringify(receipt,null,2));
}finally{await disconnectDB();}
