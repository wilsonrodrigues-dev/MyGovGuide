# MyGovGuide

## Latest: first real citizen publication — 18 November 2026

The owner explicitly approved all three PM-KISAN editorial revisions and publication. **One scheme is now genuinely published in EN/HI/KN**, with three approved search documents and one publication event in Atlas `mygovguide_dev`. All 15 original Gemini artifacts remain intact; three new editorial revisions bring the total to 18, without any new model calls. Three revisions are approved/published; 15 originals/other outputs remain review-pending (including three superseded originals). Eligibility rule approvals remain zero.

Existing `/schemes` and `/schemes/:id` React routes now display published MongoDB content through the existing public APIs, including language/fallback, benefits, source/date, official application guidance and explicit document/eligibility unknowns. Guest browsing works; research/fixtures/stale content stays excluded. Actual Atlas-backed EN/HI/KN browser search/detail verified, not mocked.

NDMA source execution was separately restored in Atlas after current evidence/expiry checks: genuine HTTP200, 100 parsed and 100 unchanged, then HTTP304 with zero new records/versions. Atlas retains 100 live notices, all internal historical snapshots. One active adapter configuration, two jobs/runs, zero schedules. Original expiry remains 25 November. No additional dataset API met the complete endpoint/rights/credential requirements; exact primary-source findings and blockers are documented.

Current key counts: 119 sources, 192 versions, 25 schemes, 164 facts, 116 notices, five fact approvals, 15 AI jobs, 18 artifacts, three public search documents, one publication, 205 pending content review items. Verification: 85 backend + five frontend tests; 31 integration nodes; 22 desktop/mobile browser journeys; build passed. Existing components were extended in place, no new dashboard or unrelated feature phase.

[Full data-to-citizen completion report](docs/history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md) · [Per-record lineage JSON](backend/reports/atlas-data-lineage.json) · [Dataset API findings](docs/guides/OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day status sections below are historical checkpoints.


## Current backend and AI storage — 18 November 2026 (latest)

The backend and worker now load the owner's **Atlas `mygovguide_dev` database from ignored `backend/.env`**, with an explicit process-only SRV DNS setting after system DNS refused Atlas lookup. `.env.example` is never loaded. Existing process variables take precedence; restart services after private configuration changes.

After explicit owner approval, 942 content/review documents across 16 exact collections were copied to the previously empty Atlas database, preserving document hashes/indexes and all local data. This includes 25 schemes, 116 notices, five fact approvals and 15 validated EN/HI/KN artifacts. All artifacts remain editorial-review pending; zero publication/eligibility approvals. Sessions, accounts, operational logs, adapter configurations, schedules and worker state were excluded. Revalidate source activation in Atlas before further live collection; historical collection logs remain local.

The existing API was refreshed and worker started; authenticated API lists all 15 Atlas artifacts, frontend proxy health is connected and the worker heartbeat is current. Gemini metadata check succeeded using private credentials, with zero new generation/paid requests. Revalidation of all copied artifacts passed. Latest checks: 85 backend + four frontend tests and 31 isolated native MongoDB integration nodes passed.

[Diagnosis, migration scope, errors and verification](docs/history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). The earlier local-only reports below describe the state before this approved Atlas transfer.


Latest real-data results (18 November): authorized NDMA RSS stored 100 real notices; repeat HTTP 304 added no duplicates. Five owner-approved scheme fact packets produced 15 validated EN/HI/KN Gemini artifacts, all pending editorial approval; no publication or paid requests. [Collection report and exact blockers](docs/history/REAL_DATA_COLLECTION_REPORT.md). Restart backend/worker for the privately configured native application database and live-source enablement.

[Whole-project status report](docs/PROJECT_STATUS_REPORT.md) — completed work, current data, verification and remaining blockers as of 18 November 2026.

Current implementation: **Phase 3.6 Civic Blue + reviewed-content preparation**. [Product Master Plan](PRODUCT_MASTER_PLAN.md) is the sole authoritative product specification; [Progress](PROGRESS.md) records completed features and unresolved blockers. The existing app includes version-bound AI jobs/artifacts, English/Hindi/Kannada keywords, editor review/publication and indexed MongoDB read endpoints. Gemini is the sole AI provider; the retired provider implementation and configuration have been removed.

Use the [documentation index](docs/README.md) for [operating guides](docs/README.md#operating-guides), [historical reports](docs/README.md#historical-evidence) and [archived prompts/plans](docs/README.md#archived-prompts-and-plans). Historical instructions do not authorize new development or override the master plan. See [AI operations](docs/guides/AI_PROCESSING_RUNBOOK.md), [implementation traceability](docs/history/PHASE3_6_TRACEABILITY.md) and the [completion report](docs/history/PHASE3_6_COMPLETION_REPORT.md).

`npm run ai:check` performs metadata-only provider checks; `npm run db:migrate:content` adds content collections/indexes after database inspection. `npm run worker` now processes both collection and AI jobs under existing scheduling/authentication gates. Generation is disabled unless source review and entitlement/budget requirements pass. No government live source or paid API use was activated by this phase.

Gemini validation on 18 November: the owner confirmed the primary project's Free tier without linked paid billing. Three real `gemini-3.5-flash-lite` requests produced valid EN/HI/KN explanations and keywords, stored only as review-pending artifacts in an isolated test database. No publication or paid generation occurred. [Actual results and current pricing references](docs/history/GEMINI_INTEGRATION_VALIDATION.md). `npm run ai:validate` is an explicit manual free-only diagnostic, never part of ordinary tests or startup.

**Government Information, In Your Language.** A Karnataka-first citizen information assistant with English, Hindi and Kannada interfaces.

Phase 3 implements onboarding, personalized Home and editable preferences with secure anonymous sessions. Phase 3.5 adds a separate protected `/admin` workspace, asynchronous collection worker, persisted schedules, data explorer, Change Radar and evidence-based review. The existing pipeline and citizen features are preserved; no Phase 4 citizen features are implemented.

For current setup, use the [admin guide](docs/guides/ADMIN_DASHBOARD_GUIDE.md), [database configuration](docs/guides/DATABASE_CONFIGURATION.md), [collection operations](docs/guides/SCRAPING_OPERATIONS_GUIDE.md) and [scheduler guide](docs/guides/SCHEDULER_CONFIGURATION.md). Run `npm run worker` alongside the existing backend/frontend terminals. Administrator login uses private ADMIN_USERNAME and ADMIN_PASSWORD values in backend/.env; no database bootstrap is required. The [Phase 3.5 report](docs/history/PHASE3_5_COMPLETION_REPORT.md) distinguishes successful local fixtures from blocked Atlas/live access. Historical reports below describe earlier phases.

## Run locally

Use Node.js **24** and native MongoDB Community **8**. From this root:

```powershell
npm ci --ignore-scripts
npm run db:local
```

Keep the database terminal open. The helper preserves the existing project replica set, database `mygovguide_phase2`, port **27018**, and `.local/mongo-test/` files. The existing MongoDB service on 27017 is unchanged. Set MONGOD_PATH if mongod is installed elsewhere.

In a second terminal:

```powershell
npm run dev:backend
```

In a third terminal:

```powershell
npm run dev:frontend
```

Open **http://127.0.0.1:5173**. The API uses **http://127.0.0.1:3001**. Vite proxies /api for same-origin cookies. Use the same loopback hostname consistently. Both folders also run directly with `cd backend; npm run dev` and `cd frontend; npm run dev`; each contains its own package.json and README. Use `npm install --ignore-scripts` when installing independently; the root lockfile provides reproducible workspace installation.

## Configuration

Optional environment files are backend/.env and frontend/.env; examples contain no secrets. Defaults work without API keys. Paths resolve from each application folder.

- MONGODB_URI retains the existing database; ingestion requires replica-set transactions.
- PHASE1_DATA_DIR defaults to backend/research/phase1.
- CLIENT_ORIGINS lists exact local frontend origins; configure exact HTTPS origins before any future deployment.
- VITE_API_BASE_URL defaults to /api. API_PROXY_TARGET can change the local proxy target.
- ENABLE_LIVE_COLLECTION defaults false and the approval registry is empty.

## Tests and build

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

Root tests include backend and frontend component/contract checks. MongoDB tests retain the existing isolated test-database naming strategy. Missing test configuration skips honestly; an explicitly configured but unreachable database fails.

Browser tests use installed Edge on Windows; other platforms need Playwright Chromium. They start direct Node servers on 3011 and 4173 and close only those owned processes, refusing occupied ports. Build after frontend changes before running browser tests. Automated mobile viewports do not constitute physical-device testing.

## Data pipeline

```powershell
npm run audit:data
npm run import:available
npm run collect:fixtures
npm run collect:dry-run
npm run collect:approved
npm run report:phase2
npm run reviews
npm run runs
npm run changes
```

All four research JSON files are supplied. The full import reads **137 records**: 70 source references, 25 schemes, 18 forms, 12 historical notices and 12 undated awareness topics. The last two full imports each left all 137 unchanged, with no new rejections, changes or review items. Synthetic fixtures remain separate from this research package.

Available schemes remain research-only, all 25 rule sets remain incomplete, and no live source is approved. The public preview endpoint returns only reviewed, active, publication-cleared metadata matched to the owning profile. The current data correctly produces an empty state. No government site was scraped or research record promoted to populate the UI.

## Anonymous preferences

The server issues a random HttpOnly, SameSite=Strict cookie and stores only its hash, preferences and expiry. Production mode adds Secure and the __Host- prefix. Profile mutations use the owning cookie and trusted-origin checks; no separate verification token is generated or required. A client UUID cannot grant ownership.

Local storage contains preferences and pending-sync state only. The app distinguishes securely saved, locally pending and visit-only states. Pending changes are retried without silently replacing them with older server values. Preview criteria must match the visible preferences. No name, phone, Aadhaar or government application data is requested.

## Structure

```text
backend/                 Express, MongoDB, ingestion, security, research and tests
  docs/                  Backend technical contracts, source logs and historical inventories
  research/phase1/        Research datasets, source evidence and audits
  reports/               Actual execution and preservation evidence
frontend/                React, styles, translations, design references and tests
  design/stitch/         Actual private project/system/screen metadata
  reports/               Build/browser results and screenshots
.github/workflows/       Inactive collection scheduling foundation
docs/
  guides/                Admin, scraping, AI, scheduler, database and quality operations
  history/               Phase completion/test reports and preserved test evidence
  plans/                 Superseded development prompts, handoff and blueprint
```

All original research/specification contents are preserved; phase reports and old specifications have moved to `docs/history/` and `docs/plans/`. See [Phase 3 completion](docs/history/PHASE3_COMPLETION_REPORT.md), [progress](PROGRESS.md), [backend guide](backend/README.md), [frontend guide](frontend/README.md), and [design system](frontend/DESIGN_SYSTEM.md). The [old source tree](backend/docs/phase2/PROJECT_STRUCTURE.txt) is a historical snapshot, not the current documentation layout.

## Troubleshooting

- MongoDB unavailable: run db:local and check port 27018 / MONGODB_URI. A standalone server cannot provide ingestion transactions.
- Sync unavailable: inspect the API, exact hostname/origin and cookies. The UI states which storage succeeded and retries safely.
- Empty schemes: expected until independent review and publication approval. Do not publish research merely to populate cards.
- Test ports occupied: stop your own test servers; the harness never replaces unrelated listeners.
- Research-only content: all four input datasets are present; their presence does not grant source automation, publication or eligibility-rule approval.

No site was deployed. Native Stitch tools became visible but their final read returned Authentication required. Successful direct MCP design generation/read and real references are separately recorded; no Stitch credential is stored in application source.
