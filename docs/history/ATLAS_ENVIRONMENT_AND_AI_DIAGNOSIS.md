# Backend environment, Atlas and AI diagnosis — 18 November 2026

The backend explicitly loads `backend/.env` via a module-relative path. It never loads `.env.example`; that file documents placeholders/defaults. Existing process environment variables take precedence over dotenv. Restart API and worker after private environment changes.

## Cause and correction

- The active private `MONGODB_URI` selected native local `mygovguide_phase2`; the supplied Atlas URI was commented out. The 15 generated language artifacts existed locally, so they were absent in Atlas.
- The machine's system DNS returned `ECONNREFUSED` for Atlas SRV lookups. Both explicit resolvers tested resolved the SRV records; Atlas authentication and read-only access then succeeded. No Atlas network allowlist, TLS or authentication control was weakened.
- Added optional `MONGODB_DNS_SERVERS` to backend configuration, validated as comma-separated IP addresses. It affects Node's process resolver only for an SRV connection. Blank retains system DNS. Ignored `.env` now selects the owner's Atlas URI/database `mygovguide_dev` and explicit process-only resolvers. Gemini primary/secondary keys and free-only settings remain private and unchanged.
- No worker was running, so newly queued content would not be processed. The existing worker was started against Atlas, and the existing API watch process refreshed. The frontend continues using its existing backend API proxy; it has no separate MongoDB connection or credentials.

## Explicitly approved data preservation

The owner approved: **“Approve content and review data copy.”** A narrowly enumerated transfer copied **942 documents across 16 content/review collections** into the previously empty Atlas database. Every copied document collection matched its source BSON hash and preserved its indexes. The local database remains unchanged; a BSON backup is retained under ignored `.local/atlas-content-backup/`.

Included: 119 sources, 192 source versions, 25 schemes, 164 facts, 25 unapproved rule sets, 18 forms, 116 notices, 12 awareness topics, 21 content changes, 210 review items, five review events, five fact approvals, 15 AI jobs and 15 AI artifacts. Search/publication collections remain empty.

Excluded: citizen sessions, admin accounts/sessions, operational audit logs, import/ingestion run logs, adapter configurations, schedules, provider/worker/lease state. Consequently historical collection run logs and source activation configuration remain in the preserved local database. Do not infer that a copied source approval alone enables live collection in Atlas; use the existing Source Manager validation/activation gates before a subsequent collection. No schedule or executable generation job was transferred.

[Verified copy receipt](../../backend/reports/atlas-content-preservation.json).

## Actual AI and runtime results

- `npm run ai:check`: primary metadata reachable, selected `gemini-3.5-flash-lite` available with `generateContent`; zero generation requests. This metadata does not independently attest billing tier. Existing owner-confirmed Free-tier settings remain in force, paid approval false and paid budget zero.
- Revalidated all **15 Atlas artifacts** against their copied approval snapshots: all passed. Five artifacts per language, English/Hindi/Kannada; all `REVIEW_PENDING`, non-public. No new generation or publication was needed.
- Running admin login HTTP 200, content metrics HTTP 200 and artifact listing count 15; database health connected. Atlas worker has a fresh RUNNING heartbeat. Initial diagnostic used the wrong login path and checked the worker before initialization completed; correcting the diagnostic yielded the successful runtime receipt without changing authentication.
- `npm test`: **85 backend + four frontend passed**. Native isolated MongoDB integration: **31 nodes passed**, zero failures/skips. Existing local tests remain separate from Atlas application data.
- Private environment and backup paths remain ignored by Git. Credentials were not printed or copied into documentation. This verifies configuration/storage, not editorial translation acceptance or credential rotation.

[Runtime/API/artifact validation receipt](../../backend/reports/atlas-runtime-verification.json) · [Integration output](../../backend/reports/atlas-config-integration-tests.txt).

## Access and remaining limits

Open your existing Atlas cluster in MongoDB Compass using the private URI from `backend/.env`, then select **`mygovguide_dev`**, collections **`schemes`**, **`notices`**, **`contentapprovals`**, **`aijobs`** and **`aiartifacts`**. Do not paste credentials into reports or chats.

In the existing admin, **AI processing / Review & publish** shows the language artifacts. Citizen pages remain empty until genuine editorial approval and publication; generation never automatically publishes or approves eligibility. For subsequent work keep the existing worker running (`npm run worker`); the hidden local worker started during this task is not a hosted production service.

Automatic approval review initially rejected a full database copy because migration had not been explicitly authorized; after owner approval it rejected an overly broad model allowlist. Neither rejected script executed. The final successful transfer used an explicit content-only model list, excluding all session/account/audit/worker collections.
