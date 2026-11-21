import {runScamAIOnce} from '../src/services/scams/workflow.js';
import {runNoticeAIOnce} from '../src/services/notices/publicWorkflow.js';
import { randomUUID } from 'node:crypto';
import {runFormAIOnce} from '../src/services/forms/workflow.js';
import {refreshReviewEvidence,processAdministrativeObservations} from '../src/services/verification/reviewEvidence.js';
import { setTimeout as sleep } from 'node:timers/promises';
import { connectDB, disconnectDB, requireTransactions } from '../src/config/db.js';
import { initModels } from '../src/models/index.js';
import { initAdminModels, WorkerHeartbeat } from '../src/models/admin.js';
import { runOne, schedulerTick } from '../src/services/admin/jobs.js';
import { runAIOnce } from '../src/services/content/workflow.js';
let stopping = false, lastEvidenceRefresh=0;
process.on('SIGINT', () => { stopping = true; }); process.on('SIGTERM', () => { stopping = true; });
const id = randomUUID();
try {
  const connection=await connectDB();if(connection.readOnly)throw Error('READ_ONLY_WORKER_DISABLED');await requireTransactions(); await initModels(); await initAdminModels();
  console.log('Native collection worker and persisted scheduler ready.');
  while (!stopping) {
    await WorkerHeartbeat.updateOne({ _id: id }, { $set: { lastSeen: new Date(), state: 'RUNNING' } }, { upsert: true });
    try { await schedulerTick(); await runOne(); await runAIOnce(); await runFormAIOnce(); await runNoticeAIOnce(); await runScamAIOnce(); } catch { console.error('Worker tick failed safely; retrying. Check database availability and job history.'); }
    if (!stopping) await sleep(1000);
    if(!stopping&&Date.now()-lastEvidenceRefresh>300000){lastEvidenceRefresh=Date.now();try{await refreshReviewEvidence();await processAdministrativeObservations();}catch{console.error('Evidence packet preparation deferred; no approval or collection was performed.');}}
  }
  await WorkerHeartbeat.updateOne({ _id: id }, { $set: { state: 'STOPPED', lastSeen: new Date() } });
} catch { console.error('Worker unavailable. Check database connectivity and replica-set capabilities.'); process.exitCode = 1; }
finally { await disconnectDB(); }
