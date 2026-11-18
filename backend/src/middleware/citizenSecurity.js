import { createHash } from 'node:crypto';
import mongoose from 'mongoose';
import { AnonymousSession } from '../models/AnonymousSession.js';
import { env } from '../config/env.js';
export const cookieName = process.env.NODE_ENV === 'production' ? '__Host-mygovguide_session' : 'mygovguide_session';
export const cookieOptions = { httpOnly: true, sameSite: 'strict', secure: process.env.NODE_ENV === 'production',
  path: process.env.NODE_ENV === 'production' ? '/' : '/api', maxAge: 30 * 24 * 60 * 60 * 1000 };
export const allowedOrigins = new Set(env.CLIENT_ORIGINS.split(',').map(s => s.trim()).filter(Boolean));
export const digest = value => createHash('sha256').update(value).digest('hex');
export const failure = (res, status, code, message) => res.status(status).json({ error: { code, message } });
export function tokenFrom(req) {
  const cookies = (req.headers.cookie || '').split(';').map(s => s.trim()).filter(s => s.startsWith(`${cookieName}=`));
  if (cookies.length !== 1) return null;
  const value = cookies[0].slice(cookieName.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}
export function requireDatabase(_req, res, next) {
  res.set('Cache-Control', 'no-store');
  if (mongoose.connection.readyState !== 1) return failure(res, 503, 'DATABASE_UNAVAILABLE', 'Preference service is temporarily unavailable');
  next();
}
export function requireTrustedMutation(req, res, next) {
  if ((req.headers.origin && !allowedOrigins.has(req.headers.origin)) || req.headers['sec-fetch-site'] === 'cross-site') {
    return failure(res, 403, 'ORIGIN_FORBIDDEN', 'Request origin is not permitted');
  }
  next();
}
export async function requireSession(req, res, next) {
  const token = tokenFrom(req);
  if (!token) return failure(res, 401, 'SESSION_REQUIRED', 'A secure anonymous session is required');
  const session = await AnonymousSession.findOne({ tokenHash: digest(token), expiresAt: { $gt: new Date() } });
  if (!session) return failure(res, 401, 'SESSION_EXPIRED', 'The anonymous session has expired');
  req.anonymousSession = session;
  next();
}
