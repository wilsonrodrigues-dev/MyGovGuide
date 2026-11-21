# MyGovGuide administration

## Evidence preparation and review triage

Use `/admin/reviews` for the grouped evidence worklist. Filter by content type, risk, reason, title or active/handled state; open a packet for source/version evidence, original clauses, missing facts, differences, current AI comparison and administrative history. Original ReviewItem flags remain intact, so the raw pending count differs from active work. The current Atlas reduction is104 handled observations,212 active records and118 packets; [exact interpretation](../history/EVIDENCE_REVIEW_AUTOMATION_REPORT.md).

Batch handling only annotates routine observations or historical internal snapshots with a deterministic reason and per-record audit. It cannot approve source rights, facts, eligibility or AI publication. Stale snapshots are refused. Old NDMA snapshots are archived under a48-hour internal policy, not declared expired hazards; fresh/unverified notices remain blocked. Legacy record actions remain under the disclosure and wait for evidence to load. Use the existing publication/forms workspaces for actual human decisions.

`npm run reviews:prepare` rebuilds/caches evidence; `npm run reviews:triage` applies safe administrative handling. The existing worker refreshes evidence every five minutes without government or model requests from this task. Unchanged check metadata preserves valid annotations; changed content/scope/dependencies must be reassessed. Rights/currentness blockers cannot be solved by toggling permissions or passing a hash check.

## Incremental scheme collection — 18 November 2026

Use the existing /admin/collection page: the scheme table shows source, canonical ID, last checked, last observed change, collection classification and review/publication state. Filter by source/outcome, open preserved observation history and inspect exact before/after changes. Legacy research records show NO_COLLECTED_OBSERVATION until an actual collection check exists. The separate identity-review list shows ambiguous candidates, evidence and possible canonical matches. An explicit confirmed mapping requires official evidence and approves identity only. It does not approve facts or publication. Re-run the authorized source after mapping to process its evidence. Existing manual collection and schedule controls remain the entry points.

Current Atlas catalog:35 records,15 published schemes,117 artifacts,75 current language revisions; all20 pending records stay pending. [Audit and actual verification](../history/INCREMENTAL_SCHEME_COLLECTION_REPORT.md). Earlier dated checkpoint counts below are historical.


Latest execution: PM-KISAN has actual owner-approved EN/HI/KN publication in Atlas, three indexes and one publication record. Existing citizen discovery/detail routes now serve it. NDMA execution configuration was separately restored and verified with HTTP200/100 unchanged then HTTP304; no schedule or new notice/version. No new Gemini calls or eligibility approvals. [Current completion evidence and lineage](../history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md); [official dataset API findings](OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day local/zero-publication/configuration observations below are historical.


## Latest Atlas configuration — 18 November 2026

Backend/API/worker now select the private Atlas `mygovguide_dev` database through ignored `backend/.env`; `.env.example` is documentation only. Optional `MONGODB_DNS_SERVERS` is a process-only SRV resolver setting, blank by default; the current explicit setting resolves the machine's refused SRV lookup without weakening TLS/authentication.

Owner-approved transfer preserved 942 content/review records, including 25 schemes and 15 validated, review-pending Gemini artifacts. All local data remains safe. Sessions/accounts/audit logs, schedules, worker state and adapter configurations were excluded; collection activation/history must not be inferred from copied source records. The API and running worker connect to Atlas; the frontend uses the existing API proxy. No new generation or publication. [Exact diagnosis, transfer scope and verification](../history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). Earlier local-only observations below are historical.



## Real-data update — 18 November 2026

In the existing admin, Sources shows active authorized NDMA RSS and disabled Income Tax (guarded HTTP 403); collection history shows genuine NDMA 200/304 runs. Data Explorer distinguishes 100 LIVE notices, 12 imported research notices and four fixtures. Review & publish contains five owner-approved limited scheme fact packets and 15 validated English/Hindi/Kannada artifacts, all pending editorial review. Zero schemes are published; no eligibility rules approved. Missing facts/dates/documents and native-language quality still require review.

The selected application database is now the existing native MongoDB; restart backend/worker for private environment changes. No new schedule was created. Preserve free-only settings; these completed requests do not authorize paid usage or automatic publication. [Exact results and remaining blockers](../history/REAL_DATA_COLLECTION_REPORT.md), [five fact packets](../FIVE_SCHEME_FACT_REVIEW.md).

## Phase 3.6 additions

The existing workspace uses the shared Civic Blue theme. **AI processing** and **Review & publish** extend the same protected `/admin` app; there is no second dashboard or scheduler. Open a scheme, inspect source versions, record an explicit evidence/rights/currentness review, queue language preparation, compare proposed output with evidence, edit into a new revision, and approve/reject with a reason. Select current approved English and any available reviewed translations before publication. Eligibility rules remain a separate approval domain.

Overview now separates content-review snapshots, AI jobs, language/keyword preparation, stale state, provenance and published index records from collection/import totals. Data Explorer includes derived artifacts; Change Radar includes stale derivatives and regeneration jobs. Public scheme previews require the new artifact/index gates, so a legacy publication flag alone cannot expose research or fixture data.

See [AI_PROCESSING_RUNBOOK.md](AI_PROCESSING_RUNBOOK.md) for entitlement/cost controls, exact APIs, current blockers and reproducible offline demonstrations. No key values are displayed. Private metadata checks are not proof of paid/free generation entitlement.

Phase 3.5 adds `/admin` to the existing React application. Citizen onboarding, preferences, translations and Home are preserved. The admin code and CSS load separately.

## Private setup

Use Node 24 and native MongoDB Community with a replica set, or Atlas. No Docker is used.

1. Install dependencies with `npm install`.
2. Copy `backend/.env.example` to `backend/.env` **only when the latter does not already exist**. Keep private values out of the example and Git.
3. Set `MONGODB_URI` to a named application database and `MONGODB_TEST_URI` to a distinct database whose name begins `mygovguide_phase2_test`.
4. Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` privately in backend/.env. Blank placeholders are supplied; no default credentials are created.
5. Restart the backend after changing credentials. No administrator database record, bootstrap or session secret is needed.

Run each service in a separate terminal:

```powershell
npm run db:local
npm run db:inspect
npm run dev:backend
npm run dev:frontend
npm run worker
```

Open `http://127.0.0.1:5173/admin`. There is no default password or public administrator registration. If Atlas is unavailable, explicitly select the local URI from `.env.example` before starting services. There is no silent database fallback.

## Pages

| Page | Working controls |
| --- | --- |
| Overview | MongoDB counts, source restrictions, research status, historical rejection count, collection outcomes by fixture/live mode, run timeline and accessible table |
| Sources | Search registry, inspect latest job/outcome, edit evidence JSON, save → separately validate → activate, disable |
| Run collection | Choose a bundled synthetic fixture or activated live source, enqueue immediately, poll progress, inspect run details and request cancellation |
| Schedules | Daily, twice daily, weekly or custom cron; local time, IANA timezone, multiple sources, validation, edit and persistent ON/OFF |
| Execution history | Pagination and mode/trigger/outcome filters; timestamps, durations, counters, errors, reviews and changes |
| Data explorer | Scheme, form, notice and scam records; search, status filter, pagination, source links, original data and immutable versions |
| Change Radar | Previous/observed payload comparison, changed fields, source evidence and review state |
| Review queue | Inspect facts, supply evidence, request further review or reject; no eligibility approval action |
| System | Database name and transaction capability, live switch, recent worker heartbeat and audit history |

All displayed counts come from MongoDB. Fixture and live jobs are labeled separately from manual and scheduled triggers. Imports are labeled IMPORT; they are not government network collections. Historical rejected imports remain visible after successful repair.

## Authentication and access

Administrator login compares the submitted username/password with ADMIN_USERNAME and ADMIN_PASSWORD in the ignored backend environment. Login, session restoration and logout do not query MongoDB. There is no admin CSRF token or admin-specific Origin validation. Citizen sessions also use cookies without a separate verification token; ownership and trusted-origin checks remain.

After login an HttpOnly cookie identifies an in-memory session, valid for eight hours. Login rotates it and logout revokes it. Restarting the backend clears these sessions; changing .env credentials requires a restart and another login. Use one backend process for this local session model. The browser does not store the password. Cookies remain SameSite=Strict and use Secure in production. Login/API request limits remain.

The dashboard still requires login. Its scheme/source/job/review data and operational audit records continue to use MongoDB; unavailable data returns a database-unavailable message while login/session/logout remain usable. Authentication events are no longer stored in MongoDB. Existing historical administrator/session collections are preserved but ignored by login.

Source validation checks evidence completeness, expiry, exact registered host, paths and public DNS. It does **not** establish permission from missing or false evidence. The named administrator must verify the real policy before supplying an approval. Saving evidence invalidates validation and disables collection; a simple activation toggle cannot supply missing evidence.

## Review behavior

Review decisions cite the current source version and supporting evidence. Stale queue items cannot override newer observations. Rejection keeps records internal and updates the matching change status. Further review keeps the selected queue item pending; repeated review notes are recorded without promoting verification status. Eligibility rules cannot be approved through this API.

To change admin access, edit the private backend environment credentials and restart the backend. Do not delete application data or modify historical admin collections.
