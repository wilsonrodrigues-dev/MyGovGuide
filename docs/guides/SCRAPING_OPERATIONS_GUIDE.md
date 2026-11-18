# Collection operations

Latest execution: PM-KISAN has actual owner-approved EN/HI/KN publication in Atlas, three indexes and one publication record. Existing citizen discovery/detail routes now serve it. NDMA execution configuration was separately restored and verified with HTTP200/100 unchanged then HTTP304; no schedule or new notice/version. No new Gemini calls or eligibility approvals. [Current completion evidence and lineage](../history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md); [official dataset API findings](OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day local/zero-publication/configuration observations below are historical.


## Latest Atlas configuration — 18 November 2026

Backend/API/worker now select the private Atlas `mygovguide_dev` database through ignored `backend/.env`; `.env.example` is documentation only. Optional `MONGODB_DNS_SERVERS` is a process-only SRV resolver setting, blank by default; the current explicit setting resolves the machine's refused SRV lookup without weakening TLS/authentication.

Owner-approved transfer preserved 942 content/review records, including 25 schemes and 15 validated, review-pending Gemini artifacts. All local data remains safe. Sessions/accounts/audit logs, schedules, worker state and adapter configurations were excluded; collection activation/history must not be inferred from copied source records. The API and running worker connect to Atlas; the frontend uses the existing API proxy. No new generation or publication. [Exact diagnosis, transfer scope and verification](../history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). Earlier local-only observations below are historical.


## Current live operation — 18 November 2026

The existing Source Manager has one active approved source, `live-ndma-sachet-rss`: exact RSS `https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml`. Explicit official RSS-reader/redistribution instructions support this scoped use; robots returned 404 (unavailable), not a denied crawl path. No linked CAP documents or assets are fetched. Approval expires 25 November 2026; retain attribution, exact path, rate/request limits and review currentness. The first worker run stored 100 historical notices; second run returned ETag HTTP 304 and wrote no duplicates. Never describe these as scheme eligibility or verified active alerts.

The ignored backend environment explicitly selects native application MongoDB and enables live collection; restart API/worker to read it. Source-specific approvals remain mandatory. No schedule was added. Income Tax source remains disabled after guarded HTTP 403 despite successful unguarded preflight. PIB, OGD, RBI and myScheme remain blocked as documented. Do not change transports/security controls to force a success.

[Current evidence, permissions, exact HTTP counts and errors](../history/REAL_DATA_COLLECTION_REPORT.md). Captured feed parser tests are offline replay; only guarded worker receipts evidence successful live ingestion.

## Earlier Phase 3.6 extension

The same native worker now also consumes reviewed-content AI preparation jobs. Source fetches do not call an LLM. Collection provenance records fixture/live mode, source/run identity, captured timestamp, raw-record hash and conditional response metadata. SafeHttp supports exact-endpoint ETag/Last-Modified revalidation and bounded 304 handling. The PIB candidate parser always stages notices, never scheme eligibility inferred from a news feed.

Earlier policy investigation (superseded only for the separately authorized NDMA feed): PIB robots returned an unavailable HTML page; the checked OGD host returned a disallow-all robots policy. No source approval or genuine live run was added. OGD's documented API requires a suitable API key plus dataset-specific license/access review. Public reuse licensing alone does not authorize crawling the denied host. See `backend/reports/phase36-source-policy-check.json`, `phase36-ogd-policy.json` and [AI operations](AI_PROCESSING_RUNBOOK.md). The original Phase 3.5 findings below remain historical evidence.

The Phase 2 adapter, SafeHttp transport, transactional staging, immutable versions and change detection remain the collection engine. Phase 3.5 supplies authenticated orchestration around it, rather than a replacement crawler.

## Safe operating sequence

1. Verify the selected database with `npm run db:inspect`. Never run tests against the application database.
2. Run `npm run worker` in its own terminal. It processes queued jobs and checks persisted schedules once per second while idle.
3. In `/admin/collection`, choose FIXTURE and a bundled source. Run Collection returns HTTP 202 with a job ID; it does not hold a request open while collecting.
4. Inspect progress and execution history. A successful fixture run demonstrates the pipeline using synthetic records, never an official live result.
5. Imported and collected records stay internal/research-only. Review evidence before any later publication process.

Only the four bundled fixture descriptors can be selected through the API. Administrators cannot provide filesystem paths or arbitrary fixture files. The engine also verifies realpath containment.

## Live source authorization

Keep `ENABLE_LIVE_COLLECTION=false` until an official source has verified access permission. The source registry, original research and permission decisions are preserved.

To configure a permitted source, save an approval contract in Sources. The JSON needs source identity, exact credential-free HTTPS URL/host, approved paths, method, terms URL, rights basis, robots URL/observed timestamp, actual robots allowance, rate/request limits, named reviewer, evidence, expiry and test plan. API sources additionally need an API agreement. `adapterOptions` describes parsing selectors where applicable; it cannot bypass SafeHttp.

Save evidence, validate it separately, then activate it. Validation checks structure, dates, scope, registered host and public DNS. It relies on truthful operator-supplied policy evidence; it is not independent legal approval. Configuration changes disable collection and invalidate validation. Live jobs also require the server environment switch. Authorization is checked when enqueueing, when executing and inside the record transaction before commit.

The transport blocks private/metadata IPs, credential URLs, unapproved redirects/queries, encoded ambiguous paths and protected citizen paths. DNS is pinned to the checked public address. HTTP bodies, redirects, retries and request budgets are bounded. Retry-After is honored; a requested cooldown longer than a minute terminates the current fetch for later retry. No login, CAPTCHA or anti-bot bypass exists. myScheme remains categorically excluded.

## Source investigation: 17 November 2026

| Candidate | Evidence and result | Operational decision |
| --- | --- | --- |
| myScheme | Official [terms](https://search.myscheme.gov.in/terms-of-use) prohibit automated access without written authorization | Disabled; no collection attempted |
| PIB registry N01/N02/N03 | Official [RSS index](https://www.pib.gov.in/RssMain.aspx) exists. [Copyright policy](https://www.pib.gov.in/content/102_2_Copyright-Policy.aspx?lang=1&reg=30) permits accurate attributed reproduction of its material with third-party exclusions. Direct `/robots.txt` probe returned HTTP 200 **HTML saying the page is unavailable**, not a robots policy. RSS index redirected to a region/language query. | Access evidence remains incomplete; no activation and no live feed collection |
| data.gov.in | [Terms](https://www.data.gov.in/terms-of-use) and [GODL](https://data.gov.in/Godl) describe dataset-specific licensing. Direct browsing of terms/robots returned 503 in this session. No specific usable endpoint/API credentials were established. | Candidate only; no activation |

Raw bounded policy-probe outcomes are in `backend/reports/phase35-policy-probes.json`. These requests investigated access policy; they were not collection runs. There were **zero successful genuine government live collection runs** in this phase.

`PibRssAdapter` is a candidate source-specific parser. It checks HTTPS PIB release-link identity and numeric PRID, preserves observed dates/document links, attaches publisher attribution and uses stable official release IDs. It handles feed metadata only, with no page traversal or pagination. Tests use explicitly synthetic XML. Real connectivity, actual feed format, pagination applicability and production parsing remain unverified until an authorized endpoint is available. Generic API/RSS/HTML/PDF adapters are also available behind the same gate; no API credential entry or arbitrary authenticated scraping is exposed.

## Failure, restart and cancellation

MongoDB jobs move QUEUED → RUNNING → SUCCEEDED/FAILED/BLOCKED/CANCELLED/INTERRUPTED. Unique active-source keys prevent overlapping jobs, including separate workers. Workers claim with expiring leases and heartbeat while collecting. Transactional lease checks fence expired workers before records commit. Restart recovers expired leases for at most three attempts. Exhausted/cancelled expired work becomes INTERRUPTED and releases the source key.

Queued cancellation is immediate. Running cancellation is cooperative at discovery/fetch boundaries and before the source batch commits. A request already being fetched/parsing may finish first. Cancellation does not undo a previously committed batch. A crash after commit but before job acknowledgement can replay; stable IDs/content hashes avoid extra versions or change events. Previous versions remain in history. Failed source staging rolls back the whole batch.

Errors shown to the dashboard are controlled messages; raw database/network errors can contain secrets and are not exposed. Original `IngestionRun` entries remain available through the protected API and dashboard timeline; job details link a run ID. Investigate failures, correct configuration and enqueue a fresh job. Do not clear unique indexes or delete records to force overlap.

## Test and maintenance commands

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

Database tests create timestamped isolated databases and retain them for audit. They never drop databases. Browser tests pass isolated test username/password values through the child-process environment; they do not create database administrator accounts. Stop owned test servers/workers after tests; the wrapper does this automatically.
