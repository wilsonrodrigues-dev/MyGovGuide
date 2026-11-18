import { randomUUID } from 'node:crypto';
import { hash } from '../../utils/hash.js';
import { models } from '../../models/index.js';
const allowed = {
  RESEARCH_ONLY: ['SOURCE_VERIFIED_FACT', 'REJECTED', 'REVIEW_REQUIRED'],
  REVIEW_REQUIRED: ['SOURCE_VERIFIED_FACT', 'REJECTED', 'SUPERSEDED'],
  SOURCE_VERIFIED_FACT: ['RULES_APPROVED_CURRENT', 'REVIEW_REQUIRED', 'SUPERSEDED'],
  RULES_APPROVED_CURRENT: ['REVIEW_REQUIRED', 'SUPERSEDED'], REJECTED: ['REVIEW_REQUIRED'], SUPERSEDED: []
};
export async function review(store, type, id, decision) {
  if (!decision.reviewer?.trim() || !decision.evidence?.trim()) throw new Error('Named reviewer and explicit evidence required');
  return store.transaction(async session => {
    const current = await store.get(type, id, session);
    if (!current || !allowed[current.status]?.includes(decision.status)) throw new Error('Invalid review transition');
    if (decision.status === 'RULES_APPROVED_CURRENT') {
      if (type !== 'EligibilityRuleSet' || !decision.humanCurated || current.completeness !== 'COMPLETE' || !current.rules?.length) {
        throw new Error('Only complete human-curated eligibility rule sets can be approved');
      }
      for (const versionId of current.sourceVersionIds || []) if (!await store.get('SourceVersion', versionId, session)) throw new Error('Missing rule source version');
    }
    if (current.currentVersionId && decision.versionId !== current.currentVersionId) throw new Error('Review must identify the current observed version');
    if (current.sourceVersionId && decision.versionId !== current.sourceVersionId) throw new Error('Fact review must identify its evidence version');
    if (['SOURCE_VERIFIED_FACT', 'RULES_APPROVED_CURRENT'].includes(decision.status) && !decision.clauseRefs?.length) throw new Error('Clause references required');
    if (decision.status === 'SOURCE_VERIFIED_FACT' && current.currentVersionId) {
      const version = await store.get('SourceVersion', current.currentVersionId, session);
      current.normalized = version.normalized;
      current.original = version.original;
      for (const [key, value] of Object.entries(version.payload)) {
        if (models[type].schema.path(key)) current[key] = value;
      }
    }
    const next = { ...current, status: decision.status, publicationStatus: 'INTERNAL', lastHumanReviewAt: new Date().toISOString(),
      ...(['SOURCE_VERIFIED_FACT', 'RULES_APPROVED_CURRENT'].includes(decision.status) && current.currentVersionId ? { approvedVersionId: current.currentVersionId } : {}),
      ...(type === 'EligibilityRuleSet' ? { review: { reviewedBy: decision.reviewer, evidence: decision.evidence,
        humanCurated: decision.humanCurated, approvedAt: new Date().toISOString() } } : {}) };
    await store.put(type, next, session);
    const eventId = `decision-${randomUUID()}`;
    await store.put('ReviewEvent', { id: eventId, original: decision, entityType: type, entityId: id,
      previousStatus: current.status, nextStatus: decision.status, reviewer: decision.reviewer,
      evidence: decision.evidence, versionId: decision.versionId }, session);
    for (const item of await store.list('ReviewItem', { entityType: type, entityId: id }, session)) {
      if (!decision.versionId || item.versionId === decision.versionId) await store.put('ReviewItem', { ...item, queueStatus: 'RESOLVED' }, session);
    }
    return next;
  });
}
export function eligibilityReadiness(ruleSet, now = new Date()) {
  const ready = ruleSet?.status === 'RULES_APPROVED_CURRENT' && ruleSet.completeness === 'COMPLETE' && ruleSet.rules?.length > 0 &&
    !ruleSet.missingInformation?.length && ruleSet.sourceVersionIds?.length > 0 &&
    ruleSet.review?.humanCurated && ruleSet.review?.reviewedBy && ruleSet.review?.approvedAt &&
    ruleSet.review?.evidence && ruleSet.effectiveFrom && new Date(ruleSet.effectiveFrom) <= now &&
    (!ruleSet.effectiveUntil || new Date(ruleSet.effectiveUntil) >= now);
  return { canEvaluate: Boolean(ready), result: ready ? 'READY_FOR_PHASE3_ENGINE' : 'INFORMATION_INCOMPLETE' };
}
export async function flagConflict(store, schemeId, field) {
  const facts = await store.list('SchemeFact', { schemeId, field });
  const current = new Map();
  for (const fact of facts) {
    const previous = current.get(fact.sourceId);
    if (!previous || new Date(fact.createdAt || 0) >= new Date(previous.createdAt || 0)) current.set(fact.sourceId, fact);
  }
  const values = new Set([...current.values()].map(f => hash(f.normalizedValue)));
  if (values.size < 2) return false;
  const id = `conflict-${schemeId}-${field}`;
  await store.put('ReviewItem', { id, original: { factIds: facts.map(f => f.id) }, entityType: 'Scheme', entityId: schemeId,
    reason: `CONFLICTING_OFFICIAL_EVIDENCE:${field}` });
  const scheme = await store.get('Scheme', schemeId);
  if (scheme) await store.put('Scheme', { ...scheme, status: 'REVIEW_REQUIRED', publicationStatus: 'WITHDRAWN', cacheStale: true });
  const rules = await store.get('EligibilityRuleSet', `rules-${schemeId}`);
  if (rules) await store.put('EligibilityRuleSet', { ...rules, status: 'REVIEW_REQUIRED', completeness: 'INFORMATION_INCOMPLETE' });
  return true;
}
