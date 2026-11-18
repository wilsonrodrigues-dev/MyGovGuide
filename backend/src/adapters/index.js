import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import Parser from 'rss-parser';
import { PDFParse } from 'pdf-parse';
import { z } from 'zod';
import { normalize, canonicalUrl } from '../services/normalization/index.js';
import { record } from '../validators/contracts.js';
import { stableId } from '../utils/hash.js';
import { ingest } from '../services/changeDetection/ingest.js';

const collected = z.object({ id: z.string().optional(), title: z.string().min(1), sourceUrl: z.string().url(),
  description: z.string().optional() }).passthrough();
class Adapter {
  constructor(source, { http, fixtureRoot } = {}) { this.source = source; this.http = http; this.fixtureRoot = fixtureRoot; }
  discover() { return [this.source.url]; }
  async fetch(url) {
    if (!this.source.fixture) return this.http.fetch(this.source, url, this.source.method);
    const root = await realpath(this.fixtureRoot);
    const file = await realpath(path.resolve(root, this.source.fixture));
    if (!file.startsWith(`${root}${path.sep}`)) throw new Error('Fixture path is outside fixture root');
    return readFile(file);
  }
  normalize(raw) {
    collected.parse(raw);
    return {
      id: raw.id || stableId('collected', [this.source.sourceId, canonicalUrl(raw.sourceUrl)]), title: raw.title,
      sourceIds: [this.source.sourceId], sourceUrl: canonicalUrl(raw.sourceUrl), original: raw,
      normalized: normalize(raw), status: 'RESEARCH_ONLY'
    };
  }
  validate(value) { return record.parse(value); }
  stage(store, value) {
    const type = this.source.entityType || 'Notice';
    const extra = type === 'Scheme' ? { state: value.normalized.state, governmentLevel: value.normalized.governmentLevel,
      beneficiaryCategories: value.normalized.beneficiaryCategories, programmeType: value.normalized.programmeType,
      historicalAliases:value.original.historicalAliases||value.original.aliases||[],originalText:value.original.originalClauses||value.original.originalText||value.normalized.description,
      benefits:value.normalized.benefits,requiredDocuments:value.normalized.requiredDocuments,applicationInfo:value.normalized.applicationInfo } :
      type === 'FormTemplate' ? { formKind: value.original.formKind, observedFields: value.original.observedFields || [] } :
      type === 'ScamAlert' ? { recordType: value.original.recordType } : {};
    return ingest(store, type, value, extra);
  }
}
export class ApiAdapter extends Adapter {
  parse(buffer) {
    const data = JSON.parse(buffer.toString('utf8'));
    return z.array(collected).parse(Array.isArray(data) ? data : data.records);
  }
}
export class RssAdapter extends Adapter {
  async parse(buffer) {
    const xml = buffer.toString('utf8');
    if (/<!DOCTYPE|<!ENTITY/i.test(xml)) throw new Error('XML entity declarations are not accepted');
    const feed = await new Parser().parseString(xml);
    return feed.items.map(item => ({ title: item.title, sourceUrl: item.link,
      description: item.contentSnippet || item.content || item.summary || '',
      observedPublicationDate: item.isoDate || item.pubDate || null }));
  }
}
// Candidate parser only. Registering a parser never authorizes a network request.
// Activation remains blocked until endpoint access/robots evidence is established.
export class PibRssAdapter extends RssAdapter {
  stage(store,value) { return ingest(store,'Notice',value); }
  async parse(buffer) {
    const items = await super.parse(buffer);
    if (!items.length) throw new Error('PIB feed has no release items');
    return items.map(item => {
      const url = new URL(item.sourceUrl);
      if (url.protocol !== 'https:' || !['www.pib.gov.in', 'pib.gov.in'].includes(url.hostname) || url.pathname.toLowerCase() !== '/pressreleasepage.aspx' || !/^\d+$/.test(url.searchParams.get('PRID') || '')) throw new Error('PIB release identity mismatch');
      const releaseId = url.searchParams.get('PRID');
      // Preserve the observed link/date, use the official release identity across feed editions.
      return { ...item, id: `pib-release-${releaseId}`, officialReleaseId: releaseId, publisher: 'Press Information Bureau', feedUrl: this.source.url, rightsAttribution: 'Press Information Bureau, Government of India', collectionScope: 'Feed metadata only; linked documents are not fetched' };
    });
  }
}
// The department expressly offers these endpoints to RSS readers. This adapter
// validates feed identity only; every request still needs the normal approval.
export class IncomeTaxRssAdapter extends RssAdapter {
  stage(store,value) { return ingest(store,'Notice',value); }
  async parse(buffer) {
    const items=await super.parse(buffer);
    if(!items.length)throw new Error('Income Tax RSS has no release items');
    return items.map(item=>{
      const url=new URL(item.sourceUrl),assetId=url.searchParams.get('p_r_p_assetEntryId');
      if(url.protocol!=='https:'||url.hostname!=='www.incometaxindia.gov.in'||url.username||url.password||!url.pathname.startsWith('/press-release-rss-feed/-/asset_publisher/')||!/^\d+$/.test(assetId||''))throw new Error('Income Tax release identity mismatch');
      const published=new Date(item.observedPublicationDate);
      if(!item.observedPublicationDate||Number.isNaN(published.valueOf()))throw new Error('Income Tax feed publication date missing or invalid');
      return {...item,id:`cbdt-release-${assetId}`,officialReleaseId:assetId,observedPublicationDate:published.toISOString(),publisher:'Income Tax Department, Ministry of Finance, Government of India',rightsAttribution:'Source: Income Tax Department, Government of India (incometaxindia.gov.in)',feedUrl:this.source.url,collectionScope:'Published RSS metadata only; no linked article/image fetch',freshnessNote:'Fetch time is not publication time; old feed entries require currentness review.'};
    });
  }
}
export class SachetRssAdapter extends RssAdapter {
  stage(store,value) { return ingest(store,'Notice',value); }
  async parse(buffer) {
    const items=await super.parse(buffer);
    if(!items.length)throw new Error('Sachet RSS contains no alerts');
    return items.map(item=>{
      const url=new URL(item.sourceUrl),identifier=url.searchParams.get('identifier');
      if(url.protocol!=='https:'||url.hostname!=='sachet.ndma.gov.in'||url.username||url.password||url.pathname!=='/cap_public_website/FetchXMLFile'||!/^\d{10,24}$/.test(identifier||''))throw new Error('Sachet alert identity mismatch');
      const published=new Date(item.observedPublicationDate);if(!item.observedPublicationDate||Number.isNaN(published.valueOf()))throw new Error('Sachet publication date missing or invalid');
      return {...item,id:`ndma-alert-${identifier}`,officialAlertId:identifier,observedPublicationDate:published.toISOString(),publisher:'National Disaster Management Authority, Government of India',rightsAttribution:'Source: NDMA SACHET; original issuing authority as identified in the alert',feedUrl:this.source.url,collectionScope:'RSS headline/summary/date/link only; CAP documents and images are not fetched',freshnessNote:'Not a verified active warning. Publication date and current validity must be reviewed; do not issue public safety advice from this stored feed snapshot.'};
    });
  }
}
export class HtmlAdapter extends Adapter {
  parse(buffer) {
    const $ = load(buffer.toString('utf8'));
    $('script,style,nav,footer,header').remove();
    const options = this.source.adapterOptions || {};
    const nodes = $(options.recordSelector || 'article');
    if (!nodes.length) throw new Error('Expected HTML record section missing');
    return nodes.toArray().map(node => {
      const el = $(node);
      return { title: el.find(options.titleSelector || 'h1,h2').first().text().trim(),
        sourceUrl: new URL(el.find('a').first().attr('href') || this.source.url, this.source.url).href,
        description: el.find(options.contentSelector || 'p').text().replace(/\s+/gu, ' ').trim() };
    });
  }
}
export class PdfAdapter extends Adapter {
  async parse(buffer) {
    if (buffer.subarray(0, 5).toString() !== '%PDF-') throw new Error('Invalid PDF signature');
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    try {
      const result = await parser.getText();
      const description = result.text.trim();
      if (!description) throw new Error('PDF has no extractable text; OCR is outside Phase 2');
      return [{ title: this.source.title || 'Document requiring review', sourceUrl: this.source.url, description }];
    } finally { await parser.destroy(); }
  }
}
export const adapterTypes = { api: ApiAdapter, rss: RssAdapter, html: HtmlAdapter, pdf: PdfAdapter };
const siteAdapters = new Map();
export function registerSiteAdapter(sourceId, AdapterClass) {
  for (const method of ['discover', 'fetch', 'parse', 'normalize', 'validate', 'stage']) {
    if (typeof AdapterClass.prototype[method] !== 'function') throw new Error(`Adapter must implement ${method}`);
  }
  siteAdapters.set(sourceId, AdapterClass);
}
export function createAdapter(source, options) {
  const registered=siteAdapters.get(source.sourceId);
  if(registered)return new registered(source,options);
  const host=source.method==='rss'?new URL(source.url).hostname:'';
  const Ctor = source.method==='rss'&&host==='sachet.ndma.gov.in'?SachetRssAdapter:source.method==='rss'&&host==='www.incometaxindia.gov.in'?IncomeTaxRssAdapter:source.method === 'rss' && ['www.pib.gov.in', 'pib.gov.in'].includes(host) ? PibRssAdapter : adapterTypes[source.method];
  if (!Ctor) throw new Error('Unsupported adapter type');
  return new Ctor(source, options);
}
