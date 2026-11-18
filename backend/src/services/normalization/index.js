import { stable } from '../../utils/hash.js';
export const cleanText = value => typeof value === 'string' ? stable(value) : value;
export function canonicalUrl(value) {
  const u = new URL(value);
  if (!/^https?:$/.test(u.protocol) || u.username || u.password) throw new Error('Invalid source URL');
  u.hash = '';
  for (const k of [...u.searchParams.keys()]) if (/^(utm_|fbclid$|gclid$)/i.test(k)) u.searchParams.delete(k);
  u.searchParams.sort();
  return u.href;
}
const categoryMap = { farmer: 'Farmer', students: 'Student', student: 'Student', women: 'Woman', woman: 'Woman',
  worker: 'Worker', labourer: 'Worker', 'senior citizen': 'Senior Citizen', elderly: 'Senior Citizen', general: 'General',
  entrepreneur: 'Entrepreneur', 'person with disability': 'Person with Disability' };
export function category(value) { return categoryMap[cleanText(value || '').toLowerCase()] || cleanText(value || 'UNKNOWN'); }
export function state(value) {
  const v = cleanText(value || 'UNKNOWN');
  return /^(india|all[- ]india|central)$/i.test(v) ? 'All India' : /^karnataka$/i.test(v) ? 'Karnataka' : v;
}
export function date(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return { original: value, value: null, reviewRequired: true };
  const dt = new Date(`${value}T00:00:00Z`);
  const valid = !Number.isNaN(dt.valueOf()) && dt.toISOString().slice(0, 10) === value;
  return { original: value, value: valid ? value : null, reviewRequired: !valid };
}
export function money(value) {
  const original = value;
  const match = String(value).trim().match(/^(?:₹|INR|Rs\.?)[\s]*([\d,]+(?:\.\d+)?)\s*(lakh|crore)?$/i);
  if (!match) return { original, value: null, currency: null, reviewRequired: true };
  const digits = match[1];
  if (digits.includes(',') && !/^(?:\d{1,3}(?:,\d{3})+|\d{1,2}(?:,\d{2})*,\d{3})(?:\.\d+)?$/.test(digits)) return { original, value: null, currency: null, reviewRequired: true };
  const amount = Number(digits.replaceAll(',', '')) * (match[2]?.toLowerCase() === 'lakh' ? 1e5 : match[2]?.toLowerCase() === 'crore' ? 1e7 : 1);
  return { original, value: Number.isSafeInteger(amount * 100) ? amount : null, currency: 'INR', reviewRequired: !Number.isSafeInteger(amount * 100) };
}
export function ageRange(value) {
  const m = String(value).match(/^(\d{1,3})\s*[-–]\s*(\d{1,3})(?:\s*years?)?$/i);
  return { original: value, min: m && +m[1] <= +m[2] ? +m[1] : null,
    max: m && +m[1] <= +m[2] ? +m[2] : null, reviewRequired: !m || +m[1] > +m[2], bounds: 'UNREVIEWED' };
}
export function normalize(input) {
  const categories = input.beneficiaryCategories || input.categories || (input.category ? [input.category] : []);
  const normalizedState = state(input.state || input.government);
  return {
    title: cleanText(input.title), department: cleanText(input.department || ''), state: normalizedState,
    governmentLevel: normalizedState === 'All India' ? 'CENTRAL' : normalizedState === 'UNKNOWN' ? 'UNKNOWN' : 'STATE',
    beneficiaryCategories: categories.map(category), programmeType: cleanText(input.programmeType || 'UNKNOWN'),
    description: cleanText(input.description || input.originalText || ''), benefits: stable(input.benefits ?? null),
    requiredDocuments: (input.requiredDocuments || []).map(cleanText), applicationInfo: stable(input.applicationInfo ?? null),
    sourceUrl: canonicalUrl(input.sourceUrl), sourceEdition: input.sourceEdition || null,
    supportingOfficialUrls: (input.supportingOfficialUrls || []).map(canonicalUrl),
    observedPublicationDate: input.observedPublicationDate || input.publishedAt || null,
    dates: Object.fromEntries(Object.entries(input.dates || {}).map(([k, v]) => [k, date(v)])),
    monetaryAmounts: (input.monetaryAmounts || []).map(money), ageRanges: (input.ageRanges || []).map(ageRange),
    incomeThresholds: (input.incomeThresholds || []).map(money),
    documentReferences: (input.documentReferences || []).map(cleanText),
    languages: (input.languages || []).map(l => ({ English: 'en', Hindi: 'hi', Kannada: 'kn' })[l] || cleanText(l)),
    eligibilityConditions: stable(input.eligibilityConditions ?? null), observedFacts: stable(input.keyFacts || {})
  };
}
