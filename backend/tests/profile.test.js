import test from 'node:test';
import assert from 'node:assert/strict';
import { profileInput, states, categories } from '../src/validators/profile.js';
import { AnonymousSession } from '../src/models/AnonymousSession.js';
import { digest, tokenFrom, cookieName, cookieOptions } from '../src/middleware/citizenSecurity.js';
test('profile contract admits supported preferences and rejects identifiers or arbitrary fields', () => {
  const profile = { state: 'Karnataka', category: 'Student', language: 'kn' };
  assert.ok(profileInput.safeParse(profile).success);
  for (const extra of [{ deviceId: 'client-id' }, { name: 'person' }, { sessionId: 'another-user' }]) assert.equal(profileInput.safeParse({ ...profile, ...extra }).success, false);
  for (const bad of [{ state: 'not-a-state' }, { category: 'not-a-category' }, { language: 'fr' }]) assert.equal(profileInput.safeParse({ ...profile, ...bad }).success, false);
  assert.equal(states.length, 36); assert.equal(categories.length, 8);
});
test('session model indexes token hashes uniquely and expires sessions', () => {
  assert.ok(AnonymousSession.schema.indexes().some(([keys, options]) => keys.tokenHash && options.unique));
  assert.ok(AnonymousSession.schema.indexes().some(([keys, options]) => keys.expiresAt && options.expireAfterSeconds === 0));
  assert.equal(AnonymousSession.schema.path('tokenHash').options.select, false);
  assert.equal(cookieOptions.httpOnly, true); assert.equal(cookieOptions.sameSite, 'strict');
});
test('session cookie parsing rejects arbitrary UUIDs and duplicate cookies; storage hashes remain distinct', () => {
  const raw = 'a'.repeat(43);
  assert.equal(tokenFrom({ headers: { cookie: `${cookieName}=${raw}` } }), raw);
  assert.equal(tokenFrom({ headers: { cookie: `${cookieName}=client-uuid` } }), null);
  assert.equal(tokenFrom({ headers: { cookie: `${cookieName}=${raw}; ${cookieName}=${raw}` } }), null);
  assert.notEqual(digest(raw), raw); assert.equal(digest(raw).length, 64);
});
test('production cookies use Secure and the host-only cookie prefix', async () => {
  const old = process.env.NODE_ENV; process.env.NODE_ENV = 'production';
  try {
    const module = await import(`../src/middleware/citizenSecurity.js?production-check=${Date.now()}`);
    assert.equal(module.cookieName, '__Host-mygovguide_session');
    assert.equal(module.cookieOptions.secure, true); assert.equal(module.cookieOptions.path, '/');
  } finally { if (old === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = old; }
});
