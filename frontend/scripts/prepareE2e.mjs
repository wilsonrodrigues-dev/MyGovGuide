import { randomBytes } from 'node:crypto';
import { connectDB, disconnectDB, requireTransactions } from '../../backend/src/config/db.js';
import { models, initModels } from '../../backend/src/models/index.js';
import { initAdminModels } from '../../backend/src/models/admin.js';
import { importResearch } from '../../backend/src/services/ingestion/importResearch.js';
import { phase1Dir } from '../../backend/src/config/env.js';
import { MongoStore } from '../../backend/src/services/ingestion/store.js';
import { ingest } from '../../backend/src/services/changeDetection/ingest.js';
export async function prepareE2e({contentFixture=false,formsFixture=false}={}) {
  const u = new URL(process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true');
  if (!/^\/mygovguide_phase2_test(?:_[\w-]+)?$/.test(u.pathname)) throw new Error('Browser tests require an isolated mygovguide_phase2_test database');
  u.pathname = `/mygovguide_phase2_test_browser_${Date.now()}`;
  const password = randomBytes(24).toString('base64url');
  try {
    await connectDB(u.href); await requireTransactions(); await initModels(); await initAdminModels();
    const store = new MongoStore(); await importResearch(store, phase1Dir);
    const notice = await store.get('Notice', 'N-01');
    await ingest(store, 'Notice', { id: notice.id, title: notice.title, sourceUrl: notice.sourceUrl, sourceIds: notice.sourceIds, original: notice.original, normalized: { ...notice.normalized, description: 'SYNTHETIC browser-test change; never an official announcement.' } });
    if(contentFixture){const {prepareContentFixture}=await import('./prepareContentFixture.mjs');await prepareContentFixture(store);}
    if(formsFixture){const {prepareFormsFixture}=await import('./prepareFormsFixture.mjs');await prepareFormsFixture();}
    console.log('Isolated browser database initialized; credentials stay in process memory.');
  } finally { await disconnectDB(); }
  return { MONGODB_URI: u.href, ADMIN_USERNAME: 'admin@example.test', ADMIN_PASSWORD: password, MYGOVGUIDE_E2E_ADMIN_PASSWORD: password, NODE_ENV: 'test',ENABLE_LIVE_COLLECTION:'false',GEMINI_FREE_TIER_CONFIRMED:'false',AI_PAID_USE_APPROVED:'false',AI_MAX_COST_PER_DAY:'0',...(contentFixture?{GEMINI_MODEL:'mock-model',MYGOVGUIDE_E2E_CONTENT_FIXTURE:'true'}:{}) };
}
