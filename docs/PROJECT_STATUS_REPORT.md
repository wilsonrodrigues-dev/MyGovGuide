# MyGovGuide — Whole-project status report

## Latest: first real citizen publication — 18 November 2026

The owner explicitly approved all three PM-KISAN editorial revisions and publication. **One scheme is now genuinely published in EN/HI/KN**, with three approved search documents and one publication event in Atlas `mygovguide_dev`. All 15 original Gemini artifacts remain intact; three new editorial revisions bring the total to 18, without any new model calls. Three revisions are approved/published; 15 originals/other outputs remain review-pending (including three superseded originals). Eligibility rule approvals remain zero.

Existing `/schemes` and `/schemes/:id` React routes now display published MongoDB content through the existing public APIs, including language/fallback, benefits, source/date, official application guidance and explicit document/eligibility unknowns. Guest browsing works; research/fixtures/stale content stays excluded. Actual Atlas-backed EN/HI/KN browser search/detail verified, not mocked.

NDMA source execution was separately restored in Atlas after current evidence/expiry checks: genuine HTTP200, 100 parsed and 100 unchanged, then HTTP304 with zero new records/versions. Atlas retains 100 live notices, all internal historical snapshots. One active adapter configuration, two jobs/runs, zero schedules. Original expiry remains 25 November. No additional dataset API met the complete endpoint/rights/credential requirements; exact primary-source findings and blockers are documented.

Current key counts: 119 sources, 192 versions, 25 schemes, 164 facts, 116 notices, five fact approvals, 15 AI jobs, 18 artifacts, three public search documents, one publication, 205 pending content review items. Verification: 85 backend + five frontend tests; 31 integration nodes; 22 desktop/mobile browser journeys; build passed. Existing components were extended in place, no new dashboard or unrelated feature phase.

[Full data-to-citizen completion report](history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md) · [Per-record lineage JSON](../backend/reports/atlas-data-lineage.json) · [Dataset API findings](guides/OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day status sections below are historical checkpoints.


## Current backend and AI storage — 18 November 2026 (latest)

The backend and worker now load the owner's **Atlas `mygovguide_dev` database from ignored `backend/.env`**, with an explicit process-only SRV DNS setting after system DNS refused Atlas lookup. `.env.example` is never loaded. Existing process variables take precedence; restart services after private configuration changes.

After explicit owner approval, 942 content/review documents across 16 exact collections were copied to the previously empty Atlas database, preserving document hashes/indexes and all local data. This includes 25 schemes, 116 notices, five fact approvals and 15 validated EN/HI/KN artifacts. All artifacts remain editorial-review pending; zero publication/eligibility approvals. Sessions, accounts, operational logs, adapter configurations, schedules and worker state were excluded. Revalidate source activation in Atlas before further live collection; historical collection logs remain local.

The existing API was refreshed and worker started; authenticated API lists all 15 Atlas artifacts, frontend proxy health is connected and the worker heartbeat is current. Gemini metadata check succeeded using private credentials, with zero new generation/paid requests. Revalidation of all copied artifacts passed. Latest checks: 85 backend + four frontend tests and 31 isolated native MongoDB integration nodes passed.

[Diagnosis, migration scope, errors and verification](history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). The earlier local-only reports below describe the state before this approved Atlas transfer.


**As of 18 November 2026, Asia/Calcutta.** This consolidates the work completed so far, current verification and remaining scope. [PRODUCT_MASTER_PLAN.md](../PRODUCT_MASTER_PLAN.md) remains the single authoritative product specification; this report creates no new plan or implementation phase. Historical reports preserve what was true at their execution dates.

## 1. Overall position

MyGovGuide has a working multilingual citizen foundation, research database, permission-gated collection pipeline, operational admin dashboard, background workers/scheduler, and reviewed AI-content preparation/publication system. Real Gemini generation has been verified for English, Hindi and Kannada, first with an isolated test and subsequently with five owner-approved real scheme fact packets in the application database.

**The complete citizen product is not finished or publicly deployed.** NDMA SACHET RSS is now authorized and collected: 100 real notices, followed by HTTP 304 without duplicate writes. Five real schemes have 15 validated multilingual artifacts awaiting editorial approval. Zero schemes are published and eligibility rules remain unapproved. Other source access restrictions are documented in the [real-data report](history/REAL_DATA_COLLECTION_REPORT.md).

The project was extended in place throughout this work. Existing backend/frontend applications, research, database files, earlier reports and completed features were preserved.

## 2. Application and technology foundation

| Area | Implemented state |
| --- | --- |
| Repository | Existing `backend/` and `frontend/` JavaScript workspaces with root npm scripts and lockfile |
| Backend | Node.js 24, Express, Mongoose, Zod, ingestion adapters, APIs, worker and scheduler |
| Frontend | React, Vite, Tailwind/shared CSS, routing, i18next, Lucide and bundled multilingual fonts |
| Database | Native local MongoDB replica set; optional privately configured Atlas; isolated timestamped test databases |
| AI | Gemini-only router using official `@google/genai`; private model/key configuration; no active Mistral implementation/configuration/dependency |
| Design | Civic Blue navy/indigo theme across citizen and admin; Noto Latin, Hindi and Kannada retained |
| Local operation | Separate native database, API, frontend and worker processes; no Docker requirement |
| Documentation | Root master plan/README/progress; operating guides in `docs/guides/`, historical reports in `docs/history/`, old prompts/plans in `docs/plans/` |

## 3. Work completed by area

### Research and data import

- Preserved source-backed research for 25 schemes, 18 form/application references, historical notices, undated scam-awareness topics, source decisions and supporting audits.
- All four research JSON datasets are supplied. The full import reads **137 inputs**: 70 source references + 25 schemes + 18 forms + 12 notices + 12 awareness topics.
- Repaired the original mappings/import coverage without inventing missing government facts or promoting research into eligibility rules.
- The last two full imports each reported **137 unchanged**, zero new records/updates/rejections, and no new changes or review items. No application import was rerun for the latest session change.
- Original evidence, source URLs, provenance, versions, hashes and research/fixture distinctions are retained. All 17 original research files still match their preservation hashes, accounting for the two reports relocated to history.

### Collection, normalization and source controls

- API/RSS/HTML/PDF adapter foundation and deterministic offline fixture collection.
- Default-deny source controls at enqueue/request/redirect/commit; exact endpoint/method/evidence checks, bounded requests and source-specific rate limits.
- Conditional HTTP handling where supported, immutable source versions, normalization, duplicate detection, material-change tracking and review staging.
- Improved scheme candidate fields and PIB parsing that classifies news as notices rather than inventing eligibility schemes.
- Import/research/fixture/live modes remain separate. No fixture success is presented as successful live government scraping.

### Existing administrator dashboard

- Protected `/admin` workspace within the existing frontend; separate admin bundle and navigation.
- Overview with database/pipeline metrics; source evidence and activation controls; bounded collection jobs, progress and safe cancellation.
- Persisted schedules with timezone/cron validation, ON/OFF state, next run and history; worker leases and restart recovery.
- Data Explorer, raw/current versions, changes/diffs, review queues, worker/system status and operational audit.
- AI processing and Review & publish: source/fact/rights/currentness review, language queueing, output/source comparison, new draft revisions, reject/approve, publication/withdrawal and history.
- Source approval, content review/publication and eligibility-rule approval remain distinct gates. A dashboard toggle does not authorize scraping.

### Citizen foundation

- Manual onboarding with state, category and language preferences; editable Settings.
- Existing Home navigation/actions, personalized context and honest loading/error/empty/future-feature states; informational How it works page.
- English, Hindi and Kannada static UI, local fonts and language switching.
- Local non-sensitive preferences and anonymous server synchronization; recovery from unavailable/expired sessions without replacing newer pending local choices.
- Existing scheme previews read only current publication-cleared content. With no real published schemes, the empty state is expected.
- Keyboard and responsive browser journeys, including 320/360/390px layouts. Automated viewports do not establish physical-device or screen-reader acceptance.

### Reviewed AI preparation, storage and search

- Version/hash-bound source fact/rights/currentness approval snapshots.
- Durable idempotent AI jobs and leased processing in the existing worker; bounded retry, quota cooldown, failure states and usage tracking.
- Structured EN/HI/KN explanations, titles, aliases, keywords and optional romanized terms grounded in approved input.
- Zod/JSON validation with preserved facts, numeric/date/document/link/citation checks; original source evidence is never replaced by generated text.
- Separate editorial review and publication; generation alone creates internal review-pending artifacts. Source changes stale/withdraw dependent derived content and prevent obsolete in-flight results from committing.
- MongoDB Unicode token indexes and bounded deterministic ranking/filtering; no AI call per search keystroke and no public collection-wide regex fallback.
- Current reviewed English fallback when an approved localized version is unavailable. Synthetic test content remains excluded from public results.

## 4. Current authentication/session behavior

The owner requested simpler authentication after the original security implementation. These are the **current** contracts; older reports describing CSRF requirements or database admin accounts are historical.

| Area | Current behavior |
| --- | --- |
| Admin login | Compare username/password against private `ADMIN_USERNAME` and `ADMIN_PASSWORD` in ignored backend `.env` |
| Admin persistence | In-memory login session identified by HttpOnly cookie; eight-hour validity; logout revokes it; restarting the backend clears it |
| Admin database use | No MongoDB account/session lookup for login, session restoration or logout; actual dashboard data and operational audit still use MongoDB |
| Citizen preferences | Owning HttpOnly cookie identifies an anonymous MongoDB session; only the session hash and minimal preferences/expiry are stored |
| Additional request token | **No CSRF token generation, response fields, middleware checks, frontend token state or request headers remain in active application code** |
| Remaining behavior | Cookie ownership, session expiry, preference validation, citizen trusted-origin/CORS checks, request limits, source permissions and editorial/spending gates remain |

Citizen profile writes and session deletion work with the owning cookie alone, without a separate token. Missing/expired sessions recover through session bootstrap. Removing the additional token did not create public admin access or remove ownership checks. Citizen and administrator cookies remain separate. Admin environment credentials are configured privately; their values are not included in this report.

## 5. Application database inventory

Actual native application database `mygovguide_phase2` inspected 18 November after the real-data task:

| Collection / state | Count |
| --- | ---: |
| Source identities | 119 |
| Immutable source versions | 192 |
| Schemes / scheme facts | 25 / 164 |
| Incomplete eligibility rule sets / approved rule sets | 25 / 0 |
| Forms / awareness topics | 18 / 12 |
| Notices: LIVE / RESEARCH / SYNTHETIC | 100 / 12 / 4 |
| Change events / review events | 21 / 5 |
| Review items total / pending | 210 / 205 |
| Historical import rejections / ingestion runs | 12 / 17 |
| Active approved live sources | 1 (NDMA SACHET) |
| Fact approvals / AI jobs / validated review-pending artifacts | 5 / 15 / 15 |
| Published schemes / public search documents / publication events | 0 / 0 / 0 |

All 17 original research hashes match; test databases remain separate. [Current machine audit](../backend/reports/real-data-final-audit.json) and [actual dashboard proof](../backend/reports/real-data-dashboard-proof.json).

## 6. Actual real Gemini validation

Latest application run: five owner-approved limited public fact packets produced **15 validated artifacts**, five per language, with `gemini-3.5-flash-lite`; all remain `REVIEW_PENDING`. Fifteen successful responses reported 16,980 input + 20,387 output = **37,367 tokens**. One transient `PROVIDER_TEMPORARY` attempt was retried successfully; its usage is unknown. Free-tier entitlement/settings were retained, paid approval false and budget zero; no paid calls or publication. Missing documents, full operative eligibility, dates and rights limitations remain visible for editorial review. [Generation receipt](../backend/reports/five-real-schemes-ai.json), [fact packets and owner approval](FIVE_SCHEME_FACT_REVIEW.md).

The earlier isolated diagnostic is preserved below and is separate from those 15 application artifacts.

| Check | Verified result |
| --- | --- |
| Model | `gemini-3.5-flash-lite` |
| Selection evidence | Reachable model metadata + documented structured-output capability/pricing; owner confirmed primary project Free tier without linked paid billing |
| Requests | **3 real requests**, one each for English, Hindi and Kannada |
| Input / output / total tokens | **2,205 / 2,533 / 4,738** reported tokens |
| Spending | Zero paid requests; free-tier estimated cost $0; paid-use flag false and paid budget zero. Invoice/billing balances were not independently inspected. |
| Content | Labeled isolated validation copy of non-sensitive historical PM-KISAN research; not a current eligibility assertion |
| Important facts | INR 6000 preserved; 2026-11-18 explicitly a test reference date, not an application deadline |
| Validation | All three outputs passed; deliberately altered amounts/dates were rejected |
| Storage | Three existing-system AIArtifacts stored as `REVIEW_PENDING`; original evidence unchanged |
| Publication | Scheme remained internal; **zero published indexes or publication events** |
| Secondary credential | Preserved privately; no live generation or quota failover test performed |

The 429 project cooldown never rotates keys to evade quotas. Gemini credentials remain only in backend private configuration. Real generation is an explicit diagnostic, not part of ordinary automated tests, source fetching or search. No new generation requests were made during the latest session-token removal.

Details, official references and receipts: [Gemini integration validation](history/GEMINI_INTEGRATION_VALIDATION.md), [generation receipt](../backend/reports/gemini-generation-validation.json).

## 7. Verification and corrections

The latest verification after real-data adapters, provenance classification and test-environment isolation:

| Check | Result | Evidence |
| --- | --- | --- |
| Backend unit/component | **85 passed**, zero failures/skips | [Unit output](../backend/reports/real-data-unit-tests.txt) |
| Frontend contracts/translations/contrast | **4 passed**, zero failures/skips | Same unit output |
| Native MongoDB integration | **31 test nodes passed**: 4 parents / 27 child scenarios; zero failures/skips | [Integration output](../backend/reports/real-data-integration-tests.txt) |
| Browser regression/theme + synthetic editor flow | **18 passed**: 16 regression/theme + 2 content journeys, desktop/mobile | [Browser output](../frontend/reports/real-data-browser-tests.txt) |
| Production bundle | Passed | [Build output](../frontend/reports/real-data-build.txt) |
| Source/research preservation | 17 original research hashes match; collection permission gates retained | Inventory audit and earlier preservation reports |

Coverage includes onboarding, editing/restoring preferences, language changes, cookie-only writes/deletion, missing/expired session handling, ownership isolation, invalid preferences/origins, admin environment login without MongoDB, jobs, schedules, source denials, versioning, AI failures, factual checks, artifact reviews, indexed search and publication gates.

Earlier issues corrected include import mappings, conditional HTTP handling, PIB Notice classification and an asynchronous editor-close race found by mobile tests. Initially unavailable sandbox networking/local database were resolved before real Gemini success; no paid retry or quota workaround was used. Old failure outputs and original phase reports remain available.

## 8. What remains incomplete or blocked

| Area | Remaining work / blocker |
| --- | --- |
| Government live collection | NDMA operates within the recorded RSS scope, approval expires 25 November. PIB robots evidence remains unusable; OGD needs a permitted API/key and dataset review; RBI rejected transport; Income Tax guarded HTTP403 remains disabled. myScheme needs written permission. |
| Real published content | Five fact snapshots owner-approved for AI only; 15 artifacts await language/editor signoff and unresolved facts/currentness review. No eligibility or publication approval was given. |
| Eligibility | All 25 rule sets remain incomplete/unapproved; definitive eligibility/gap decisions and citizen UI are not implemented. |
| Full scheme citizen experience | Existing previews and public read APIs are groundwork; full discovery/details/application guidance UI remains future scope. |
| Forms and notices | References/research exist; citizen catalog/detail guidance, unfamiliar form/notice upload, extraction and privacy flows remain unfinished. |
| Voice | Full opt-in cross-site command orchestration, spoken onboarding/navigation and real-device Hindi/Kannada quality acceptance remain unfinished. |
| Scam/current updates | Undated awareness data must remain distinct; verified dated public alerts and personalized notification infrastructure remain unfinished. |
| Centers/maps | Verified official center directory, coordinates, maps/list and permissioned location flow remain unfinished. |
| Citizen accounts | Optional registration/login, bookmarks/follows and personalized persistent notifications remain unfinished; current anonymous preferences are not registered accounts. |
| Complete Home | Approved-content slider and complete recommended-content experience depend on reviewed real data and additional citizen UI. |
| Atlas | Last read-only inspection failed DNS/connection; no Atlas writes. Local verification works. Reprobed during real-data work; the existing native application database is now explicitly selected in ignored configuration. |
| QA and tooling | Native Stitch authentication unresolved; actual earlier design references retained. Physical-device, screen-reader, native-speaker translation QA and production penetration testing remain unperformed. |
| Credentials/dependencies | Previously exposed credentials still require private rotation/confirmation. Last audit recorded one unpatched picomatch advisory through three development-tool packages; runtime audit was clean then. No new network audit was run here. |
| Deployment | No public deployment or production certification; hosted worker/scheduler strategy and production acceptance remain outstanding. |

No overall completion percentage is assigned: the implemented data/admin foundation and the remaining citizen product are different parts of the specification.

## 9. Run the existing project

Use Node 24. Configure database, admin and Gemini values only in ignored `backend/.env`; the example contains placeholders. When Atlas is unavailable, explicitly select the existing native database:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27018/mygovguide_phase2?directConnection=true
MONGODB_TEST_URI=mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true
```

Start each long-running service in a separate terminal from the project root:

```powershell
npm run db:local
npm run dev:backend
npm run dev:frontend
npm run worker
```

Open `http://127.0.0.1:5173`; admin is `/admin`. Native MongoDB uses port 27018, backend 3001. Admin credentials are read from `ADMIN_USERNAME` / `ADMIN_PASSWORD`; restart after changing them. The old bootstrap command is no longer needed to create a database account. In-memory admin sessions reset on restart; citizen preference sessions remain in MongoDB.

Reproduce automated verification:

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

`npm run ai:check` performs model metadata checks only. `npm run ai:validate` is a separate manual real-generation diagnostic; recheck current model/project free entitlement first. It is never required by the ordinary test command. No paid generation or source activation is implied by starting these services.

## 10. Supporting records

- [Current progress](../PROGRESS.md), [documentation index](README.md)
- [Admin guide](guides/ADMIN_DASHBOARD_GUIDE.md), [AI runbook](guides/AI_PROCESSING_RUNBOOK.md), [collection operations](guides/SCRAPING_OPERATIONS_GUIDE.md), [scheduler](guides/SCHEDULER_CONFIGURATION.md), [database setup](guides/DATABASE_CONFIGURATION.md)
- [Phase 2](history/PHASE2_COMPLETION_REPORT.md), [Phase 3](history/PHASE3_COMPLETION_REPORT.md), [Phase 3.5](history/PHASE3_5_COMPLETION_REPORT.md), [Phase 3.6](history/PHASE3_6_COMPLETION_REPORT.md), [traceability](history/PHASE3_6_TRACEABILITY.md)
- [Documentation cleanup](history/DOCUMENTATION_CLEANUP_VERIFICATION.md), [real Gemini validation](history/GEMINI_INTEGRATION_VALIDATION.md), [environment admin login](history/ENV_ADMIN_LOGIN_CHANGE.md)

Use this report for the consolidated current picture and the master plan for required product behavior. Earlier reports may describe superseded authentication/design choices or previously missing inputs; they remain historical evidence.
