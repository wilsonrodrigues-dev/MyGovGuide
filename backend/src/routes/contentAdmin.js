import { Router } from 'express';
import { z } from 'zod';
import { models } from '../models/index.js';
import { ContentApproval,AIJob,AIArtifact,ContentPublication } from '../models/content.js';
import { approveFacts,enqueueAI,retryAI,reviewArtifact,publishContent,contentMetrics } from '../services/content/workflow.js';
import { providerHealth } from '../services/content/providers.js';
import { searchContent } from '../services/content/search.js';
import {consolidatedEditorialReview,decideConsolidatedReview} from '../services/content/editorialReview.js';
const router=Router(),run=fn=>(req,res,next)=>Promise.resolve(fn(req,res)).catch(next);
const paging=req=>z.object({page:z.coerce.number().int().min(1).max(10000).default(1),limit:z.coerce.number().int().min(1).max(100).default(20)}).parse(req.query);
router.get('/metrics',run(async(_req,res)=>res.json(await contentMetrics())));
router.get('/providers',run(async(_req,res)=>res.json(await providerHealth())));
router.get('/editorial-review',run(async(req,res)=>res.json(await consolidatedEditorialReview(req.query))));
router.post('/editorial-review/decisions',run(async(req,res)=>{const result=await decideConsolidatedReview(req.body,req.admin.username);res.status(result.complete?200:409).json(result);}));
router.post('/preparation-batches',run(async(req,res)=>{
 const value=z.object({schemeIds:z.array(z.string().min(1).max(180)).min(1).max(5),languages:z.array(z.enum(['en','hi','kn'])).min(1).max(3)}).strict().parse(req.body);
 const items=[];for(const id of [...new Set(value.schemeIds)]){try{items.push({schemeId:id,status:'QUEUED_OR_EXISTING',jobs:await enqueueAI(id,value.languages,req.admin.username)});}catch(error){items.push({schemeId:id,status:'BLOCKED',reason:error.safe?error.message:'Preparation could not be queued; inspect current review and provider configuration.'});}}
 res.status(items.some(i=>i.status==='QUEUED_OR_EXISTING')?202:409).json({items,publicationActions:0});
}));
router.get('/schemes',run(async(req,res)=>{
  const {page,limit}=paging(req),filter={};if(req.query.status)filter.status=z.enum(['RESEARCH_ONLY','SOURCE_VERIFIED_FACT','REVIEW_REQUIRED']).parse(req.query.status);
  const [items,total]=await Promise.all([models.Scheme.find(filter).sort({title:1}).skip((page-1)*limit).limit(limit).lean(),models.Scheme.countDocuments(filter)]);res.json({items,total,page,limit});
}));
router.get('/schemes/:id',run(async(req,res)=>{
  const scheme=await models.Scheme.findById(req.params.id).lean();if(!scheme)return res.status(404).json({error:{code:'NOT_FOUND',message:'Scheme not found'}});
  const [versions,approvals,artifacts,jobs,publications]=await Promise.all([models.SourceVersion.find({entityType:'Scheme',entityId:scheme.id}).sort({revision:-1}).lean(),ContentApproval.find({schemeId:scheme.id}).sort({createdAt:-1}).lean(),AIArtifact.find({schemeId:scheme.id}).sort({createdAt:-1}).lean(),AIJob.find({schemeId:scheme.id}).sort({createdAt:-1}).lean(),ContentPublication.find({schemeId:scheme.id}).sort({createdAt:-1}).lean()]);res.json({scheme,versions,approvals,artifacts,jobs,publications});
}));
router.post('/schemes/:id/fact-review',run(async(req,res)=>res.json(await approveFacts(req.params.id,req.body,req.admin.username))));
router.post('/schemes/:id/prepare',run(async(req,res)=>{const {languages}=z.object({languages:z.array(z.enum(['en','hi','kn'])).min(1).max(3)}).strict().parse(req.body);res.status(202).json({items:await enqueueAI(req.params.id,languages,req.admin.username)});}));
router.post('/schemes/:id/publication',run(async(req,res)=>{const value=z.object({artifactIds:z.array(z.string()).max(3),evidence:z.string().max(3000).optional(),withdraw:z.boolean().default(false)}).strict().parse(req.body);res.json(await publishContent(req.params.id,value.artifactIds,value.evidence,req.admin.username,{withdraw:value.withdraw}));}));
router.get('/jobs',run(async(req,res)=>{const {page,limit}=paging(req),filter={};if(req.query.state)filter.state=z.enum(['QUEUED','RUNNING','REVIEW_PENDING','FAILED','BLOCKED','DEFERRED','STALE']).parse(req.query.state);const [items,total]=await Promise.all([AIJob.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),AIJob.countDocuments(filter)]);res.json({items,total,page,limit});}));
router.post('/jobs/:id/retry',run(async(req,res)=>res.json(await retryAI(req.params.id,req.admin.username))));
router.get('/artifacts',run(async(req,res)=>{const {page,limit}=paging(req),filter={};if(req.query.schemeId)filter.schemeId=z.string().max(180).parse(req.query.schemeId);if(req.query.state)filter.state=z.enum(['REVIEW_PENDING','APPROVED','REJECTED','VALIDATION_FAILED']).parse(req.query.state);const [items,total]=await Promise.all([AIArtifact.find(filter).sort({createdAt:-1}).skip((page-1)*limit).limit(limit).lean(),AIArtifact.countDocuments(filter)]);res.json({items,total,page,limit});}));
router.post('/artifacts/:id/review',run(async(req,res)=>res.json(await reviewArtifact(req.params.id,req.body,req.admin.username))));
router.get('/search-preview',run(async(req,res)=>res.json(await searchContent(req.query,{syntheticPreview:true}))));
export default router;
