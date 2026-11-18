import test from 'node:test';
import assert from 'node:assert/strict';
import { PibRssAdapter } from '../src/adapters/index.js';
import { SafeHttp } from '../src/services/ingestion/http.js';
import { authorized } from './helpers.js';
import { MemoryStore } from '../src/services/ingestion/store.js';
const source = { sourceId: 'N02', method: 'rss', url: 'https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=1' };
const feed = link => Buffer.from(`<?xml version="1.0"?><rss version="2.0"><channel><title>SYNTHETIC PIB FORMAT TEST</title><link>https://www.pib.gov.in/</link><description>Synthetic</description><item><title>Synthetic test release</title><link>${link.replaceAll('&', '&amp;')}</link><description>Synthetic description</description><pubDate>Tue, 17 Nov 2026 09:00:00 GMT</pubDate></item></channel></rss>`);
test('candidate PIB parser preserves release identity, dates and document link without fetching linked pages', async () => {
  const adapter = new PibRssAdapter(source); const url = 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=123&lang=1';
  const [raw] = await adapter.parse(feed(url)); assert.equal(raw.id, 'pib-release-123'); assert.equal(raw.sourceUrl, url);
  assert.equal(raw.observedPublicationDate, '2026-11-17T09:00:00.000Z'); assert.equal(adapter.normalize(raw).status, 'RESEARCH_ONLY');
  assert.equal(raw.feedUrl, source.url); assert.match(raw.rightsAttribution, /Press Information Bureau/);
  for (const link of ['https://evil.example/PressReleasePage.aspx?PRID=123', 'https://www.pib.gov.in/login', 'http://www.pib.gov.in/PressReleasePage.aspx?PRID=123']) await assert.rejects(adapter.parse(feed(link)), /identity/);
  await assert.rejects(adapter.parse(Buffer.from('<html>Unavailable</html>')));
});
test('server Retry-After is respected and a long cooldown stops retries', async () => {
  let calls = 0, now = Date.now(); const delays = [];
  const http = new SafeHttp({ now: () => now, wait: async ms => { delays.push(ms); now += ms; }, resolve: async () => ({ address: '8.8.8.8', family: 4 }), request: async () => ({ status: ++calls === 1 ? 429 : 200, retryAfter: '15', body: Buffer.from('ok') }) });
  await http.fetch(authorized(), 'https://example.test/data', 'html'); assert.ok(delays.includes(15000)); assert.equal(calls, 2);
  let attempts = 0;
  const blocked = new SafeHttp({ resolve: async () => ({ address: '8.8.8.8', family: 4 }), request: async () => { attempts++; return { status: 429, retryAfter: '3600', body: Buffer.alloc(0) }; } });
  await assert.rejects(blocked.fetch(authorized(), 'https://example.test/data', 'html'), /cooldown/); assert.equal(attempts, 1);
});
test('PIB releases remain notices even when an operator selects Scheme entity type',async()=>{
 const store=new MemoryStore();await store.put('Source',{id:'N02',title:'SYNTHETIC PIB source test',url:source.url,host:'www.pib.gov.in',original:{synthetic:true}});
 const adapter=new PibRssAdapter({...source,entityType:'Scheme'});const [raw]=await adapter.parse(feed('https://www.pib.gov.in/PressReleasePage.aspx?PRID=123'));
 await adapter.stage(store,adapter.validate(adapter.normalize(raw)));assert.equal((await store.list('Scheme')).length,0);assert.equal((await store.list('Notice')).length,1);
});
test('conditional requests preserve validators and 304 never fabricates new records',async()=>{
  const a=authorized(),requests=[];
  const http=new SafeHttp({resolve:async()=>({address:'8.8.8.8',family:4}),request:async(_url,_ip,options)=>{requests.push(options.headers);return {status:304,etag:'"abc"',lastModified:'Tue, 17 Nov 2026 09:00:00 GMT',body:Buffer.alloc(0)};}});
  http.validators.set(a.url,{etag:'"abc"',lastModified:'Tue, 17 Nov 2026 09:00:00 GMT'});
  assert.equal(await http.fetch(a,a.url,'html'),null);assert.equal(requests[0]['If-None-Match'],'"abc"');assert.equal(http.responses.get(a.url).status,304);
});
