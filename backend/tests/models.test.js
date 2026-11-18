import test from 'node:test';
import assert from 'node:assert/strict';
import { models } from '../src/models/index.js';
import { record, rule, approval, validateRoot } from '../src/validators/contracts.js';
import { authorized } from './helpers.js';

test('all 11 required models and internal audit models exist', () => {
  for (const name of ['Source', 'SourceVersion', 'Scheme', 'SchemeFact', 'EligibilityRuleSet', 'FormTemplate', 'Notice', 'ScamAlert', 'ChangeEvent', 'ReviewEvent', 'IngestionRun']) assert.ok(models[name]);
});
for (const [name, Model] of Object.entries(models)) {
  test(`${name} rejects an empty document`, async () => { await assert.rejects(new Model({}).validate()); });
}
test('source defaults deny automation', async () => {
  const source = new models.Source({ _id: 's', id: 's', title: 'test', url: 'https://example.test/', host: 'example.test', original: {} });
  await source.validate(); assert.equal(source.authorizationStatus, 'NOT_AUTHORIZED_FOR_AUTOMATION');
});
test('source does not accept credential URLs', async () => {
  await assert.rejects(new models.Source({ _id: 's', id: 's', title: 'test', url: 'https://secret:secret@example.test', host: 'example.test', original: {} }).validate());
});
test('stable ID, revision and meaningful-change indexes are defined', () => {
  assert.ok(models.Source.schema.indexes().some(([keys, options]) => keys.id && options.unique));
  assert.ok(models.SourceVersion.schema.indexes().some(([keys, options]) => keys.entityId && keys.revision && options.unique));
  assert.ok(models.ChangeEvent.schema.indexes().some(([keys, options]) => keys.oldVersionId && keys.newVersionId && options.unique));
});
test('eligibility approval cannot be created with incomplete rules', async () => {
  await assert.rejects(new models.EligibilityRuleSet({ _id: 'r', id: 'r', original: {}, schemeId: 's', status: 'RULES_APPROVED_CURRENT' }).validate());
});
test('awareness topics reject incident publication dates', async () => {
  await assert.rejects(new models.ScamAlert({ _id: 'a', id: 'a', original: {}, title: 'topic', sourceIds: ['s'], sourceUrl: 'https://example.test', recordType: 'AWARENESS_TOPIC', publishedAt: new Date() }).validate());
});
test('record contracts reject malformed or unknown fields', () => {
  assert.equal(record.safeParse({ id: 'a' }).success, false);
  assert.throws(() => validateRoot('VERIFIED_SCHEMES.json', { schemes: [] }));
});
test('nested rules require clause references', () => {
  assert.ok(rule.safeParse({ id: 'root', logic: 'AND', clauseRefs: ['p1'], children: [
    { id: 'age', field: 'age', dataType: 'number', operator: 'gte', value: 18, clauseRefs: ['p1.1'] }
  ] }).success);
  assert.equal(rule.safeParse({ id: 'r', field: 'age', dataType: 'number', operator: 'gte', value: 18, clauseRefs: [] }).success, false);
});
test('approval schema requires rights, robots, reviewer and API agreement', () => {
  assert.ok(approval.safeParse(authorized()).success);
  for (const key of ['rightsBasis', 'sourceTermsUrl', 'reviewedBy', 'robotsObservedAt', 'approvalEvidence']) {
    const input = authorized(); delete input[key]; assert.equal(approval.safeParse(input).success, false);
  }
  assert.equal(approval.safeParse(authorized({ method: 'api' })).success, false);
});
test('rules reject mismatched values, invalid bounds, and money without units', () => {
  const base = { id: 'r', field: 'age', dataType: 'number', operator: 'gte', value: '18', clauseRefs: ['1'] };
  assert.equal(rule.safeParse(base).success, false);
  assert.equal(rule.safeParse({ ...base, operator: 'between', value: [40, 18] }).success, false);
  assert.equal(rule.safeParse({ ...base, field: 'annualIncome', value: 1000 }).success, false);
  assert.equal(rule.safeParse({ ...base, field: 'annualIncome', value: 1000, currency: 'INR', unit: 'annual' }).success, true);
});
