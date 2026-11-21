import test from 'node:test';
import assert from 'node:assert/strict';
import { fixtureScheme,fixtureOutput,translations } from './support/contentFixture.js';
import { canonicalFacts,validateOutput,words,searchTokens,normalizeSearch,syntheticEvidence } from '../src/services/content/contracts.js';
import { AIProviderRouter,AIError,maxRequestCost,providerAllowed,categorize } from '../src/services/content/providers.js';
const approval={facts:canonicalFacts(fixtureScheme),excerpt:fixtureScheme.description,clauseRefs:['Synthetic clause 1'],evidenceUrl:fixtureScheme.sourceUrl,dataClass:'SYNTHETIC'};
const config={GEMINI_API_KEY_PRIMARY:'mock-primary',GEMINI_API_KEY_SECONDARY:'mock-secondary',GEMINI_MODEL:'mock-model',AI_MAX_RETRIES:2,AI_MAX_COST_PER_DAY:0,GEMINI_FREE_TIER_CONFIRMED:'true',GEMINI_SECONDARY_AUTHORIZED:'true'};
function memoryState(){const rows=new Map();return {get:async id=>rows.get(id),set:async(id,value)=>rows.set(id,{...rows.get(id),...value})};}
test('all language artifacts retain exact critical values, source clauses, links and document names',()=>{
  assert.equal(syntheticEvidence({packageMetadata:{synthetic:false},notes:'Do not use synthetic examples as official facts.'}),false);
  assert.equal(syntheticEvidence({packageMetadata:{synthetic:true}}),true);
  assert.equal(syntheticEvidence({collectionProvenance:{mode:'FIXTURE'}}),true);
  for(const language of ['en','hi','kn']){const result=validateOutput(fixtureOutput(approval,language),approval,language);assert.equal(result.ok,true,JSON.stringify(result.errors));assert.ok(result.warnings.length);}
});
test('malformed model output, unsupported language, invented number/date/document/link and changed facts fail',()=>{
  assert.equal(validateOutput({},approval,'en').ok,false);
  for(const mutate of [o=>o.language='fr',o=>o.benefits=['INR 6500'],o=>o.summary+=' Deadline 2027-01-01',o=>o.documents.push({name:'Passport',label:'Passport',explanation:'Required'}),o=>o.howToApply.links[0].url='https://evil.example',o=>o.preservedFacts[0].value='Changed',o=>o.citations[0].quote='Invented clause',o=>o.language='hi']){const o=fixtureOutput(approval,'en');mutate(o);assert.equal(validateOutput(o,approval,'en').ok,false);}
});
test('Unicode normalization and indexed tokens preserve Hindi/Kannada and transliteration',()=>{
  for(const [lang,t]of Object.entries(translations)){const tokens=searchTokens([t.title,...t.aliases,...t.keywords,...t.romanized]);for(const q of t.keywords){assert.ok(words(q).every(w=>tokens.includes(w)),`${lang}:${q}`);}}
  assert.equal(normalizeSearch('  SCHOLARSHIP,  विद्यार्थि  ಕನ್ನಡ  '),'scholarship विद्यार्थि ಕನ್ನಡ');
  assert.ok(searchTokens(['ವಿದ್ಯಾರ್ಥಿವೇತನ']).includes('ವಿದ್ಯಾರ್ಥಿವೇತನ'));assert.ok(searchTokens(['scholarship']).includes('scholar'));
});
test('a negative approval disclaimer is allowed but positive or mixed eligibility promises remain rejected',()=>{
 const out=fixtureOutput(approval,'en');out.limitations.push('No open application window or guaranteed approval is asserted.');assert.equal(validateOutput(out,approval,'en').ok,true);
 for(const claim of ['You are eligible.','Not only are you automatically eligible.','No guaranteed approval is asserted, but you are eligible.']){const changed=structuredClone(out);changed.summary=claim;assert.ok(validateOutput(changed,approval,'en').errors.includes('UNSUPPORTED_ELIGIBILITY_PROMISE'));}
});
test('429 defers project and never rotates to the second Gemini key',async()=>{
  assert.equal(categorize({status:429,headers:{'retry-after':'120'}}).retryAfterMs,120000);
  assert.equal(categorize({status:429,message:JSON.stringify({error:{details:[{retryDelay:'180s'}]}})}).retryAfterMs,180000);
  const keys=[],state=memoryState();const router=new AIProviderRouter({config,state,adapters:{gemini:async({key})=>{keys.push(key);throw new AIError('PROVIDER_QUOTA',{status:429,retryAfterMs:120000});}},wait:async()=>{}});
  await assert.rejects(router.generate(approval,'en'),e=>e.code==='PROVIDER_QUOTA');assert.deepEqual(keys,['mock-primary']);
  await assert.rejects(router.generate(approval,'en'),e=>e.code==='PROVIDER_COOLDOWN');assert.equal(keys.length,1);
});
test('temporary errors retry finitely with backoff; invalid JSON/400 never fail over',async()=>{
  const delays=[],calls=[];const router=new AIProviderRouter({config,state:memoryState(),wait:async ms=>delays.push(ms),adapters:{gemini:async()=>{calls.push(1);if(calls.length<3)throw new AIError('PROVIDER_TEMPORARY',{status:503});return {text:JSON.stringify(fixtureOutput(approval,'en'))};}}});
  assert.equal((await router.generate(approval,'en')).provider,'gemini');assert.deepEqual(delays,[500,1000]);assert.equal(calls.length,3);
  let invoked=0;const malformed=new AIProviderRouter({config,state:memoryState(),adapters:{gemini:async()=>{invoked++;return {text:'not JSON'};}}});
  await assert.rejects(malformed.generate(approval,'en'),e=>e.code==='MODEL_JSON_INVALID');assert.equal(invoked,1);
  const badRequestKeys=[];const badRequest=new AIProviderRouter({config,state:memoryState(),adapters:{gemini:async({key})=>{badRequestKeys.push(key);throw new AIError('PROVIDER_BAD_REQUEST',{status:400});}}});
  await assert.rejects(badRequest.generate(approval,'en'),e=>e.status===400);assert.deepEqual(badRequestKeys,['mock-primary']);
});
test('401 may use expressly authorized replacement, 403 stops without secondary',async()=>{
  const calls=[];const router=new AIProviderRouter({config,state:memoryState(),adapters:{gemini:async({key})=>{calls.push(key);if(key==='mock-primary')throw new AIError('PROVIDER_AUTHORIZATION',{status:401});return {text:JSON.stringify(fixtureOutput(approval,'en'))};}}});
  await router.generate(approval,'en');assert.deepEqual(calls,['mock-primary','mock-secondary']);
  const denied=[];const r=new AIProviderRouter({config,state:memoryState(),adapters:{gemini:async({key})=>{denied.push(key);throw new AIError('PROVIDER_AUTHORIZATION',{status:403});}}});await assert.rejects(r.generate(approval,'en'));assert.deepEqual(denied,['mock-primary']);
});
test('zero budget and unconfirmed free entitlement perform zero model requests',async()=>{
  let calls=0;const r=new AIProviderRouter({config:{...config,GEMINI_FREE_TIER_CONFIRMED:'false'},state:memoryState(),adapters:{gemini:async()=>{calls++;}}});await assert.rejects(r.generate(approval,'en'),e=>e.code==='AI_SPENDING_NOT_AUTHORIZED');assert.equal(calls,0);
  assert.equal(providerAllowed({...config,AI_PAID_USE_APPROVED:'true',AI_MAX_COST_PER_DAY:1},'unsupported-provider'),false);
});
test('Gemini paid mode requires explicit permission, rates and reservation; unknown providers are rejected',async()=>{
  const paid={...config,GEMINI_FREE_TIER_CONFIRMED:'false',AI_PAID_USE_APPROVED:'true',AI_MAX_COST_PER_DAY:1,GEMINI_INPUT_COST_PER_MILLION:1,GEMINI_OUTPUT_COST_PER_MILLION:2};const reserves=[];
  const r=new AIProviderRouter({config:paid,state:memoryState(),reserve:async amount=>reserves.push(amount),adapters:{gemini:async()=>({text:JSON.stringify(fixtureOutput(approval,'kn')),usage:{inputTokens:10,outputTokens:20}})}});
  const out=await r.generate(approval,'kn');assert.equal(out.provider,'gemini');assert.equal(validateOutput(out.output,approval,'kn').ok,true);assert.ok(reserves[0]>0);
  assert.throws(()=>maxRequestCost({...paid,GEMINI_INPUT_COST_PER_MILLION:0},'gemini','test'),e=>e.code==='PRICE_CONFIGURATION_REQUIRED');
  assert.throws(()=>maxRequestCost(paid,'unsupported-provider','test'),e=>e.code==='PROVIDER_NOT_SUPPORTED');
  await assert.rejects(new AIProviderRouter({config:paid,state:memoryState(),adapters:{gemini:async()=>assert.fail('Unreserved paid request')}}).generate(approval,'en'),e=>e.code==='BUDGET_RESERVATION_REQUIRED');
});
