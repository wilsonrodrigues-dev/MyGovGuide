import { MemoryStore } from '../src/services/ingestion/store.js';
export async function storeWithSource() {
  const store = new MemoryStore();
  await store.put('Source', { id: 'test-source', original: {}, title: 'Synthetic source', url: 'https://example.test/data', host: 'example.test' });
  return store;
}
export function candidate(overrides = {}) {
  return { id: 'test-scheme', title: 'Synthetic scheme', sourceIds: ['test-source'], sourceUrl: 'https://example.test/data',
    original: { description: 'original' }, normalized: { description: 'Original description', benefits: 'INR 100' },
    status: 'RESEARCH_ONLY', ...overrides };
}
export function authorized(overrides = {}) {
  return { sourceId: 'approved-test', enabled: true, host: 'example.test', approvedPaths: ['/data'],
    method: 'html', sourceTermsUrl: 'https://example.test/terms', rightsBasis: 'SYNTHETIC test grant',
    robotsUrl: 'https://example.test/robots.txt', robotsObservedAt: new Date(Date.now() - 60000).toISOString(), robotsAllowed: true,
    rateLimit: { minIntervalMs: 1000, maxRequests: 20 }, reviewedBy: 'Synthetic test reviewer', approvalEvidence: 'Test-only evidence',
    approvalExpiry: new Date(Date.now() + 86400000).toISOString(), testPlan: 'Local transport mock', url: 'https://example.test/data', ...overrides };
}
