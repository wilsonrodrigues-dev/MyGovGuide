import test from 'node:test';
import {mockPublicationSnapshot} from '../support/publicationSnapshot.js';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from '../../src/app.js';
import { AnonymousSession } from '../../src/models/AnonymousSession.js';
import { connectDB, disconnectDB, requireTransactions } from '../../src/config/db.js';
import { serverRoot } from '../../src/config/env.js';
import { models, initModels } from '../../src/models/index.js';
import { MongoStore } from '../../src/services/ingestion/store.js';
import { ingest } from '../../src/services/changeDetection/ingest.js';
import { digest } from '../../src/middleware/citizenSecurity.js';
const uri = process.env.MONGODB_TEST_URI;
test('secure anonymous profile API against native MongoDB', { skip: !uri && 'Set MONGODB_TEST_URI to the existing local replica set test URI' }, async t => {
  const url = new URL(uri); assert.match(url.pathname, /^\/mygovguide_phase2_test(?:_[\w-]+)?$/);
  url.pathname = `/mygovguide_phase2_test_profiles_${Date.now()}`;
  await connectDB(url.href); await requireTransactions(); await initModels();
  const server = app.listen(0, '127.0.0.1'); await new Promise(r => server.once('listening', r));
  const base = `http://127.0.0.1:${server.address().port}`; const results = [];
  async function call(route, { cookie, body, method = 'GET', origin } = {}) {
    return fetch(`${base}/api${route}`, { method, headers: { ...(cookie ? { Cookie: cookie } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}), ...(origin ? { Origin: origin } : {}) }, body: body !== undefined ? JSON.stringify(body) : undefined });
  }
  async function session() { const response = await call('/session', { method: 'POST', body: {} }); assert.equal(response.status, 201); return { cookie: response.headers.get('set-cookie').split(';')[0], ...(await response.json()), header: response.headers.get('set-cookie') }; }
  let a, b;
  try {
    await t.test('creates opaque HttpOnly sessions and stores only a token hash', async () => {
      a = await session(); b = await session(); assert.notEqual(a.cookie, b.cookie);
      assert.match(a.header, /HttpOnly/i); assert.match(a.header, /SameSite=Strict/i); assert.match(a.header, /Path=\/api/i);
      assert.equal(a.profile, null); assert.ok(!Object.hasOwn(a, 'sessionId'));
      assert.equal(Object.hasOwn(a,'csrfToken'),false);
      const raw = a.cookie.split('=')[1];
      const doc = await AnonymousSession.findOne({ tokenHash: digest(raw) }).select('+tokenHash').lean();
      assert.equal(doc.tokenHash, digest(raw)); assert.notEqual(doc.tokenHash, raw); assert.ok(!Object.hasOwn(doc, 'ip'));
      results.push('opaque cookie and hashed storage: passed');
    });
    await t.test('profile creation, retrieval and repeated session bootstrap retain preferences', async () => {
      const profile = { state: 'Karnataka', category: 'Student', language: 'kn' };
      const saved = await call('/profile', { ...a, method: 'PUT', body: profile }); assert.equal(saved.status, 200);
      assert.deepEqual((await saved.json()).profile, profile);
      assert.deepEqual((await (await call('/profile', a)).json()).profile, profile);
      const reused = await call('/session', { ...a, method: 'POST', body: {} }); assert.equal(reused.status, 200);
      assert.deepEqual((await reused.json()).profile, profile); assert.equal(reused.headers.get('set-cookie'), null);
      const changed = { state: 'Kerala', category: 'Farmer', language: 'hi' };
      await call('/profile', { ...a, method: 'PUT', body: changed });
      assert.deepEqual((await (await call('/profile', a)).json()).profile, changed);
      results.push('save/retrieve/session persistence/state/category/language: passed');
    });
    await t.test('ownership cannot be replaced with client UUIDs or profile IDs', async () => {
      assert.equal((await call('/profile')).status, 401);
      assert.equal((await call('/profile', { cookie: 'mygovguide_session=00000000-0000-0000-0000-000000000000' })).status, 401);
      assert.equal((await (await call('/profile', b)).json()).profile, null);
      assert.equal((await call('/profile', { ...b, method: 'PUT', body: { state: 'Karnataka', category: 'General', language: 'en', sessionId: a.cookie } })).status, 422);
      assert.equal((await call('/profile/someone-else', b)).status, 404);
      assert.equal((await (await call('/profile', a)).json()).profile.state, 'Kerala');
      results.push('ownership and UUID spoofing protection: passed');
    });
    await t.test('cookie-only preference writes succeed; invalid input and disallowed origins fail', async () => {
      const body = { state: 'Kerala', category: 'Farmer', language: 'hi' };
      assert.equal((await call('/profile', { cookie: a.cookie, method: 'PUT', body })).status, 200);
      assert.equal((await call('/profile', { method: 'PUT', body })).status, 401);
      assert.equal(Object.hasOwn(await(await call('/session',a)).json(),'csrfToken'),false);
      assert.equal((await call('/profile', { ...a, origin: 'https://attacker.invalid', method: 'PUT', body })).status, 403);
      assert.equal((await call('/session', { origin: 'https://attacker.invalid', method: 'POST', body: {} })).status, 403);
      assert.equal((await call('/profile', { ...a, method: 'PUT', body: { ...body, state: 'invalid' } })).status, 422);
      const cors = await call('/profile', { ...a, origin: 'http://127.0.0.1:5173' });
      assert.equal(cors.headers.get('access-control-allow-origin'), 'http://127.0.0.1:5173');
      assert.equal(cors.headers.get('access-control-allow-credentials'), 'true');
      results.push('cookie-only writes, validation and explicit CORS: passed');
    });
    await t.test('previews exclude research, withdrawn, stale and mismatched schemes', async () => {
      const store = new MongoStore();
      await store.put('Source', { id: 'preview-source', title: 'Mock source snapshot for isolated tests', url: 'https://department.gov.in/projection-test', host: 'department.gov.in', original: { testDouble: 'No network collection; authoritative snapshot mock' } });
      const input = { id: 'preview-scheme', title: 'Mock preview projection', sourceIds: ['preview-source'], sourceUrl: 'https://department.gov.in/projection-test', original: { testDouble: 'No real government data' }, normalized: { description: 'Mock source content for isolated read projection' } };
      await ingest(store, 'Scheme', input, { state: 'Kerala', beneficiaryCategories: ['Farmer'], schemeStatus: 'ACTIVE' });
      assert.equal((await (await call('/schemes/preview', a)).json()).items.length, 0);
      const scheme = await store.get('Scheme', input.id);
      await store.put('Scheme', { ...scheme, status: 'SOURCE_VERIFIED_FACT', publicationStatus: 'PUBLISHED', cacheStale: false,
        approvedVersionId: scheme.currentVersionId, lastHumanReviewAt: new Date(), publicationEvidence: { rightsBasis: 'SYNTHETIC TEST', reviewer: 'Test reviewer', evidence: 'Test evidence only' } });
      assert.equal((await (await call('/schemes/preview', a)).json()).items.length,0,'A legacy publication flag alone is insufficient');
      await mockPublicationSnapshot(await store.get('Scheme',input.id));
      const previews = (await (await call('/schemes/preview', a)).json()).items;
      assert.equal(previews.length, 1); assert.equal(previews[0].eligibilityAvailable, false);
      assert.equal(previews[0].translationUnavailable,true,'Missing Hindi falls back transparently to reviewed English');
      const indexed=(await (await call('/content/search?q=preview&language=en')).json()).items;assert.equal(indexed.length,1);assert.equal(indexed[0].id,input.id);
      const fallbackSearch=(await(await call('/content/search?q=preview&language=kn')).json()).items;
      assert.equal(fallbackSearch.length,1);assert.equal(fallbackSearch[0].language,'en');assert.equal(fallbackSearch[0].requestedLanguage,'kn');assert.equal(fallbackSearch[0].translationUnavailable,true);
      const detail=await (await call(`/content/schemes/${input.id}?language=hi`)).json();assert.equal(detail.translationUnavailable,true);assert.equal(detail.language,'en');assert.equal(detail.source.version,scheme.currentVersionId);
      assert.equal(detail.eligibilityStatus,'OPERATIVE_RULES_INCOMPLETE');assert.equal(detail.eligibilityAvailable,false);assert.equal(detail.scheme.state,'Kerala');
      assert.ok(!Object.hasOwn(previews[0], 'original')); assert.ok(!Object.hasOwn(previews[0], 'publicationEvidence'));
      await call('/profile', { ...b, method: 'PUT', body: { state: 'Karnataka', category: 'Student', language: 'en' } });
      assert.equal((await (await call('/schemes/preview', b)).json()).items.length, 0);
      await store.put('Scheme', { ...(await store.get('Scheme', input.id)), cacheStale: true });
      assert.equal((await (await call('/schemes/preview', a)).json()).items.length, 0);
      assert.equal((await call(`/content/schemes/${input.id}?language=en`)).status,404);
      assert.equal((await(await call('/content/search?q=preview&language=kn')).json()).items.length,0,'English fallback must not expose stale content');
      results.push('published/verified/profile-matched safe preview projection: passed');
    });
    await t.test('catalog pagination covers all published matches, retains filters and General recommendations without eligibility claims',async()=>{
      const store=new MongoStore();for(let i=0;i<5;i++){
        const input={id:'catalog-page-'+i,title:'Mock catalog pagination '+i,sourceIds:['preview-source'],sourceUrl:'https://department.gov.in/projection-test',original:{testDouble:'Isolated pagination contract; not real government content'},normalized:{description:'Mock catalog record for page-boundary checks'}};
        await ingest(store,'Scheme',input,{state:i===3?'All India':i===4?'Kerala':'Karnataka',beneficiaryCategories:[i===1||i===3?'General':i===4?'Worker':'Farmer'],schemeStatus:'ACTIVE'});
        const s=await store.get('Scheme',input.id);await store.put('Scheme',{...s,status:'SOURCE_VERIFIED_FACT',publicationStatus:'PUBLISHED',cacheStale:false,approvedVersionId:s.currentVersionId,lastHumanReviewAt:new Date(),publicationEvidence:{rightsBasis:'Mock rights',reviewer:'Isolated test',evidence:'Mock publication contract only'}});await mockPublicationSnapshot(await store.get('Scheme',input.id));
      }
      const pages=[];for(const page of [1,2,3]){const r=await call('/content/search?q=catalog&language=kn&limit=2&page='+page);assert.equal(r.status,200);const d=await r.json();assert.equal(d.total,5);assert.equal(d.totalPages,3);assert.equal(d.page,page);assert.equal(d.hasNext,page<3);assert.ok(d.items.every(x=>x.translationUnavailable&&x.language==='en'));pages.push(...d.items.map(x=>x.id));}
      assert.equal(new Set(pages).size,5);assert.equal(pages.length,5);
      const filtered=await(await call('/content/search?q=catalog&state=Karnataka&category=Farmer&limit=10')).json();assert.equal(filtered.total,4);assert.ok(filtered.items.every(x=>x.state!=='Kerala'));
      assert.equal((await call('/content/search?page=0')).status,400);
      await call('/profile',{...b,method:'PUT',body:{state:'Karnataka',category:'General',language:'en'}});const recommended=await(await call('/schemes/preview',b)).json();assert.equal(recommended.items.length,4);assert.ok(recommended.items.every(x=>x.eligibilityAvailable===false));assert.equal(recommended.matching.category,'General');
    });
    await t.test('logout and expiry prevent later access even before TTL cleanup', async () => {
      assert.equal((await call('/session', { ...b, method: 'DELETE' })).status, 204);
      assert.equal((await call('/profile', b)).status, 401);
      await AnonymousSession.updateOne({ tokenHash: digest(a.cookie.split('=')[1]) }, { expiresAt: new Date(Date.now() - 1000) });
      assert.equal((await call('/profile', a)).status, 401);
      results.push('revocation and expiry: passed');
    });
    await fs.writeFile(path.join(serverRoot, 'reports/profile-integration.json'), JSON.stringify({ executedAt: new Date().toISOString(), database: url.pathname.slice(1), results }, null, 2));
  } finally { await new Promise(r => server.close(r)); await disconnectDB(); }
});
