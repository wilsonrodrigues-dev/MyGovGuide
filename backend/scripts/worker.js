import { randomUUID } from 'node:crypto';
import { setTimeout as sleep } from 'node:timers/promises';
import { connectDB, disconnectDB, requireTransactions } from '../src/config/db.js';
import { initModels } from '../src/models/index.js';
import { initAdminModels, WorkerHeartbeat } from '../src/models/admin.js';
import { runOne, schedulerTick } from '../src/services/admin/jobs.js';
import { runAIOnce } from '../src/services/content/workflow.js';
let stopping = false;
process.on('SIGINT', () => { stopping = true; }); process.on('SIGTERM', () => { stopping = true; });
const id = randomUUID();
try {
  await connectDB(); await requireTransactions(); await initModels(); await initAdminModels();
  console.log('Native collection worker and persisted scheduler ready.');
  while (!stopping) {
    await WorkerHeartbeat.updateOne({ _id: id }, { $set: { lastSeen: new Date(), state: 'RUNNING' } }, { upsert: true });
    try { await schedulerTick(); await runOne(); await runAIOnce(); } catch { console.error('Worker tick failed safely; retrying. Check database availability and job history.'); }
    if (!stopping) await sleep(1000);
  }
  await WorkerHeartbeat.updateOne({ _id: id }, { $set: { state: 'STOPPED', lastSeen: new Date() } });
} catch { console.error('Worker unavailable. Check database connectivity and replica-set capabilities.'); process.exitCode = 1; }
finally { await disconnectDB(); }
