import mongoose from 'mongoose';
import { states, categories, languages } from '../validators/profile.js';
const profileSchema = new mongoose.Schema({
  state: { type: String, enum: states, required: true },
  category: { type: String, enum: categories, required: true },
  language: { type: String, enum: languages, required: true }
}, { _id: false, strict: 'throw' });
const schema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true, match: /^[a-f0-9]{64}$/, select: false },
  profile: { type: profileSchema, default: null },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true, strict: 'throw', autoCreate: false, autoIndex: false });
export const AnonymousSession = mongoose.models.AnonymousSession || mongoose.model('AnonymousSession', schema);
const initialized = new WeakMap();
export async function initAnonymousSessions() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database is unavailable');
  if (!initialized.has(db)) {
    const promise = (async () => { await AnonymousSession.createCollection(); await AnonymousSession.createIndexes(); })();
    initialized.set(db, promise);
    promise.catch(() => initialized.delete(db));
  }
  return initialized.get(db);
}
