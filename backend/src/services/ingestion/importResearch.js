import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { inputFiles, validateRoot, sourceInput, researchInput } from '../../validators/contracts.js';
import { normalize, canonicalUrl } from '../normalization/index.js';
import { hash, stableId } from '../../utils/hash.js';
import { ingest, counters, addCounters } from '../changeDetection/ingest.js';
import { assertPublicResearch, redactPrivate } from '../../validators/privacy.js';

export async function readPackage(directory, { availableOnly = false } = {}) {
  const data = {}; const missing = [];
  for (const file of Object.keys(inputFiles)) {
    try { data[file] = validateRoot(file, JSON.parse(await readFile(path.join(directory, file), 'utf8'))); }
    catch (error) {
      if (error.code === 'ENOENT') missing.push(file);
      else throw new Error(`Invalid input root or JSON in ${file}; package was not imported`);
    }
  }
  if (missing.length && !availableOnly) throw new Error(`Phase 1 input files missing: ${missing.join(', ')}. No substitute research records were generated.`);
  if (!Object.keys(data).length) throw new Error('Phase 1 input files missing: no JSON datasets available.');
  return data;
}
async function upsertSource(store, raw) {
  assertPublicResearch(raw);
  const input = sourceInput.parse(raw);
  const normalized = { title: input.title.trim(), url: canonicalUrl(input.url), host: new URL(input.url).hostname,
    organization: input.organization, sourceType: input.type };
  // Hash omits undefined keys, matching BSON/JSON persistence semantics.
  const contentHash = hash(JSON.parse(JSON.stringify(normalized)));
  return store.transaction(async session => {
    const old = await store.get('Source', input.id, session);
    const tally = counters(); tally.read = 1; tally.pendingReview = 1;
    if (old?.contentHash === contentHash) { tally.unchanged = 1; return tally; }
    await store.put('Source', { id: input.id, ...normalized, original: raw, normalized, contentHash,
      authorizationStatus: 'NOT_AUTHORIZED_FOR_AUTOMATION', collectionMethod: 'offline', status: 'RESEARCH_ONLY',
      revision: (old?.revision || 0) + 1 }, session);
    tally[old ? 'updated' : 'created'] = 1;
    return tally;
  });
}
export async function importResearch(store, directory, { availableOnly = false } = {}) {
  const data = await readPackage(directory, { availableOnly });
  const id = `import-${randomUUID()}`;
  const run = { id, original: { packageHashes: Object.fromEntries(Object.entries(data).map(([k, v]) => [k, hash(v)])) },
    mode: 'IMPORT', startedAt: new Date().toISOString(), counters: counters(), sources: [], runErrors: [] };
  const results = {}; const excluded = data['FORMS_REGISTRY.json']?.brokenLinkDoNotUse || [];
  const missingFiles = Object.keys(inputFiles).filter(f => !data[f]);
  await store.put('IngestionRun', run);
  const groups = [
    ['SOURCE_REGISTRY.json', 'sources', 'Source'], ['VERIFIED_SCHEMES.json', 'schemes', 'Scheme'],
    ['FORMS_REGISTRY.json', 'forms', 'FormTemplate'], ['NOTICES_AND_ALERTS.json', 'notices', 'Notice'],
    ['NOTICES_AND_ALERTS.json', 'scamAwareness', 'ScamAlert']
  ];
  for (const [filename, key, type] of groups) {
    if (!data[filename]) continue;
    const tally = counters();
    for (const [index, raw] of data[filename][key].entries()) {
      try {
        if (type === 'Source') addCounters(tally, await upsertSource(store, { ...raw, title: raw.title || raw.name, url: raw.url || raw.officialUrl }));
        else {
          const url = raw.sourceUrl || raw.officialSourceUrl || raw.officialUrl || raw.primaryOfficialUrl;
          let sourceIds = raw.sourceIds;
          if (!sourceIds) {
            const canonical = canonicalUrl(url);
            const sources = await store.list('Source');
            const matched = sources.filter(s => canonicalUrl(s.url) === canonical).sort((a, b) => a.id.localeCompare(b.id));
            if (matched.length) sourceIds = [matched[0].id];
            else {
              // A URL reference is a real, deny-only source identity. It is labelled
              // separately and never represented as an absent registry entry.
              const sourceId = stableId('reference', canonical);
              await upsertSource(store, { id: sourceId, title: `Research URL reference: ${raw.title}`, url,
                type: 'SUPPLEMENTAL_RESEARCH_REFERENCE', originDataset: filename });
              sourceIds = [sourceId];
            }
          }
          const input = researchInput.parse({ ...raw, sourceIds, sourceUrl: url,
            category: raw.category || raw.primaryCategory, department: raw.department || raw.responsibleAuthority,
            description: raw.description || raw.eligibilityResearchSummary || raw.safetySummary || raw.summaryForResearch || raw.notes || '',
            categories: raw.categories || raw.matchedCategories,
            observedPublicationDate: raw.observedPublicationDate || raw.publishedAt || raw.announcedAt || null,
            benefits: raw.benefits || raw.benefitOrServiceSummary || null,
            historicalAliases: raw.historicalAliases || raw.aliases || [],
            eligibilityConditions: raw.eligibilityConditions || raw.eligibilityResearchSummary || null,
            applicationInfo: raw.applicationInfo || { url: raw.applicationUrl || null, observedWindow: raw.applicationWindow || null }
          });
          const normalized = normalize(input);
          const extra = {};
          if (type === 'Scheme') Object.assign(extra, { state: normalized.state, governmentLevel: normalized.governmentLevel,
            department: normalized.department, beneficiaryCategories: normalized.beneficiaryCategories,
            programmeType: normalized.programmeType, originalText: input.originalText || input.description || '',
            historicalAliases: input.historicalAliases || [], requiredDocuments: normalized.requiredDocuments });
          if (type === 'FormTemplate') {
            const kinds = { public_pdf_form: 'PDF_FORM', authenticated_web_application: 'AUTHENTICATED_PORTAL',
              public_application_guidance: 'INSTRUCTIONS_ONLY', external_financing_application: 'AUTHENTICATED_PORTAL',
              bank_offline_form: 'INSTRUCTIONS_ONLY', form_in_governing_rules: 'INSTRUCTIONS_ONLY', service_directory: 'INSTRUCTIONS_ONLY',
              public_service_entry: 'PUBLIC_APPLICATION_PAGE' };
            extra.formKind = kinds[input.formKind] || input.formKind;
            if (!['PDF_FORM', 'PUBLIC_APPLICATION_PAGE', 'AUTHENTICATED_PORTAL', 'INSTRUCTIONS_ONLY'].includes(extra.formKind)) throw new Error('Explicit form classification required');
            extra.observedFields = input.observedFields || input.fieldNamesObserved || [];
            extra.linkedSchemeIds = input.linkedSchemeIds || (input.schemeId ? [input.schemeId] : []);
            for (const schemeId of extra.linkedSchemeIds) if (!await store.get('Scheme', schemeId)) throw new Error('Unknown form scheme reference');
            extra.officialLinks = [url];
          }
          if (type === 'ScamAlert') {
            extra.recordType = key === 'scamAwareness' ? 'AWARENESS_TOPIC' : input.recordType;
          }
          // Missing dates stay missing; a supplied date is retained as observed research,
          // never converted into an actionable deadline or new incident.
          if (input.schemeId) extra.schemeId = input.schemeId;
          addCounters(tally, await ingest(store, type, { id: input.id, title: normalized.title, sourceIds: input.sourceIds,
            sourceUrl: normalized.sourceUrl, original: { ...raw, packageMetadata: data[filename].metadata }, normalized,
            status: 'RESEARCH_ONLY' }, extra));
        }
      } catch (error) {
        tally.read++; tally.rejected++;
        const rejectionId = stableId('rejection', [id, filename, key, index]);
        await store.put('ImportRejection', { id: rejectionId, original: redactPrivate(raw && typeof raw === 'object' ? raw : { value: raw }),
          runId: id, filename, recordIndex: index, reason: error.name === 'ZodError' ? 'Input contract validation failed' : 'Record validation, reference or database write failed' });
      }
    }
    results[key] = tally; addCounters(run.counters, tally);
  }
  run.finishedAt = new Date().toISOString();
  run.outcome = run.counters.rejected || missingFiles.length ? 'PARTIAL' : 'SUCCESS';
  run.original = { ...run.original, results, missingFiles, availableOnly, brokenLinksExcluded: excluded, brokenLinkCount: excluded.length,
    supplementalSourceCount: (await store.list('Source')).filter(s => s.sourceType === 'SUPPLEMENTAL_RESEARCH_REFERENCE').length };
  await store.put('IngestionRun', run);
  return run;
}
