import test from 'node:test';
import assert from 'node:assert/strict';
import { randomBytes } from 'node:crypto';
import { spawnSync } from 'node:child_process';
process.env.ADMIN_USERNAME="test-admin";process.env.ADMIN_PASSWORD="test-password";
process.env.ENABLE_LIVE_COLLECTION='false'; // Unit tests never inherit private live-collection enablement.
const { credentialsMatch, createSession, revokeSession, authenticate, digest, tokenFrom, cookieName, cookieOptions } = await import('../src/services/admin/auth.js');
const { scheduleDefinition, sourceFor } = await import('../src/services/admin/jobs.js');
const schedule = { name: 'Test', enabled: false, kind: 'DAILY', time: '06:00', timezone: 'Asia/Kolkata', mode: 'FIXTURE', sourceIds: ['fixture-api'] };
test('admin compares environment username/password without a database account',()=>{
 assert.equal(credentialsMatch('test-admin','test-password'),true);assert.equal(credentialsMatch('other','test-password'),false);assert.equal(credentialsMatch('test-admin','wrong'),false);
});
test('in-memory login session restores, expires and revokes without CSRF or MongoDB',()=>{
 const token=createSession(),req={headers:{cookie:cookieName+'='+token}};
 let status,next=false;const res={status(n){status=n;return this;},json(){}};
 authenticate(req,res,()=>next=true);assert.equal(next,true);assert.equal(req.admin.username,'test-admin');assert.notEqual(digest(token),token);
 assert.equal(tokenFrom(req),token);assert.equal(tokenFrom({headers:{cookie:cookieName+'=arbitrary'}}),null);
 const clock=Date.now;try{Date.now=()=>clock()+cookieOptions.maxAge+1;authenticate(req,res,()=>assert.fail('Expired session'));assert.equal(status,401);}finally{Date.now=clock;}
 const other=createSession();revokeSession(other);authenticate({headers:{cookie:cookieName+'='+other}},res,()=>assert.fail('Revoked session'));assert.equal(status,401);
 assert.equal(cookieOptions.httpOnly,true);
});
test('daily and twice-daily cron honor India timezone and weekly day', () => {
  const now = new Date('2026-11-17T00:00:00Z');
  assert.equal(scheduleDefinition(schedule, now).nextRun.toISOString(), '2026-11-17T00:30:00.000Z');
  assert.equal(scheduleDefinition({ ...schedule, kind: 'TWICE_DAILY' }, now).cron, '0 6,18 * * *');
  assert.equal(scheduleDefinition({ ...schedule, kind: 'WEEKLY', weekday: 1 }, now).nextRun.toISOString(), '2026-11-23T00:30:00.000Z');
});
test('custom cron validates timezone, syntax and prevents second-level jobs', () => {
  assert.equal(scheduleDefinition({ ...schedule, kind: 'CUSTOM', cron: '*/5 * * * *', timezone: 'UTC' }, new Date('2026-11-17T00:01:00Z')).nextRun.toISOString(), '2026-11-17T00:05:00.000Z');
  for (const change of [{ timezone: 'Mars/Olympus' }, { kind: 'CUSTOM', cron: '* * * * * *' }, { kind: 'CUSTOM', cron: 'banana' }, { time: '25:00' }, { sourceIds: [] }]) assert.throws(() => scheduleDefinition({ ...schedule, ...change }));
});
test('cron handles daylight saving and database configuration forbids collisions', async () => {
  const { validateDatabaseUris } = await import('../src/config/env.js');
  assert.doesNotThrow(() => validateDatabaseUris('mongodb+srv://user:password@example.test/mygovguide_dev', 'mongodb+srv://user:password@example.test/mygovguide_phase2_test'));
  assert.throws(() => validateDatabaseUris('mongodb://localhost/'));
  assert.throws(() => validateDatabaseUris('mongodb://localhost/admin'));
  assert.throws(() => validateDatabaseUris('mongodb://localhost/mygovguide_phase2_test', 'mongodb://localhost/mygovguide_phase2_test'));
  assert.throws(() => validateDatabaseUris('mongodb://localhost/app', 'mongodb://localhost/app'));
  const spring = scheduleDefinition({ ...schedule, time: '09:00', timezone: 'America/New_York' }, new Date('2026-03-08T00:00:00Z'));
  assert.equal(spring.nextRun.toISOString(), '2026-03-08T13:00:00.000Z');
});
test('live gate denies before database/network and fixtures are a closed allowlist', async () => {
  await assert.rejects(sourceFor('S01', 'LIVE'), /disabled/); await assert.rejects(sourceFor('../../arbitrary', 'FIXTURE'));
  assert.equal((await sourceFor('fixture-rss', 'FIXTURE')).fixture, 'feed.xml');
});
test('invalid environment never logs credential values and Mongo URI supports Atlas', () => {
  const secret = 'mongodb+srv://private-user:private-password@cluster.example/mygovguide_dev';
  const good = spawnSync(process.execPath, ['--input-type=module', '-e', "import('./src/config/env.js').then(m=>console.log(Boolean(m.env.MONGODB_URI)))"], { cwd: new URL('../', import.meta.url), env: { ...process.env, MONGODB_URI: secret }, encoding: 'utf8' });
  assert.equal(good.status, 0); assert.equal(good.stdout.trim(), 'true');
  const bad = spawnSync(process.execPath, ['--input-type=module', '-e', "import('./src/config/env.js')"], { cwd: new URL('../', import.meta.url), env: { ...process.env, PORT: 'bad', MONGODB_URI: secret }, encoding: 'utf8' });
  assert.notEqual(bad.status, 0); assert.equal((bad.stdout + bad.stderr).includes('private-password'), false);
});
