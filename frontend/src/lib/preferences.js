import { isProfile } from '../data/options.js';
export const preferenceKey = 'mygovguide.preferences.v1';
export function readPreferences(storage) {
  try {
    const text = storage.getItem(preferenceKey);
    if (!text || text.length > 2000) return null;
    const value = JSON.parse(text);
    return isProfile(value.profile) ? { profile: value.profile, pending: value.pending === true } : null;
  } catch { return null; }
}
export function writePreferences(storage, profile, pending) {
  if (!isProfile(profile)) throw new Error('Invalid preferences');
  try { storage.setItem(preferenceKey, JSON.stringify({ profile, pending })); storage.setItem('mygovguide.language', profile.language); return true; }
  catch { return false; }
}
