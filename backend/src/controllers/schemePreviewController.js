import { z } from 'zod';
import { failure } from '../middleware/citizenSecurity.js';
import { searchContent } from '../services/content/search.js';
export async function schemePreviews(req,res){
  const query=z.object({q:z.string().trim().max(120).optional()}).strict().safeParse(req.query);
  if(!query.success)return failure(res,422,'INVALID_SEARCH','Search text must contain at most 120 characters');
  const profile=req.anonymousSession.profile;
  if(!profile)return failure(res,409,'PROFILE_REQUIRED','Complete your preferences first');
  let result=await searchContent({q:query.data.q||'',language:profile.language,state:profile.state,category:profile.category,limit:4});
  let translationUnavailable=false;
  if(!result.items.length&&profile.language!=='en'){result=await searchContent({q:query.data.q||'',language:'en',state:profile.state,category:profile.category,limit:4});translationUnavailable=Boolean(result.items.length);}
  res.json({items:result.items.map(s=>({...s,translationUnavailable:s.translationUnavailable||translationUnavailable,requestedLanguage:profile.language})),reason:result.items.length?null:'NO_REVIEWED_SCHEMES',matching:{state:profile.state,category:profile.category}});
}
