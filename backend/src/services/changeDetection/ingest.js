import { record } from '../../validators/contracts.js';
import { hash, stableId, changedFields } from '../../utils/hash.js';
import { flagConflict } from '../verification/review.js';
import { scopedStore } from '../ingestion/store.js';
import { assertPublicResearch } from '../../validators/privacy.js';

export const counters = () => ({ read: 0, created: 0, updated: 0, unchanged: 0, rejected: 0, pendingReview: 0,
  reviewItems: 0, changeEvents: 0, successful: 0, failed: 0, skipped: 0 });
export function addCounters(a, b) { for (const key of Object.keys(a)) a[key] += b[key] || 0; return a; }

export async function ingest(store, type, candidate, extra = {}) {
  assertPublicResearch(candidate);
  if (!['Scheme', 'Notice', 'FormTemplate', 'ScamAlert'].includes(type)) throw new Error('Unsupported ingest entity');
  const parsed = record.parse(candidate);
  if (parsed.status !== 'RESEARCH_ONLY') throw new Error('Collectors and imports can only stage research');
  return store.transaction(async session => {
    for (const id of parsed.sourceIds) if (!await store.get('Source', id, session)) throw new Error(`Unknown source reference: ${id}`);
    if (extra.schemeId && !await store.get('Scheme', extra.schemeId, session)) throw new Error('Unknown scheme reference');
    const old = await store.get(type, parsed.id, session);
    const content = { ...parsed.normalized, title: parsed.title, sourceUrl: parsed.sourceUrl, sourceIds: parsed.sourceIds, ...extra };
    const contentHash = hash(content);
    const tally = counters(); tally.read = 1;
    if (old?.contentHash === contentHash) {
      tally.unchanged = 1; tally.pendingReview = old.status === 'RESEARCH_ONLY' || old.status === 'REVIEW_REQUIRED' ? 1 : 0;
      return tally;
    }
    const revision = (old?.revision || 0) + 1;
    // A-B-A transitions keep distinct version instances while repeat A-A runs stop above.
    const versionId = stableId('version', [type, parsed.id, revision, contentHash]);
    const version = {
      id: versionId, original: parsed.original, normalized: parsed.normalized, sourceId: parsed.sourceIds[0],
      sourceIds: parsed.sourceIds, entityType: type, entityId: parsed.id, contentHash, payload: content,
      previousVersionId: old?.currentVersionId, retrievedAt: new Date().toISOString(), revision
    };
    await store.put('SourceVersion', version, session);
    const reviewId = stableId('review', [type, parsed.id, versionId]);
    await store.put('ReviewItem', { id: reviewId, original: {}, entityType: type, entityId: parsed.id,
      reason: old ? 'SOURCE_CONTENT_CHANGED' : 'INITIAL_RESEARCH_REVIEW', versionId }, session);
    tally.reviewItems = 1; tally.pendingReview = 1;
    if (old) {
      const prior = await store.get('SourceVersion', old.currentVersionId, session);
      const fields = changedFields(prior?.payload || old.normalized, content);
      const eventId = stableId('change', [old.currentVersionId, versionId]);
      await store.put('ChangeEvent', {
        id: eventId, original: {}, entityType: type, entityId: parsed.id, sourceIds: parsed.sourceIds,
        oldHash: old.contentHash, newHash: contentHash, oldVersionId: old.currentVersionId,
        newVersionId: versionId, changedFields: fields,
        summary: `${parsed.title}: changed ${fields.join(', ')}; human review required.`
      }, session);
      tally.changeEvents = 1; tally.updated = 1;
    } else tally.created = 1;
    const trusted = old && (old.approvedVersionId || ['SOURCE_VERIFIED_FACT', 'RULES_APPROVED_CURRENT'].includes(old.status));
    // Preserve approved fields; new observations remain in immutable SourceVersion.
    await store.put(type, trusted ? {
      ...old, status: 'REVIEW_REQUIRED', publicationStatus: 'WITHDRAWN', cacheStale: true,
      contentHash, currentVersionId: versionId, revision, lastCheckedAt: new Date().toISOString(),
      ...(type === 'Scheme' ? { simplifiedText: {} } : {})
    } : {
      ...parsed, ...extra, status: old && old.status !== 'RESEARCH_ONLY' ? 'REVIEW_REQUIRED' : 'RESEARCH_ONLY',
      contentHash, currentVersionId: versionId, revision, lastCheckedAt: new Date().toISOString(),
      cacheStale: true, publicationStatus: 'INTERNAL', ...(type === 'Scheme' ? { simplifiedText: {} } : {})
    }, session);
    if (type === 'Scheme') {
      for (const field of ['description', 'benefits', 'requiredDocuments', 'eligibilityConditions']) {
        if (parsed.normalized[field] == null || parsed.normalized[field] === '') continue;
        const factId = stableId('fact', [parsed.id, field, versionId]);
        await store.put('SchemeFact', { id: factId, original: {}, schemeId: parsed.id, field,
          sourceId: parsed.sourceIds[0], sourceVersionId: versionId, originalValue: parsed.original[field] ?? parsed.normalized[field],
          normalizedValue: parsed.normalized[field], sourceSection: parsed.original.sourceSection || 'Whole research record; clause review pending' }, session);
      }
      for (const [field, value] of Object.entries(parsed.original.keyFacts || {})) {
        const factId = stableId('fact', [parsed.id, `keyFacts.${field}`, versionId]);
        await store.put('SchemeFact', { id: factId, original: {}, schemeId: parsed.id, field: `keyFacts.${field}`,
          sourceId: parsed.sourceIds[0], sourceVersionId: versionId, originalValue: value,
          normalizedValue: value, sourceSection: `Research keyFacts.${field}; operative clause not reviewed` }, session);
      }
      const ruleId = `rules-${parsed.id}`;
      const rules = await store.get('EligibilityRuleSet', ruleId, session);
      if (!rules) await store.put('EligibilityRuleSet', { id: ruleId, original: {}, schemeId: parsed.id,
        sourceVersionIds: [versionId], rules: [], missingInformation: ['Full operative clauses and human approval missing'] }, session);
      else if (old) await store.put('EligibilityRuleSet', { ...rules, status: 'REVIEW_REQUIRED',
        completeness: 'INFORMATION_INCOMPLETE', publicationStatus: 'WITHDRAWN', cacheStale: true }, session);
      const factFields = ['description', 'benefits', 'requiredDocuments', 'eligibilityConditions',
        ...Object.keys(parsed.original.keyFacts || {}).map(k => `keyFacts.${k}`)];
      for (const field of factFields) {
        if (await flagConflict(scopedStore(store, session), parsed.id, field)) tally.reviewItems++;
      }
    }
    return tally;
  });
}
