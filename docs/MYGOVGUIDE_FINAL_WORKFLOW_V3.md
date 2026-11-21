# MyGovGuide — Final Demo-First Workflow & Data Architecture

**Active owner amendment — 21 November 2026:** The Final Real Data Completion and Citizen Feature Correction instruction supersedes earlier routine mandatory-human-review and three-scheme/demo-only limits. Process the entire existing scheme/form/notice/scam inventory through targeted authoritative research, source-version preservation, evidence/factual/translation validation and automatic publication of sufficiently supported content. Machine decisions must use a distinct automated validator identity and version-bound audit metadata, never a fabricated human approval or government certification. Incomplete/contradictory operative rules still cannot produce eligibility verdicts. External access/rehosting permissions, source restrictions, privacy, zero-paid entitlement and legacy-database safeguards remain mandatory. No bulk scraping or collection-monitor changes. Record resumable per-record outcomes in `backend/reports/citizen-data-completion-progress.json`. Older human-review wording below describes the superseded workflow wherever it conflicts with this amendment.

**Frozen design specification — 20 November 2026**

**Purpose.** Improve the existing MERN application (React/Vite, Node/Express, MongoDB Atlas) rather than replace it. Prove a small real-content citizen demo and show a bounded live collection in a transparent admin monitor. No destructive changes to the legacy database.

## 1. Decisions and scope

- New active database: `mygovguide_demo_v2`; existing `mygovguide_dev` is **read-only/unchanged** rollback source. Inspect the current actual database name before wiring either; names here reflect our proposed configuration.
- Preserve the prior database, MongoDB audit/evidence, credentials, published content, and existing functionality. Do not bulk-delete or reset Atlas collections.
- Ingest four *allowlisted candidate sources*, subject to source-specific authorization: (1) Jan Suraksha (official rules and forms for PMJJBY, PMSBY, APY), (2) PIB RSS (announcements), (3) NDMA SACHET RSS/CAP (alerts), (4) I4C/CyberDost official awareness resources (scams). These are **different content types**; do not count PIB announcements as operative scheme rules or historical SACHET messages as active emergencies. For I4C, prefer curated official source files until automated access terms are verified.
- `data.gov.in` is **optional** after identifying an applicable dataset and its license/API terms, not a substitute for real scheme eligibility guidelines. API Setu is an optional discovery resource; government APIs may require onboarding.
- Selectively migrate *valid verified* reference content and source evidence into the demo DB; create **new versioned data** for genuinely new findings. Keep an immutable trace to sources and migration origin.
- Demo targets (real accepted data): **5–10 enriched schemes, 3 complete approved real rule sets, 2–3 complete official forms with EN/HI/KN field guidance, 2–3 source-grounded notice examples, 5–8 genuine official scam-awareness items, and 1 live permitted bounded collector run**. These targets are not yet achieved.
- Citizens: EN/HI/KN UI + selected language explanations, optional voice, completely usable manual mode. Guest browsing and on-demand private forms/notices without login.
- OpenCode is the **development agent**, not the website's runtime search/collection service. The website uses its own backend adapters and keys. Connect OpenCode's model separately via `/connect`, according to its provider setup.

## 2. Data model — reuse and extend existing Mongoose models, do not duplicate unnecessarily

### A. Official source / source version
- Source ID, issuing authority, host, approved URL/path scope, collection policy/permission evidence and expiry, polling constraints, source type, fetch mode, original language.
- Exact official URL, fetched time, published/effective/expiry time when verifiable, original text/extraction, PDF/asset link, content hash, HTTP status/ETag/Last-Modified, version number, immutable evidence passages/pages, redirect chain, MIME and document size.
- Fact-specific evidence references, supersession, conflicts, failures, provenance and authenticity status. A successful HTTP 200 or web search hit is **not** editorial acceptance, automated collection permission or rehosting permission.

### B. Scheme
- Stable scheme ID; official name/aliases/title EN/HI/KN; authority, jurisdiction, category/audience, purpose, benefits (amounts + units), full operative conditions and exclusions, document requirements (conditional rules), online/offline how-to-apply steps, helpdesk, official apply URL, optional valid official form references, deadlines/effective periods if actual, official sources/versions, last verified, status.
- Per-scheme readiness: `SCHEME_FACTS_READY`, `RULESET_READY`, `FORM_GUIDE_READY`, `AI_EN_READY`, `AI_HI_READY`, `AI_KN_READY`, each with reasons and source version. A scheme can be published as informational content without giving an eligibility verdict if a separately approved *complete* rule set is unavailable.
- Localized factual simplification and indexed search keywords; never replace original evidence with AI output.

### C. Eligibility rule set
- Scheme ID, operative version/effective period, source clause IDs, AND/OR/NOT/conditional requirements, typed fields and answer units, numeric/date boundary semantics, categories, exceptions, conflict flags, mandatory evidence, reviewer decision and expiry/invalidation.
- Rule completeness requires all governing clauses resolved; never interpret missing rules as `eligible`. Deterministic evaluator emits MET/UNMET/MISSING/UNKNOWN per condition and an overall qualified/cannot-determine result. AI may *explain* but never decide.

### D. Form catalog and field guidance
- Stable form ID and standalone category (can have zero linked schemes), issuing authority, form type/name/purpose, version/edition, official URL, document hash/pages/MIME/size, last verified and document availability. Application PDF versus online portal route explicitly distinguished.
- Optional ImageKit `fileId`/URL **only after verifying third-party hosting rights**; otherwise official URL/local temporary preview. Never rehost private uploads.
- For every visible form field: ID, original label, source page/passage, ordering, reliable coordinates if known, type, required/optional/conditional, purpose, how-to-fill, allowed values/format, source-supported fictional example, accompanying instructions/warnings, EN/HI/KN explanation, source/version and quality status.
- Any user-uploaded form: transient private file, local text/OCR extraction, match SHA and official edition; use only non-sensitive titles/labels for official search. If uncertain, show 'Unidentified uploaded form' and source-grounded generic field help. No public admin review for citizen uploads.

### E. Notice
- Notice ID, title, department/issuer, original URL/PDF/text, version, issue/event/effective/deadline fields individually with exact cited source passages, intended audience, instructions/actions, documents, official contact, chronology, historical/current/superseded/unknown status, EN/HI/KN explanation, checklist and quality validation.
- Original private uploaded notices are session-only and not promoted into public data. Local extraction first, then optional safe consented AI on a reviewed non-sensitive excerpt; no raw private documents to free external models. Historical notices must not generate present-tense 'act now' instructions.

### F. Scam-awareness / advisory
- Stable ID; official CyberDost/I4C source; title; category (phishing, OTP, fake scheme, UPI, job scam, etc.); `EVERGREEN_AWARENESS` versus `DATED_INCIDENT`; original advisory publication date if known; source passage; common warning signs; what to avoid; safe actions; exact official reporting link; EN/HI/KN summaries and validation. No invented fresh incident claims.

### G. Jobs and event log
- `CollectionRun`: UUID, requested source(s), operator, start/finish, status, worker owner/lease, source policy snapshot, budgets, counts (found/downloaded/unchanged/enriched/needs-review/published/blocked/errors), timestamps.
- `CollectionEvent`: run ID + monotonically increasing sequence, timestamp, source ID, target URL masked/safe, stage, status, duration, HTTP result, record reference, safe human-readable message, structured metrics. Persist first, then emit to authorized admins through Socket.IO.
- No secrets, personal uploads, full extracted private text or raw AI prompts in logs.

## 3. Completeness-first collection state machine

`DISCOVERED -> SOURCE_AUTHORIZED -> FETCHED -> ORIGINAL_EVIDENCE_SAVED -> EXTRACTED -> MISSING_FIELDS_FOUND -> ENRICHING -> FACTS_VALIDATED -> AI_PREPARED -> LANGUAGE_VALIDATED -> READY_FOR_EDITORIAL_DECISION -> PUBLISHED`

Alternate truth-preserving terminal states: `UNCHANGED`, `RESEARCH_ONLY`, `BLOCKED_SOURCE_ACCESS`, `BLOCKED_RIGHTS`, `BLOCKED_CONFLICTING_RULES`, `BLOCKED_OLD_EDITION`, `DEFERRED_QUOTA`, `FAILED_RETRYABLE`, `HISTORICAL`, `SUPERSEDED`.

- Store every **incomplete** attempt in the private staging/evidence DB collections so it can resume; only citizen-ready approved items go to published search and pages.
- **Information discovery:** inspect existing source/cache and same-doc history; fetch exact permitted official source; identify missing data; search narrowly via Tavily using official-domain constrained query; retrieve verified official pages/PDFs with bounded HTTP; Playwright only where allowed and necessary; local OCR on raster if feasible. Cap search calls, bytes, crawl depth and time per job. Never bypass CAPTCHA, authentication, robots/terms or source permissions.
- Source-specific source policies control auto-fetch and changes. A status toggle alone must NOT grant permission. Check permission at job start and before each fetch/commit.
- **Normalized facts:** source-anchored exact passages plus typed values. Verify issuing authority, title/edition and conflicts before assigning to scheme/form/notice.
- **AI preparation:** use validated cached EN/HI/KN when same fact/document version. Otherwise Gemini primary, enabled entitled Gemini secondary, then independent authorized Groq where configured; bounded retries; schema validation and numeric/date/condition integrity checks. No free-tier circumvention and zero paid spend. Persist provider/model/prompt/version/usage and validity.
- **Publish:** editor approves grouped genuine fact/eligibility/document interpretation and language publication, not every extraction event; reuse valid old approvals only when evidence/meaning/version unchanged. Missing or uncertain requirements are not invented to satisfy demo counts.
- **AI missing:** validated raw source may remain available with transparent limited explanation; no silent invented or stale translated content.

## 4. Citizen journeys

1. **Scheme**: search/filter verified source-backed results -> detail original + EN/HI/KN simple explanation + requirements + docs + official application -> `Check Eligibility` on EVERY published scheme -> `/eligibility/:schemeId` auto-select -> only approved complete rules ask questions -> condition results and citations; otherwise show supported known criteria and precise unavailable status. `Open form` links correct official PDF/online portal.
2. **Catalog form**: open original PDF (desktop side-by-side/mobile tabs) -> field selection -> source-grounded what-to-enter/example in preferred language -> next/back/repeat/listen/stop.
3. **Unfamiliar form upload**: PDF/image -> bound/OCR locally -> hash/title/authority/edition match; official-source lookup using only safe metadata -> field-by-field guidance (contextual, version-appropriate) -> original alongside explanation -> optional TTS; ask consent before sending specifically reviewed non-sensitive excerpts to a permitted AI provider. Do not claim official identity if not verified.
4. **Private notice upload**: PDF/image/pasted text -> local extract/OCR/transcribe -> original preview -> reviewed/redacted non-sensitive excerpt and explicit provider consent -> structured AI in chosen language -> grounded actions/docs/deadlines, checklists, readback; deletion/TTL. No public queue.
5. **Public notice**: only complete, appropriately approved exact source version; date roles and historical status visible.
6. **Scam awareness**: curated source-linked evergreen lessons and dated advisories separately, multilingual simple action guidance and official cybercrime reporting route. No fake live scam incident.

## 5. Admin worker monitor

- Admin has 3 simple navigation areas: `Dashboard`, `Content`, `Needs Attention`, plus a prominent `Collection Monitor` workspace reachable from Dashboard.
- Select one eligible source (display authorization/expiry), `Start Collection`, `Stop after current document`, `Retry failed`, `View run history`; commands via authenticated REST. **Socket.IO is monitoring only**, not an unauthenticated execution endpoint.
- Admin-only authenticated Socket.IO room `collection:run:<id>`, joined after authorization and job ownership checks; persist events before sending, replay events by sequence ID after reconnect. Server worker is source of truth, not frontend timers.
- Show current official URL, permission verdict, job stage, document title, HTTP status, extracted fields, missing facts, source searches attempted, AI model and quotas, artifact validation, staging/publishing decisions, elapsed duration, metrics and actionable error reason. Mask API keys/PII/secret URL tokens.
- `socket.io` server + `socket.io-client` frontend; prefer existing REST session/auth mechanism. No fake progress/stages. Use backpressure/event rate limits and job leases for singleton worker.
- Demo: one permitted source, 1–3 documents max, bounded requests, single concurrent job; expect real `UNCHANGED` outcome to be valid, not force new published records. Offer separate **clearly labeled replay** of persisted prior genuine run if live network is unavailable.

## 6. Database switch and rollback

1. Inventory current `.env`, current `mongoose.connect()` behavior, worker DB selection, secret/session storage and 22 protected Atlas collection hash baseline where available.
2. Export a protected, locally encrypted, access-controlled backup of old data without exposing PII/secrets; verify it is restorable.
3. Create `mygovguide_demo_v2` under the permitted Atlas cluster. Use `MONGODB_DB_NAME` with explicit `dbName` or equivalent once, verified by a safe read; do not rely on ambiguous URI default database or accidental double configuration.
4. Add startup assertion that **all processes** (API, worker, admin jobs, cron, tests) point at the selected DB. Add old database write denylist and disable all collection workers on the old database.
5. Set up required indexes/unique constraints and migrate selected verified records with source/version/provenance; do NOT copy legacy pending observation spam or synthetic fixtures into public collections.
6. Build the selected demo evidence and public content in the new DB. Run automated + browser acceptance and compare old DB hashes unchanged.
7. Rollback by stopping all app/worker processes, changing selected database back to old read-only/working configuration and restarting. Do not mutate or replace old data. If old DB was writable historically, allow write access only by explicit operator change *after* safety checks.

## 7. Environment credentials (backend only)

Required: Atlas connection, existing backend session/auth secrets (keep their current names), Gemini primary, Tavily search key for enrichment, and **only when rehosting authorized** ImageKit public/private key and URL endpoint. Optional: Gemini secondary, Groq account API key and confirmed entitlement, data.gov.in API key for chosen dataset. No API key needed for Playwright, Socket.IO or local Tesseract. OpenCode model credentials configured separately via its `/connect` or per-provider settings. See companion `.env.example`.

**Security:** No secrets in `VITE_*`, Git, sockets or job logs. `.env` never committed; `.env.example` uses placeholders. Avoid paid API calls. Google Gemini free-tier data policies mean raw personal/confidential form or notice content must not be sent to it just because a user clicked upload; use local extraction, redaction and suitable separate consent, with conservative external-AI eligibility.

## 8. Development sequence and hard acceptance gates

**Phase 0 — Baseline & DB safety:** report actual current counts/config, create backup and new DB connection; old unchanged; both API and worker know which DB they use.

**Phase 1 — Complete 3 Jan Suraksha demo schemes:** authoritative current actual rules, applicable limits/exclusions, official apply route and forms; 3 fully reviewed deterministic eligibility checkers; 2–3 field-by-field complete public form guides; translate & validate EN/HI/KN. No invented thresholds, never publish unapproved rules. Use additional already-verified scheme records to reach 5–10 enriched schemes where feasible.

**Phase 2 — Notices & scams:** 2–3 source-backed PIB/NDMA appropriate notices/examples (historical status honest), 5–8 genuinely official CyberDost lessons/advisories, user-upload flows in EN/HI/KN. Source permissions and currentness verified before live polling.

**Phase 3 — Collection engine:** four bounded source adapters with differing modes/policies; staging completeness checker, Tavily fallback, extraction/OCR, validation, AI cache, idempotent saves, retry/TTL.

**Phase 4 — Admin monitor:** persistent events/REST/Socket.IO/permissions; reconnect and job replay; bounded one-source live demonstration.

**Phase 5 — Acceptance and freeze:** unit + API + isolated Mongo + browser desktop/mobile, live provider test within zero-pay plan, published real scheme→eligibility→form, user-upload form and notice, scam awareness, monitor live (or labeled replay), all three languages/manual/voice. Preserve old DB; report exact real vs synthetic results and outstanding permission gates.

### Explicit stop/fail conditions

- Do not delete, overwrite or silently update old Atlas data.
- Do not interpret `200 OK`, AI generation success, or synthetically passing tests as legal authorization, human approval or verified government correctness.
- Do not publish a real scheme eligibility verdict without complete operative clauses and genuine source-version-specific review.
- Do not auto-rehost official PDFs or ingest private user files permanently without appropriate rights/consent.
- Do not set the admin pending count to `0` by suppressing legitimate exceptions. Target `0 actionable routine pending`; show blocked separately.
- Do not scrape all sources or start paid services. Scope demo to selected contents only.

## 9. Exact final report format

Output a table for each demo item: ID, source, current official document/edition, facts and rules validated, form guide coverage, EN/HI/KN artifact status, publication state, citizen page test and blockers. Include job count, live HTTP results, source checks, AI provider calls, Mongo old-v-new preservation hashes, ImageKit proof only if authorized, screenshots of full flows and a defensible rollback test.
