import { randomUUID } from 'node:crypto';
import { authorize } from '../ingestion/access.js';

// Internal operator service only. No public endpoint or automatic approval path.
export async function approveSource(store, sourceId, approval) {
  const checked = authorize(approval, approval.url, approval.method);
  if (checked.sourceId !== sourceId) throw new Error('Approval source identity mismatch');
  return store.transaction(async session => {
    const source = await store.get('Source', sourceId, session);
    if (!source || source.host !== checked.host) throw new Error('Approval does not match an existing source host');
    await store.put('Source', { ...source, authorizationStatus: 'APPROVED', approval: checked, collectionMethod: checked.method }, session);
    const id = `source-approval-${randomUUID()}`;
    await store.put('ReviewEvent', { id, original: { accessDecision: 'APPROVED', sourceId }, entityType: 'Source', entityId: sourceId,
      previousStatus: source.status || 'RESEARCH_ONLY', nextStatus: source.status || 'RESEARCH_ONLY',
      reviewer: checked.reviewedBy, evidence: checked.approvalEvidence }, session);
  });
}
