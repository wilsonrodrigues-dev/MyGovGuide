import express from 'express';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import {z} from 'zod';
import {requireDatabase,requireTrustedMutation} from '../middleware/citizenSecurity.js';
import {FormDocument} from '../models/forms.js';
import {extractDocument,privateUploadResult,MAX_UPLOAD_BYTES,formError} from '../services/forms/extraction.js';
import {formCatalog,formDetail} from '../services/forms/catalog.js';
const router=express.Router(),run=fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next);
router.use((_req,res,next)=>{res.set({'Cache-Control':'no-store','Referrer-Policy':'no-referrer'});next();});
router.post('/uploads/extract',requireTrustedMutation,rateLimit({windowMs:60000,limit:12,standardHeaders:'draft-8',legacyHeaders:false,message:{error:{code:'UPLOAD_RATE_LIMIT',message:'Please wait before uploading another document.'}}}),express.raw({type:()=>true,limit:MAX_UPLOAD_BYTES}),run(async(req,res)=>{
 const bytes=req.body;
 try{
  // This endpoint never accepts an external-processing option, calls a model,
  // stores uploads, records filenames, or returns extracted personal values.
  if(Object.keys(req.query).some(key=>key!=='consent'))throw formError('EXTERNAL_PROCESSING_NOT_PERMITTED',403);
  if(req.query.consent!=='local-only')throw formError('LOCAL_PROCESSING_CONSENT_REQUIRED',403);
  const extraction=await extractDocument(bytes,req.headers['content-type']?.split(';')[0]);
  bytes.fill(0);req.body=undefined;
  const docs=mongoose.connection.readyState===1?await FormDocument.find().sort({retrievedAt:-1,_id:-1}).limit(200).select('_id formId sha256 edition identifiers fields expiresAt status').lean():[];
  const latest=new Map();for(const doc of docs)if(!latest.has(doc.formId))latest.set(doc.formId,doc);
  const known=[...latest.values()].filter(doc=>doc.expiresAt>new Date()&&doc.status!=='REJECTED');
  res.json(privateUploadResult(extraction,known));
  extraction.text='';extraction.acroFields=[];
 }finally{if(Buffer.isBuffer(bytes))bytes.fill(0);req.body=undefined;}
}));
router.get('/',requireDatabase,run(async(req,res)=>{const query=z.object({schemeId:z.string().max(100).optional()}).strict().parse(req.query);res.json(await formCatalog(query));}));
router.get('/:id',requireDatabase,run(async(req,res)=>{const {language}=z.object({language:z.enum(['en','hi','kn']).default('en')}).strict().parse(req.query);res.json(await formDetail(z.string().max(100).parse(req.params.id),language));}));
router.use((error,_req,res,_next)=>{const status=error.type==='entity.too.large'?413:error.name==='ZodError'?400:error.safe?error.status||400:500;res.status(status).json({error:{code:error.type==='entity.too.large'?'FILE_SIZE_LIMIT':error.name==='ZodError'?'INVALID_FORM_REQUEST':error.safe?error.code:'FORM_SERVICE_UNAVAILABLE',message:status===413?'Maximum file size is 5 MB.':error.safe?error.code:'Form request could not be completed.'}});});
export default router;
