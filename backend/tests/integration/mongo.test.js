import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { serverRoot, phase1Dir } from '../../src/config/env.js';
import { connectDB, disconnectDB, requireTransactions } from '../../src/config/db.js';
import { models, initModels } from '../../src/models/index.js';
import { MongoStore } from '../../src/services/ingestion/store.js';
import { importResearch, readPackage } from '../../src/services/ingestion/importResearch.js';
import { collect } from '../../src/services/ingestion/collect.js';
import { ingest } from '../../src/services/changeDetection/ingest.js';

const uri = process.env.MONGODB_TEST_URI;
test('MongoDB integration suite (explicit isolated test URI required)', { skip: !uri && 'Set MONGODB_TEST_URI to a local replica set test database' }, async t => {
  const u = new URL(uri);
  assert.match(u.pathname, /^\/mygovguide_phase2_test(?:_[\w-]+)?$/, 'Only an explicitly named isolated test database is allowed');
  const databaseName = `mygovguide_phase2_test_${Date.now()}`;
  u.pathname = `/${databaseName}`;
  await connectDB(u.href);
  await requireTransactions(); await initModels();
  const store = new MongoStore(); const results = [];
  try {
    await t.test('unique index rejects duplicate source identity', async () => {
      await store.put('Source', { id: 'unique', title: 'Synthetic unique', original: {}, host: 'example.test', url: 'https://example.test' });
      await assert.rejects(models.Source.collection.insertOne({ _id: 'duplicate', id: 'unique', title: 'x', original: {}, host: 'example.test', url: 'https://example.test' }), error => error.code === 11000);
      results.push('unique index: passed');
    });
    await t.test('all synthetic package record types persist and reimport without duplicates', async () => {
      const first = await importResearch(store, path.join(serverRoot, 'fixtures/research-package'));
      const second = await importResearch(store, path.join(serverRoot, 'fixtures/research-package'));
      assert.equal(first.counters.created, 5); assert.equal(second.counters.unchanged, 5); assert.equal(second.counters.rejected, 0);
      assert.equal(await models.Scheme.countDocuments({ id: 'synthetic-scheme' }), 1);
      assert.equal((await store.get('Source', 'synthetic-source')).authorizationStatus, 'NOT_AUTHORIZED_FOR_AUTOMATION');
      results.push({ syntheticImport: first.counters, syntheticRepeat: second.counters });
    });
    await t.test('all available real Phase 1 records persist, reconcile and repeat unchanged', async () => {
      const first = await importResearch(store, phase1Dir, { availableOnly: true });
      const second = await importResearch(store, phase1Dir, { availableOnly: true });
      assert.equal(first.counters.rejected, 0); assert.equal(first.original.results.schemes.created, 25);
      assert.equal(first.original.results.forms.created, 18); assert.equal(second.counters.unchanged, 137);
      assert.equal(first.original.results.scamAwareness.created, 12); assert.equal(first.original.results.notices.created, 12);
      assert.equal(second.counters.changeEvents, 0);
      assert.equal(await models.EligibilityRuleSet.countDocuments({ status: 'RULES_APPROVED_CURRENT' }), 0);
      results.push({ availableImport: first.counters, availableRepeat: second.counters, missingFiles: first.original.missingFiles });
    });
    await t.test('four adapter types persist end to end; repeat collection stays unchanged', async () => {
      const sources = JSON.parse(await readFile(path.join(serverRoot, 'fixtures/sources.json'), 'utf8'));
      const options = { offline: true, fixtureRoot: path.join(serverRoot, 'fixtures') };
      const first = await collect(store, sources, options); const second = await collect(store, sources, options);
      assert.equal(first.counters.created, 4); assert.equal(first.counters.successful, 4); assert.equal(first.counters.failed, 0);
      assert.equal(second.counters.unchanged, 4); assert.equal(second.counters.changeEvents, 0);
      const value = await store.get('Notice', 'fixture-api-notice'); assert.ok(value.normalized.description.includes('ಕನ್ನಡ'));
      const changed = { id: value.id, title: value.title, sourceUrl: value.sourceUrl, sourceIds: value.sourceIds,
        original: value.original, normalized: { ...value.normalized, description: 'Material synthetic update' } };
      assert.equal((await ingest(store, 'Notice', changed)).changeEvents, 1);
      assert.equal((await ingest(store, 'Notice', changed)).changeEvents, 0);
      assert.equal(await models.SourceVersion.countDocuments({ entityId: value.id }), 2);
      results.push({ fixtureFirst: first.counters, fixtureRepeat: second.counters });
    });
    await t.test('missing references fail and failed multi-document writes roll back', async () => {
      const versionsBefore = await models.SourceVersion.countDocuments();
      const noticesBefore = await models.Notice.countDocuments();
      const value = { id: 'invalid-write', title: 'Invalid', sourceUrl: 'https://example.test', sourceIds: ['fixture-api'], original: {}, normalized: {} };
      await assert.rejects(ingest(store, 'Notice', value, { unknownProperty: 'force rollback' }));
      assert.equal(await models.SourceVersion.countDocuments(), versionsBefore);
      assert.equal(await models.Notice.countDocuments(), noticesBefore);
      await assert.rejects(ingest(store, 'Notice', { ...value, sourceIds: ['absent'] }));
      results.push('reference integrity and transaction rollback: passed');
    });
    await t.test('full original package availability', async context => {
      try { await readPackage(phase1Dir); }
      catch (error) { context.skip(error.message); return; }
      const full = await importResearch(store, phase1Dir); assert.equal(full.counters.rejected, 0);
    });
    await writeFile(path.join(serverRoot, 'reports/mongo-integration.json'), JSON.stringify({ databaseName, results,
      counts: Object.fromEntries(await Promise.all(Object.entries(models).map(async ([key, Model]) => [key, await Model.countDocuments()]))) }, null, 2));
  } finally { await disconnectDB(); }
});
