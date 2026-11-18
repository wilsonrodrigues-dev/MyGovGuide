import dns from 'node:dns/promises';
import ipaddr from 'ipaddr.js';
import { approval } from '../../validators/contracts.js';

export function publicAddress(address) {
  try { return ipaddr.process(address).range() === 'unicast'; } catch { return false; }
}
export function authorize(source, url, method, now = new Date()) {
  const result = approval.safeParse(source);
  if (!result.success) throw new Error('Source authorization is incomplete or malformed');
  const a = result.data;
  if (!a.enabled || a.method !== method || new Date(a.approvalExpiry) <= now) throw new Error('Source is disabled, expired, or method is not approved');
  const u = new URL(url);
  if (u.protocol !== 'https:' || u.username || u.password || (u.port && u.port !== '443')) throw new Error('Only credential-free HTTPS on port 443 is allowed');
  const host = u.hostname.replace(/^\[|\]$/g, '').toLowerCase();
  if (host === 'myscheme.gov.in' || host.endsWith('.myscheme.gov.in')) throw new Error('myScheme automated collection is excluded');
  if (host !== a.host.toLowerCase() || host === 'localhost' || host.endsWith('.localhost') || !host.includes('.')) throw new Error('Host is outside approval scope');
  if (ipaddr.isValid(host) && !publicAddress(host)) throw new Error('Non-public destination blocked');
  if (/%(?:2f|5c|2e|25)/i.test(u.pathname) || u.pathname.includes('\\')) throw new Error('Encoded or ambiguous paths blocked');
  if (!a.approvedPaths.some(p => p === '/' || u.pathname === p || u.pathname.startsWith(p.endsWith('/') ? p : `${p}/`))) throw new Error('URL path is outside approval scope');
  if (/(?:login|signin|captcha|beneficiar|aadhaar|account|otp|webform)/i.test(u.pathname)) throw new Error('Protected or citizen-data path blocked');
  // Query parameters are only approved when explicitly present on the reviewed endpoint.
  const reviewed = new URL(a.url);
  if (u.search !== reviewed.search) throw new Error('Unapproved query parameters');
  return a;
}
export async function resolvePublic(host, lookup = dns.lookup) {
  const entries = await lookup(host, { all: true, verbatim: true });
  if (!entries.length || entries.some(e => !publicAddress(e.address))) throw new Error('DNS resolved to a non-public destination');
  return entries[0];
}
