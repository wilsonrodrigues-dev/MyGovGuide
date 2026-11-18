process.env.ADMIN_USERNAME='admin@example.test';process.env.ADMIN_PASSWORD='isolated-admin-test-password';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes, randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
const { connectDB, disconnectDB, requireTransactions } = await import('../../src/config/db.js');
const { models, initModels } = await import('../../src/models/index.js');
const { initAdminModels, AdminUser, AdminAudit, AdminSession, CollectionJob, CollectionSchedule } = await import('../../src/models/admin.js');
const { enqueue, runOne, saveSchedule, schedulerTick, recoverExpired, cancelJob } = await import('../../src/services/admin/jobs.js');
const { MongoStore } = await import('../../src/services/ingestion/store.js');
const { ingest } = await import('../../src/services/changeDetection/ingest.js');
const { app } = await import('../../src/app.js');
const uri = process.env.MONGODB_TEST_URI;
test('admin database, API and worker integration (isolated database)', { skip: !uri }, async t => {
  const u = new URL(uri); assert.match(u.pathname, /^\/mygovguide_phase2_test(?:_[\w-]+)?$/);
  u.pathname = `/mygovguide_phase2_test_admin_${Date.now()}`;
  await connectDB(u.href); await requireTransactions(); await initModels(); await initAdminModels();
  const password=process.env.ADMIN_PASSWORD;
  
  const server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}/api/admin`; let cookie;
  async function request(url, method = 'GET', body, extra = {}) {
    return fetch(base + url, { method, headers: { Origin: 'http://127.0.0.1:5173', ...(cookie ? { Cookie: cookie } : {}), 'Content-Type': 'application/json', ...extra }, ...(body ? { body: JSON.stringify(body) } : {}) });
  }
  try {
    await t.test('admin login uses environment credentials and resources deny anonymous access', async () => {
      for (const p of ['/stats', '/sources', '/jobs', '/schedules', '/data/Scheme', '/changes', '/reviews', '/system', '/audit']) assert.equal((await request(p)).status, 401);
      assert.equal((await request('/auth/login', 'POST', { username: 'admin@example.test', password: 'incorrect' })).status, 401);
      const r = await request('/auth/login', 'POST', { username: 'admin@example.test', password }); assert.equal(r.status, 200);
      cookie = r.headers.get('set-cookie').split(';')[0];
      assert.ok(r.headers.get('set-cookie').includes('HttpOnly')); assert.ok(r.headers.get('set-cookie').includes('SameSite=Strict'));
    });
    await t.test('manual job queues asynchronously, overlap is rejected, worker commits and history shows real counts', async () => {
      const r = await request('/jobs', 'POST', { sourceId: 'fixture-api', mode: 'FIXTURE' }); assert.equal(r.status, 202); const job = await r.json();
      assert.equal((await request('/jobs', 'POST', { sourceId: 'fixture-api', mode: 'FIXTURE' })).status, 409);
      const results = await Promise.all([runOne(), runOne()]); assert.equal(results.filter(Boolean).length, 1);
      const done = await (await request(`/jobs/${job._id}`)).json(); assert.equal(done.job.state, 'SUCCEEDED'); assert.equal(done.job.counters.created, 1); assert.equal(done.run.mode, 'FIXTURES');
      assert.equal((await (await request('/jobs?mode=FIXTURE&trigger=MANUAL')).json()).total, 1);
      await enqueue({ sourceId: 'fixture-api', mode: 'FIXTURE', actor: 'test-admin' }); const again = await runOne(); assert.equal(again.counters.unchanged, 1); assert.equal(again.counters.changeEvents, 0);
      const stats = await (await request('/stats')).json(); assert.equal(stats.counts.Notice, 1); assert.equal(stats.totals.created, 1);
    });
    await t.test('unapproved live source and unconfigured activation cannot bypass gates', async () => {
      assert.equal((await request('/jobs', 'POST', { sourceId: 'S01', mode: 'LIVE' })).status, 409);
      assert.equal((await request('/sources/S01/activation', 'POST', { enabled: true })).status, 409);
      assert.equal((await request('/schedules', 'POST', { name: 'Live denied', enabled: true, kind: 'DAILY', mode: 'LIVE', sourceIds: ['S01'] })).status, 409);
    });
    const scheduleInput = { name: 'Persisted fixture schedule', enabled: false, kind: 'DAILY', time: '06:00', timezone: 'Asia/Kolkata', mode: 'FIXTURE', sourceIds: ['fixture-rss'] };
    await t.test('scheduler OFF persists, ON executes one slot across concurrent ticks, OFF prevents future runs', async () => {
      const s = await saveSchedule(scheduleInput, 'test-admin');
      await CollectionSchedule.updateOne({ _id: s._id }, { $set: { nextRun: new Date(Date.now() - 1000) } });
      await schedulerTick(); assert.equal(await CollectionJob.countDocuments({ trigger: 'SCHEDULED' }), 0);
      await request(`/schedules/${s._id}/activation`, 'POST', { enabled: true });
      await CollectionSchedule.updateOne({ _id: s._id }, { $set: { nextRun: new Date(Date.now() - 1000) } });
      await Promise.all([schedulerTick(), schedulerTick()]); assert.equal(await CollectionJob.countDocuments({ trigger: 'SCHEDULED' }), 1);
      await runOne();
      await request(`/schedules/${s._id}/activation`, 'POST', { enabled: false });
      await CollectionSchedule.updateOne({ _id: s._id }, { $set: { nextRun: new Date(Date.now() - 1000) } }); await schedulerTick();
      assert.equal(await CollectionJob.countDocuments({ trigger: 'SCHEDULED' }), 1);
      assert.equal((await (await request('/schedules')).json()).items[0].enabled, false);
      assert.equal((await request('/schedules/validate', 'POST', { ...scheduleInput, kind: 'CUSTOM', cron: 'bad' })).status, 400);
    });
    await t.test('cancel, worker restart recovery, exhausted retries and failures retain previous records', async () => {
      const q = await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' }); await cancelJob(q._id); assert.equal((await CollectionJob.findById(q._id)).state, 'CANCELLED');
      const interrupted = await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' });
      await CollectionJob.updateOne({ _id: interrupted._id }, { $set: { state: 'RUNNING', leaseToken: 'dead-worker', leaseUntil: new Date(0), attempts: 1 } });
      await recoverExpired(); assert.equal((await CollectionJob.findById(interrupted._id)).state, 'QUEUED'); assert.equal((await runOne()).state, 'SUCCEEDED');
      const failed = await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' }); const before = await models.Notice.countDocuments();
      await runOne({ collectFn: async () => { throw new Error('Synthetic transport failure'); } }); assert.equal((await CollectionJob.findById(failed._id)).state, 'FAILED'); assert.equal(await models.Notice.countDocuments(), before);
      await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' }); assert.equal((await runOne()).state, 'SUCCEEDED');
      const exhausted = await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' });
      await CollectionJob.updateOne({ _id: exhausted._id }, { $set: { state: 'RUNNING', leaseToken: 'lost', leaseUntil: new Date(0), attempts: 3 } });
      await recoverExpired(); const terminal = await CollectionJob.findById(exhausted._id).lean(); assert.equal(terminal.state, 'INTERRUPTED'); assert.equal(terminal.activeKey, undefined);
      await enqueue({ sourceId: 'fixture-html', mode: 'FIXTURE', actor: 'test-admin' });
      const cancelled = await runOne({ collectFn: async (_store, _sources, options) => {
        const active = await CollectionJob.findOne({ state: 'RUNNING', sourceId: 'fixture-html' }).lean(); await cancelJob(active._id);
        assert.equal(await options.shouldCancel(), true); await assert.rejects(options.beforeCommit());
        return { id: 'synthetic-no-run', outcome: 'NO_OP', counters: {} };
      } }); assert.equal(cancelled.state, 'CANCELLED');
    });
    await t.test('data explorer and change versions expose evidence, review rejects automatic approvals', async () => {
      const store = new MongoStore(); const current = await store.get('Notice', 'fixture-api-notice');
      await ingest(store, 'Notice', { id: current.id, title: current.title, sourceUrl: current.sourceUrl, sourceIds: current.sourceIds, original: current.original, normalized: { ...current.normalized, description: 'Synthetic changed evidence for version comparison' } });
      const changes = await (await request('/changes')).json(); assert.equal(changes.total, 1);
      const compare = await (await request(`/changes/${changes.items[0].id}`)).json(); assert.notEqual(compare.oldVersion.contentHash, compare.newVersion.contentHash);
      const explorer = await (await request('/data/Notice?q=fixture')).json(); assert.ok(explorer.total >= 1);
      const reviews = await (await request('/reviews')).json(); const item = reviews.items.find(x => x.entityId === current.id && x.versionId === compare.newVersion.id);
      assert.ok(item);
      assert.equal((await request(`/reviews/${item.id}`, 'POST', { status: 'SOURCE_VERIFIED_FACT', evidence: 'Synthetic test evidence' })).status, 400);
      assert.equal((await request(`/reviews/${item.id}`, 'POST', { status: 'REJECTED', evidence: 'Synthetic evidence demonstrates this record must remain internal.' })).status, 200);
      assert.equal((await models.ChangeEvent.findById(changes.items[0].id)).reviewStatus, 'REJECTED');
      assert.equal((await models.Notice.findById(current.id)).publicationStatus, 'INTERNAL'); assert.equal(await models.ReviewEvent.countDocuments(), 1);
    });
    await t.test('logout revokes session and audit omits passwords', async () => {
      assert.equal(await AdminUser.countDocuments(),0);assert.equal(await AdminSession.countDocuments(),0);
      assert.equal(JSON.stringify(await AdminAudit.find().lean()).includes(password), false);
      assert.equal((await request('/auth/logout', 'POST', {})).status, 200); assert.equal((await request('/stats')).status, 401);
    });
  } finally { await new Promise(r => server.close(r)); await disconnectDB(); }
});
