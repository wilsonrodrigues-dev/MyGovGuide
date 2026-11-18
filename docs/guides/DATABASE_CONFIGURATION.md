# Local and Atlas database configuration

Latest execution: PM-KISAN has actual owner-approved EN/HI/KN publication in Atlas, three indexes and one publication record. Existing citizen discovery/detail routes now serve it. NDMA execution configuration was separately restored and verified with HTTP200/100 unchanged then HTTP304; no schedule or new notice/version. No new Gemini calls or eligibility approvals. [Current completion evidence and lineage](../history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md); [official dataset API findings](OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day local/zero-publication/configuration observations below are historical.


## Latest Atlas configuration — 18 November 2026

Backend/API/worker now select the private Atlas `mygovguide_dev` database through ignored `backend/.env`; `.env.example` is documentation only. Optional `MONGODB_DNS_SERVERS` is a process-only SRV resolver setting, blank by default; the current explicit setting resolves the machine's refused SRV lookup without weakening TLS/authentication.

Owner-approved transfer preserved 942 content/review records, including 25 schemes and 15 validated, review-pending Gemini artifacts. All local data remains safe. Sessions/accounts/audit logs, schedules, worker state and adapter configurations were excluded; collection activation/history must not be inferred from copied source records. The API and running worker connect to Atlas; the frontend uses the existing API proxy. No new generation or publication. [Exact diagnosis, transfer scope and verification](../history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). Earlier local-only observations below are historical.


Phase 3.6 adds `ContentApproval`, `AIJob`, `AIArtifact`, `SchemeSearchDocument`, `ContentPublication`, daily budget, AI worker-slot and provider-circuit collections. `npm run db:migrate:content` inspects target/capabilities before additive index creation. There is no destructive reset. Source versions, old approved snapshots and artifact revisions remain preserved. The existing local application database was explicitly selected/inspected and migrated; two full imports each left all 137 inputs unchanged. Configured Atlas inspection still failed DNS/connectivity, so no Atlas migration/import occurred.

Private values belong in ignored `backend/.env` or process environment. `.env.example` contains local defaults and placeholders only. Never use VITE-prefixed variables for database or authentication secrets.

Use an explicit database name in `MONGODB_URI`. `MONGODB_TEST_URI` must select a distinct `mygovguide_phase2_test` database (optional suffix). Configuration rejects unnamed/system databases and application/test collisions. Test runners additionally create timestamped test database names. No test runner drops a database or cleans the real application database.

Native local MongoDB: `npm run db:local` uses the existing `.local/mongo-test` data directory and port 27018. It verifies an existing server and does not reinitialize it. The application database remains `mygovguide_phase2`. Keep the database terminal open if this command started it.

Atlas: set the supplied SRV URI privately, include the selected database name and URL-encode password characters. Allow the client IP in Atlas network access and grant the database user only required application/test privileges. Do not add broad network rules as a workaround. DNS/SRV and TLS connectivity must work from this machine.

Run `npm run db:inspect` before writing. It connects, checks transaction capability (replica set or mongos), identifies only the database name and lists collection counts. Connection errors report sanitized categories rather than URIs. For a verified empty target, run `node backend/scripts/inspectDatabase.js --initialize-empty`: it adds missing collections/indexes and imports the research package only if empty. Existing populated targets receive missing indexes only; no data replacement or cleanup. Review existing records before an explicit idempotent `npm run import:phase1 -w backend`.

Startup checks connectivity, transactions and collections before initializing admin indexes. Index creation is additive; no syncIndexes/dropIndexes migration is used. Versioned ingestion uses multi-document transactions. Existing standalone MongoDB can serve health but is insufficient for these writes.

Admin login configuration: set ADMIN_USERNAME and ADMIN_PASSWORD privately in backend/.env. Authentication uses an in-memory session and does not query MongoDB or require a session secret/CSRF token. Dashboard data still uses MongoDB. Citizen preference sessions remain separate, use MongoDB and the owning cookie, and have no additional verification token.

## Actual Atlas result, 17 November 2026

A connection string was found in the local environment example. It was moved to ignored local configuration and replaced by placeholders in the example. The previously unnamed URI was assigned development database `mygovguide_dev`, with a separate test database `mygovguide_phase2_test`. Password rotation is required because the credential had been present in the example and appeared during diagnostic output; no credential is reproduced here.

Read-only Atlas inspection was attempted both within the sandbox and with approved network access. It failed with `DNS_OR_CONNECTION_FAILED`. Atlas collections/capabilities could not be inspected, and **no Atlas writes or tests succeeded**. Correct the private cluster/DNS/network configuration and rotate the credential before retrying. Local tests passed against explicitly selected native MongoDB; the application never silently switches away from the configured Atlas URI.
