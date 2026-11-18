import { GoogleGenAI } from '@google/genai';
import { mkdir, writeFile } from 'node:fs/promises';
import { env } from '../src/config/env.js';
import { categorize, providerAllowed } from '../src/services/content/providers.js';
const results={at:new Date().toISOString(),operation:'MODEL_METADATA_ONLY',generationCalls:0,estimatedCostUsd:0,gemini:{configured:Boolean(env.GEMINI_API_KEY_PRIMARY),secondaryConfigured:Boolean(env.GEMINI_API_KEY_SECONDARY),selectedModel:env.GEMINI_MODEL||null,spendingAuthorized:providerAllowed(env,'gemini'),projectFreeTierConfirmed:env.GEMINI_FREE_TIER_CONFIRMED==='true',billingTierVerification:'NOT_EXPOSED_BY_MODEL_METADATA'}};
if(env.GEMINI_API_KEY_PRIMARY){
  try{
    const client=new GoogleGenAI({apiKey:env.GEMINI_API_KEY_PRIMARY,httpOptions:{timeout:12000,retryOptions:{attempts:1}}});
    const pager=await client.models.list({config:{pageSize:100}});let names=[];
    for await(const model of pager){names.push({name:model.name,actions:model.supportedActions||[],inputTokenLimit:model.inputTokenLimit,outputTokenLimit:model.outputTokenLimit});if(names.length>=200)break;}
    results.gemini.connectivity='METADATA_REACHABLE';results.gemini.models=names;
    results.gemini.listingTruncated=names.length>=200;
    results.gemini.textGenerationCandidates=names.filter(m=>m.name.startsWith('models/gemini-')&&m.actions.includes('generateContent')&&!/image|nano-banana|audio|tts|live|robotics|embedding/i.test(m.name)).map(m=>m.name);
    results.gemini.capabilityNote='generateContent availability does not prove JSON Schema support, free quota or the billing tier. Cross-check current official model/pricing documentation.';
    if(env.GEMINI_MODEL){const model=await client.models.get({model:env.GEMINI_MODEL});results.gemini.selectedModelAvailable=Boolean(model.name);results.gemini.selectedModelSupportsGenerateContent=(model.supportedActions||[]).includes('generateContent');}
    const blockers=[];if(!env.GEMINI_MODEL)blockers.push('MODEL_NOT_SELECTED');if(!providerAllowed(env,'gemini'))blockers.push('ENTITLEMENT_NOT_CONFIRMED');if(blockers.length)results.gemini.generationBlocked=blockers;
  }catch(error){const safe=categorize(error);results.gemini.connectivity='BLOCKED';results.gemini.category=safe.code;results.gemini.httpStatus=safe.status;}
}
await mkdir(new URL('../reports/',import.meta.url),{recursive:true});
await writeFile(new URL('../reports/gemini-provider-check.json',import.meta.url),JSON.stringify(results,null,2));
console.log(JSON.stringify(results));
