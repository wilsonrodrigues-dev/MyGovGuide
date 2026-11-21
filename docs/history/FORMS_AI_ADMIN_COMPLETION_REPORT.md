# Forms, simplified admin and AI reliability

19 November 2026. Existing implementation extended; no rebuild or Milestone 3 work.

**Acceptance: implementation delivered; Milestone 2 is not fully content-complete.** Four real form packets still lack the owner's fact/rights/currentness decision. No verified form-specific multilingual guidance was generated or published, and no ImageKit rehosting permission was invented.

## Implemented behavior

- `/forms` and `/forms/:id`: bundled PDF.js viewer and matching local worker; desktop original/explanation columns, mobile PDF/assistant tabs, pages, zoom, official document/application links, field selector, previous/next, explain/repeat/read/stop and existing language controls. Original labels, source passages and uncertainties remain visible. Examples are not invented. Selecting a downloaded PDF for preview makes no upload request.
- Actual canvas rendering is verified after PDF.js finishes the page. A known document must match its SHA256. A unique exact PDF widget label or reviewed coordinates bound to that SHA can highlight/jump to a field. Approximate/duplicate labels and unreviewed rectangles do not highlight. Ujjwala currently has no reliable stored coordinates, so its view makes no location claim.
- Existing consented local-server extraction remains: PDF/PNG/JPEG type checks, 5 MB limit, PDF maximum 10 pages, isolated parsing, no OCR success pretence, no private MongoDB/AI/CDN storage. Clearing results releases React references and the viewer/worker; no persistent upload copy is created. Rendering never invokes an AI provider. Browser garbage collection is not a guarantee of physical-memory erasure.
- Manual and contextual typed voice actions use the same selected field/page/guidance; manual selection/navigation and language changes stop previous narration. Existing microphone opt-in remains. Local EN/HI/KN label aids are explicitly generic, separate from published reviewed guidance.
- Admin primary navigation: **Dashboard / Content / Needs Attention**. All existing collection, scheduler, versions, review, AI and system tools remain under **Advanced / Operations**. Searchable `/api/admin/content-catalog` supports type/status/search/pagination; form publication state derives from current validated guidance. Needs Attention excludes routine/historical triage work while keeping unresolved blockers visible.
- `/admin/forms?formId=...` provides one document-level original PDF/field/evidence/uncertainty review, prefilled existing source/version/hash evidence, and consolidated exact three-language editorial review. Permission/currentness/legal judgments remain explicit, unchecked decisions. Existing version-aware approval reuse and deterministic evidence automation are preserved; nothing new was automatically approved or published.
- Optional server-only ImageKit upload supports `IMAGEKIT_API` as a recognizable private key and `IMAGEKIT_PRIVATE_KEY` alias, plus `IMAGEKIT_URL_ENDPOINT`. Uploads require confirmed free entitlement, explicit enablement and expiring source/hash-bound rehosting permission. The operation accepts a document ID, reads an inspected blank source from the private operator cache, verifies SHA and stores edition/source/hash/file ID/delivery URL. Claiming/deterministic naming and completed-version reuse prevent repeat uploads. Ambiguous or interrupted uploads require reconciliation. Citizen uploads cannot enter it.

## Provider fallback and actual configuration

The owner-authorized order is Gemini primary -> authorized Gemini secondary -> Groq. Valid source/language/version/prompt artifacts and completed chunks are reused first. Both providers use the existing structured contracts and factual/language validators; no factual failure triggers another provider. Attempts preserve model/provider, credential label, latency, failure category and available token usage. Each credential gets at most 20 seconds within a 60-second chain deadline, with bounded transient retries.

| Case | Actual automated result |
|---|---|
| Primary service failure | Authorized secondary succeeds before Groq |
| Both Gemini credentials unavailable | Groq adapter succeeds for EN/HI/KN synthetic contracts |
| Shared/unknown Gemini project 429 | Secondary skipped; Retry-After project cooldown persisted; entitled independent Groq may run |
| Explicit independent Gemini projects | Authorized secondary may use its own quota |
| Slow credentials | Retry time cannot consume the whole chain and starve later providers |
| All providers unavailable | Three failed attempts recorded; job DEFERRED; no artifact/publication |
| 400/403/nonretryable response or malformed JSON | Stop; no fallback bypass |
| Invalid preserved facts/language | Existing validator rejects; no fallback regeneration |
| Missing free entitlement or private citizen data | No model request |
| Cache/interruption | Existing valid artifacts/chunks reused; expired leases recover without repeating successful chunks |

These are injected transports/synthetic evidence, not successful live Gemini/Groq generations. The real environment remains unchanged: Gemini `gemini-3.1-flash-lite`, primary/secondary keys present, primary free entitlement confirmed, **secondary authorization false**, shared-project default. The secondary is therefore intentionally skipped in real operation until configured with confirmed project/free entitlement. Groq key under supplied `GROQ_API_KEY_PRIMART` is recognized; fallback model is `openai/gpt-oss-120b`; free entitlement is **unconfirmed**, so real Groq generation remains disabled. Correct alias `GROQ_API_KEY_PRIMARY` takes precedence if supplied. Paid approval remains false and daily budget zero. **Actual model calls in this task: zero.**

Groq documents [strict structured output compatibility](https://console.groq.com/docs/structured-outputs) and a [separate Free-plan limit table](https://console.groq.com/docs/rate-limits). Availability/schema support does not establish this account's free entitlement or Kannada quality. Live fallback quality is still unvalidated. ImageKit documents [server private-key authentication](https://imagekit.io/docs/api-keys); the configured private key is recognizable, but delivery endpoint/free confirmation/enablement are missing. **Actual ImageKit uploads: zero.** See the [updated runbook](../guides/AI_PROCESSING_RUNBOOK.md) and [safe configuration example](../../backend/.env.example).

## Real document journey and preservation

Using the existing Atlas API and previously fetched blank public PDFs, opened FORM-01, selected its local Ujjwala KYC PDF, verified its recorded SHA256, rendered both-page-capable original, selected/advanced fields and requested readback while switching EN/HI/KN on desktop/mobile. Six instrumented utterances carried en-IN/hi-IN/kn-IN and the selected local aid. This demonstrates browser command/state wiring, **not physical microphone recognition or audible/native-language quality**. Ujjwala's printed Version 5.0 remains explicitly unconfirmed as the operative current edition; selected labels do not constitute complete application instructions.

The real scanned FORM-02 PAHAL PDF rendered through the consented temporary-upload path, reported OCR unavailable and cleared its result. It is not presented as an Ujjwala application. No new government HTTP fetch or cloud-provider generation occurred. Nine real-data/document screenshots captured, with no browser page errors or external browser origins. Synthetic two-page widgets separately prove reliable highlighting; synthetic published guidance separately covers EN/HI/KN reviewed-cache serving.

All **19 protected Atlas collection hashes remained identical**: 35 schemes, 15 publications, 117 scheme AI artifacts, 45 published search indexes, 268 source versions, 341 original review records, 25 human review events, 148 sources, 157 notices, 12 scam records, 35 unapproved rule sets, 25 fact approvals, 18 form references, five form documents, zero form guidance artifacts/jobs/review events, one adapter configuration and zero schedules. The 20 pending schemes and four deferred form packets remain pending. No content, audit history or private credentials were deleted or rewritten.

## Verification and screenshots

Final checks: **120 backend +14 frontend unit tests**, **47 isolated MongoDB checks**, **32 regression +4 editorial +16 Forms desktop/mobile browser journeys**; production build passed. Provider free/spend controls were disabled for isolated integration/browser work. Tests use explicitly synthetic sources and transports; no fixture is counted as live collection. Existing editorial tests were updated to open Advanced before navigating; new Content filter labels were made explicit for accessible manual selection. The first assertions exposed those issues and were corrected before the final passing runs.

Configured Gemini/Groq/ImageKit/database/admin secret scan: zero matches in shareable source/reports; real `.env`, private caches/backups and local receipts remain Git-ignored. The PDF.js bundle produces a size advisory; viewer assets are local, with no CDN dependency.

- Real [Ujjwala desktop original](../../frontend/reports/forms-completion-real/ujjwala-original-desktop.png), [mobile original](../../frontend/reports/forms-completion-real/ujjwala-original-mobile.png), [Kannada reading aid](../../frontend/reports/forms-completion-real/ujjwala-reading-aid-mobile.png), [scanned PAHAL](../../frontend/reports/forms-completion-real/pahal-scanned-mobile.png).
- Existing admin [Dashboard](../../frontend/reports/forms-completion-real/admin-dashboard-desktop.png), [Content](../../frontend/reports/forms-completion-real/admin-content-desktop.png), [Needs Attention](../../frontend/reports/forms-completion-real/admin-attention-desktop.png), [document review](../../frontend/reports/forms-completion-real/admin-form-document-desktop.png).
- Explicitly synthetic [widget/highlight desktop](../../frontend/reports/forms-completion-synthetic/viewer-desktop.png), [mobile](../../frontend/reports/forms-completion-synthetic/viewer-mobile.png).

Final [machine-readable verification receipt](../../backend/reports/forms-ai-admin-verification.json) confirms all233 checks, protected counts, zero secret matches and closed temporary project service ports. Local test MongoDB was shut down only after checking its exact replica-set name, port and workspace data path; unrelated databases were left untouched.

## Remaining acceptance blockers

The four form packets still require genuine fact/rights/currentness review, complete operative instructions/required conditions and exact EN/HI/KN editorial decisions. No pending owner decision was bypassed. Other catalog references remain incomplete; scanned forms need a verified OCR path. Ujjwala embedding/rehosting rights and operative edition are unresolved. ImageKit needs the named missing settings, confirmed free account limits and specific rehosting permission; already hosted assets require operator removal if rights are revoked. Groq needs account-level free confirmation and a bounded approved public-content language-quality test; real secondary Gemini use needs its runtime enablement and confirmed project/free entitlement. Native speech quality requires actual listening/microphone evaluation. These prevent declaring the full verified Forms milestone complete.
