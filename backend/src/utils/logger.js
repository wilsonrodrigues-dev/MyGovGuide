// Log only known operation labels and counters. Never serialize raw errors, URLs or env.
export function log(event, data = {}) {
  const allowed = ['status', 'sourceId', 'created', 'updated', 'unchanged', 'rejected', 'skipped', 'failed', 'successful'];
  console.log(JSON.stringify({ time: new Date().toISOString(), event,
    ...Object.fromEntries(Object.entries(data).filter(([key]) => allowed.includes(key))) }));
}
