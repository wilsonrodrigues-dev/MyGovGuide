import { randomBytes } from 'node:crypto';
import { z } from 'zod';
import { AnonymousSession, initAnonymousSessions } from '../models/AnonymousSession.js';
import { profileInput } from '../validators/profile.js';
import { digest, tokenFrom, cookieName, cookieOptions, failure } from '../middleware/citizenSecurity.js';
const view = doc => ({ profile: doc.profile ? { state: doc.profile.state, category: doc.profile.category, language: doc.profile.language } : null,
  expiresAt: doc.expiresAt.toISOString() });
export async function createSession(req, res) {
  if (!z.object({}).strict().safeParse(req.body || {}).success) return failure(res, 422, 'INVALID_REQUEST', 'Session creation does not accept personal identifiers');
  await initAnonymousSessions();
  let token = tokenFrom(req);
  let session = token && await AnonymousSession.findOne({ tokenHash: digest(token), expiresAt: { $gt: new Date() } });
  if (!session) {
    token = randomBytes(32).toString('base64url');
    session = await AnonymousSession.create({ tokenHash: digest(token), expiresAt: new Date(Date.now() + cookieOptions.maxAge) });
    res.cookie(cookieName, token, cookieOptions);
    return res.status(201).json(view(session));
  }
  res.json(view(session));
}
export function readSession(req, res) { res.json(view(req.anonymousSession)); }
export function readProfile(req, res) { res.json(view(req.anonymousSession)); }
export async function updateProfile(req, res) {
  const result = profileInput.safeParse(req.body);
  if (!result.success) return failure(res, 422, 'INVALID_PROFILE', 'Choose a supported state, citizen category and language');
  // No client-supplied session/profile identifier participates in this ownership query.
  const doc = await AnonymousSession.findOneAndUpdate({ _id: req.anonymousSession._id, expiresAt: { $gt: new Date() } },
    { $set: { profile: result.data } }, { new: true, runValidators: true });
  if (!doc) return failure(res, 401, 'SESSION_EXPIRED', 'The anonymous session has expired');
  res.json(view(doc));
}
export async function deleteSession(req, res) {
  await AnonymousSession.deleteOne({ _id: req.anonymousSession._id });
  const { maxAge: _maxAge, ...options } = cookieOptions;
  res.clearCookie(cookieName, options); res.status(204).end();
}
