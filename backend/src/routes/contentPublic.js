import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { requireDatabase } from '../middleware/citizenSecurity.js';
import { searchContent,readPublished } from '../services/content/search.js';
const router=Router();router.use(requireDatabase,rateLimit({windowMs:60000,limit:90,standardHeaders:'draft-8',legacyHeaders:false}));
router.get('/search',async(req,res,next)=>{try{res.json(await searchContent(req.query));}catch(e){if(e.name==='ZodError')return res.status(400).json({error:{code:'INVALID_SEARCH',message:'Use a bounded query and en, hi or kn language.'}});next(e);}});
router.get('/schemes/:id',async(req,res,next)=>{try{const result=await readPublished(req.params.id,req.query.language||'en');if(!result)return res.status(404).json({error:{code:'CONTENT_UNAVAILABLE',message:'No current reviewed publication is available.'}});res.json(result);}catch(e){if(e.name==='ZodError')return res.status(400).json({error:{code:'INVALID_LANGUAGE',message:'Use en, hi or kn.'}});next(e);}});
export default router;
