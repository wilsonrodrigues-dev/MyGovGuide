import { GoogleGenAI } from '@google/genai';
import { setTimeout as sleep } from 'node:timers/promises';
import { env } from '../../config/env.js';
import { AIProviderState } from '../../models/content.js';
import { outputJsonSchema, makePrompt } from './contracts.js';
export class AIError extends Error {
  constructor(code, { status = 0, retryAfterMs = 0, attempts = [] } = {}) { super(code); Object.assign(this, { code, status, retryAfterMs, attempts }); }
}
export function categorize(error) {
  if (error instanceof AIError) return error;
  const status = Number(error.status || error.statusCode || 0);
  const retryAfter = error.headers?.get?.('retry-after') || error.headers?.['retry-after'];
  const retryAfterMs = retryAfter ? /^\d+$/.test(retryAfter) ? +retryAfter * 1000 : Math.max(0, Date.parse(retryAfter)-Date.now()) : 0;
  let guidance=Number.isFinite(retryAfterMs)?retryAfterMs:0;
  // Gemini SDK errors may put google.rpc.RetryInfo in JSON details rather than headers.
  try{const data=typeof error.message==='string'?JSON.parse(error.message):error;for(const detail of data?.error?.details||data?.details||[]){if(typeof detail.retryDelay==='string'&&/^\d+(?:\.\d+)?s$/.test(detail.retryDelay))guidance=Math.max(guidance,parseFloat(detail.retryDelay)*1000);}}catch{}
  return new AIError(status === 429 ? 'PROVIDER_QUOTA' : [401,403].includes(status) ? 'PROVIDER_AUTHORIZATION' : status === 400 ? 'PROVIDER_BAD_REQUEST' : status >= 500 || !status ? 'PROVIDER_TEMPORARY' : 'PROVIDER_FAILED', { status, retryAfterMs:guidance });
}
export function providerAllowed(config, provider) {
  if (provider !== 'gemini') return false;
  if (provider === 'gemini' && config.GEMINI_FREE_TIER_CONFIRMED === 'true') return true;
  return config.AI_PAID_USE_APPROVED === 'true' && config.AI_MAX_COST_PER_DAY > 0;
}
export function maxRequestCost(config, provider, prompt) {
  if (provider !== 'gemini') throw new AIError('PROVIDER_NOT_SUPPORTED');
  if (provider === 'gemini' && config.GEMINI_FREE_TIER_CONFIRMED === 'true') return 0;
  const prefix = provider.toUpperCase(), inputRate = config[`${prefix}_INPUT_COST_PER_MILLION`], outputRate = config[`${prefix}_OUTPUT_COST_PER_MILLION`];
  if (!(inputRate > 0 && outputRate > 0)) throw new AIError('PRICE_CONFIGURATION_REQUIRED');
  // Conservative byte count bounds input tokens, including schema and system text.
  return (Buffer.byteLength(prompt + JSON.stringify(outputJsonSchema), 'utf8') * inputRate + 3072 * outputRate) / 1e6;
}
async function geminiGenerate({ key, model, prompt }) {
  const client = new GoogleGenAI({ apiKey: key, httpOptions: { timeout: 20000, retryOptions: { attempts: 1 } } });
  const response = await client.models.generateContent({ model, contents: prompt, config: { responseMimeType: 'application/json', responseJsonSchema: outputJsonSchema, temperature: 0.1, maxOutputTokens: 3072 } });
  return { text: response.text, usage: { inputTokens: response.usageMetadata?.promptTokenCount || 0, outputTokens: response.usageMetadata?.candidatesTokenCount || 0, totalTokens: response.usageMetadata?.totalTokenCount || 0 } };
}
const databaseState = {
  get: id => AIProviderState.findById(id).lean(),
  set: (id, value) => AIProviderState.updateOne({ _id: id }, { $set: value }, { upsert: true })
};
export class AIProviderRouter {
  constructor({ config = env, adapters = { gemini: geminiGenerate }, state = databaseState, wait = sleep, now = () => Date.now(), reserve = async amount => {if(amount>0)throw new AIError('BUDGET_RESERVATION_REQUIRED');} } = {}) { Object.assign(this, { config, adapters, state, wait, now, reserve }); }
  async generate(approval, language) {
    if (!['CURATED_PUBLIC','LIVE','SYNTHETIC'].includes(approval.dataClass)) throw new AIError('PUBLIC_CONTENT_REQUIRED');
    const prompt = makePrompt(approval, language); if (Buffer.byteLength(prompt) > 24000) throw new AIError('INPUT_TOO_LARGE');
    const attempts = []; let primaryError;
    const providers = ['gemini'];
    for (const provider of providers) {
      if (!providerAllowed(this.config, provider)) { primaryError = new AIError('AI_SPENDING_NOT_AUTHORIZED'); continue; }
      const model = this.config[`${provider.toUpperCase()}_MODEL`];
      let key = this.config.GEMINI_API_KEY_PRIMARY;
      if (!model || !key) { primaryError = new AIError('PROVIDER_NOT_CONFIGURED'); continue; }
      const circuitId = 'gemini-primary';
      const circuit = await this.state.get(circuitId);
      if (new Date(circuit?.cooldownUntil || 0).getTime() > this.now()) { primaryError=new AIError('PROVIDER_COOLDOWN',{retryAfterMs:new Date(circuit.cooldownUntil).getTime()-this.now()});continue; }
      let secondary = false;
      if(circuit?.disabled){
        if(provider==='gemini'&&circuit.credentialStatus===401&&this.config.GEMINI_SECONDARY_AUTHORIZED==='true'&&this.config.GEMINI_API_KEY_SECONDARY&&!(await this.state.get('gemini-secondary'))?.disabled){key=this.config.GEMINI_API_KEY_SECONDARY;secondary=true;}
        else{primaryError=new AIError('PROVIDER_CREDENTIAL_DISABLED');continue;}
      }
      for (let retry = 0; retry <= this.config.AI_MAX_RETRIES; retry++) {
        const bound = maxRequestCost(this.config, provider, prompt);
        await this.reserve(bound, provider);
        try {
          const response = await this.adapters[provider]({ key, model, prompt, language, approval });
          if (typeof response.text !== 'string' || response.text.length > 64000) throw new AIError('MODEL_RESPONSE_INVALID');
          let output; try { output = JSON.parse(response.text); } catch { throw new AIError('MODEL_JSON_INVALID'); }
          attempts.push({ provider, model, credential: secondary ? 'secondary' : 'primary', outcome: 'RESPONSE_RECEIVED', reservedUsd: bound });
          return { output, provider, model, attempts, usage: response.usage || {}, costUsd: attempts.reduce((sum,x)=>sum+(x.reservedUsd||0),0) };
        } catch (error) {
          const safe = categorize(error); attempts.push({ provider, model, credential: secondary ? 'secondary' : 'primary', outcome: safe.code, status: safe.status, reservedUsd: bound }); primaryError = safe;
          if (safe.code.startsWith('MODEL_') || safe.status === 400) throw Object.assign(safe, { attempts });
          if (safe.status === 429) {
            // One project quota: never switch Gemini keys on 429.
            await this.state.set(circuitId, { cooldownUntil: new Date(this.now()+Math.max(60000,safe.retryAfterMs)), category: safe.code }); break;
          }
          if ([401,403].includes(safe.status)) {
            await this.state.set(secondary ? 'gemini-secondary' : circuitId, { disabled: true, credentialStatus:safe.status, category: safe.code });
            if (provider === 'gemini' && safe.status === 401 && !secondary && this.config.GEMINI_SECONDARY_AUTHORIZED === 'true' && this.config.GEMINI_API_KEY_SECONDARY && !(await this.state.get('gemini-secondary'))?.disabled && retry < this.config.AI_MAX_RETRIES) { key = this.config.GEMINI_API_KEY_SECONDARY; secondary = true; continue; }
            // 403 is a permission denial, never a reason to try another credential.
            throw Object.assign(safe, { attempts });
          }
          if (safe.code === 'PROVIDER_TEMPORARY' && retry < this.config.AI_MAX_RETRIES) { await this.wait(500 * 2 ** retry); continue; }
          break;
        }
      }
    }
    throw Object.assign(primaryError || new AIError('PROVIDERS_UNAVAILABLE'), { attempts });
  }
}
export async function providerHealth(config = env) {
  const states = await AIProviderState.find({_id:{$in:['gemini-primary','gemini-secondary']}}).lean();
  return { gemini: { primaryConfigured: Boolean(config.GEMINI_API_KEY_PRIMARY), secondaryConfigured: Boolean(config.GEMINI_API_KEY_SECONDARY), model: config.GEMINI_MODEL || null, generationAllowed: providerAllowed(config,'gemini'), freeTierConfirmed: config.GEMINI_FREE_TIER_CONFIRMED === 'true' }, dailyBudgetUsd: config.AI_MAX_COST_PER_DAY, paidUseApproved: config.AI_PAID_USE_APPROVED === 'true', states };
}
