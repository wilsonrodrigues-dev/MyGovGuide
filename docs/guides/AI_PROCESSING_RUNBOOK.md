# Phase 3.6 AI content operations

## Blank-form draft preparation — 21 November 2026

The existing Forms worker now accepts evidence-bound `SOURCE_GROUNDED_DRAFT` jobs before human publication review. Only source-identified blank public forms with archived page quotes and an inventory/PDF/source-version binding qualify. This is not consent to send citizen uploads to any provider. Private arbitrary uploads retain local parsing/OCR, in-memory retention and no automatic external processing.

Use the existing `/admin/forms?formId=FORM-20` workspace to inspect the original document alongside the saved draft. The preparation button reuses current versioned jobs/artifacts; the existing worker processes eight guidance units per routine-draft request and saves validated parts. Quota/cooldown pauses retain progress and respect retry timing. Invalid output fails closed and retains a diagnostic receipt; an explicit corrected retry can use validation feedback. Never rotate a shared key to evade quota or enable an unconfirmed paid/fallback entitlement.

`FormGuidanceArtifact` drafts remain `REVIEW_PENDING`. The public API reports document identification, source verification, extraction, per-language preparation, automated checks and citizen readiness separately. It never exposes a pending draft as reviewed guidance. Source fact/rights/currentness review and the existing exact-revision publication decision remain required under master plan §17.4. PDF embedding/rehosting has a separate rights gate; selecting a downloaded official PDF for browser-only preview does not grant hosting rights. Source changes invalidate cached derivatives even when the PDF ID stays the same but the field inventory changes.

Current task results, exact coverage, blockers and genuine screenshots are linked from [the Forms Help completion report](../history/FORMS_HELP_COMPLETION_REPORT.md). Historical entries below remain historical checkpoints.

## Everyday admin decisions, 20 November 2026

Open **Content**, which starts with Ready to Publish. Preview the original source and all three language versions, then choose **Approve & Publish**, **Keep Pending** or **Reject**. Existing URLs, document/fact hashes, versions and exact artifact references are attached by the server; no mandatory supporting-evidence text is required. Rejection notes are optional. Selecting Forms shows all original references; these remain separate from reviewed guidance. Published content and already handled observations do not ask for another approval.

**Approve & Publish Ready** opens the exact eligible list and requires an explicit confirmation. Source/version/revision snapshots are rechecked, then scheme/form editorial decisions and publication run in one transaction; blocked, expired, withdrawn, rejected or invalid content cannot enter that set. No generation occurs during review. Existing source-rights decisions and missing facts remain real blockers; removing evidence typing does not create a rights basis. Unknown permission declarations stay in Advanced operations.

Protected `/api/admin/content-workbench` provides grouped worklists/counts and previews; `/decisions` accepts exact snapshots plus confirmation, and `/process` handles safe administrative observations only. The existing worker also performs idempotent routine/historical triage on its five-minute evidence cycle. It uses the recorded approval-decision time, exact approved facts and validated source versions to recognize covered old research. Current facts, changed evidence, unsupported comparisons and incomplete guides stay visible. Original ReviewItems, human decisions and source versions remain preserved.

The latest Atlas run handled103 additional observations (207 total) without publication. The owner explicitly approved and published the nine limited-summary schemes /27 exact language revisions:24 schemes and72 indexes are now published. All original15 publications remain preserved; Ready is0. [Exact review set](../history/READY_CONTENT_REVIEW_2026_11_18.json), [completion, counts and screenshots](../history/SIMPLE_ADMIN_APPROVAL_REPORT.md).

## Current: Forms viewer and sequential provider chain, 19 November 2026

The owner's latest instruction supersedes Gemini-only operation: primary Gemini, authorized secondary Gemini, then Groq. Private `backend/.env` remains the only runtime credential source. The complete safe defaults are in [backend/.env.example](../../backend/.env.example); this example never overrides the real environment.

Configure `GROQ_API_KEY_PRIMART` (owner-supplied spelling) or `GROQ_API_KEY_PRIMARY` (takes precedence), `GROQ_MODEL=openai/gpt-oss-120b`, and **only after confirming the actual account's free plan**, `GROQ_FREE_TIER_CONFIRMED=true`. The selected model supports [strict structured output](https://console.groq.com/docs/structured-outputs); its presence in the [free-plan rate table](https://console.groq.com/docs/rate-limits) does not establish this key's entitlement. Live Groq EN/HI/KN quality remains untested. Keep `AI_PAID_USE_APPROVED=false` and `AI_MAX_COST_PER_DAY=0`. No real Groq request was made in this task.

Keep `GEMINI_SECONDARY_AUTHORIZED` explicit. `GEMINI_SECONDARY_PROJECT_RELATION=shared` is the default; `unknown` also fails closed for quota. Use `independent` only with actual separate-project evidence. A shared-project 429 skips the secondary key and persists project cooldown. Retry-After and provider/credential circuits apply; transient requests have bounded retries and a 60-second overall chain deadline. 400, 403, malformed JSON, nonretryable responses and failed factual validation do not trigger fallback. 401 disables the broken credential and can use an expressly authorized replacement. If none can run, jobs defer under the existing bounded retry policy. Redacted attempts record provider/model/credential label, latency and failure category; successful chunks preserve token usage and version/language identity. Valid cached artifacts/chunks bypass provider work. Opening a form or changing language never generates content.

Everyday admin navigation is **Dashboard / Content / Needs Attention**. All prior tools remain under **Advanced / Operations**. Content searches schemes/forms/notices/scams; form publication status derives from current reviewed guidance, not the legacy template flag. `/admin/forms?formId=FORM-01` combines local original PDF, fields, source evidence, uncertainties and exact multilingual revisions. Source/version/hash evidence is prefilled; genuine rights and editorial attestations remain explicit. Existing deterministic review automation and approved-scope reuse remain in place; no new content is auto-published.

`/forms/:id` displays stored guidance or clearly labeled local reading aids. A downloaded original PDF may be selected **in browser memory only**, without upload. PDF.js and its matching worker are bundled locally; maximum 5 MB /10 pages, no embedded JavaScript or attachments, exact source SHA when known. Manual and typed contextual voice controls share selection/page state. Only unique PDF widget labels or reviewed document-hash coordinates produce highlights. Do not claim tested microphone recognition or native speech quality from instrumented browser speech checks.

Optional ImageKit uses [server-side private-key Basic authentication](https://imagekit.io/docs/api-keys). `IMAGEKIT_API` is accepted only as an identifiable `private_` key; otherwise set `IMAGEKIT_PRIVATE_KEY`. Also configure `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_UPLOADS_ENABLED=true` and confirmed `IMAGEKIT_FREE_TIER_CONFIRMED=true` before use. No public key is needed for this server-upload path. Current key is recognized, but endpoint/free entitlement/upload enablement are absent. Do not expose these credentials through Vite.

The advanced document panel records separately evidenced, expiring `OFFICIAL_ORIGIN_EMBED` or `IMAGEKIT_REHOST` permissions bound to exact source URL/hash. API: protected `GET /api/admin/forms/storage-status`, `POST /:id/display-rights`, `POST /:id/imagekit` (document ID only). The server reads an operator-inspected blank PDF from ignored `.local/forms-milestone/<formId>.pdf`, verifies its hash, claims once, uploads to `https://upload.imagekit.io/api/v1/files/upload`, and records edition/source/hash/file ID/delivery URL. It accepts no citizen file or arbitrary fetch URL. Completed uploads are reused. Interrupted/uncertain uploads remain `RECONCILIATION_REQUIRED`; inspect the ImageKit account before any recovery. Revoking app delivery does not delete a hosted file; remove it in the ImageKit account separately. No real upload or permission grant was performed. Rights-unknown documents retain official links and local preview only; official-origin display also requires permission and usable CORS.

The owner's four form fact/rights/currentness packets remain pending. This implementation is not approval to queue or publish them. [Results, screenshots and remaining acceptance limits](../history/FORMS_AI_ADMIN_COMPLETION_REPORT.md).

## Forms extension — owner kept preparation pending

The existing `/admin/forms` workspace handles blank public form evidence and exact EN/HI/KN revision review. Current decision: **keep all four form packets pending** until fact, rights and currentness issues are resolved. Do not queue real form generation, infer approval from implementation permission or publish the selected55 labels as a complete form guide. [Packet and owner decision](../FORMS_MILESTONE_REVIEW.md), [actual implementation/tests](../history/FORMS_MILESTONE_REPORT.md).

`GET /api/forms` and `GET /api/forms/:id?language=en|hi|kn` read the catalog and reviewed cache; they never generate. Protected admin endpoints are `/api/admin/forms/:id/fact-review`, `/prepare` and `/publication`. A fact decision requires the exact current document ID, facts/rights/currentness attestations and evidence. Preparation uses the existing worker/provider router and persisted four-field chunks. Publication requires3 exact validated current-language artifact IDs and explicit human evidence. Source change/expiry/rejection prevents serving old guidance. Admin actions do not modify scraper permissions or scheme eligibility.

`node backend/scripts/stageFormDocuments.js` validates the operator-inspected PDFs and matching manual-download receipts under ignored `.local/forms-milestone/`; `--store` stages document/source versions without approving them. It performs no network collection and refuses files lacking a matching observed GET/hash receipt. Do not use citizen uploads or synthetic fixtures as public source evidence. Original PDFs are not automatically hosted. The current viewer policy above permits browser-only local preview and separately rights-reviewed delivery; source links/hash/selected factual evidence remain stored. Real PDFs were individually fetched during the authorized audit; this does not grant ongoing automated-source rights.

Reproduce isolated checks with `npm test`, `npm run test:integration`, `npm run build`, `npm run test:e2e`, and `npm run test:e2e:forms -w frontend`, with a local `mygovguide_phase2_test*` database and free/paid generation disabled. Forms browser fixtures are labeled synthetic; they make no Gemini calls. Citizen uploads accept local-only consent and never enter this queue, MongoDB, logs or Gemini. See `/privacy` for retention/deletion behavior.

Current operation: use the consolidated review in `/admin/publish`, covering all pending schemes. There are no automatic or per-five-scheme approval prompts. Existing valid revisions are reused. New research cannot enter Gemini without genuine human fact/rights/currentness review. [Consolidated workflow and blockers](../history/CONSOLIDATED_REVIEW_AND_CATALOG_PREPARATION.md).

Latest Batch 2 owner-approved publication: fifteen schemes /45 indexes published, ten schemes /30 current revisions pending. No generation repeated. [Execution report](../history/BATCH_TWO_PUBLICATION_REPORT.md).

Latest owner-approved Batch 1 publication brings the catalog to ten schemes /30 language indexes, with fifteen schemes /45 revisions still pending. No generation was repeated. [Execution report](../history/BATCH_ONE_PUBLICATION_REPORT.md).

Current catalog operation, 18 November 2026: the private model is `gemini-3.1-flash-lite`, selected after repeated 3.5 HTTP503 failures and fresh official capability/free-tier checks for the same owner-confirmed Free-tier project. No paid use or secondary-key quota switching. See the [catalog execution report](../history/SCHEME_CATALOG_EXPANSION_REPORT.md) for actual counts/errors; older checkpoints below retain their original model/results.

The existing workspace now supports preparation batches of up to five fact-reviewed schemes. It reuses jobs and reports blockers. For selected editorial decisions, inspect each current revision, select it, enter review evidence and explicitly attest personal language/keyword/source review. Approval and publication remain separate. Never treat a fact-review approval as translation/publication permission. Historical-only `publicationBlocked` facts cannot be published.

Some provider responses contain placeholder documents despite an unknown approved checklist. Preserve invalid output and use a separate unapproved draft to remove invented entries; do not certify an empty list as “no documents needed.” A valid corrected draft may coexist with the original failed generation job. Do not regenerate valid current revisions to clear historical errors. Review exact revision IDs and output hashes in the scheme batch packets.

Latest execution: PM-KISAN has actual owner-approved EN/HI/KN publication in Atlas, three indexes and one publication record. Existing citizen discovery/detail routes now serve it. NDMA execution configuration was separately restored and verified with HTTP200/100 unchanged then HTTP304; no schedule or new notice/version. No new Gemini calls or eligibility approvals. [Current completion evidence and lineage](../history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md); [official dataset API findings](OFFICIAL_DATASET_API_FINDINGS.md). Earlier same-day local/zero-publication/configuration observations below are historical.


## Latest Atlas configuration — 18 November 2026

Backend/API/worker now select the private Atlas `mygovguide_dev` database through ignored `backend/.env`; `.env.example` is documentation only. Optional `MONGODB_DNS_SERVERS` is a process-only SRV resolver setting, blank by default; the current explicit setting resolves the machine's refused SRV lookup without weakening TLS/authentication.

Owner-approved transfer preserved 942 content/review records, including 25 schemes and 15 validated, review-pending Gemini artifacts. All local data remains safe. Sessions/accounts/audit logs, schedules, worker state and adapter configurations were excluded; collection activation/history must not be inferred from copied source records. The API and running worker connect to Atlas; the frontend uses the existing API proxy. No new generation or publication. [Exact diagnosis, transfer scope and verification](../history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). Earlier local-only observations below are historical.



## Real-data update — 18 November 2026

In the existing admin, Sources shows active authorized NDMA RSS and disabled Income Tax (guarded HTTP 403); collection history shows genuine NDMA 200/304 runs. Data Explorer distinguishes 100 LIVE notices, 12 imported research notices and four fixtures. Review & publish contains five owner-approved limited scheme fact packets and 15 validated English/Hindi/Kannada artifacts, all pending editorial review. Zero schemes are published; no eligibility rules approved. Missing facts/dates/documents and native-language quality still require review.

The selected application database is now the existing native MongoDB; restart backend/worker for private environment changes. No new schedule was created. Preserve free-only settings; these completed requests do not authorize paid usage or automatic publication. [Exact results and remaining blockers](../history/REAL_DATA_COLLECTION_REPORT.md), [five fact packets](../FIVE_SCHEME_FACT_REVIEW.md).

The authoritative requirements are [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md), especially section 17 and its 18 November documentation revision. The [pre-redesign implementation brief](../OPENCODE_IMPLEMENTATION_BRIEF.md) records historical instructions and does not override the [final redesign roadmap](../FINAL_REDESIGN_ROADMAP.md). This extends the existing Express/React application and native worker. That historical phase did not implement citizen voice/uploads; current Forms and voice additions are documented above. Maps, registered accounts, notifications and eligibility interfaces remain outside this task.

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

Historical 18 November checkpoint: Gemini was the only implemented provider. The current owner-authorized chain above supersedes that restriction. The retired provider adapter, environment schema/placeholders and private configuration entries have been removed. There was no separate vendor SDK dependency to uninstall. Historical implementation details remain in the [Phase 3.6 completion report](../history/PHASE3_6_COMPLETION_REPORT.md); those do not describe the current provider implementation.

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
