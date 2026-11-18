import test from 'node:test';
import assert from 'node:assert/strict';
import { normalize, category, state, date, money, ageRange, canonicalUrl } from '../src/services/normalization/index.js';
import { hash, changedFields } from '../src/utils/hash.js';
test('categories, state and government normalize without losing Unicode', () => {
  assert.equal(category(' students '), 'Student'); assert.equal(category('Labourer'), 'Worker');
  assert.equal(state('all-india'), 'All India');
  const value = normalize({ title: 'ಕನ್ನಡ हिंदी', sourceUrl: 'https://example.test', state: 'karnataka' });
  assert.equal(value.title, 'ಕನ್ನಡ हिंदी'); assert.equal(value.governmentLevel, 'STATE');
});
test('dates are strict and never infer missing deadlines', () => {
  assert.equal(date('2026-02-29').value, null); assert.equal(date('2024-02-29').value, '2024-02-29');
  assert.equal(date('15/11/26').value, null); assert.equal(date(undefined).value, null);
});
test('money retains original and rejects malformed grouping and unspecified units', () => {
  assert.equal(money('₹2,50,000').value, 250000); assert.equal(money('INR 2.5 lakh').value, 250000);
  assert.equal(money('Rs. 1 crore').value, 10000000); assert.equal(money('₹1,2,3').value, null);
  assert.equal(money('250000').value, null); assert.equal(money('₹1,000 per month').reviewRequired, true);
});
test('age ranges do not invent inclusive/exclusive rules', () => {
  assert.equal(ageRange('18–40 years').min, 18); assert.equal(ageRange('18–40 years').bounds, 'UNREVIEWED');
  assert.equal(ageRange('40-18').min, null);
});
test('URLs retain meaningful queries and path case', () => {
  assert.equal(canonicalUrl('https://EXAMPLE.test/Doc?b=2&utm_source=x&a=1#section'), 'https://example.test/Doc?a=1&b=2');
  assert.notEqual(canonicalUrl('https://example.test/Doc'), canonicalUrl('https://example.test/doc'));
  assert.throws(() => canonicalUrl('file:///etc/passwd'));
});
test('hash ignores object key order and whitespace but detects amounts', () => {
  assert.equal(hash({ b: 'A  B', a: 1 }), hash({ a: 1, b: 'A B' }));
  assert.notEqual(hash({ amount: 100 }), hash({ amount: 101 }));
  assert.deepEqual(changedFields({ a: 1, b: 2 }, { a: 1, b: 3 }), ['b']);
});
