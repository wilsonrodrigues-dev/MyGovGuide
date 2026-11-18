import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createAdapter,IncomeTaxRssAdapter,SachetRssAdapter} from '../src/adapters/index.js';
import {MemoryStore} from '../src/services/ingestion/store.js';
const ndma={sourceId:'recorded-ndma',url:'https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml',method:'rss',entityType:'Scheme'};
const tax={sourceId:'recorded-cbdt',url:'https://www.incometaxindia.gov.in/press-release-rss-feed/-/asset_publisher/bxhj/rss',method:'rss',entityType:'Scheme'};
const capture=name=>readFile(new URL('../fixtures/captured/'+name,import.meta.url));
test('recorded genuine NDMA RSS parses stable official IDs and observed dates; replay is not a live request',async()=>{
 const adapter=createAdapter(ndma);assert.ok(adapter instanceof SachetRssAdapter);
 const rows=await adapter.parse(await capture('ndma-2026-11-18.xml'));assert.equal(rows.length,100);assert.equal(new Set(rows.map(x=>x.id)).size,100);
 assert.match(rows[0].observedPublicationDate,/^2026-11-/);assert.match(rows[0].freshnessNote,/Not a verified active warning/);
 assert.deepEqual(adapter.discover(),[ndma.url],'Only the approved feed is discovered, not CAP document links');
 const store=new MemoryStore();await store.put('Source',{id:ndma.sourceId,title:'Recorded RSS parser test only',url:ndma.url,host:'sachet.ndma.gov.in',original:{recordedReplay:true}});
 const value=adapter.validate(adapter.normalize(rows[0]));await adapter.stage(store,value);const repeat=await adapter.stage(store,value);
 assert.equal((await store.list('Notice')).length,1);assert.equal((await store.list('Scheme')).length,0);assert.equal((await store.list('SourceVersion')).length,1);assert.equal(repeat.unchanged,1);
});
test('recorded tax RSS uses official asset IDs and keeps old publication dates instead of relabeling as current',async()=>{
 const adapter=createAdapter(tax);assert.ok(adapter instanceof IncomeTaxRssAdapter);const rows=await adapter.parse(await capture('cbdt-2026-11-18.xml'));
 assert.equal(rows.length,10);assert.match(rows[0].id,/^cbdt-release-\d+$/);assert.match(rows[0].observedPublicationDate,/^2025-/);assert.match(rows[0].rightsAttribution,/Income Tax/);
});
test('official RSS parsers reject external identities, missing dates and XML entity declarations',async()=>{
 const ndmaXml=(await capture('ndma-2026-11-18.xml')).toString(),taxXml=(await capture('cbdt-2026-11-18.xml')).toString();
 await assert.rejects(createAdapter(ndma).parse(Buffer.from(ndmaXml.replaceAll('https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile','https://evil.example/cap_public_website/FetchXMLFile'))),/identity/);
 await assert.rejects(createAdapter(tax).parse(Buffer.from(taxXml.replaceAll('https://www.incometaxindia.gov.in/press-release-rss-feed','https://evil.example/press-release-rss-feed'))),/identity/);
 await assert.rejects(createAdapter(ndma).parse(Buffer.from('<!DOCTYPE rss>'+ndmaXml)),/entity/);
 await assert.rejects(createAdapter(ndma).parse(Buffer.from(ndmaXml.replace(/<pubDate>[^<]*<\/pubDate>/g,'<pubDate>invalid</pubDate>'))),/date/);
});
