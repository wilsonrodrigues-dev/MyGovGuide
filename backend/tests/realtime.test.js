import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { io } from 'socket.io-client';
process.env.ADMIN_USERNAME = 'realtime-admin';
process.env.ADMIN_PASSWORD = 'realtime-password';

const { createSession, revokeSession, adminFromToken, sessionFromToken, cookieName } = await import('../src/services/admin/auth.js');
const { publish, subscribe } = await import('../src/services/realtime/events.js');
const { app } = await import('../src/app.js');
const { attachRealtime, realtimePath } = await import('../src/realtime.js');

test('Socket.IO authentication resolves only current admin sessions', () => {
  const token = createSession();
  assert.equal(adminFromToken(token).username, 'realtime-admin');
  assert.equal(sessionFromToken(token)?.credentialVersion.length, 64);
  assert.equal(adminFromToken('not-a-session'), null);
  revokeSession(token);
  assert.equal(adminFromToken(token), null);
});

test('live event bus delivers one sanitized event and unsubscribes cleanly', () => {
  const seen = [];
  const unsubscribe = subscribe((event) => seen.push(event));
  const event = publish('job:progress', { jobId: 'job-1', progress: 'Fetching source' }, { persist: false });
  assert.equal(seen.length, 1);
  assert.equal(seen[0].id, event.id);
  assert.equal(seen[0].type, 'job:progress');
  assert.equal(seen[0].payload.progress, 'Fetching source');
  assert.match(seen[0].at, /^\d{4}-\d{2}-\d{2}T/);
  unsubscribe();
  publish('job:finished', { job: { state: 'SUCCEEDED' } }, { persist: false });
  assert.equal(seen.length, 1);
});

test('Socket.IO requires an admin cookie and streams live events to the admin room', async () => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const realtime = attachRealtime(server);
  const url = `http://127.0.0.1:${server.address().port}`;
  try {
    const anonymous = io(url, { path: realtimePath, transports: ['websocket'], reconnection: false, forceNew: true });
    const denied = await new Promise((resolve) => anonymous.once('connect_error', resolve));
    assert.equal(denied.data.code, 'ADMIN_AUTH_REQUIRED');
    anonymous.close();

    const token = createSession();
    const client = io(url, { path: realtimePath, transports: ['websocket'], reconnection: false, forceNew: true, extraHeaders: { Cookie: `${cookieName}=${token}` } });
    const ready = await new Promise((resolve, reject) => { client.once('admin:ready', resolve); client.once('connect_error', reject); });
    assert.equal(ready.user.username, 'realtime-admin');
    const received = once(client, 'admin:event');
    publish('job:progress', { jobId: 'live-1', progress: 'Fetching source' }, { persist: false });
    const [event] = await received;
    assert.equal(event.type, 'job:progress');
    assert.equal(event.payload.jobId, 'live-1');
    client.close();
  } finally {
    realtime.close();
    await new Promise((resolve) => server.close(resolve));
  }
});
