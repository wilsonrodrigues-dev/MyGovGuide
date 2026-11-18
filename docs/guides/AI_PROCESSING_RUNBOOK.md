# Phase 3.6 AI content operations

Latest execution: PM-KISAN has actual owner-approved EN/HI/KN publication in Atlas, three indexes and one publication record. Existing citizen discovery/detail routes now serve it. NDMA execution configuration was separately restored and verified with HTTP200/100 unchanged then HTTP304; no schedule or new notice/version. No new Gemini calls or eligibility approvals. [Current completion evidence and lineage](../history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md); [official dataset API findings](OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day local/zero-publication/configuration observations below are historical.


## Latest Atlas configuration — 18 November 2026

Backend/API/worker now select the private Atlas `mygovguide_dev` database through ignored `backend/.env`; `.env.example` is documentation only. Optional `MONGODB_DNS_SERVERS` is a process-only SRV resolver setting, blank by default; the current explicit setting resolves the machine's refused SRV lookup without weakening TLS/authentication.

Owner-approved transfer preserved 942 content/review records, including 25 schemes and 15 validated, review-pending Gemini artifacts. All local data remains safe. Sessions/accounts/audit logs, schedules, worker state and adapter configurations were excluded; collection activation/history must not be inferred from copied source records. The API and running worker connect to Atlas; the frontend uses the existing API proxy. No new generation or publication. [Exact diagnosis, transfer scope and verification](../history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). Earlier local-only observations below are historical.



## Real-data update — 18 November 2026

In the existing admin, Sources shows active authorized NDMA RSS and disabled Income Tax (guarded HTTP 403); collection history shows genuine NDMA 200/304 runs. Data Explorer distinguishes 100 LIVE notices, 12 imported research notices and four fixtures. Review & publish contains five owner-approved limited scheme fact packets and 15 validated English/Hindi/Kannada artifacts, all pending editorial review. Zero schemes are published; no eligibility rules approved. Missing facts/dates/documents and native-language quality still require review.

The selected application database is now the existing native MongoDB; restart backend/worker for private environment changes. No new schedule was created. Preserve free-only settings; these completed requests do not authorize paid usage or automatic publication. [Exact results and remaining blockers](../history/REAL_DATA_COLLECTION_REPORT.md), [five fact packets](../FIVE_SCHEME_FACT_REVIEW.md).

The authoritative requirements are [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md), especially section 17 and its 18 November documentation revision. The [archived implementation prompt](../plans/CODEX_PHASE3_6_PROMPT.md) records historical instructions and does not override the current specification. This extends the existing Express/React application and native worker. It does not implement future voice, uploads, maps, accounts, notifications or eligibility interfaces.

## Start services

Use Node 24 and the existing native MongoDB replica set, or a reachable privately configured Atlas database. Keep each long-running command in its own terminal:

```powershell
npm install
npm run db:local
npm run db:inspect
npm run db:migrate:content
npm run dev:backend
npm run dev:frontend
npm run worker
```

The database URI in ignored `backend/.env` is authoritative. There is no silent local fallback. To explicitly select the existing local database for one terminal, set:

```powershell
$env:MONGODB_URI='mongodb://127.0.0.1:27018/mygovguide_phase2?directConnection=true'
```

Inspect the target before writing. `db:migrate:content` checks connectivity, transaction capability and collection names before adding collections/indexes. It never drops/reset/replaces data. The worker initializes missing additive indexes as well. Configure the first admin privately using [ADMIN_DASHBOARD_GUIDE.md](ADMIN_DASHBOARD_GUIDE.md); no default account is created.

## Provider configuration and spending

Put private credentials only in ignored backend environment configuration. Never use VITE variables or paste keys into chat. The example contains names/placeholders only.

| Variable | Purpose / default |
| --- | --- |
| `GEMINI_API_KEY_PRIMARY`, `GEMINI_API_KEY_SECONDARY` | Server-only credentials; neither establishes free usage |
| `GEMINI_MODEL` | Explicit model selected after metadata/capability verification; no hard-coded model fallback |
| `GEMINI_FREE_TIER_CONFIRMED=false` | Operator attestation that this model/project is genuinely free/unbilled for the intended requests; leave false until checked |
| `GEMINI_SECONDARY_AUTHORIZED=false` | Explicitly authorize valid credential replacement after a 401; never used to evade a 429 or 403 |
| `AI_PAID_USE_APPROVED=false`, `AI_MAX_COST_PER_DAY=0` | Explicit paid-use authorization and daily USD cap; a key or budget value alone does not authorize spending |
| `GEMINI_INPUT_COST_PER_MILLION`, `GEMINI_OUTPUT_COST_PER_MILLION` | Confirmed current model rates, required for paid requests |
| `AI_MAX_RETRIES=2`, `AI_MAX_CONCURRENT_JOBS=2` | Bounded transient retries and MongoDB-leased global worker slots |

Run `npm run ai:check` for **model metadata only**. It lists available model names/actions and checks a configured model if present. It does not generate content or verify billing entitlement. Models available to a key are not necessarily free. Confirm current pricing, project billing, quota and data-use terms independently before enabling generation. Free-tier public material may be used by the provider for product improvement; private uploads and filled applications are excluded from this phase.

With no paid authorization, generation requires explicitly confirmed Gemini free-tier entitlement. Paid Gemini use additionally requires explicit permission, configured rates and a positive daily cap. On 18 November the owner confirmed the primary project's Free tier without linked paid billing. After model metadata and official capability/pricing checks, private configuration selected `gemini-3.5-flash-lite` and confirmed free usage. Paid use remains false and the daily paid budget is zero. Recheck model pricing and the project's tier before future use or configuration changes; a free-tier model can be billable in a paid project.

Gemini is the only implemented provider. The retired provider adapter, environment schema/placeholders and private configuration entries have been removed. There was no separate vendor SDK dependency to uninstall. Historical implementation details remain in the [Phase 3.6 completion report](../history/PHASE3_6_COMPLETION_REPORT.md); those do not describe the current provider implementation.

The router uses one project cooldown across Gemini credentials. A 429 honors backoff and never rotates keys. Temporary transport/5xx errors retry with bounded exponential backoff. A 401 disables the bad credential; a separately authorized valid replacement may be used. A 403 stops without credential bypass. Invalid request/JSON/schema fails validation. When Gemini is unavailable, defer preparation and retain current reviewed cache/original-text fallback.

For paid requests, MongoDB reserves a conservative request-cost bound before **each** attempt, using UTF-8 input bytes (including schema) and the output-token limit. Reservations count against a UTC daily cap even on ambiguous transport failure; they are not refunded as if an interrupted request were free. The operator must maintain correct model rates and vendor-side spending limits. Reserved bounds and actual token usage are distinct; neither is a provider invoice. Default settings authorize no paid request.

## Source and fact review

1. Source access approval remains in the existing Sources manager. Read the actual policy/robots/API agreement and approve exact host/path/query/method/rate scope. The AI workflow cannot authorize scraping. myScheme remains excluded.
2. Collect/version using the existing worker, or import research. Research does not become publishable merely because the import succeeded.
3. Open `/admin/ai` or `/admin/publish`, choose a scheme and inspect original evidence/current version. Record a human fact review with an exact official source URL, quoted public excerpt, clause references, reuse rights/restrictions, currentness evidence and a future review-validity limit. Explicitly attest facts/rights/non-sensitive public material. The server supplies editor identity.
4. Canonical facts come from that exact version; the approval stores its hash and evidence separately. It does not replace the original or approve an eligibility ruleset. Incomplete/unverified rules stay unavailable for verdicts.

Human review is a real editorial responsibility. The application checks contracts, source/version identity, dates and explicit attestations; it cannot prove that an operator's quoted policy or factual judgment is truthful. Do not approve a research summary as an operative government clause without independently checking the real document. A `CURATED_PUBLIC` approval means manually reviewed evidence; it is not a successful live scrape. `LIVE` additionally requires recorded successful online collection provenance. Synthetic approvals are restricted to a test environment **and** an isolated test database.

## Preparation, editing and publication

- Select English, Hindi and/or Kannada and queue preparation. The browser receives job IDs immediately. The existing native worker performs generation after source review; no model is called during collection, search, page loading or language keystrokes.
- Jobs deduplicate by scheme, approval/source version/hash, task, language, prompt version, planned provider and model. Model/prompt changes require fresh jobs. Retry preserves a job's chosen source/model identity and rechecks currentness, credentials and budget.
- Structured outputs contain translated title, summary, audience, benefits, exact original document names with localized labels, application steps/approved links, limitations, aliases/keywords/romanized terms, exact preserved facts and source citations.
- Zod rejects malformed output. Validation checks exact canonical fact values, document requirements, approved links, ISO dates, numeric tokens (including Indian scripts) and quoted clause references. Validation warnings remain visible. These deterministic checks **cannot prove full semantic or translation correctness**; each language and keyword set requires editor review.
- Inspect artifacts next to approved evidence. Edit JSON into a new draft revision, then review that stored revision separately. Rejection is audited. Reviewed versions are not overwritten by edits. There is no automatic approval or publication.
- Select current approved English and optionally one current approved Hindi/Kannada artifact each, enter publication evidence and publish. Unreviewed translations stay hidden; missing languages fall back transparently to reviewed English. This updates MongoDB search indexes and the scheme's publication snapshot, not eligibility rules.
- Withdraw with an audit reason. To restore an earlier artifact revision, select that still-current approved revision and republish with evidence. An outdated source version cannot be rolled back as if it were current official facts.

The dashboard shows imported research, fixture/live collection modes, fact-review snapshots, AI states by language/origin, token usage/reserved cost, published index records and source/rule approval separately. Derived fields are also in Data Explorer. Change Radar shows stale artifacts and regeneration job state.

## Public reads and search

`GET /api/content/search?q=…&language=en|hi|kn&state=…&category=…` uses indexed normalized Unicode terms with bounded prefixes and deterministic title/alias/keyword ranking. It never calls a model or performs collection-wide regex search. Safe reviewed aliases can include common misspellings and romanized terms. Only current, unexpired, editor-approved published artifacts can be returned.

`GET /api/content/schemes/:id?language=…` returns a current reviewed explanation plus original evidence, source/version and review date. Missing localized content may transparently fall back to current reviewed English; never to a stale version. Existing Home previews use the same gates and explicitly label English fallback. No new scheme-discovery/detail page or other future citizen feature is implemented here.

Synthetic artifacts are always excluded from public endpoints, even if published in an isolated test database. Authenticated `/api/admin/content/search-preview` can inspect clearly labeled synthetic test indexes only in that isolated environment. A mocked authoritative publication snapshot separately tests the positive public read path. Neither is a claim of live government data.

## Change and failure recovery

Material source changes create new immutable evidence, preserve the previous approved snapshot, withdraw current search visibility, mark related artifacts stale and stop obsolete queued work. Workers fence both their job lease and current source/version before committing a result. An in-flight response arriving after a source change cannot publish or become a current artifact. New facts require renewed review and generation.

Expired AI worker leases recover for at most three attempts. Global MongoDB worker slots bound concurrent jobs across processes. Failed/blocked/deferred jobs are inspectable and retryable through admin. Transient retries defer with a cooldown; persistent credential/budget/configuration blocks require operator repair. Previous approved publication survives an unrelated failed preparation attempt. Do not delete records or bypass unique indexes to force retries.

## Verification commands

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

The browser wrapper runs the regression suite, then a separate synthetic content fixture suite in a fresh isolated database. The latter uses deterministic `MOCK_OFFLINE` responses, zero real generation calls, labeled synthetic evidence and no real publication. Test databases remain for audit. Owned test services stop automatically; the pre-existing native database is preserved.

## Manual real-generation diagnostic

After verifying model availability, current official free pricing and the account's actual Free tier, use the existing native local database and an explicit isolated URI:

```powershell
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run ai:check
npm run ai:validate
```

`ai:validate` requires confirmed free entitlement, paid-use approval false and paid budget zero. It creates a timestamped isolated database, stages a clearly labeled test copy of historical non-sensitive public PM-KISAN research, simulates fact review only there, then makes at most one bounded real request per language (EN first, then HI/KN only after success). No retries, secondary-key switching, tools or publication actions occur. It uses the existing router, worker, Zod/factual validator and AIArtifact storage. Source permissions and application records are unchanged. A test reference date is explicitly not a government deadline. Stored output remains `REVIEW_PENDING`; invalid output is retained for inspection and stops the diagnostic. This command makes real requests and is intentionally excluded from automated test/startup scripts.

Results are written to `backend/reports/gemini-generation-validation.json` plus timestamped receipts. Metadata-only checks write `backend/reports/gemini-provider-check.json`. Read the [validation report](../history/GEMINI_INTEGRATION_VALIDATION.md) before interpreting test content as current government information. Never publish these synthetic test copies.

## Current external status

Gemini metadata and three real `gemini-3.5-flash-lite` generation requests succeeded on 18 November after the owner confirmed Free tier/no paid billing and official pricing was checked. EN/HI/KN structured explanations and keywords passed validation; 2,205 input + 2,533 output = 4,738 total reported tokens. Three artifacts remain review-pending in an isolated test database; zero publication events and zero paid requests. Billing tier is owner-attested, not inferred from metadata; invoice/account balances were not inspected. Atlas inspection previously failed DNS/connectivity; no Atlas write occurred.

No government source was newly authorized. PIB's robots endpoint returned unavailable HTML. The checked OGD host returned a robots rule disallowing all crawling; its documented API also requires an appropriate API key and dataset/access review. A license alone does not override robots or grant an API credential. No dataset/RSS content was collected from that denied host. See the source-policy reports and approval log for exact URLs/results.

Official implementation references: [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output), [project rate limits](https://ai.google.dev/gemini-api/docs/rate-limits), [pricing/data use](https://ai.google.dev/gemini-api/docs/pricing), [Google JavaScript SDK](https://github.com/googleapis/js-genai), [OGD API access help](https://data.gov.in/help).
