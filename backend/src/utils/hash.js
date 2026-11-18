import { createHash } from 'node:crypto';
export function stable(value) {
  if (typeof value === 'string') return value.normalize('NFC').replace(/\s+/gu, ' ').trim();
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') return Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]));
  return value;
}
export const hash = value => createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
export const stableId = (prefix, value) => `${prefix}-${hash(value).slice(0, 24)}`;
export function changedFields(a, b) {
  return [...new Set([...Object.keys(a || {}), ...Object.keys(b || {})])].sort()
    .filter(k => hash(a?.[k] ?? null) !== hash(b?.[k] ?? null));
}
