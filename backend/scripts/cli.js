import { readFile, writeFile, mkdir, appendFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { connectDB, disconnectDB, requireTransactions } from '../src/config/db.js';
import { env, serverRoot, phase1Dir, approvalFile, projectRoot } from '../src/config/env.js';
import { models, initModels } from '../src/models/index.js';
import { MongoStore } from '../src/services/ingestion/store.js';
import { readPackage, importResearch } from '../src/services/ingestion/importResearch.js';
import { collect } from '../src/services/ingestion/collect.js';
import { approval } from '../src/validators/contracts.js';

const command = process.argv[2];
const reportDir = path.join(serverRoot, 'reports');
async function approvals() {
  const raw = JSON.parse(await readFile(approvalFile, 'utf8'));
  if (!Array.isArray(raw)) throw new Error('Source approvals must be an array');
  return raw;
}
export async function auditInputs() {
  const required = ['VERIFIED_SCHEMES.json', 'FORMS_REGISTRY.json', 'NOTICES_AND_ALERTS.json', 'SOURCE_REGISTRY.json'];
  const files = {};
  for (const file of required) {
    try { const data = JSON.parse(await readFile(path.join(phase1Dir, file), 'utf8'));
      files[file] = { present: true, rootKeys: Object.keys(data), counts: Object.fromEntries(Object.entries(data).filter(([, v]) => Array.isArray(v)).map(([k, v]) => [k, v.length])) };
    } catch (error) { files[file] = { present: false, error: error.code === 'ENOENT' ? 'MISSING' : 'INVALID_JSON' }; }
  }
  const schemeMatrix = parse(await readFile(path.join(phase1Dir, 'SCHEME_VERIFICATION_MATRIX.csv'), 'utf8'), { columns: true, skip_empty_lines: true, bom: true });
  const sourceDecisions = parse(await readFile(path.join(phase1Dir, 'SOURCE_PERMISSION_DECISIONS.csv'), 'utf8'), { columns: true, skip_empty_lines: true, bom: true });
  return { generatedAt: new Date().toISOString(), files, csvEvidence: {
    schemeMatrixRows: schemeMatrix.length, sourcePermissionRows: sourceDecisions.length,
    sourceColumns: Object.keys(sourceDecisions[0] || {}), schemeColumns: Object.keys(schemeMatrix[0] || {})
  }, approvedLiveAdapters: (await approvals()).filter(a => approval.safeParse(a).success && a.enabled && new Date(a.approvalExpiry) > new Date()).length,
    note: 'CSV evidence is not a substitute for the missing JSON research datasets.' };
}
async function main() {
  await mkdir(reportDir, { recursive: true });
  if (['audit', 'report'].includes(command)) {
    const result = await auditInputs();
    await writeFile(path.join(reportDir, 'input-audit.json'), `${JSON.stringify(result, null, 2)}\n`);
    console.log(JSON.stringify(result, null, 2)); return;
  }
  if (command === 'registry') {
    const raw = await approvals();
    const invalid = raw.filter(a => !approval.safeParse(a).success).length;
    console.log(JSON.stringify({ entries: raw.length, invalid, default: 'DENY', enabled: raw.filter(a => a.enabled).length }));
    if (invalid) process.exitCode = 1; return;
  }
  if (command === 'import' || command === 'import-available') await readPackage(phase1Dir, { availableOnly: command === 'import-available' });
  if (command === 'dry-run' || command === 'approved') {
    const sources = await approvals();
    if (command === 'dry-run' || sources.length === 0 || env.ENABLE_LIVE_COLLECTION !== 'true') {
      const result = await collect(null, sources, { dryRun: true, enableLive: env.ENABLE_LIVE_COLLECTION === 'true' });
      await writeFile(path.join(reportDir, command === 'dry-run' ? 'dry-run.json' : 'approved-no-op.json'), JSON.stringify(result, null, 2));
      await appendFile(path.join(reportDir, 'no-op-history.jsonl'), `${JSON.stringify(result)}\n`);
      console.log(JSON.stringify({ ...result, note: 'Safe no-op/dry run; no HTTP requests or database writes.' }, null, 2)); return;
    }
  }
  await connectDB();
  if (command === 'db') {
    let transactions = false; try { await requireTransactions(); transactions = true; } catch { /* reported below */ }
    console.log(JSON.stringify({ connected: true, transactions, note: transactions ? 'Ready for ingestion' : 'Read-only startup works; ingestion needs a replica set' })); return;
  }
  if (['reviews', 'runs', 'changes'].includes(command)) {
    const model = { reviews: 'ReviewItem', runs: 'IngestionRun', changes: 'ChangeEvent' }[command];
    const rows = await models[model].find(command === 'reviews' ? { queueStatus: 'PENDING' } : {}).sort({ createdAt: -1 }).limit(25)
      .select('id entityType entityId reason summary mode outcome counters createdAt').lean();
    console.log(JSON.stringify(rows, null, 2)); return;
  }
  await requireTransactions(); await initModels();
  const store = new MongoStore(); let result;
  if (command === 'import' || command === 'import-available') result = await importResearch(store, phase1Dir, { availableOnly: command === 'import-available' });
  else if (command === 'fixtures') result = await collect(store, JSON.parse(await readFile(path.join(serverRoot, 'fixtures/sources.json'), 'utf8')),
    { offline: true, fixtureRoot: path.join(serverRoot, 'fixtures') });
  else if (command === 'approved') result = await collect(store, await approvals(), { enableLive: true });
  else throw new Error('Unknown command. See README for supported commands.');
  await writeFile(path.join(reportDir, `${command}-latest.json`), `${JSON.stringify(result, null, 2)}\n`);
  console.log(JSON.stringify(result, null, 2));
  if (result.counters.failed || result.counters.rejected) process.exitCode = 1;
}
if (process.argv[1] && path.resolve(process.argv[1]) === path.join(serverRoot, 'scripts', 'cli.js')) {
  try { await main(); } catch (error) {
    // Raw database/network errors can contain credentials; print only controlled messages.
    const safe = /^Phase 1 input files missing|^Invalid input root|^MongoDB unavailable|^Writes require|^Source approvals|^Unknown command/.test(error.message);
    console.error(JSON.stringify({ error: safe ? error.message : 'Operation failed. Check configuration, input contracts and database availability.' }));
    process.exitCode = 1;
  } finally { await disconnectDB(); }
}
