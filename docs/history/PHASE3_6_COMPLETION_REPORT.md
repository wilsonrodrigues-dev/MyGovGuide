# MyGovGuide Phase 3.6 completion report

Completed local implementation and verification: **18 November 2026, Asia/Calcutta**. Machine-readable reports retain actual UTC timestamps. Product authority remains [PRODUCT_MASTER_PLAN.md v2.3](../../PRODUCT_MASTER_PLAN.md); implementation scope is [CODEX_PHASE3_6_PROMPT.md](../plans/CODEX_PHASE3_6_PROMPT.md).

The authorized local theme/admin/data-to-content slice is implemented and tested. Genuine government collection, real AI generation entitlement/model selection and Atlas connectivity remain blocked as described below. This is not a claim that the later citizen roadmap or production release is complete.

## Delivered behavior

- Replaced the active citizen/admin green/orange palette with shared **Civic Blue** tokens: navy, indigo, light background, white surfaces, ink/muted text, blue borders and red errors. Existing Noto scripts, responsive layout, languages, actions and route behavior are retained. Statuses have text labels; color alone conveys no approval.
- Preserved the existing admin app, separate administrator/citizen sessions, CSRF, Origin checks, rate limits, collection authorization, immutable versions, source histories, worker/scheduler and import logic. There is no replacement stack, second dashboard or duplicate scheduler.
- Added version/hash-bound human fact/rights/currentness snapshots, durable AI jobs/artifacts, editorial revisions, publication history, per-language search documents, daily budget records, global leased worker slots and provider circuit state. Migrations add collections/indexes only.
- Added Gemini through the official JavaScript SDK with env-selected model, structured JSON output, bounded transient retry and project-wide quota cooldown. A 429 never rotates keys; a 403 stops; a 401 may use separately authorized credential replacement. Optional Mistral fallback needs independent entitlement, opt-in, positive budget, explicit paid permission and public input classification.
- Generation requires reviewed source content. It runs in the existing native worker, not in scraping, page loads, search or keystrokes. Job keys bind scheme, approval/source version/hash, task, language, prompt version, provider/model. Source and lease checks fence the commit after a long provider call.
- Added source-grounded English/Hindi/Kannada explanation/title/aliases/keywords/romanized-term contracts. Validation checks canonical values, document names, approved links, numeric/ISO-date preservation, citations and script. Every artifact still requires editorial signoff; deterministic checks cannot establish full semantic or translation accuracy.
- Extended `/admin` with **AI processing** and **Review & publish**. Editors inspect original facts, capture review evidence, queue languages, inspect safe provider/model/usage metadata, edit into a new draft, reject/approve, select current approved versions and publish/withdraw with audit evidence. Eligibility rules cannot be approved through these content actions.
- Added indexed Unicode search and current-version public read endpoints. Existing Home previews now use those publication gates; a legacy publication flag alone is insufficient. Missing localized content can explicitly fall back to current reviewed English. No new discovery/detail UI or unrelated future citizen feature was built.
- Material changes preserve raw and previous approved snapshots, mark affected artifacts stale, withdraw current indexes and require renewed review. An obsolete in-flight model response cannot commit. Failed new preparation does not erase an unrelated valid approved publication.
- Added conditional HTTP metadata/provenance to the existing engine, preserved scheme candidate aliases/documents/application fields, and ensured PIB news remains Notice data even if misconfigured as Scheme. No eligibility rules are inferred from news.

Main files: `backend/src/models/content.js`, `services/content/{contracts,providers,workflow,search}.js`, `routes/contentAdmin.js`, `routes/contentPublic.js`, additive changes to the existing worker/ingestion/admin/preview code, `frontend/src/admin/ContentWorkspace.jsx` and shared theme CSS. Full inventory is in [PHASE3_6_TRACEABILITY.md](PHASE3_6_TRACEABILITY.md).

## Actual database/import state

The configured Atlas target was inspected read-only with approved network access but failed `DNS_OR_CONNECTION_FAILED`. **No Atlas migration/import/write occurred.** The existing native `mygovguide_phase2` database was then explicitly selected and inspected for replica-set capability/collections before additive local migration.

Two full imports each produced: **137 read, 137 unchanged, 0 created, 0 updated, 0 rejected, 0 new changes and 0 new review items**. Existing real/research entity counts remain: 25 schemes, 18 forms, 12 research notices plus 4 pre-existing fixture notices, 12 undated awareness topics, 112 source identities, 16 changes, 87 review items and 12 retained historical rejections. Eligibility-rule approvals and source automation approvals remain zero. Two import audit runs were added, bringing IngestionRun history to 14.

The real local application content collections contain **zero ContentApprovals, AIJobs, AIArtifacts, SearchDocuments or ContentPublications**. No research scheme was silently approved or published. Test artifacts live only in timestamped isolated test databases. All 17 baseline research files remain byte-identical; the final credential scan found no configured private values in scanned source/docs/reports. The ignored `.env` remains private and was not printed. Previously exposed credentials still require rotation; no old secret is reproduced here.

Evidence: `backend/reports/phase36-baseline.json`, `phase36-local-migration.json`, `phase36-final-audit.json`.

## AI results and costs

| Operation | Actual result |
| --- | --- |
| Gemini connectivity | **Model metadata reachable** with the private primary key; available model/action metadata recorded |
| Selected generation model | Not configured; no model was silently chosen from an old handoff |
| Free-tier/paid entitlement | Free usage not confirmed; paid use not authorized; daily budget zero |
| Real Gemini content-generation calls/tokens | **0 / 0** |
| Secondary Gemini live generation | Not attempted; quota behavior tested with mocks |
| Mistral live API generation | Not configured/disabled; **0 calls** |
| Approved paid generation spending | **0 USD**; no paid generation request was made |
| Synthetic vertical slice | EN/HI/KN prepared using `MOCK_OFFLINE` / `synthetic-fixture-v1`, zero real provider tokens/cost |

The fixture proof uses the real parser/version/review/job/artifact/publication/index stack with simulated human approval **only in isolated tests** and deterministic injected provider output. It covers all three languages, more than ten query cases per language when variants are included, romanization/prefixes, exact facts, rejection, draft revisions, source changes, stale output and failure recovery. Synthetic publications remain excluded from public endpoints. An authenticated isolated-test preview inspects them with explicit synthetic labels. A separately mocked authoritative database snapshot verifies the positive citizen-safe public read/fallback path. Neither test represents live government scraping or a real model-generated translation.

Provider report: `backend/reports/phase36-provider-check.json`. Metadata access does not prove model/schema quality, free quota or billing entitlement. Enable real generation only after privately selecting a verified capable model and confirming lawful public input, account entitlement and spending constraints.

## Live-source investigation

| Candidate | Observed evidence | Result |
| --- | --- | --- |
| PIB RSS | Official RSS directory/copyright pages reachable; robots URL returned HTTP 200 HTML saying the page was unavailable, not a usable robots policy | Access conditions incomplete; source-specific candidate parser tested only with synthetic XML; not activated |
| OGD/data.gov.in | Checked robots URL returned `User-agent: *` / `Disallow: /`; official help documents API-key access; dataset license/access still needs specific review | No crawling/data-feed collection enabled; an open reuse license alone is insufficient |
| myScheme | Existing written-authorization restriction retained | Excluded; no collection attempt |

**Genuine live government collection runs: zero. New source approvals: zero.** Limited policy/robots/model metadata checks are not reported as data collections. A usable authorized endpoint, appropriate API access where needed, per-path/method policy/rights evidence and a genuine parsing/integration run are required before activation. Existing enqueue/request/redirect/commit checks remain.

Evidence: `backend/reports/phase36-source-policy-check.json`, `phase36-ogd-policy.json`, existing source approval log. Official references used: [PIB copyright](https://www.pib.gov.in/content/102_2_Copyright-Policy.aspx?lang=1&reg=30), [OGD robots](https://www.data.gov.in/robots.txt), [OGD API access help](https://data.gov.in/help), [Gemini project quotas](https://ai.google.dev/gemini-api/docs/rate-limits), [structured outputs](https://ai.google.dev/gemini-api/docs/structured-output), [pricing/data use](https://ai.google.dev/gemini-api/docs/pricing), [Mistral usage controls](https://docs.mistral.ai/admin/billing-usage/usage-limits).

## Verification

| Check | Final result | Artifact |
| --- | --- | --- |
| Backend unit/component | **82 passed**, no failures/skips | `backend/reports/phase36-unit-tests.txt` |
| Frontend contracts/actual token AA contrast | **4 passed**, no failures/skips | Same report |
| Database integration | **31 passed test nodes**, including 4 parent suites / 27 substantive child scenarios, no failures/skips | `backend/reports/phase36-integration-tests.txt` |
| Existing citizen/admin + Civic Blue viewport journeys | **16 passed** | `frontend/reports/phase36-regression-e2e.json` |
| Synthetic editor/publication/search browser journeys | **2 passed**, desktop/mobile, no skips | `frontend/reports/phase36-content-e2e.json` |
| Production build | Passed | `frontend/reports/phase36-build.txt` |
| Production dependency audit | **0 vulnerabilities** | Final `npm audit --omit=dev` result |
| Full dependency audit | **3 high findings in one development-tool chain**, unresolved upstream | See below |

Browser checks cover 320/360/390px and desktop widths, language scripts, no document-level overflow, onboarding/profile recovery, existing admin auth/jobs/scheduler, and the actual artifact review/publication controls. Source-to-content integration additionally tests duplicate jobs, competing workers/slots, expired leases, exact data checks, project quota behavior, provider-disabled/budget behavior, atomic budget reservations, invalid JSON, optional fallback contract, immutable evidence, stale commit fencing and positive/negative public read gates. Test databases are isolated, retained and never used for application-data cleanup.

One dependency limitation remains: [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf) affects picomatch through 4.0.7; the advisory lists **no patched version**, and the registry's current release is 4.0.7. npm propagates this development dependency finding through tinyglobby/Vite (3 package findings, one underlying advisory). The application does not expose arbitrary glob patterns as a public API. Development/preview stays bound to localhost; no public deployment was performed. A disruptive Vite downgrade was not used to hide the finding. Recheck upstream before production deployment or accepting untrusted build configuration. Runtime dependencies audit cleanly.

Manual physical-device, screen-reader, native-speaker editorial QA and production penetration testing remain unperformed. Real authorized feed parsing and real generation quality remain unverified because their external gates have not been satisfied.

## Run and handoff

See [AI_PROCESSING_RUNBOOK.md](../guides/AI_PROCESSING_RUNBOOK.md) and [ADMIN_DASHBOARD_GUIDE.md](../guides/ADMIN_DASHBOARD_GUIDE.md). Start native database, backend, frontend and `npm run worker` separately; inspect/migrate the explicitly selected database first. Bootstrap an administrator privately if needed. No default account/password exists.

Reproduce:

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

Owned test API/frontend/worker processes were stopped by the wrapper; the pre-existing database and its files were preserved. Atlas DNS/access, real source authorization, actual model/entitlement configuration, and the upstream development dependency patch remain external follow-up. No Docker, paid API enablement, public deployment or unrelated citizen phase was introduced.
