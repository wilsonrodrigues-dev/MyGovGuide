import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { serverRoot, phase1Dir } from '../src/config/env.js';
import { storeWithSource, candidate } from './helpers.js';
import { MemoryStore } from '../src/services/ingestion/store.js';
import { ingest } from '../src/services/changeDetection/ingest.js';
import { review, eligibilityReadiness, flagConflict } from '../src/services/verification/review.js';
import { importResearch, readPackage } from '../src/services/ingestion/importResearch.js';
import { collect } from '../src/services/ingestion/collect.js';
import { createAdapter, registerSiteAdapter, ApiAdapter } from '../src/adapters/index.js';
import { approveSource } from '../src/services/verification/sourceApproval.js';
import { authorized } from './helpers.js';
import { redactPrivate, assertPublicResearch } from '../src/validators/privacy.js';
const fixtureRoot = path.join(serverRoot, 'fixtures');
const packageDir = path.join(fixtureRoot, 'research-package');
const sources = JSON.parse(await readFile(path.join(fixtureRoot, 'sources.json'), 'utf8'));

test('synthetic package imports all groups, retains uncertainty and is idempotent', async () => {
  const store = new MemoryStore();
  const first = await importResearch(store, packageDir);
  assert.equal(first.counters.created, 5); assert.equal(first.counters.rejected, 0);
  const second = await importResearch(store, packageDir);
  assert.equal(second.counters.created, 0); assert.equal(second.counters.updated, 0); assert.equal(second.counters.unchanged, 5);
  assert.equal((await store.list('SourceVersion')).length, 4); assert.equal((await store.list('ChangeEvent')).length, 0);
  assert.equal((await store.get('Scheme', 'synthetic-scheme')).status, 'RESEARCH_ONLY');
  assert.equal((await store.get('Source', 'synthetic-source')).authorizationStatus, 'NOT_AUTHORIZED_FOR_AUTOMATION');
  assert.equal(eligibilityReadiness(await store.get('EligibilityRuleSet', 'rules-synthetic-scheme')).canEvaluate, false);
  assert.equal((await store.get('ScamAlert', 'synthetic-awareness')).recordType, 'AWARENESS_TOPIC');
  assert.equal(first.original.brokenLinkCount, 1);
});
test('strict full-package import stops before any write when inputs are missing', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'mygovguide-missing-'));
  const store = new MemoryStore();
  await assert.rejects(importResearch(store, dir), /missing/);
  assert.deepEqual(store.tables, {});
});
test('available real research maps actual fields, form kinds, aliases and source references', async () => {
  const store = new MemoryStore();
  const result = await importResearch(store, phase1Dir, { availableOnly: true });
  assert.equal(result.original.results.schemes.read, 25); assert.equal(result.original.results.forms.read, 18);
  assert.equal(result.counters.rejected, 0);
  const pension = await store.get('Scheme', 'IN-SR-01');
  assert.ok(pension.historicalAliases.includes('IGNOAPS'));
  assert.equal((await store.get('Scheme', 'IN-ST-01')).beneficiaryCategories[0], 'Student');
  assert.equal((await store.get('FormTemplate', 'FORM-03')).formKind, 'AUTHENTICATED_PORTAL');
  assert.equal((await store.get('FormTemplate', 'FORM-12')).formKind, 'INSTRUCTIONS_ONLY');
  assert.equal((await store.list('EligibilityRuleSet')).length, 25);
  const again = await importResearch(store, phase1Dir, { availableOnly: true });
  assert.equal(again.counters.unchanged, 137); assert.equal(again.counters.changeEvents, 0);
  assert.equal(again.counters.created, 0); assert.equal(again.counters.updated, 0); assert.equal(again.counters.rejected, 0);
  assert.equal(result.counters.read, 137);
  const awareness = await store.list('ScamAlert'); assert.equal(awareness.length, 12);
  for (const item of awareness) {
    assert.equal(item.recordType, 'AWARENESS_TOPIC'); assert.equal(item.publishedAt, undefined);
    assert.equal(item.normalized.observedPublicationDate, null);
    assert.equal(item.sourceUrl, item.original.primaryOfficialUrl);
    assert.ok(item.normalized.description.length > 20); assert.equal(item.publicationStatus || 'INTERNAL', 'INTERNAL');
  }
});
test('record rejection is audited and recovery can be reimported', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'mygovguide-recovery-'));
  for (const f of ['SOURCE_REGISTRY.json', 'VERIFIED_SCHEMES.json', 'FORMS_REGISTRY.json', 'NOTICES_AND_ALERTS.json']) {
    await writeFile(path.join(dir, f), await readFile(path.join(packageDir, f)));
  }
  const data = JSON.parse(await readFile(path.join(dir, 'VERIFIED_SCHEMES.json'), 'utf8'));
  data.schemes.push({ id: 'invalid', title: '' });
  await writeFile(path.join(dir, 'VERIFIED_SCHEMES.json'), JSON.stringify(data));
  const store = new MemoryStore(); const result = await importResearch(store, dir);
  assert.equal(result.counters.rejected, 1); assert.equal((await store.list('ImportRejection')).length, 1);
  data.schemes[1] = { ...data.schemes[0], id: 'recovered', title: 'Recovered synthetic record' };
  await writeFile(path.join(dir, 'VERIFIED_SCHEMES.json'), JSON.stringify(data));
  const recovered = await importResearch(store, dir); assert.equal(recovered.counters.rejected, 0);
  assert.ok(await store.get('Scheme', 'recovered'));
});
test('new, unchanged, changed and repeated versions produce correct event history', async () => {
  const store = await storeWithSource(); const input = candidate();
  assert.equal((await ingest(store, 'Scheme', input)).created, 1);
  assert.equal((await ingest(store, 'Scheme', input)).unchanged, 1);
  const changed = candidate({ normalized: { ...input.normalized, benefits: 'INR 200' } });
  assert.equal((await ingest(store, 'Scheme', changed)).changeEvents, 1);
  assert.equal((await ingest(store, 'Scheme', changed)).changeEvents, 0);
  const changes = await store.list('ChangeEvent');
  assert.deepEqual(changes[0].changedFields, ['benefits']); assert.equal((await store.list('SourceVersion')).length, 2);
  assert.equal((await ingest(store, 'Scheme', input)).changeEvents, 1); // A -> B -> A remains a real transition.
  assert.equal((await store.list('SourceVersion')).length, 3);
});
test('unrelated programmes never merge on similar titles', async () => {
  const store = await storeWithSource(); await ingest(store, 'Scheme', candidate());
  await ingest(store, 'Scheme', candidate({ id: 'unrelated' }));
  assert.equal((await store.list('Scheme')).length, 2);
});
test('invalid input, missing references and transaction failure leave earlier records untouched', async () => {
  const store = await storeWithSource(); await ingest(store, 'Scheme', candidate());
  const before = JSON.stringify(store.tables);
  await assert.rejects(ingest(store, 'Scheme', candidate({ title: '' })));
  await assert.rejects(ingest(store, 'Scheme', candidate({ sourceIds: ['absent'] })));
  await assert.rejects(ingest(store, 'Scheme', candidate({ normalized: { benefits: 'changed' } }), { unknownField: true }));
  assert.equal(JSON.stringify(store.tables), before);
});
test('review requires evidence, current version, clauses and preserves approved data on change', async () => {
  const store = await storeWithSource(); await ingest(store, 'Scheme', candidate());
  const current = await store.get('Scheme', 'test-scheme');
  await assert.rejects(review(store, 'Scheme', current.id, { status: 'SOURCE_VERIFIED_FACT' }));
  await review(store, 'Scheme', current.id, { status: 'SOURCE_VERIFIED_FACT', reviewer: 'Synthetic reviewer', evidence: 'Synthetic clause', clauseRefs: ['1.1'], versionId: current.currentVersionId });
  const approved = await store.get('Scheme', current.id);
  await ingest(store, 'Scheme', candidate({ normalized: { description: 'Changed', benefits: 'INR 200' } }));
  const changed = await store.get('Scheme', current.id);
  assert.equal(changed.status, 'REVIEW_REQUIRED'); assert.equal(changed.publicationStatus, 'WITHDRAWN');
  assert.deepEqual(changed.normalized, approved.normalized); assert.equal(changed.cacheStale, true);
  assert.equal((await store.list('ReviewEvent')).length, 1);
  assert.equal((await store.get('EligibilityRuleSet', 'rules-test-scheme')).completeness, 'INFORMATION_INCOMPLETE');
  await ingest(store, 'Scheme', candidate({ normalized: { description: 'Changed again', benefits: 'INR 300' } }));
  assert.deepEqual((await store.get('Scheme', current.id)).normalized, approved.normalized);
});
test('scraper output cannot promote facts or rules', async () => {
  const store = await storeWithSource();
  await assert.rejects(ingest(store, 'Scheme', candidate({ status: 'SOURCE_VERIFIED_FACT' })));
  await assert.rejects(ingest(store, 'EligibilityRuleSet', candidate()));
  assert.equal(eligibilityReadiness({ status: 'RESEARCH_ONLY' }).result, 'INFORMATION_INCOMPLETE');
});
test('contradictory official-source facts generate a review item', async () => {
  const store = await storeWithSource(); await ingest(store, 'Scheme', candidate());
  const fact = (await store.list('SchemeFact'))[0];
  await store.put('Source', { id: 'different-source', original: {}, title: 'Different synthetic source', host: 'other.test', url: 'https://other.test' });
  await store.put('SchemeFact', { ...fact, id: 'conflict-fact', sourceId: 'different-source', normalizedValue: 'Contradiction' });
  assert.equal(await flagConflict(store, 'test-scheme', fact.field), true);
  assert.ok((await store.list('ReviewItem')).some(item => item.reason.startsWith('CONFLICTING')));
});
test('all four offline adapters collect end to end and repeated runs are unchanged', async () => {
  const store = new MemoryStore();
  const first = await collect(store, sources, { offline: true, fixtureRoot });
  assert.equal(first.counters.successful, 4); assert.equal(first.counters.created, 4); assert.equal(first.counters.failed, 0);
  const second = await collect(store, sources, { offline: true, fixtureRoot });
  assert.equal(second.counters.unchanged, 4); assert.equal(second.counters.changeEvents, 0);
  assert.equal((await store.list('IngestionRun')).length, 2);
  assert.ok((await store.get('Notice', 'fixture-api-notice')).normalized.description.includes('ಕನ್ನಡ'));
});
test('partial source failures retain stored content and do not stop other sources', async () => {
  const store = new MemoryStore(); await collect(store, sources, { offline: true, fixtureRoot });
  const before = await store.get('Notice', 'fixture-api-notice');
  const broken = sources.map(s => s.method === 'api' ? { ...s, fixture: 'nonexistent.json' } : s);
  const result = await collect(store, broken, { offline: true, fixtureRoot });
  assert.equal(result.counters.failed, 1); assert.equal(result.counters.successful, 3);
  assert.deepEqual(await store.get('Notice', 'fixture-api-notice'), before);
});
test('offline fixture paths cannot escape root', async () => {
  const adapter = createAdapter({ ...sources[0], fixture: '../package.json' }, { fixtureRoot });
  await assert.rejects(adapter.fetch('unused'), /outside/);
});
test('RSS and Atom parsing preserve information; malformed inputs fail', async () => {
  const rss = createAdapter(sources[1]);
  assert.equal((await rss.parse(await readFile(path.join(fixtureRoot, 'atom.xml')))).length, 1);
  await assert.rejects(rss.parse(Buffer.from('<not-xml')));
  await assert.rejects(rss.parse(Buffer.from('<!DOCTYPE x><rss/>')));
  assert.throws(() => createAdapter(sources[0]).parse(Buffer.from('{bad json')));
  assert.throws(() => createAdapter(sources[2]).parse(Buffer.from('<html>missing article</html>')));
  await assert.rejects(createAdapter(sources[3]).parse(Buffer.from('not a PDF')));
});
test('HTML markup and navigation changes do not create material changes', () => {
  const adapter = createAdapter(sources[2]);
  const a = adapter.parse(Buffer.from('<article><h1>Title</h1><p>Text  here</p></article><footer>old</footer>'));
  const b = adapter.parse(Buffer.from('<nav>new</nav><article class="new"><h1>Title</h1><p>Text here</p></article>'));
  assert.deepEqual(adapter.normalize(a[0]).normalized, adapter.normalize(b[0]).normalized);
});
test('online disabled sources and dry run make no requests', async () => {
  let calls = 0; const http = { fetch() { calls++; throw new Error('must not be called'); } };
  const result = await collect(new MemoryStore(), sources, { http, enableLive: false });
  assert.equal(result.counters.skipped, 4); assert.equal(calls, 0);
  await collect(null, sources, { http, dryRun: true }); assert.equal(calls, 0);
});
test('synthetic approved collection requires matching database evidence before its transport can run', async () => {
  const store = new MemoryStore(); let calls = 0;
  const source = authorized({ method: 'api', apiAgreement: 'Synthetic API grant' });
  const http = { fetch: async () => { calls++; return Buffer.from(JSON.stringify({ records: [{ id: 'approved-notice', title: 'Synthetic transport', sourceUrl: source.url }] })); } };
  await store.put('Source', { id: source.sourceId, title: 'Synthetic approval test', url: source.url, host: source.host, original: {} });
  const denied = await collect(store, [source], { enableLive: true, http });
  assert.equal(denied.counters.skipped, 1); assert.equal(calls, 0);
  await approveSource(store, source.sourceId, source);
  const success = await collect(store, [source], { enableLive: true, http });
  assert.equal(success.counters.successful, 1); assert.equal(calls, 1);
  assert.equal((await store.list('ReviewEvent')).length, 1);
});
test('private citizen fields cannot be staged; rejection copies can be safely redacted', async () => {
  const store = await storeWithSource();
  await assert.rejects(ingest(store, 'Scheme', candidate({ original: { aadhaarNumber: 'SYNTHETIC-NOT-REAL' } })), /Private citizen/);
  assert.equal((await store.list('Scheme')).length, 0);
  assert.deepEqual(redactPrivate({ nested: { phone_number: 'SYNTHETIC' } }), { nested: { phone_number: '[REDACTED]' } });
  assert.doesNotThrow(() => assertPublicResearch({ fieldNamesObserved: ['Aadhaar number', 'Mobile number'] }));
});
test('historical source versions cannot be replaced by later writes', async () => {
  const store = await storeWithSource(); await ingest(store, 'Scheme', candidate());
  const old = (await store.list('SourceVersion'))[0];
  await assert.rejects(store.put('SourceVersion', { ...old, payload: { tampered: true } }), /immutable/);
  assert.deepEqual((await store.get('SourceVersion', old.id)).payload, old.payload);
});
test('site-specific adapters can register parsers without changing the pipeline', async () => {
  class SpecificApi extends ApiAdapter {
    parse(buffer) { const value = JSON.parse(buffer.toString()); return value.items.map(item => ({ title: item.heading, sourceUrl: item.link })); }
  }
  registerSiteAdapter('site-specific-test', SpecificApi);
  const adapter = createAdapter({ sourceId: 'site-specific-test', method: 'api' });
  const rows = await adapter.parse(Buffer.from(JSON.stringify({ items: [{ heading: 'Synthetic site shape', link: 'https://example.test/item' }] })));
  assert.equal(adapter.validate(adapter.normalize(rows[0])).title, 'Synthetic site shape');
  assert.throws(() => registerSiteAdapter('invalid', class {}), /implement/);
});
test('reviewed notices preserve approved content until the changed version is explicitly reviewed', async () => {
  const store = await storeWithSource(); const value = candidate({ id: 'notice-review' });
  await ingest(store, 'Notice', value);
  const initial = await store.get('Notice', value.id);
  const decision = { status: 'SOURCE_VERIFIED_FACT', reviewer: 'Synthetic reviewer', evidence: 'Synthetic clause', clauseRefs: ['1'] };
  await review(store, 'Notice', value.id, { ...decision, versionId: initial.currentVersionId });
  await ingest(store, 'Notice', { ...value, original: { description: 'Changed raw text' }, normalized: { description: 'Changed text' } });
  const staged = await store.get('Notice', value.id);
  assert.equal(staged.status, 'REVIEW_REQUIRED'); assert.equal(staged.normalized.description, value.normalized.description);
  await review(store, 'Notice', value.id, { ...decision, versionId: staged.currentVersionId });
  const reviewed = await store.get('Notice', value.id);
  assert.equal(reviewed.normalized.description, 'Changed text'); assert.equal(reviewed.original.description, 'Changed raw text');
});
