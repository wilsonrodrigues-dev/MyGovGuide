import { randomUUID } from 'node:crypto';
import { createAdapter } from '../../adapters/index.js';
import { authorize } from './access.js';
import { SafeHttp } from './http.js';
import { counters, addCounters } from '../changeDetection/ingest.js';
import { scopedStore } from './store.js';
import {hash} from '../../utils/hash.js';

export async function collect(store, sources, { offline = false, dryRun = false, enableLive = false, fixtureRoot,
  http = new SafeHttp(), concurrency = 2, beforeCommit = async () => {}, onProgress = async () => {}, shouldCancel = async () => false } = {}) {
  const id = `run-${randomUUID()}`;
  const run = { id, original: {}, mode: dryRun ? 'DRY_RUN' : offline ? 'FIXTURES' : 'ONLINE',
    startedAt: new Date().toISOString(), counters: counters(), sources: [], runErrors: [] };
  if (!dryRun) await store.put('IngestionRun', run);
  await onProgress('Preparing collection', id);
  let next = 0;
  async function worker() {
    while (next < sources.length) {
      const source = sources[next++];
      if (await shouldCancel()) break;
      try {
        if (!offline && !dryRun && enableLive) {
          const registered = await store.get('Source', source.sourceId);
          if (registered?.httpCache?.url === source.url && http.validators) http.validators.set(source.url, registered.httpCache);
          if (!registered || registered.authorizationStatus !== 'APPROVED' || registered.approval?.approvalEvidence !== source.approvalEvidence) {
            run.counters.skipped++; run.sources.push({ sourceId: source.sourceId, status: 'SKIPPED', reason: 'Database source authorization does not match reviewed approval' }); continue;
          }
        }
        if (!offline) {
          if (!enableLive) throw new Error('Live collection disabled by configuration');
          authorize(source, source.url, source.method);
        } else if (!source.fixture || !fixtureRoot) throw new Error('Offline source requires a local fixture');
      } catch (error) {
        run.counters.skipped++; run.sources.push({ sourceId: source.sourceId, status: 'SKIPPED', reason: error.message }); continue;
      }
      if (dryRun) { run.sources.push({ sourceId: source.sourceId, status: 'WOULD_PROCESS', reason: 'Configuration gate passed; database approval must also match before live collection' }); continue; }
      try {
        // An approval file cannot create an official source identity by itself.
        if (!await store.get('Source', source.sourceId)) {
          if (!offline) throw new Error('Approved source is missing from database registry');
          await store.put('Source', { id: source.sourceId, title: source.title || 'SYNTHETIC fixture source',
            url: source.url, host: new URL(source.url).hostname, original: { synthetic: true },
            collectionMethod: 'offline' });
        }
        const adapter = createAdapter(source, { http, fixtureRoot });
        const staged = [];
        for (const url of adapter.discover()) {
          if (await shouldCancel()) throw new Error('Cancelled');
          await onProgress('Fetching and parsing source', id);
          const body = await adapter.fetch(url);
          if (body === null && http.responses?.get(url)?.status === 304) continue;
          const records = await adapter.parse(body);
          // Validate the entire batch before its first write.
          staged.push(...records.map(raw => {
            const value=adapter.normalize(raw);
            value.original={...value.original,collectionProvenance:{mode:offline?'FIXTURE':'LIVE',sourceId:source.sourceId,sourceUrl:url,fetchedAt:new Date().toISOString(),runId:id,synthetic:offline,rawRecordHash:hash(raw),etag:http.responses?.get(url)?.etag||null,lastModified:http.responses?.get(url)?.lastModified||null}};
            return adapter.validate(value);
          }));
        }
        const sourceCounters = await store.transaction(async session => {
          await beforeCommit(session);
          const scoped = scopedStore(store, session);
          const tally = counters();
          for (const value of staged) addCounters(tally, await adapter.stage(scoped, value));
          const dbSource = await scoped.get('Source', source.sourceId);
          const response=http.responses?.get(source.url);
          await scoped.put('Source', { ...dbSource, lastSuccessfulCollection: new Date().toISOString(), lastCollectionError: undefined, ...(response?.status===200?{httpCache:response.url&&response.url!==source.url?undefined:{url:source.url,etag:response.etag,lastModified:response.lastModified}}:{}) });
          await beforeCommit(session);
          return tally;
        });
        addCounters(run.counters, sourceCounters);
        const response=http.responses?.get(source.url);
        run.counters.successful++; run.sources.push({ sourceId: source.sourceId, status: 'SUCCESS', records: staged.length,
          ...(!offline&&response?{httpStatus:response.status,responseBytes:response.responseBytes??null,notModified:response.status===304}: {}) });
      } catch (error) {
        const httpStatus=/Collection HTTP status (\d{3})/.exec(error.message||'')?.[1];
        const reason=httpStatus?`Collection HTTP ${httpStatus}; no bypass attempted`:'Collection or staging failed; see validation and source configuration';
        run.counters.failed++; run.sources.push({ sourceId: source.sourceId, status: 'FAILED', reason });
        // A cancelled or obsolete worker must not overwrite current source metadata.
        try {
          await store.transaction(async session => {
            await beforeCommit(session);
            const dbSource = await store.get('Source', source.sourceId, session);
            if (dbSource) await store.put('Source', { ...dbSource, lastCollectionError: httpStatus?reason:'Collection failed; previous data retained' }, session);
          });
        } catch { /* Retain metadata on cancellation, lease loss or database failure. */ }
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(Math.max(1, concurrency), 4) }, worker));
  run.finishedAt = new Date().toISOString();
  run.outcome = run.counters.failed ? (run.counters.successful ? 'PARTIAL' : 'FAILED') : run.counters.successful ? 'SUCCESS' : 'NO_OP';
  if (!dryRun) await store.put('IngestionRun', run);
  return run;
}
