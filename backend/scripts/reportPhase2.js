import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'csv-parse/sync';
import { auditInputs } from './cli.js';
import { serverRoot, projectRoot } from '../src/config/env.js';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { models } from '../src/models/index.js';

const output = path.join(serverRoot, 'reports'); await mkdir(output, { recursive: true });
await mkdir(path.join(serverRoot, 'docs/phase2'), { recursive: true });
const audit = await auditInputs();
const report = { generatedAt: new Date().toISOString(), audit, database: { available: false } };
try {
  await connectDB();
  report.database = { available: true, counts: Object.fromEntries(await Promise.all(Object.entries(models).map(async ([key, Model]) => [key, await Model.countDocuments()]))),
    approvedSources: await models.Source.countDocuments({ authorizationStatus: 'APPROVED' }),
    approvedRuleSets: await models.EligibilityRuleSet.countDocuments({ status: 'RULES_APPROVED_CURRENT' }),
    pendingReviews: await models.ReviewItem.countDocuments({ queueStatus: 'PENDING' }),
    supplementalSources: await models.Source.find({ sourceType: 'SUPPLEMENTAL_RESEARCH_REFERENCE' }).select('id title url authorizationStatus').sort({ id: 1 }).lean() };
} catch { report.database = { available: false, note: 'MongoDB unavailable; input audit still generated' }; }
finally { await disconnectDB(); }
await writeFile(path.join(output, 'phase2-status.json'), JSON.stringify(report, null, 2));
await writeFile(path.join(output, 'input-audit.json'), JSON.stringify(audit, null, 2));
const rows = parse(await readFile(path.join(serverRoot, 'research/phase1/SOURCE_PERMISSION_DECISIONS.csv'), 'utf8'), { columns: true, skip_empty_lines: true });
const escape = s => String(s || '').replaceAll('|', '\\|').replace(/\r?\n/g, ' ');
const table = rows.map(r => `| ${escape(r.id)} | [${escape(r.name)}](${r.url}) | DENIED | ${escape(r.scraperDecision20261116)} | ${r.rightsEvidenceUrl ? `[evidence](${r.rightsEvidenceUrl})` : 'Evidence pending'} |`).join('\n');
const fixtures = JSON.parse(await readFile(path.join(serverRoot, 'fixtures/sources.json'), 'utf8'));
const supplemental = (report.database.supplementalSources || []).map(s => `| ${escape(s.id)} | [${escape(s.title)}](${s.url}) | DENIED |`).join('\n');
await writeFile(path.join(serverRoot, 'docs/phase2/SOURCE_APPROVAL_LOG.md'), `# Source approval log\n\nGenerated ${report.generatedAt}. Original source decisions: [Phase 1 CSV](../../research/phase1/SOURCE_PERMISSION_DECISIONS.csv). No approvals have been fabricated. ${rows.length} evidence rows are preserved below; none permits live collection.\n\nLive configuration: backend/config/source-approvals.json is empty. ENABLE_LIVE_COLLECTION defaults to false. Public access, content reuse rights, and robot access are separate. myScheme remains excluded even if a malformed local approval is supplied.\n\n| ID | Source | Live | Unresolved decision | Supporting evidence |\n|---|---|---|---|---|\n${table}\n\n## Offline adapters\n\n${fixtures.map(s => `- ${s.sourceId}: ${s.method}; local ${s.fixture}; synthetic, offline only.`).join('\n')}\n\n## Supplemental URL identities\n\nThe partial importer creates stable deny-only Source identities for actual official URLs in supplied research. These are labelled SUPPLEMENTAL_RESEARCH_REFERENCE; they do not substitute for the missing 70-entry SOURCE_REGISTRY.json. Current database counts appear in backend/reports/phase2-status.json. No field-name labels in form metadata are citizen application data.\n\n## Before activation\n\nObtain source-specific access and reuse evidence; review host, exact paths, method, robots URL/observation/permission, terms, rights basis, API agreement if relevant, reviewer, expiry, rate limit and test plan. Add the reviewed record to the approval file and call the internal approveSource service to record a matching database decision. Validate with registry:validate, inspect collect:dry-run, and set ENABLE_LIVE_COLLECTION=true only after both approvals match. Scheduling remains commented out.\n`);
const ignored = new Set(['.git', 'node_modules', '.npm-cache', '.local']);
async function tree(dir, prefix = '') {
  const result = [];
  const entries = (await readdir(dir, { withFileTypes: true })).filter(e => !ignored.has(e.name) && e.name !== '.env').sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    result.push(`${prefix}${entry.name}${entry.isDirectory() ? '/' : ''}`);
    if (entry.isDirectory()) result.push(...await tree(path.join(dir, entry.name), `${prefix}  `));
  }
  return result;
}
await writeFile(path.join(serverRoot, 'docs/phase2/PROJECT_STRUCTURE.txt'), `MyGovGuide/\n${(await tree(projectRoot, '  ')).join('\n')}\n`);
await writeFile(path.join(serverRoot, 'docs/phase2/SUPPLEMENTAL_SOURCE_LOG.md'), `# Supplemental research URL identities\n\nThese actual research URLs are internal metadata, each denied for live collection. They are separate from the 70-row Phase 1 permissions CSV. No authorization or original registry entry is inferred.\n\n| ID | Reference | Live collection |\n|---|---|---|\n${supplemental}\n`);
console.log(JSON.stringify({ generatedAt: report.generatedAt, inputs: report.audit.files,
  database: { available: report.database.available, counts: report.database.counts,
    approvedSources: report.database.approvedSources, approvedRuleSets: report.database.approvedRuleSets,
    pendingReviews: report.database.pendingReviews },
  output: 'backend/reports/phase2-status.json; docs/phase2 source logs and project structure' }, null, 2));
