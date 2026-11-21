# Demo operations and rollback

## Current six-stage verification - 20 November 2026

Use [final acceptance](../history/FINAL_DEMO_COMPLETION_REPORT_2026_11_20.md) for current counts. The machine receipt was removed during the 21 November 2026 cleanup and remains in the local recovery branch. There are 35 stored / 24 published schemes, 19 form references / eight documents, and zero complete reviewed form guides. Three new rule packets are unapproved. Public notices and scam entries remain zero. The full real-content demo is incomplete even though local verification passed. Earlier counts in historical reports are snapshots.

Open `/admin/content?scope=DEMO&category=ALL` for the eight-scheme graph. The ALL scope retains the entire existing inventory/history. Preview attaches source/version evidence automatically. Keep incomplete rules, outdated forms and missing-rights content pending; normal UI operations do not authorize expanding a historical human decision. The curated graph is `backend/config/demo-manifest.json`.

For a single genuine collection, inspect the current source permission and expiry in `/admin/monitor`, select the authorized source and set the LIVE record limit to 1–3. Start only that job, then use its exact ID in a separate terminal:

```powershell
$env:ENABLE_LIVE_COLLECTION='true'
node backend/scripts/runCollectionJob.js JOB_ID_FROM_ADMIN
Remove-Item Env:ENABLE_LIVE_COLLECTION
```

The dedicated command processes that persisted bounded LIVE job in the demo database; it does not start cron or consume unrelated jobs. The API and worker must use the same private backend environment. Use the monitor's run-summary export and persisted replay after refresh. The two verified job IDs are `ded01619-eaf0-4307-969c-0486655b682d` and `75659580-401a-442b-b4b9-1793a60042c4`: HTTP 200, 100 parsed each, three NEW then three UNCHANGED. Do not rerun these completed IDs as a new demonstration. NDMA permission expires `2026-11-25T08:35:51.133Z`; after expiry use clearly labeled persisted history until permission is legitimately renewed. RSS announcements do not authorize eligibility extraction or CAP attachments.

Three genuine free-tier `gemini-3.1-flash-lite` outputs for a short public Meghalaya notice were validated in EN/HI/KN. The QA browser replay used those exact recorded outputs, labeled recorded, with no new model calls. It is neither a public notice publication nor evidence that a different private upload can be sent to a free provider. Default form extraction and local field reading make no external AI call. Keep private filled-form data out of providers/public research and do not bypass pending form fact/rights/currentness gates. Switching languages reuses versioned content/cache rather than regenerating valid output.

The 295 automated checks use isolated databases and explicit fixture/provider modes; the separate actual Atlas checks covered 24 pages and 72 language responses. Physical microphone/native voice quality still requires device testing. See the final report for exact real-versus-recorded-versus-synthetic evidence and screenshots. Stop owned test services with their terminal Ctrl+C; never stop OpenCode or unrelated development terminals. Existing backup/rollback instructions below remain applicable.

Use the existing MERN application. Runtime credentials come from ignored `backend/.env`; neither example file is loaded. The current selected database is `mygovguide_demo_v2`. See [acceptance report](../history/OPENCODE_CONTINUATION_ACCEPTANCE_REPORT.md) for actual content and limitations.

## Start and stop

From the repository root, run `npm start` for the API and `npm run dev:frontend` in a separate terminal. Open the URL printed by Vite, sign in with the configured environment administrator, and open **Advanced / Operations → Live monitor** (`/admin/monitor`). Manual controls remain available.

Use Ctrl+C in each terminal to stop only the processes you started. OpenCode's terminal is independent. Never terminate unrelated Node or MongoDB processes by image name.

Do not start the general worker merely to inspect content. `npm run worker` runs the existing queues/scheduler, including any authorized AI work already queued. Review the selected database, pending jobs and schedules first. Source permissions and provider entitlement gates still apply.

## Bounded genuine RSS demonstration

The implemented pilot selects only `live-ndma-sachet-rss`, verifies its existing matching source approval/configuration/expiry, and runs two jobs with a three-record commit cap. It does not consume other queued jobs or start cron. In PowerShell:

```powershell
$env:ENABLE_LIVE_COLLECTION='true'
node backend/scripts/demoSourcePilot.js --apply
Remove-Item Env:ENABLE_LIVE_COLLECTION
```

This performs real requests and adds pending evidence to the demo DB. Inspect the authorization expiry before running again. NDMA's feed is announcements, not scheme eligibility; CAP documents and images are outside this approval. A 100-item response can be parsed while only three items are committed. The run records both counts. Truncated responses do not save validators that could falsely mark unprocessed records complete. A failed/expired source is a real blocker; do not bypass it.

Open **Recent execution** in the monitor to inspect the saved run. Reloaded history is persisted prior execution, not a fresh fetch. Socket events are sequenced, sanitized and committed before broadcast; the API polls the same log for separate-worker writes. History expires after seven days. Existing execution/run records retain their own history. Stop requests are honored at safe transaction boundaries; retry creates a new gated run rather than editing a completed audit record.

## Database rollback and backup

Stop API/workers first. Use an Atlas role restricted to reads where available. Set `DATABASE_READ_ONLY=true`, `MONGODB_DB_NAME=mygovguide_dev`, `LEGACY_MONGODB_DB_NAME=mygovguide_dev`, and keep `DENY_LEGACY_DB_WRITES=true`. Use a cluster-root URI, without a conflicting database path. Restart only the API for inspection. The application guard rejects writes and the worker refuses to start; it is not a substitute for Atlas database permissions. Switch back to the demo name with `DATABASE_READ_ONLY=false` after stopping the API again. Never disable the legacy guard to make an operation pass.

`node backend/scripts/backupLegacy.js --verify-restore` reads legacy data and writes an AES-256-GCM backup under ignored `.local/legacy-backup/`. It requires an explicit local isolated `MONGODB_TEST_URI` and Windows CurrentUser DPAPI. The encrypted key file is bound to the current Windows account; retain it with the encrypted backup and receipt. This is **not portable recovery to another account/computer** without a separately managed recovery mechanism. Backup output contains no plaintext dump. Restore verification inserts documents and recreates indexes in a fresh local `mygovguide_phase2_test_backup_*` database, checks collection hashes, then removes that temporary restored database. It never restores over Atlas.

The old unrestricted migration already ran under OpenCode. Existing imported history has been preserved. Future `migrateDemoDatabase.js --apply` calls require one to ten explicit `--scheme-id=ID` arguments and select their evidence graph; they omit citizen/admin sessions, operational jobs and raw pending observations. Inserts remain additive. Historical Jan Suraksha seed/approval replay scripts refuse `--apply`; use exact new revisions and authenticated review instead.

## Providers, forms and discovery

Do not regenerate valid existing scheme artifacts. Form preparation requires a genuinely reviewed current blank document; outdated premiums and unresolved rights remain blockers. New form output includes meaning/what-to-enter and source-only examples, with local evidence validation and fenced resumable jobs. Local OCR supports English, up to two image/scanned PDF pages, within the existing upload limits. Low confidence and unsupported pages remain visible. No upload is stored or automatically sent to Gemini.

`POST /api/admin/source-discovery` accepts an existing public `schemeId` and `sourceGroup` (`JAN_SURAKSHA`, `PIB`, `NDMA`, `I4C`). It is authenticated, disabled by default, and requires `TAVILY_ENABLED=true`, a backend-only key and confirmed free entitlement. It has a persisted hard cap of two basic searches per UTC day, caches successful queries for 24 hours, and restricts returned official domains. There is no arbitrary citizen/private query input. Search candidates never grant automation rights or fact approval. No live Tavily call was made in this continuation.

Gemini secondary authorization and Groq free entitlement remain as configured privately. Do not enable paid usage, rotate projects to evade quota, or upload/rehost PDFs through ImageKit without its required credentials and explicit document rights.

## Verification

Use `npm run db:local` for the isolated replica set. Set a distinct `mygovguide_phase2_test*` URI before integration/browser tests, and disable live collection/provider entitlement in test processes. Run `npm test`, `npm run test:integration`, and `npm run build`. Run content and approval browser suites in separate harness invocations because both intentionally publish the same fixture revisions. Browser fixtures and recorded RSS tests are explicitly offline and do not prove live acquisition or human government-content approval.
