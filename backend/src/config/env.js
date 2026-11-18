import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { isIP } from 'node:net';
import { z } from 'zod';

export const serverRoot = fileURLToPath(new URL('../../', import.meta.url));
export const projectRoot = path.dirname(serverRoot);
dotenv.config({ path: path.join(serverRoot, '.env'), quiet: true });
const schema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(3001),
  HOST: z.string().default('127.0.0.1'),
  CLIENT_ORIGINS: z.string().default('http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173,http://localhost:4173'),
  MONGODB_URI: z.preprocess(v => v === '' ? undefined : v,
    z.string().regex(/^mongodb(?:\+srv)?:\/\//).default('mongodb://127.0.0.1:27018/mygovguide_phase2?directConnection=true')),
  ENABLE_LIVE_COLLECTION: z.enum(['true', 'false']).default('false'),
  MONGODB_DNS_SERVERS: z.string().default('').refine(value => !value.trim() || value.split(',').every(server => isIP(server.trim()) !== 0), 'Use comma-separated DNS server IP addresses'),
  GEMINI_API_KEY_PRIMARY: z.string().optional(),
  GEMINI_API_KEY_SECONDARY: z.string().optional(),
  GEMINI_MODEL: z.string().max(120).default(''),
  GEMINI_FREE_TIER_CONFIRMED: z.enum(['true','false']).default('false'),
  GEMINI_SECONDARY_AUTHORIZED: z.enum(['true','false']).default('false'),
  AI_PAID_USE_APPROVED: z.enum(['true','false']).default('false'),
  AI_MAX_COST_PER_DAY: z.coerce.number().min(0).max(100).default(0),
  AI_MAX_RETRIES: z.coerce.number().int().min(0).max(2).default(2),
  AI_MAX_CONCURRENT_JOBS: z.coerce.number().int().min(1).max(4).default(2),
  GEMINI_INPUT_COST_PER_MILLION: z.coerce.number().nonnegative().default(0),
  GEMINI_OUTPUT_COST_PER_MILLION: z.coerce.number().nonnegative().default(0),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  ADMIN_USERNAME: z.string().max(254).optional(),
  ADMIN_PASSWORD: z.string().max(200).optional(),
  MONGODB_TEST_URI: z.preprocess(v => v === '' ? undefined : v, z.string().regex(/^mongodb(?:\+srv)?:\/\//).optional()),
  HTTP_TIMEOUT_MS: z.coerce.number().int().min(100).max(60000).default(10000),
  HTTP_MAX_BYTES: z.coerce.number().int().min(1).max(20971520).default(5242880)
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) throw new Error('Invalid environment configuration. Check backend/.env.example; secret values are not logged.');
export const env = parsed.data;
export function validateDatabaseUris(appUri, testUri) {
  try {
    const app = new URL(appUri);
    if (!/^\/[\w-]+$/.test(app.pathname) || /^\/(admin|local|config)$/.test(app.pathname)) throw new Error();
    if (testUri) {
      const test = new URL(testUri);
      if (!/^\/mygovguide_phase2_test(?:_[\w-]+)?$/.test(test.pathname) || (app.host === test.host && app.pathname === test.pathname)) throw new Error();
    }
  } catch { throw new Error('Use an explicitly named application database and a separate mygovguide_phase2_test database. Connection values are not logged.'); }
}
validateDatabaseUris(env.MONGODB_URI, env.MONGODB_TEST_URI);
export const phase1Dir = path.resolve(serverRoot, process.env.PHASE1_DATA_DIR || 'research/phase1');
export const approvalFile = path.resolve(serverRoot, process.env.SOURCE_APPROVAL_FILE || 'config/source-approvals.json');
