import { randomUUID } from 'node:crypto';
import { createAdapter } from '../../adapters/index.js';
import { authorize } from './access.js';
import { SafeHttp } from './http.js';
import { counters, addCounters } from '../changeDetection/ingest.js';
import { scopedStore } from './store.js';
import {hash} from '../../utils/hash.js';
import {incrementalContract,incrementalUrl,atPath} from './incremental.js';
import {stableId} from '../../utils/hash.js';

export async function collect(store, sources, { offline = false, dryRun = false, enableLive = false, fixtureRoot,
  http = new SafeHttp(), concurrency = 2, maxRecords=10000, beforeCommit = async () => {}, onProgress = async () => {}, shouldCancel = async () => false } = {}) {
  if(!Number.isInteger(maxRecords)||maxRecords<1||maxRecords>10000)throw Error('Invalid bounded record limit');
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
          if (!registered || registered.authorizationStatus !== 'APPROVED' || hash(registered.approval)!==hash(authorize(source,source.url,source.method))) {
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
        const incremental=incrementalContract(source);if(incremental&&offline)throw Error('Incremental network traversal is tested through injected transport, not a repeated single fixture');
        const registered=await store.get('Source',source.sourceId),priorState=registered?.incrementalState;
        const since=incremental&&priorState?.contractHash===hash(incremental)?priorState.since:null;
        let cursor,offset=0,watermark=since,firstUrl=source.url,pagesFetched=0,parsedRecords=0,truncated=false;
        const seen=new Set(),urls=incremental?[incrementalUrl(source,incremental,{since})]:[...adapter.discover()];
        for (let page=0;page<urls.length;page++) {const url=urls[page];if(page===0)firstUrl=url;
          if(seen.has(url))throw Error('Pagination repeated a cursor or URL');seen.add(url);
          if(incremental){if(page>=incremental.maxPages)throw Error('Incremental page limit reached; checkpoint retained');http.validators?.delete(url);}
          if (await shouldCancel()) throw new Error('Cancelled');
          await onProgress('Fetching source', id,{stage:'FETCHING',sourceId:source.sourceId,sourceUrl:url});
          const body = await adapter.fetch(url);
          await onProgress('HTTP response received',id,{stage:'FETCHED',sourceId:source.sourceId,sourceUrl:url,httpStatus:http.responses?.get(url)?.status||null,responseTimeMs:http.responses?.get(url)?.responseTimeMs??null});
          pagesFetched++;
          if (body === null && http.responses?.get(url)?.status === 304) {if(incremental)throw Error('A page-level 304 cannot confirm a complete incremental traversal');continue;}
          const records = await adapter.parse(body);
          parsedRecords+=records.length;
          await onProgress('Source parsed',id,{stage:'EXTRACTED',sourceId:source.sourceId,sourceUrl:url,parsedRecords:records.length});
          // Validate the entire batch before its first write.
          if(incremental&&staged.length+records.length>maxRecords)throw Error('Incremental record limit reached; checkpoint retained');
          const selected=records.slice(0,Math.max(0,maxRecords-staged.length));if(selected.length<records.length)truncated=true;
          staged.push(...selected.map(raw => {
            const value=adapter.normalize(raw);
            value.original={...value.original,collectionProvenance:{mode:offline?'FIXTURE':'LIVE',sourceId:source.sourceId,sourceUrl:url,fetchedAt:new Date().toISOString(),runId:id,synthetic:offline,rawRecordHash:hash(raw),etag:http.responses?.get(url)?.etag||null,lastModified:http.responses?.get(url)?.lastModified||null}};
            return adapter.validate(value);
          }));
          if(staged.length>10000)throw Error('Bounded record staging limit reached');
          if(truncated)break;
          if(incremental){const json=JSON.parse(body.toString('utf8'));if(incremental.watermarkPath){const observed=atPath(json,incremental.watermarkPath);if(typeof observed!=='string'||Number.isNaN(Date.parse(observed)))throw Error('Documented API watermark missing or invalid');if(watermark&&new Date(observed)<new Date(watermark))throw Error('API watermark moved backwards');watermark=new Date(observed).toISOString();}
            if(incremental.mode==='CURSOR'){const next=atPath(json,incremental.nextCursorPath);if(next!==null&&next!==undefined&&next!==''){if(typeof next!=='string'||next.length>512||/[\r\n]/.test(next))throw Error('Invalid pagination cursor');cursor=next;urls.push(incrementalUrl(source,incremental,{since,cursor}));}}
            else if(records.length===incremental.pageSize){offset+=incremental.pageSize;urls.push(incrementalUrl(source,incremental,{since,offset}));}
          }
        }
        await onProgress('Source records validated; review requirements retained',id,{stage:'VALIDATED',sourceId:source.sourceId,validatedRecords:staged.length,contentScope:staged[0]?.original?.collectionScope||null,automaticApproval:false});
        const committed = await store.transaction(async session => {
          await beforeCommit(session);
          const scoped = scopedStore(store, session);
          const tally = counters(),classifications={NEW:0,UNCHANGED:0,UPDATED:0,NEEDS_IDENTITY_REVIEW:0},observedSchemeIds=[];
          for (const value of staged){const result=await adapter.stage(scoped,value);addCounters(tally,result);if(result.classification)classifications[result.classification]++;if(result.schemeId)observedSchemeIds.push(result.schemeId);}
          if(source.entityType==='Scheme'&&http.responses?.get(firstUrl)?.status===304){const ids=new Set(registered?.httpCache?.schemeIds||[]);for(const schemeId of ids){const scheme=await scoped.get('Scheme',schemeId);if(!scheme)continue;const checkedAt=new Date().toISOString();await scoped.touch('Scheme',schemeId,{lastCheckedAt:checkedAt,lastCollectionStatus:'UNCHANGED',lastCollectionSourceId:source.sourceId,lastCollectionRunId:id});await scoped.put('CollectionObservation',{id:stableId('observation',[id,source.sourceId,schemeId,'304']),original:{notModified:true},sourceId:source.sourceId,runId:id,schemeId,title:scheme.title,recordKey:schemeId,classification:'UNCHANGED',sourceUrl:scheme.sourceUrl,sourceVersionId:scheme.currentVersionId,checkedAt});tally.unchanged++;classifications.UNCHANGED++;}}
          const dbSource = await scoped.get('Source', source.sourceId);
          const response=http.responses?.get(firstUrl);
          await scoped.put('Source', { ...dbSource, lastSuccessfulCollection: new Date().toISOString(), lastCollectionError: undefined, ...(!incremental&&response?.status===200?{httpCache:truncated||response.url&&response.url!==source.url?undefined:{url:source.url,etag:response.etag,lastModified:response.lastModified,...(source.entityType==='Scheme'?{schemeIds:[...new Set(observedSchemeIds)]}:{})}}:{}),...(incremental?{incrementalState:{contractHash:hash(incremental),since:watermark||null,completedAt:new Date().toISOString(),pagesFetched}}:{}) });
          await beforeCommit(session);
          return {tally,classifications};
        });
        addCounters(run.counters, committed.tally);
        await onProgress('Records staged; no automatic publication',id,{stage:'STAGED',sourceId:source.sourceId,newRecords:committed.tally.created,updatedRecords:committed.tally.updated,unchangedRecords:committed.tally.unchanged,reviewItems:committed.tally.reviewItems,published:0});
        const response=http.responses?.get(firstUrl);
        run.counters.successful++; run.sources.push({ sourceId: source.sourceId, status: 'SUCCESS', records: staged.length,
          classifications:committed.classifications,pagesFetched,parsedRecords,truncated,
          ...(!offline&&response?{httpStatus:response.status,responseTimeMs:response.responseTimeMs??null,responseBytes:response.responseBytes??null,notModified:response.status===304}: {}) });
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
