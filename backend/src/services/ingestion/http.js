import https from 'node:https';
import { setTimeout as sleep } from 'node:timers/promises';
import { authorize, resolvePublic } from './access.js';

export function pinnedRequest(url, resolved, { timeoutMs, maxBytes, headers = {} }) {
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const req = https.get(url, {
      signal: controller.signal,
      headers: { 'user-agent': 'MyGovGuide-Research/3.6', 'accept-encoding': 'identity', ...headers },
      // DNS pinning prevents a rebind between the policy check and the socket connection.
      lookup: (_host, options, callback) => callback(null, options.all ? [resolved] : resolved.address, resolved.family)
    }, res => {
      const chunks = []; let size = 0;
      res.on('data', chunk => {
        size += chunk.length;
        if (size > maxBytes) req.destroy(new Error('Response exceeds byte limit'));
        else chunks.push(chunk);
      });
      res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location,
        contentType: res.headers['content-type'] || '', retryAfter: res.headers['retry-after'], etag: res.headers.etag, lastModified: res.headers['last-modified'], body: Buffer.concat(chunks) }));
      res.on('error', reject);
    });
    req.on('error', reject);
    req.on('close', () => clearTimeout(timer));
  });
}
export class SafeHttp {
  constructor({ request = pinnedRequest, resolve = resolvePublic, wait = sleep, now = () => Date.now(), timeoutMs = 10000, maxBytes = 5242880 } = {}) {
    Object.assign(this, { request, resolve, wait, now, timeoutMs, maxBytes });
    this.counts = new Map(); this.hostLocks = new Map(); this.lastRequest = new Map();
    this.validators = new Map(); this.responses = new Map();
  }
  async limited(source, url, fn) {
    const previous = this.hostLocks.get(source.host) || Promise.resolve();
    const task = previous.catch(() => {}).then(async () => {
      const count = this.counts.get(source.sourceId) || 0;
      if (count >= source.rateLimit.maxRequests) throw new Error('Approved request budget exhausted');
      const delay = source.rateLimit.minIntervalMs - (this.now() - (this.lastRequest.get(source.host) ?? -Infinity));
      if (delay > 0) await this.wait(delay);
      authorize(source, url, source.method);
      this.counts.set(source.sourceId, count + 1);
      this.lastRequest.set(source.host, this.now());
      return fn();
    });
    this.hostLocks.set(source.host, task.catch(() => {}));
    return task;
  }
  async fetch(source, initialUrl, method) {
    let url = initialUrl;
    for (let redirect = 0; redirect <= 4; redirect++) {
      const a = authorize(source, url, method);
      let response;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          response = await this.limited(a, url, async () => {
            const resolved = await this.resolve(a.host);
            const cached = this.validators.get(url) || {}, headers = {};
            for (const [key, value] of [['If-None-Match',cached.etag],['If-Modified-Since',cached.lastModified]]) if (typeof value === 'string' && value.length <= 1000 && !/[\r\n]/.test(value)) headers[key]=value;
            return this.request(url, resolved, { timeoutMs: this.timeoutMs, maxBytes: this.maxBytes, headers });
          });
        } catch (error) {
          if (attempt === 2 || /authorization|budget|scope|public|disabled|expired/i.test(error.message)) throw error;
          await this.wait(250 * 2 ** attempt); continue;
        }
        if ([408, 429, 500, 502, 503, 504].includes(response.status) && attempt < 2) {
          const header = response.retryAfter;
          const retryMs = header == null ? 0 : /^\d+$/.test(String(header)) ? Number(header) * 1000 : Math.max(0, Date.parse(header) - this.now());
          // A long server cooldown ends this job instead of tying up a worker or retrying early.
          if (retryMs > 60000) throw new Error('Server requested a long cooldown; defer to a later collection');
          await this.wait(Math.max(1000 * 2 ** attempt, Number.isFinite(retryMs) ? retryMs : 0)); continue;
        }
        break;
      }
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        if (!response.location) throw new Error('Redirect lacks destination');
        url = new URL(response.location, url).href;
        continue;
      }
      const metadata={status:response.status,etag:response.etag,lastModified:response.lastModified,url,responseBytes:response.body.length};
      this.responses.set(initialUrl,metadata);this.responses.set(url,metadata);
      if (response.status === 304) {
        const prior=this.validators.get(url)||{};
        if(![prior.etag,prior.lastModified].some(value=>typeof value==='string'&&value.length>0&&value.length<=1000&&!/[\r\n]/.test(value)))throw new Error('Unexpected not-modified response without cache validators');
        return null;
      }
      if (response.status !== 200) throw new Error(`Collection HTTP status ${response.status}; no bypass attempted`);
      if (response.body.length > this.maxBytes) throw new Error('Response exceeds byte limit');
      return response.body;
    }
    throw new Error('Redirect limit exceeded');
  }
}
