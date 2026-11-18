import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize, publicAddress, resolvePublic } from '../src/services/ingestion/access.js';
import { SafeHttp } from '../src/services/ingestion/http.js';
import { authorized } from './helpers.js';
test('default deny makes zero DNS lookups and zero external requests', async () => {
  let calls = 0;
  const http = new SafeHttp({ request: async () => { calls++; }, resolve: async () => { calls++; } });
  await assert.rejects(http.fetch({}, 'https://example.test/data', 'html'));
  assert.equal(calls, 0);
});
test('authorization accepts complete scoped approval', () => { assert.ok(authorize(authorized(), 'https://example.test/data/item', 'html')); });
test('disabled, expired, wrong method, private URL and wrong host are denied', () => {
  for (const input of [authorized({ enabled: false }), authorized({ approvalExpiry: '2020-01-01T00:00:00Z' }), authorized({ robotsAllowed: false })]) {
    assert.throws(() => authorize(input, input.url, 'html'));
  }
  assert.throws(() => authorize(authorized(), 'https://example.test/data', 'pdf'));
  for (const url of ['https://other.test/data', 'http://example.test/data', 'https://127.0.0.1/data', 'https://example.test/database', 'https://example.test/data/%2fprivate', 'https://example.test/data?account=x']) {
    assert.throws(() => authorize(authorized(), url, 'html'));
  }
});
test('myScheme and authenticated citizen paths stay excluded', () => {
  const a = authorized({ host: 'search.myscheme.gov.in', url: 'https://search.myscheme.gov.in/data' });
  assert.throws(() => authorize(a, a.url, 'html'), /myScheme/);
  assert.throws(() => authorize(authorized(), 'https://example.test/data/login', 'html'));
});
test('IPv4, IPv6, mapped IPv4, metadata, link local and reserved ranges are blocked', async () => {
  for (const address of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '192.168.1.1', '0.0.0.0', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1']) assert.equal(publicAddress(address), false, address);
  assert.equal(publicAddress('8.8.8.8'), true);
  await assert.rejects(resolvePublic('example.test', async () => [{ address: '8.8.8.8', family: 4 }, { address: '127.0.0.1', family: 4 }]));
});
test('redirect destination is authorized before a second DNS lookup or request', async () => {
  let requests = 0; let dns = 0;
  const http = new SafeHttp({ resolve: async () => { dns++; return { address: '8.8.8.8', family: 4 }; },
    request: async () => { requests++; return { status: 302, location: 'https://127.0.0.1/private', body: Buffer.alloc(0) }; } });
  await assert.rejects(http.fetch(authorized(), 'https://example.test/data', 'html'));
  assert.equal(requests, 1); assert.equal(dns, 1);
});
test('HTTP retries are bounded, rate spaced and request budget enforced', async () => {
  let requests = 0; let time = Date.now(); const delays = [];
  const http = new SafeHttp({ now: () => time, wait: async ms => { delays.push(ms); time += ms; },
    resolve: async () => ({ address: '8.8.8.8', family: 4 }),
    request: async () => ({ status: ++requests < 3 ? 429 : 200, body: Buffer.from('ok') }) });
  assert.equal((await http.fetch(authorized(), 'https://example.test/data', 'html')).toString(), 'ok');
  assert.equal(requests, 3); assert.ok(delays.reduce((a, b) => a + b, 0) >= 2000);
  const a = authorized({ sourceId: 'limited', rateLimit: { minIntervalMs: 1000, maxRequests: 1 } });
  await http.fetch(a, a.url, 'html'); await assert.rejects(http.fetch(a, a.url, 'html'), /budget/);
});
test('timeout failures retry finitely and oversized responses fail safely', async () => {
  let attempts = 0;
  const options = { resolve: async () => ({ address: '8.8.8.8', family: 4 }), wait: async () => {} };
  const http = new SafeHttp({ ...options, request: async () => { attempts++; throw new Error('Timeout'); } });
  await assert.rejects(http.fetch(authorized(), 'https://example.test/data', 'html')); assert.equal(attempts, 3);
  const small = new SafeHttp({ ...options, maxBytes: 2, request: async () => ({ status: 200, body: Buffer.from('large') }) });
  await assert.rejects(small.fetch(authorized(), 'https://example.test/data', 'html'), /byte limit/);
});
