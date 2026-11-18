# MyGovGuide progress — 18 November 2026

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


[PRODUCT_MASTER_PLAN.md](PRODUCT_MASTER_PLAN.md) is the sole authoritative product specification. This file records implementation and verification, not a new phase or work authorization. [Documentation index](docs/README.md) · [Phase 3.6 completion](docs/history/PHASE3_6_COMPLETION_REPORT.md) · [Traceability](docs/history/PHASE3_6_TRACEABILITY.md).

## Real data collection completed — 18 November 2026

The existing guarded worker fetched the authorized NDMA SACHET RSS endpoint: HTTP 200, 100 parsed notices, 100 new notices and 100 immutable source versions. A second ETag request returned HTTP 304, adding no duplicates or versions. These are historical alert snapshots requiring currentness review, not verified active warnings or scheme eligibility rules.

Five existing schemes (PM-KISAN, NMMSS, PMJJBY, PMSBY and PMUY) received official-document fact packets and source versions. The owner approved these limited public facts for AI preparation only. Gemini `gemini-3.5-flash-lite` generated 15 validated artifacts (five each EN/HI/KN), all editorial-review pending and internal. There were 15 successful responses and one transient failed attempt; successful responses reported 37,367 tokens. No paid requests, publication events or eligibility approvals occurred.

Current application inventory: 119 sources, 192 source versions, 25 schemes, 164 facts, 18 forms, 116 notices (100 LIVE / 12 RESEARCH / 4 SYNTHETIC), 12 awareness topics, 210 review items (205 pending), five fact approvals, 15 AI jobs/artifacts, zero public search documents/publications. All 25 eligibility rule sets remain unapproved. All 17 original research-file hashes match.

PIB collection remains blocked by unusable robots evidence; OGD needs permitted API/key/dataset review; RBI transport rejected access. Income Tax RSS preflight returned XML, but the guarded worker returned HTTP 403: disabled, zero stored notices, no bypass. Atlas read-only inspection again failed DNS/connection; the ignored backend configuration now explicitly selects the existing native application database. Restart backend/worker to load it. Only NDMA is active, scoped approval expires 25 November; no schedule was created.

Verification: 85 backend + four frontend tests, 31 MongoDB integration nodes and 18 browser journeys passed; build passed. Actual application dashboard screenshots verify live/research/fixture separation, source status, jobs and the pending multilingual artifacts. Private environment files remain ignored and configured secrets were absent from scanned shareable files.

[Detailed collection/results/error report](docs/history/REAL_DATA_COLLECTION_REPORT.md) · [Five approved fact packets](docs/FIVE_SCHEME_FACT_REVIEW.md). Editorial/native-language review, missing operative documents and currentness checks remain required before publication. Source access and paid-use controls remain in force.

## Completed and locally verified

| Capability | Exact completed behavior and limits |
| --- | --- |
| Existing project | JavaScript backend/frontend workspaces, native MongoDB replica-set support, optional separately configured Atlas; no Docker or replacement application |
| Research import | All four original JSON datasets supplied; 137 research inputs: 70 sources, 25 schemes, 18 forms, 12 historical notices, 12 undated awareness topics. Last two full imports each left 137 unchanged, with zero new rejections/changes/reviews. No application import was rerun during this cleanup. |
| Collection foundation | Deny-by-default API/RSS/HTML/PDF adapters, immutable original versions and provenance, normalized candidates, changes and review queues; conditional HTTP handling and fixture-tested PIB Notice parsing |
| Existing admin | Environment username/password login and in-memory sessions without admin CSRF or database authentication; source evidence, operational audit, bounded collection jobs, cancellation, persisted timezone schedules, worker leases, explorer, diffs and review controls |
| Civic Blue | Shared blue/indigo citizen/admin tokens, retained Latin/Hindi/Kannada fonts, keyboard support and 320/360/390px browser checks |
| Guest foundation | Manual onboarding, editable state/category/language, local preferences and secure anonymous synchronization; existing Home actions and honest unavailable/empty states |
| Reviewed AI preparation | Version/hash-bound fact and rights review; durable idempotent jobs, leases, retry/circuit controls, conservative spending reservations; official Gemini SDK with privately configured model |
| Multilingual derived content | Source-grounded EN/HI/KN explanations, titles, aliases, keywords and optional romanization; structured/factual validation; original evidence retained |
| Editorial publication | Draft revisions, compare/edit/reject/approve, audited publish/withdraw, approved revision selection and source-change invalidation; separate from eligibility-rule approval |
| Indexed reads | MongoDB Unicode token search with filters/ranking and current-publication checks; existing Home previews use those gates; explicit approved-English fallback; synthetic records excluded from public results |
| End-to-end proof | Isolated synthetic source → review → mocked EN/HI/KN → editor → publication → indexed queries; positive citizen-safe public reads separately tested with authoritative database mocks. This is not live government collection or real model generation. |
| Real Gemini validation | Three real `gemini-3.5-flash-lite` calls after owner confirmation of Free tier/no paid billing and official model/pricing verification. EN/HI/KN structured explanations/keywords passed exact-fact checks and stored as `REVIEW_PENDING` in an isolated test database; zero publication events or paid requests. |

Earlier Phase 3.6 inventory is preserved in its historical audit. The current application inventory and genuine collection results are recorded above; five limited fact approvals authorize AI preparation only.

## Documentation cleanup completed

- Kept this file, README and the single authoritative master plan in the root.
- Moved 10 historical phase reports/verification records into docs/history/, six operating guides into docs/guides/, and three old prompts/plans into docs/plans/.
- Added a navigation index and repaired local Markdown links. Historical source trees, command outputs and JSON manifests retain their execution-time paths.
- Preserved every prior report, including 66 machine-report/screenshot files copied before the existing test harness refreshed fixed output paths. All 17 original research files remain byte-identical after accounting for the two relocated reports.
- Retired the independent AI fallback from the active technology specification. Gemini remains selected; working AI code, environment examples, dependencies, tests and legacy compatibility remain unchanged and disabled as before.
- Verified Git excludes backend/frontend private environment files and variants; none is tracked. Scanned shareable files for configured secret values without printing them; no matches. This does not prove credentials have been rotated or certify all historical Git objects.
- Verified 155 non-documentation source/configuration/research/design files against the pre-cleanup hash manifest: no changes. No feature implementation, rebuild, migration, application-data cleanup, deployment or new implementation phase.

## Verification rerun for this cleanup

| Existing check | Result |
| --- | --- |
| npm test | 82 backend + 4 frontend tests passed; zero failures/skips |
| npm run test:integration | 31 test nodes passed (4 parents / 27 child scenarios); zero failures/skips; explicitly selected isolated local test URI |
| npm run test:e2e | 16 existing regression/theme journeys + 2 synthetic content journeys passed on desktop/mobile; existing build reused, no rebuild |
| Documentation / preservation / secrets | Local link targets resolve; all 17 original research hashes match; protected code/configuration unchanged; private env files ignored/untracked and configured secrets absent from scanned shareable files |

Details, raw outputs and limitations: [cleanup verification](docs/history/DOCUMENTATION_CLEANUP_VERIFICATION.md). Earlier progress is preserved as [historical progress](docs/history/PROGRESS_BEFORE_DOCUMENTATION_CLEANUP.md).

## Gemini-only integration validation — 18 November 2026

- Removed the retired provider adapter, active environment schema/placeholders/private entries and dashboard readiness dependency. No separate vendor SDK was installed, so no dependency removal or lockfile churn was needed. Gemini primary/secondary credentials were preserved only in ignored backend configuration.
- `npm run ai:check` reaches model metadata and verifies `gemini-3.5-flash-lite` supports `generateContent`. Current official capability documentation confirms structured output; pricing lists free standard input/output for eligible Free-tier projects. The owner explicitly confirmed the primary project's Free tier with no paid billing linked. Model availability alone was not used as proof of free usage.
- Privately configured that model and confirmed free entitlement; paid approval remains false, paid daily budget zero. Primary-key validation made three requests (EN, HI, KN), with no retries, secondary-key switching or tools. Reported tokens: 2,205 input + 2,533 output = 4,738 total; free-tier estimated cost $0, zero paid requests. No invoice or billing balance was independently inspected.
- Used a clearly labeled isolated test copy of historical public PM-KISAN research. Preserved INR 6000 and test reference date 2026-11-18 (explicitly not an application deadline), source citations, facts and original evidence. Deliberately changed amount/date outputs were rejected. Three artifacts remain review-pending, scheme internal, zero public indexes/publication events. No real research scheme was approved or government source collected.
- Existing regressions: 82 backend + 4 frontend tests, 31 database test nodes and 18 browser journeys passed; production build passed. The relevant existing admin section now shows Gemini-only readiness and spending controls without redesigning the dashboard.
- Added the explicit manual `npm run ai:validate` diagnostic; it is excluded from ordinary tests/startup, requires free-only settings and an isolated test URI, stops on failure and retains receipts. Initial sandbox metadata connectivity and stopped local database errors were resolved before successful real generation; the database failure made zero model calls.
- The first mobile content regression exposed an existing asynchronous editor-close race. A completed review now closes before the list refresh, preventing it from closing the next editor; assertions and timeouts were preserved. Initial failure output is retained with the validation report.

Full receipts, pricing/model links, errors and limits: [Gemini integration validation](docs/history/GEMINI_INTEGRATION_VALIDATION.md). No additional implementation phase or citizen feature was begun.

## Unresolved blockers and unimplemented requirements

Latest owner-requested admin change: [environment-only login](docs/history/ENV_ADMIN_LOGIN_CHANGE.md). Login/session/logout no longer query MongoDB or use admin CSRF tokens. Citizen sessions were subsequently simplified to cookie-only requests; no separate CSRF token remains in either app. Set ADMIN_USERNAME and ADMIN_PASSWORD privately in backend/.env and restart the backend; no default password or database bootstrap is supplied. Sessions reset on backend restart. Dashboard data still requires MongoDB. Existing tests and desktop/mobile journeys verify this flow; see the linked evidence. No new phase or unrelated feature was started.

| Item | Precise remaining limitation |
| --- | --- |
| Genuine live government collection | NDMA RSS has two successful guarded runs (200 then 304), 100 notices. Other sources remain blocked as recorded above; myScheme still needs written permission. Approval renewal/currentness review remains necessary. |
| AI production/editorial acceptance | Small real EN/HI/KN generation/storage test now succeeds on the owner-confirmed Free tier. Native-speaker quality review, broad factual cases and ongoing account/quota/pricing checks remain necessary. Secondary-key live generation was not tested. Paid use remains unapproved with budget zero. |
| Publication and eligibility | Five limited source-fact snapshots approved for AI only; 15 artifacts require editorial/language approval, missing-information and currentness review. Zero published schemes; all 25 eligibility rule sets remain incomplete/unapproved. |
| Atlas | Connected after explicit process-only SRV DNS correction; owner-approved content is copied and verified. API/worker now use Atlas. Local data is preserved; operational logs/configurations were excluded from transfer. |
| Credential rotation | Previously exposed credentials require private rotation/confirmation. Ignore rules and a clean file scan do not revoke an exposed credential. |
| Development dependency | Last full audit recorded one unpatched picomatch advisory propagated through three dev-tool packages; runtime audit was clean. No dependency changes or new network audit during cleanup; upstream remediation remains unresolved. |
| Design tooling / real-world QA | Native Stitch authentication unresolved; existing references retained. Physical-device, screen-reader, native-speaker translation QA and production penetration testing remain unperformed. |
| Remaining citizen product | Full cross-site voice, discovery/detail interfaces, forms/notices uploads, eligibility UI, maps/centers, citizen accounts, bookmarks/notifications and complete approved-content slider remain unimplemented or partial as specified in the master plan. They were not started here. |
| Deployment | No public deployment or production release; hosted scheduling and production acceptance remain outstanding. |

## Citizen cookie-only sessions and consolidated report — 18 November 2026

Removed all remaining runtime CSRF generation, response fields, request middleware, frontend token state/header injection and CORS-header declaration. Profile writes and session deletion use the owning cookie; origin checks, preference validation and expiry remain. Session recovery still retries after an expired/missing cookie. Existing tests cover cookie-only writes, no extra response token, logout, ownership isolation and invalid input. No government collection, AI generation or publication was performed in this change.

[Whole-project status report](docs/PROJECT_STATUS_REPORT.md) consolidates all completed work, current application database counts, real Gemini receipts, remaining features and external blockers. Latest validation: 82 backend + 4 frontend + 31 database test nodes + 18 browser journeys; build succeeds. Evidence uses the cookie-session test files linked in that report.
