# CODEX MASTER PROMPT — MyGovGuide Phase 3.6: Civic Blue Redesign + Trusted Data-to-AI Pipeline

You are operating in the owner's existing VS Code MyGovGuide workspace. The project already has a JavaScript `backend/` and `frontend/`, MongoDB/Mongoose data models, 137 Phase 1 research records (including non-publishable material), an admin console, authenticated admin sessions, a bounded source-authorization gate, fixture collectors, workers, change detection, scheduling, and a React citizen onboarding/Home foundation. **Do not rebuild any of these.**

## 0. Authority, scope, and operating procedure

**Read the newest `PRODUCT_MASTER_PLAN.md` v2.3 first**. If absent, search the workspace for `MyGovGuide_PRODUCT_MASTER_PLAN_v2_3.md` and explain that a copy should be placed at root; read it as the canonical product specification. Then inspect `docs/history/PHASE3_5_COMPLETION_REPORT.md`, backend/frontend code, actual npm scripts, current tests, admin implementation, old Phase 1/2 data and source approval logs.

Work autonomously on normal local code/config/test changes, including necessary installs and existing Stitch assets. No repeated questions for routine steps. Do **not** bypass host/tool approvals, use paid APIs without explicit spending approval, deploy publicly, delete live data, weaken the source-authorization gate, or mark government facts as approved without evidence and authorized review. Never put API credentials in chat, frontend, reports, committed files or `.env.example`.

Create a brief checklist in `PROGRESS.md` and execute it. Preserve source code, history, existing tests, and research files. Use JavaScript only. No Docker, no new monorepo nesting, no separate admin app, no extra technology stack.

## 1. Theme overhaul — no green or orange

The current dark-green/orange aesthetic is rejected. Apply a **Civic Blue** design system across the existing **citizen and admin** React applications:

- Primary navy `#1E3A8A`
- Interactive indigo `#4F46E5`
- Background `#F7F9FC`
- White surface `#FFFFFF`
- Main text `#17243A`
- Muted text `#536276`
- Border `#DCE3EF`
- Errors `#B42318`

Branding, hero cards, buttons, charts and active navigation must not use green or orange. Distinguish statuses with accessible text/icons rather than colors alone. Keep existing Noto Latin, Devanagari and Kannada fonts, language switching and responsive layouts. Maintain WCAG AA contrast and check 320px, 360px, 390px widths and common desktop breakpoints. Centralize tokens in theme variables/Tailwind, not scattered inline values. Preserve actions and route behavior.

Existing Stitch-generated 14 screens may be referenced, but the previous green/orange design must not control the result. If Stitch MCP authentication is unavailable, complete the redesign in React/Tailwind anyway; do not invent new Stitch artifacts.

## 2. Database and API configuration

The owner will provide these values **privately** in ignored backend `.env` or an equivalent local secret store:

```dotenv
MONGODB_URI=
MONGODB_TEST_URI=
GEMINI_API_KEY_PRIMARY=
GEMINI_API_KEY_SECONDARY=
GEMINI_MODEL=
MISTRAL_API_KEY=
MISTRAL_MODEL=
AI_FALLBACK_MISTRAL_ENABLED=false
AI_MAX_COST_PER_DAY=0
AI_MAX_RETRIES=2
AI_MAX_CONCURRENT_JOBS=2
```

Check the codebase's environment conventions before choosing filename or dotenv loading strategy. Add placeholders to `.env.example` if necessary, with **no real values**. Mask credentials in diagnostics. If legacy values were exposed in logs, document rotation instructions, never repeat them.

Retain local native MongoDB support and optional Atlas. Inspect target database, read-only where possible, before changes. Keep test databases fully isolated. New indexes/models must be additive; no destructive reinitialization. Preserve admin and citizen session isolation, CSRF, audit, worker leases and scheduling.

## 3. Source collection — complete the existing system, not a replacement

Audit current API/RSS/HTML/PDF adapters and source approval evidence. Preserve the DENY-BY-DEFAULT source gate at enqueue, request, redirect and commit. A public website or MongoDB connection string does not confer permission to scrape.

**Live collection:** Identify one practical official **documented API/RSS/approved dataset** with verified automated-access/reuse conditions; implement its source-specific adapter with proper evidence, response parsing, rate limits, ETag/Last-Modified where available, pagination if necessary, timestamps and error reporting. Prefer sources whose policy actually supports automated data collection. If no genuinely approved source can be established, do not manufacture approval or enable a live source. Mark live collection as blocked, leave tests/fixtures working, and record exactly what external authorization is needed. myScheme stays blocked without written permission.

For *every* collected object preserve immutable raw/original evidence (or rights-compatible excerpt), source URL, source ID, fetched date, publication/effective date when known, hash, provenance, and whether content is synthetic, research, or genuine live data. Avoid confusing general cyber-awareness guidance with dated scam incidents.

Implement/repair source-specific parsing for scheme facts: canonical scheme name/aliases, responsible department, central/state applicability, beneficiary categories, benefit details, original clauses, supporting documents, eligibility conditions (as unapproved candidates), form/application URLs, latest verified date. If an official feed contains only notices/news and no scheme eligibility, classify it accurately; **do not invent scheme records**.

## 4. Reviewed-content → AI content preparation (main missing feature)

Build upon existing review, ingestion and jobs. Do not call AI on every request or during source fetch; queue it **after source/fact review**.

Canonical workflow:
1. Collect authorized source and version it.
2. Normalize facts into pending review with exact original source references.
3. Authorized human review validates key scheme facts, rights/evidence, date and currentness. Keep research-only unreleased.
4. Only for approved source content, enqueue an AI task to produce **simple English** explanation with summary, who it may help, benefits, documents, how to apply, and limitations. Do not fabricate missing values.
5. Generate **Hindi and Kannada** versions grounded in the same approved facts; add translated titles, approved aliases, synonyms, searchable keywords, and optional safe romanized terms. Do not create fake eligibility facts.
6. Validate structured JSON with Zod and compare exact amounts, dates, income/age thresholds, document names and links to approved source facts. Record validation warnings/errors; high-impact text requires editor approval before publication.
7. Save derived versions in MongoDB and provide admin preview/edit/reject/approve workflow.
8. Publish only the correct approved version; search and scheme previews read from MongoDB, never directly from the LLM.
9. On material source change, invalidate dependent AI/search artifacts for that old version; preserve history and require fresh review, without overwriting the previous approved snapshot.

Make generation **idempotent** by scheme ID + source version/hash + task + language + prompt/model version; support in-progress/failed/retry/reviewed statuses and worker leases. Add additive `AIJob`, `AIArtifact`, `SchemeSearchDocument` (or equivalent) only where existing models don't already meet those requirements.

**Multilingual search:** index normalized keywords/titles/aliases for `en`, `hi`, `kn` in MongoDB; preserve Unicode; don't rely on English-only `$text` analyzer or use unbounded collection-wide regex. Provide deterministic search ranking with state/category filters and optional romanized aliases. Do not call AI per keystroke. Publish only reviewed records; show a transparent unavailable/empty state if none exists.

## 5. Multiple AI providers — correct failover, no quota circumvention

Implement one `AIProviderRouter` abstraction and task-based provider adapters:

- Gemini via current official JavaScript SDK, model in `GEMINI_MODEL`, primary key first.
- Secondary Gemini credential is **valid credential redundancy only**. Keys in the same Google Cloud project share quotas: **do not rotate keys to bypass 429/rate limits**.
- On transient network/5xx: bounded retry with exponential backoff; on 429 honor retry guidance and defer; on 401/403 disable faulty credential and alert admin. On malformed input/schema, fail or repair properly, not indiscriminate failover.
- Mistral is an independent optional fallback only after its API access/billing entitlement is confirmed, `AI_FALLBACK_MISTRAL_ENABLED=true`, nonzero approved budget or otherwise confirmed free API entitlement, and input privacy permits use. Do not infer that possession of a key means requests are free or authorized to incur charges.
- Every provider must conform to the **same JSON/Zod contract** and factual validation; record provider/model/prompt version, timestamp, retries, token usage and cost estimate, without leaking secrets.
- If providers unavailable, queue for later or show current approved source text; never produce a fictional AI summary.
- Sensitive filled citizen forms, private documents, identity IDs and personal user uploads **must not be sent to free/public AI APIs by default**.

Include health checks that do not reveal secrets, provider status indicators and safe error handling. Use actual model availability/capability discovery or documented API models; never hardcode an obsolete model ID based on old handoff text.

## 6. Finish and extend the existing `/admin` dashboard

**Do not create a second dashboard.** Make its existing controls operational, backed by real MongoDB records and worker jobs. Add/update:

- Overview with separate counters for imported-research, fixtures, authorized-live, source-review, AI pending/failed, EN/HI/KN prepared, published, outdated, source-authorized and eligibility-rule-approved.
- Sources: authorization evidence, last run, last HTTP/parse failure, approval/denial; enable toggle **cannot** supersede source access restrictions.
- Manual scrape: fixture/test mode and approved-live mode; job progress, bounded logs, cancellation where safe, error messages.
- Scheduler: existing persistent cron ON/OFF, timezone, next due, run history. Do not duplicate scheduler or make cloud job assumptions. AI generation scheduling may be separate from scraping.
- Data Explorer: view raw excerpt, parsed facts, evidence link, source version, derived English/Hindi/Kannada content, keywords and history.
- AI Work Queue: pick approved scheme, queue simplify/translate/keywords, inspect output, retry failures, compare providers, view safe cost/usage metrics.
- Review & Publish: editor can review claim, translations, keyword sets and source evidence; approve/reject with audit trail. Do not allow a one-click 'approve all' on government eligibility rules.
- Changes: show source changes, stale AI artifacts and subsequent regeneration status.

Keep existing admin authentication, session expiration, CSRF, allowed-origin checks, role/ownership authorization and audit trail. No public admin endpoint.

## 7. One true end-to-end demonstration

With an **approved or clearly labeled synthetic fixture** (never relabel synthetic content as real):

`Source → parse → version → review/stage → fact approval (simulated only in isolated tests unless genuine approval exists) → AI English summary → Hindi/Kannada → keywords → JSON validation → review/publish gate → indexed MongoDB search → citizen-safe read endpoint → visible admin metrics`.

If a real approved source and reviewed scheme exist, test it separately and mark the outcome as genuinely live. Otherwise the fixture test is a pipeline proof only; do not make a live-collection claim. Test offline error handling and preserve previous approved snapshots when a new import fails validation.

## 8. Regression and acceptance testing

Rerun existing backend, database, frontend and browser tests. Add tests for:
- all three language outputs and malformed/unsupported model responses;
- exact numerical/date/document preservation;
- 2-key Gemini quota behavior, temporary-error backoff and optional Mistral response-contract fallback;
- cost budget and provider-disabled behavior;
- idempotency and version-keyed AI cache;
- search normalizations and ranking for English/Hindi/Kannada;
- raw source not replaced by generated text;
- no unapproved/synthetic scheme leaked as official current data;
- no source-gate bypass via manual or cron jobs;
- review/approval/reject permissions and audit history;
- theme contrast/keyboard/mobile layout and no regressions in onboarding, admin security or scheduler.

Run real API integration tests only if credentials are available; use deterministic mocked providers and local fixtures for offline coverage. If a vendor connection fails, report precise sanitized cause; don't claim success. Do not force green builds by weakening expectations.

## 9. Completion report

Update `README.md`, `PROGRESS.md`, product master references, `.env.example`, admin operations guide, AI processing runbook and a new `docs/history/PHASE3_6_COMPLETION_REPORT.md` with actual code/file changes, import statistics, AI results, tokens/costs, provider attempts, validated source links, tests and blocked items. Include exact commands to run database, backend, frontend and workers **without Docker**. Distinguish local fixture, research-only, approved live, prepared AI and public publication in every report.

**Do not start future citizen features** (voice orchestration, notices/forms uploads, maps, notifications, eligibility UI, etc.) during this task. Those remain mandatory in the master plan, but this phase is strictly about getting the trusted data/AI/admin system working and refreshing the color theme.

**START: inspect and audit the existing workspace, preserve the baseline, apply the Civic Blue theme, then build and test the source-review → AI → multilingual keywords → MongoDB/admin flow completely to the extent permitted by genuine credentials and source approvals.**
