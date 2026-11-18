import test from 'node:test';
import assert from 'node:assert/strict';
process.env.ADMIN_USERNAME='test-admin';process.env.ADMIN_PASSWORD='test-password';
const {app}=await import('../src/app.js');
test('health remains available without MongoDB and citizen/admin database routes fail closed', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const health = await fetch(`${base}/api/health`); assert.equal(health.status, 200);
    assert.equal((await health.json()).database, 'unavailable');
    const status = await fetch(`${base}/api/data/status`); assert.equal(status.status, 503);
    assert.equal((await status.json()).error.code, 'DATABASE_UNAVAILABLE');
    const admin = await fetch(`${base}/api/admin/stats`); assert.equal(admin.status, 401);
    assert.equal((await admin.json()).error.code,'ADMIN_AUTH_REQUIRED');
    const login=await fetch(base+'/api/admin/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'test-admin',password:'test-password'})});assert.equal(login.status,200);
    const data=await login.json();assert.equal(data.user.username,'test-admin');assert.equal('csrfToken' in data,false);
    const cookie=login.headers.get('set-cookie').split(';')[0];
    assert.equal((await fetch(base+'/api/admin/auth/session',{headers:{Cookie:cookie}})).status,200);
    assert.equal((await fetch(base+'/api/admin/stats',{headers:{Cookie:cookie}})).status,503);
    assert.equal((await fetch(base+'/api/admin/auth/logout',{method:'POST',headers:{Cookie:cookie}})).status,200);
    assert.equal((await fetch(base+'/api/admin/auth/session',{headers:{Cookie:cookie}})).status,401);
    const bad = await fetch(`${base}/api/data/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
    assert.equal(bad.status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
