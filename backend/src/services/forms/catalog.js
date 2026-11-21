import {viewerDelivery} from './imagekit.js';
import {models} from '../../models/index.js';
import {FormDocument,FormGuidanceArtifact} from '../../models/forms.js';
import {validateFormOutput} from './contracts.js';
import {bindingMatches,validateDraft,draftEligible} from './drafts.js';
import {formError} from './extraction.js';
import {getCurrentDocument} from './workflow.js';
import {machineFormDocument,machineFormArtifact} from '../verification/automatedPolicy.js';
const safeUrl=value=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password?u.href:null;}catch{return null;}};
const validArtifact=(a,doc)=>!!(a.validation?.ok&&(a.binding?bindingMatches(a.binding,doc)&&validateDraft(a.output,doc,a.language).ok:validateFormOutput(a.output,doc,a.language).ok));
function preparationState(doc,artifacts){
 const languages=Object.fromEntries(['en','hi','kn'].map(language=>[language,artifacts.some(a=>a.language===language&&a.status!=='REJECTED'&&validArtifact(a,doc))]));
 return {documentIdentified:!!doc?.sha256,sourceVerified:!!doc&&draftEligible(doc),fieldsExtracted:!!doc?.fields.length,aiGuidancePrepared:Object.values(languages).every(Boolean),automatedValidationPassed:Object.values(languages).every(Boolean),languages,citizenReady:false,blockers:doc?.preparation?.blockers||[]};
}
export async function formCatalog({schemeId}={}){
 const forms=await models.FormTemplate.find(schemeId?{linkedSchemeIds:schemeId}:{}).sort({title:1}).limit(200).lean();
 const docs=await FormDocument.find({formId:{$in:forms.map(f=>f.id)}}).sort({retrievedAt:-1,_id:-1}).lean();
 const latestDocs=[...new Map(forms.map(f=>[f.id,docs.find(d=>d.formId===f.id)])).values()].filter(Boolean);
 const artifacts=await FormGuidanceArtifact.find({documentId:{$in:latestDocs.map(d=>d._id)}}).lean();
 const items=forms.map(form=>{const doc=docs.find(d=>d.formId===form.id),usable=doc&&doc.status!=='REJECTED'&&doc.expiresAt>new Date()&&!doc.warnings.includes('OCR_UNAVAILABLE');return{id:form.id,title:form.title,kind:form.formKind,schemeIds:form.linkedSchemeIds,sourceUrl:safeUrl(form.sourceUrl),documentUrl:doc?safeUrl(doc.url):null,documentId:doc?._id,edition:doc?.edition,checkedAt:doc?.retrievedAt,expiresAt:doc?.expiresAt,fieldCount:doc?.fields.length||0,status:usable?'DOCUMENT_CHECKED':doc?'DOCUMENT_NEEDS_REVIEW':'REFERENCE_ONLY',warnings:doc?.warnings||[],audience:form.id==='FORM-18'?'DISTRIBUTOR_OR_MECHANIC':'CITIZEN',guidanceStatus:doc?.status==='FACTS_APPROVED'?'EDITORIAL_REVIEW_PENDING':'FACT_REVIEW_PENDING'};});
 for(const item of items){const doc=latestDocs.find(d=>d.formId===item.id),own=artifacts.filter(a=>a.documentId===doc?._id);item.preparation=preparationState(doc,own);item.languageStatus=Object.fromEntries(['en','hi','kn'].map(lang=>{const a=own.find(a=>a.language===lang&&validArtifact(a,doc));return[lang,a?.status==='APPROVED'&&!a.review?.at?'REVIEW_PENDING':a?.status||'NOT_PREPARED'];}));if(item.preparation.aiGuidancePrepared)item.guidanceStatus='VALIDATED_DRAFT_REVIEW_PENDING';if(item.status==='DOCUMENT_CHECKED'&&(doc?.status==='FACTS_APPROVED'&&doc.factReview?.at&&Object.values(item.languageStatus).every(s=>s==='APPROVED')||machineFormDocument(doc)&&['en','hi','kn'].every(l=>own.some(a=>a.language===l&&machineFormArtifact(a)&&validArtifact(a,doc))))){item.guidanceStatus='PUBLISHED';item.preparation.citizenReady=true;}}
 return{items,total:items.length,documentChecked:items.filter(f=>f.status==='DOCUMENT_CHECKED').length,frequentlyUsed:[],usageMeasured:false};
}
export async function formDetail(id,language='en'){
 const form=await models.FormTemplate.findById(id).lean();if(!form)throw formError('FORM_NOT_FOUND',404);
 const doc=await getCurrentDocument(id),usable=doc&&doc.status!=='REJECTED'&&doc.expiresAt>new Date()&&!doc.warnings.includes('OCR_UNAVAILABLE');
 const artifacts=usable?await FormGuidanceArtifact.find({formId:id,documentId:doc._id}).lean():[];
 const valid=artifacts.filter(a=>validArtifact(a,doc)&&(doc?.status==='FACTS_APPROVED'&&doc.factReview?.at&&a.status==='APPROVED'&&a.review?.at||machineFormDocument(doc)&&machineFormArtifact(a)));
 // Publication requires all three reviewed current-language versions. Never
 // fall back to an older document or expose unapproved derivatives.
 const published=new Set(valid.map(a=>a.language)).size===3;
 const artifact=published?valid.find(a=>a.language===language):null;
 const preparation=preparationState(doc,artifacts);preparation.citizenReady=published;
 const schemes=await models.Scheme.find({_id:{$in:form.linkedSchemeIds||[]},publicationStatus:'PUBLISHED'}).select('_id title').lean();
 return{preparation,viewer:viewerDelivery(doc),form:{id:form.id,title:form.title,kind:form.formKind},source:{documentId:doc?._id,url:safeUrl(form.sourceUrl),documentUrl:doc?safeUrl(doc.url):null,checkedAt:doc?.retrievedAt,expiresAt:doc?.expiresAt,sha256:doc?.sha256,edition:doc?.edition,pages:doc?.pages,status:usable?'DOCUMENT_CHECKED':doc?'DOCUMENT_NEEDS_REVIEW':'REFERENCE_ONLY'},applicationUrl:doc?safeUrl(doc.applicationUrl):null,purpose:doc?.purpose||null,documents:doc?.documents||[],schemes:schemes.map(s=>({id:s._id,title:s.title})),fields:usable?doc.fields.map(f=>({id:f.id,label:f.label,page:f.page,role:f.role,requirement:f.requirement,condition:f.condition,instruction:f.instruction,sourceQuote:f.sourceQuote,coordinates:f.coordinates,status:'EXTRACTED_NEEDS_REVIEW'})):[],guidance:artifact?.output||null,verification:artifact?(machineFormArtifact(artifact)?'AUTOMATED_SOURCE_VALIDATION':'HUMAN_REVIEWED'):null,language,translationUnavailable:!artifact,guidanceStatus:published?'PUBLISHED':preparation.aiGuidancePrepared?'VALIDATED_DRAFT_REVIEW_PENDING':doc?.status==='FACTS_APPROVED'?'EDITORIAL_REVIEW_PENDING':'FACT_REVIEW_PENDING',warnings:doc?.warnings||[]};
}
