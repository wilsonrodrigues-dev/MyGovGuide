import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { setTimeout as sleep } from 'node:timers/promises';
import path from 'node:path';
import { copyFile } from 'node:fs/promises';
process.env.NODE_ENV='test';
const {prepareE2e}=await import('./prepareE2e.mjs');
const require = createRequire(import.meta.url);
const frontend = fileURLToPath(new URL('../', import.meta.url));
const backend = path.resolve(frontend, '../backend');
const children = [];
function start(file, args, cwd, env) {
  const child = spawn(process.execPath, [file, ...args], { cwd, env: { ...process.env, ...env }, stdio: 'inherit', windowsHide: true });
  children.push(child); return child;
}
async function available(url) { try { return (await fetch(url, { signal: AbortSignal.timeout(750) })).ok; } catch { return false; } }
async function ready(url, child) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (child.exitCode !== null) throw new Error('Owned test server exited before becoming ready');
    if (await available(url)) {
      if (url.endsWith('/api/health')) {
        const health = await (await fetch(url)).json();
        if (health.database !== 'connected') throw new Error('MongoDB is required for browser checks. Run npm run db:local before testing.');
      }
      return;
    }
    await sleep(250);
  }
  throw new Error('Local test server did not become ready');
}
async function stop(child) {
  if (child.exitCode !== null) return;
  child.kill(); // Direct Node child handles avoid Windows npm/cmd process-tree teardown.
  await Promise.race([new Promise(resolve => child.once('close', resolve)), sleep(2000)]);
  if (child.exitCode === null) child.kill('SIGKILL');
}
try {
  if (await available('http://127.0.0.1:3011/api/health') || await available('http://127.0.0.1:4173')) throw new Error('Test ports 3011/4173 are already in use; no existing server was stopped');
  const formsFixture=process.argv.some(x=>['forms.spec.js','formsViewer.spec.js'].includes(x));
  const testEnv = {...await prepareE2e({contentFixture:process.argv.some(x=>['content.spec.js','approval.spec.js'].includes(x)),formsFixture}),...(formsFixture?{MYGOVGUIDE_E2E_FORMS_FIXTURE:'true'}:{})};
  const api = start(path.join(backend, 'src/server.js'), [], backend, { ...testEnv, PORT: '3011' });
  await ready('http://127.0.0.1:3011/api/health', api);
  start(path.join(backend, 'scripts/worker.js'), [], backend, testEnv);
  const vitePackage = require.resolve('vite/package.json');
  const preview = start(path.join(path.dirname(vitePackage), 'bin/vite.js'), ['preview', '--host', '127.0.0.1'], frontend, { API_PROXY_TARGET: 'http://127.0.0.1:3011' });
  await ready('http://127.0.0.1:4173', preview);
  const testPackage = require.resolve('@playwright/test/package.json');
  const args=process.argv.slice(2);
  const tests = start(path.join(path.dirname(testPackage), 'cli.js'), ['test', ...(args.length?args:['--grep-invert','@content-fixture|@forms-fixture|@forms-viewer'])], frontend, { ...testEnv, MYGOVGUIDE_E2E_SERVERS: 'external' });
  process.exitCode = await new Promise(resolve => tests.once('exit', code => resolve(code ?? 1)));
  await copyFile(path.join(frontend,'reports/e2e-results.json'),path.join(frontend,formsFixture?'reports/forms-e2e.json':args.includes('content.spec.js')?'reports/phase36-content-e2e.json':'reports/phase36-regression-e2e.json'));
  if(!args.length&&process.exitCode===0){
    for(const child of [...children].reverse())await stop(child);
    const content=start(fileURLToPath(import.meta.url),['content.spec.js'],frontend,{});
    process.exitCode=await new Promise(resolve=>content.once('exit',code=>resolve(code??1)));
  }
} catch (error) { console.error(error.message); process.exitCode = 1; }
finally { for (const child of [...children].reverse()) await stop(child); }
