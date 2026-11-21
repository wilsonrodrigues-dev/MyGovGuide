import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { CronExpressionParser } from 'cron-parser';
import { z } from 'zod';
import { CollectionJob, CollectionSchedule, AdapterConfig } from '../../models/admin.js';
import { models } from '../../models/index.js';
import { MongoStore } from '../ingestion/store.js';
import { collect } from '../ingestion/collect.js';
import { authorize } from '../ingestion/access.js';
import { hash } from '../../utils/hash.js';
import { env, serverRoot } from '../../config/env.js';
import { audit } from './auth.js';
import { publish } from '../realtime/events.js';

export const fixtures = JSON.parse(await readFile(path.join(serverRoot, 'fixtures/sources.json'), 'utf8'));
function sanitizeJob(job) {
  if (!job) return null;
  const value = job.toObject ? job.toObject() : job;
  const { leaseToken, activeKey, ...safe } = value;
  return safe;
}
function jobEvent(type, job, extra = {}) { return publish(type, { job: sanitizeJob(job), ...extra }); }
export function fail(message, status = 400) { throw Object.assign(new Error(message), { safe: true, status }); }
export async function sourceFor(sourceId, mode, session) {
  if (mode === 'FIXTURE') {
    const source = fixtures.find(s => s.sourceId === sourceId);
    if (!source) fail('Choose a bundled fixture source');
    return source;
  }
  if (env.ENABLE_LIVE_COLLECTION !== 'true') fail('Live collection is disabled in server configuration', 409);
  const config = await AdapterConfig.findById(sourceId).session(session || null).lean();
  const source = await models.Source.findById(sourceId).session(session || null).lean();
  if (!config?.enabled || !config.validatedHash || config.validatedHash !== config.configHash || config.configHash !== hash(config.approval) || source?.authorizationStatus !== 'APPROVED' || hash(source.approval) !== config.configHash) fail('Source requires matching authorization, separate validation and activation', 409);
  authorize(config.approval, config.approval.url, config.approval.method);
  return config.approval;
}
export async function enqueue({ sourceId, mode, actor, trigger = 'MANUAL', scheduledKey,maxRecords=mode==='LIVE'?3:10000 }, session) {
  if(!Number.isInteger(maxRecords)||maxRecords<1||maxRecords>(mode==='LIVE'?3:10000))fail('Live demo runs must be limited to one to three records');
  if (!session) {
    const job = await new MongoStore().transaction(s => enqueue({ sourceId, mode, actor, trigger, scheduledKey,maxRecords }, s));
    await jobEvent('job:queued', job);
    return job;
  }
  if (!['FIXTURE', 'LIVE'].includes(mode)) fail('Invalid collection mode');
  await sourceFor(sourceId, mode, session);
  const value = { _id: randomUUID(), sourceId, mode,maxRecords, actor, trigger, state: 'QUEUED', activeKey: sourceId, progress: 'Waiting for worker', ...(scheduledKey ? { scheduledKey } : {}) };
  try {
    const [job] = await CollectionJob.create([value], { session });
    await audit(actor, 'JOB_QUEUED', job._id, { sourceId, mode, trigger }, session);
    return job.toObject();
  } catch (error) { if (error.code === 11000) fail('A job for this source is already queued/running, or this scheduled slot already exists', 409); throw error; }
}
export const scheduleInput = z.object({
  name: z.string().trim().min(1).max(120), enabled: z.boolean(), kind: z.enum(['DAILY', 'TWICE_DAILY', 'WEEKLY', 'CUSTOM']),
  time: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/).default('06:00'), weekday: z.number().int().min(0).max(6).default(1),
  cron: z.string().max(100).default('0 6 * * *'), timezone: z.string().max(80).default('Asia/Kolkata'),
  sourceIds: z.array(z.string().min(1).max(180)).min(1).max(30), mode: z.enum(['FIXTURE', 'LIVE'])
}).strict();
export function scheduleDefinition(input, now = new Date()) {
  const value = scheduleInput.parse(input);
  new Intl.DateTimeFormat('en', { timeZone: value.timezone }).format(now);
  const [hour, minute] = value.time.split(':').map(Number);
  const cron = value.kind === 'CUSTOM' ? value.cron : value.kind === 'DAILY' ? `${minute} ${hour} * * *` : value.kind === 'TWICE_DAILY' ? `${minute} ${hour},${(hour + 12) % 24} * * *` : `${minute} ${hour} * * ${value.weekday}`;
  if (cron.trim().split(/\s+/).length !== 5 || /[H?]/.test(cron)) fail('Use a deterministic five-field cron expression (minute hour day month weekday)');
  const iterator = CronExpressionParser.parse(cron, { tz: value.timezone, currentDate: now });
  const nextRun = iterator.next().toDate();
  if (iterator.next().toDate() - nextRun < 60000) fail('Minimum schedule interval is one minute');
  return { ...value, sourceIds: [...new Set(value.sourceIds)], cron, nextRun };
}
export async function saveSchedule(input, actor, id = randomUUID()) {
  const value = scheduleDefinition(input);
  if (value.enabled) for (const sourceId of value.sourceIds) await sourceFor(sourceId, value.mode);
  return new MongoStore().transaction(async session => {
    const row = await CollectionSchedule.findOneAndUpdate({ _id: id }, { $set: value, $inc: { revision: 1 } }, { upsert: true, new: true, session });
    await audit(actor, 'SCHEDULE_SAVED', id, { enabled: value.enabled, cron: value.cron, timezone: value.timezone }, session);
    return row.toObject();
  });
}
export async function schedulerTick(now = new Date()) {
  const due = await CollectionSchedule.find({ enabled: true, nextRun: { $lte: now } }).limit(50).lean();
  for (const schedule of due) {
    await new MongoStore().transaction(async session => {
      const nextRun = CronExpressionParser.parse(schedule.cron, { tz: schedule.timezone, currentDate: now }).next().toDate();
      const claimed = await CollectionSchedule.updateOne({ _id: schedule._id, revision: schedule.revision, enabled: true, nextRun: schedule.nextRun }, { $set: { nextRun, lastRun: now, lastOutcome: 'QUEUED' } }, { session });
      if (!claimed.modifiedCount) return;
      // Check in the transaction: a concurrent OFF/edit invalidates the slot claim.
      for (const sourceId of schedule.sourceIds) {
        const existing = await CollectionJob.exists({ $or: [{ activeKey: sourceId }, { scheduledKey: `${schedule._id}:${schedule.revision}:${schedule.nextRun.toISOString()}:${sourceId}` }] }).session(session);
        if (existing) { await CollectionSchedule.updateOne({ _id: schedule._id }, { $set: { lastOutcome: 'SKIPPED_OVERLAP' } }, { session }); continue; }
        try {
          await sourceFor(sourceId, schedule.mode, session);
        } catch {
          await CollectionSchedule.updateOne({ _id: schedule._id }, { $set: { lastOutcome: 'BLOCKED_AUTHORIZATION' } }, { session });
          await audit('scheduler', 'SCHEDULE_BLOCKED', schedule._id, { sourceId }, session); continue;
        }
        await enqueue({ sourceId, mode: schedule.mode, actor: 'scheduler', trigger: 'SCHEDULED', scheduledKey: `${schedule._id}:${schedule.revision}:${schedule.nextRun.toISOString()}:${sourceId}` }, session);
      }
    });
  }
  return due.length;
}
const leaseMs = 60000;
export async function recoverExpired(now = new Date(),jobId) {
  const scope=jobId?{_id:jobId}:{};
  const interrupted=await CollectionJob.find({...scope,state:'RUNNING',leaseUntil:{$lt:now},runId:{$exists:true}}).select('runId').lean();
  if(interrupted.length)await models.IngestionRun.updateMany({_id:{$in:interrupted.map(j=>j.runId)},outcome:'RUNNING'},{$set:{outcome:'FAILED',finishedAt:now},$push:{runErrors:'Worker interruption; committed record/cursor transactions are retained and retry is idempotent.'}});
  await CollectionJob.updateMany({ ...scope,state: 'RUNNING', leaseUntil: { $lt: now }, attempts: { $lt: 3 }, cancelRequested: false }, { $set: { state: 'QUEUED', progress: 'Recovered after worker interruption' }, $unset: { leaseToken: '', leaseUntil: '' } });
  await CollectionJob.updateMany({ ...scope,state: 'RUNNING', leaseUntil: { $lt: now }, $or: [{ attempts: { $gte: 3 } }, { cancelRequested: true }] }, { $set: { state: 'INTERRUPTED', finishedAt: now, error: 'Worker lease expired; review execution before retrying' }, $unset: { activeKey: '', leaseToken: '', leaseUntil: '' } });
}
export async function cancelJob(id) {
  const queued = await CollectionJob.findOneAndUpdate({ _id: id, state: 'QUEUED' }, { $set: { state: 'CANCELLED', cancelRequested: true, finishedAt: new Date(), progress: 'Cancelled before start' }, $unset: { activeKey: '' } }, { new: true });
  const job = queued || await CollectionJob.findOneAndUpdate({ _id: id, state: 'RUNNING' }, { $set: { cancelRequested: true, progress: 'Cancellation requested; waiting for safe boundary' } }, { new: true });
  if (job) await jobEvent('job:updated', job, { reason: 'CANCELLATION_REQUESTED' });
  return job;
}
export async function runOne({ collectFn = collect, jobId, maxRecords=10000 } = {}) {
  await recoverExpired(new Date(),jobId);
  const token = randomUUID();
  const job = await CollectionJob.findOneAndUpdate({ state: 'QUEUED', cancelRequested: false,...(jobId?{_id:jobId}:{}) }, { $set: { state: 'RUNNING', startedAt: new Date(), leaseToken: token, leaseUntil: new Date(Date.now() + leaseMs), progress: 'Checking source authorization' }, $inc: { attempts: 1 } }, { sort: { createdAt: 1 }, new: true }).lean();
  if (!job) return null;
  await jobEvent('job:running', job);
  const owned = { _id: job._id, state: 'RUNNING', leaseToken: token };
  let lost = false;
  const heartbeat = setInterval(async () => {
    try { const r = await CollectionJob.updateOne({ ...owned, leaseUntil: { $gt: new Date() } }, { $set: { leaseUntil: new Date(Date.now() + leaseMs) } }); if (!r.modifiedCount) lost = true; } catch { lost = true; }
  }, 10000);
  heartbeat.unref();
  try {
    const source = await sourceFor(job.sourceId, job.mode);
    const check = async session => {
      if (lost) throw new Error('Lease lost');
      // Touch the lease within the ingestion transaction. Cancellation/recovery conflicts
      // with this write, fencing obsolete workers before their record batch commits.
      const r = await CollectionJob.updateOne({ ...owned, cancelRequested: false, leaseUntil: { $gt: new Date() } }, { $set: { leaseUntil: new Date(Date.now() + leaseMs) } }, { session });
      if (!r.matchedCount) throw new Error('Cancelled or worker lease lost');
      await sourceFor(job.sourceId, job.mode, session);
    };
    const run = await collectFn(new MongoStore(), [source], { offline: job.mode === 'FIXTURE', enableLive: env.ENABLE_LIVE_COLLECTION === 'true', fixtureRoot: path.join(serverRoot, 'fixtures'),maxRecords:Math.min(maxRecords,job.maxRecords||(job.mode==='LIVE'?3:10000)),
      beforeCommit: check, onProgress: async (progress, runId, detail={}) => { await CollectionJob.updateOne(owned, { $set: { progress, runId } }); await publish('job:progress', { jobId: job._id, progress, runId,...detail }); }, shouldCancel: async () => lost || Boolean((await CollectionJob.findOne(owned).lean())?.cancelRequested) });
    const latest = await CollectionJob.findOne(owned).lean();
    const state = latest?.cancelRequested ? 'CANCELLED' : run.outcome === 'SUCCESS' ? 'SUCCEEDED' : run.outcome === 'NO_OP' ? 'BLOCKED' : 'FAILED';
    await CollectionJob.updateOne(owned, { $set: { state, runId: run.id, counters: run.counters, finishedAt: new Date(), progress: 'Finished; records remain subject to review', ...(state === 'FAILED' ? { error: 'Source failed; inspect run details' } : {}) }, $unset: { activeKey: '', leaseToken: '', leaseUntil: '' } });
  } catch {
    const latest = await CollectionJob.findOne(owned).lean();
    await CollectionJob.updateOne(owned, { $set: { state: latest?.cancelRequested ? 'CANCELLED' : 'FAILED', finishedAt: new Date(), error: 'Collection stopped safely; verify source authorization and run history' }, $unset: { activeKey: '', leaseToken: '', leaseUntil: '' } });
  } finally { clearInterval(heartbeat); }
  const finished = await CollectionJob.findById(job._id).select('-leaseToken').lean();
  await jobEvent('job:finished', finished);
  return finished;
}
