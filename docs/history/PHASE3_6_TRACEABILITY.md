# Phase 3.6 implementation inventory and traceability

Authority: Product Master Plan v2.3, section 17, and CODEX_PHASE3_6_PROMPT.md. Repository inspected before changes: existing backend/frontend, all persistence models, admin routes/UI, source adapters and transport, review/ingestion services, native worker/scheduler, tests and historical reports. Baseline source/research/test hashes are in `docs/history/test-artifacts-before-cleanup/backend/phase36-baseline.json`. The original 72 backend and 4 frontend checks passed before implementation.

| Requirement | Existing foundation retained | Phase 3.6 implementation / proof |
| --- | --- | --- |
| JavaScript MERN, two folders, native MongoDB | Workspace/scripts, Express, React/Vite, Mongoose | Additive files only; no Docker, alternate framework, new admin app or replacement scheduler |
| Civic Blue, no green/orange branding | Existing pages, Noto fonts, routing, keyboard/locale controls | Shared variables in `frontend/src/styles.css`; tokenized admin CSS; current token contrast tests; 320/360/390/1280px browser checks |
| Source permissions | `access.js`, SafeHttp, registered approvals, source manager | Existing gates retained; exact-endpoint conditional HTTP metadata; no source approvals manufactured; policy report documents blocks |
| Original source evidence | Immutable `SourceVersion`, semantic hashes, ingestion runs | Collection provenance includes fixture/live mode, source/run, capture time, raw-record hash and HTTP validators; no AI text replaces original |
| Source-specific parsing | API/RSS/HTML/PDF adapters, candidate PIB parser | Scheme aliases/original text/application/document fields retained; PIB releases force Notice classification; synthetic parser tests, no invented scheme eligibility |
| Fact review and rights | Existing review service, admin identity/audit | `ContentApproval` snapshots exact source/hash, canonical facts, excerpt/clauses, rights, reviewer and validity; separate from access/rule approval |
| Durable AI processing | Existing dedicated worker/DB transaction pattern | `AIJob`, leased global slots, idempotent version/language/prompt/model key, bounded retries/recovery, budget reservations, current-source commit fence |
| Gemini official SDK | None previously | `@google/genai` 3.4.0; private model metadata check; model selected in env; no generation entitlement inferred from a key |
| Two keys and independent fallback | None previously | Project-wide Gemini cooldown; no 429 rotation, 401 replacement only if expressly authorized, 403 stops; Mistral requires independent opt-in/entitlement/spend/privacy gates |
| Factual and trilingual outputs | Static citizen UI translations | Zod output schema; exact facts/documents/links/citations, numeric/date checks and target script checks; EN/HI/KN mock-provider vertical slice |
| Editorial artifacts and publishing | Research rejection/further-review UI | Existing admin extended with AI processing and Review & publish; new draft revisions, approval/rejection evidence, publication/withdrawal audit, current-source rollback candidates |
| Multilingual search | Old title-only preview regex | Indexed Unicode tokens, prefixes, reviewed aliases/romanization, deterministic ranking and state/category filters; no request-time AI or public collection regex scan |
| Public read boundaries | Anonymous profile/session ownership | `/api/content/search`, `/api/content/schemes/:id`; Home previews use reviewed publication/index gates; explicit English fallback; synthetic/stale/research-only data hidden |
| Changes and failure | Existing source versions/changes/review queue | Derivatives stale and search withdrawn on source change; raw/approved history retained; in-flight obsolete generation cannot commit; unrelated AI failure keeps approved publication |
| Operations and metrics | Actual collection counters/history, schedules and heartbeat | Added origin/language/review/stale/token/cost metrics; Data Explorer derived history and Change Radar regeneration impact; redacted provider configuration/circuit states |
| Local/Atlas isolation | URI validation, explicit test prefix | Read-only Atlas attempted and blocked; explicitly inspected local DB gets additive content indexes; timestamped test DBs retained without cleanup |
| Acceptance demonstration | Four offline adapters and browser harness | Source parse → version → simulated human fact review → mock EN/HI/KN → JSON/fact validation → editor publish → private synthetic index preview; public endpoints exclude it. Separate mocked authoritative snapshot tests positive public reads |

## Existing routes preserved

Citizen onboarding, Home, Settings, How It Works, language selection, preference/session APIs and honest future-feature routes remain. No complete scheme-discovery/detail page, voice orchestration, uploaded-form/notice processing, center map, citizen account, notification or eligibility UI was started.

Existing admin overview/sources/manual collection/schedules/history/data/changes/reviews/system remain. New routes are `/admin/ai` and `/admin/publish` within that same app. All `/api/admin/content/*` routes are mounted **after** the existing administrator session/Origin/CSRF middleware and share rate limits/audit. Public reads are bounded and publication-filtered; they do not grant administrator actions.

## Persistence additions

`backend/src/models/content.js`: ContentApproval, AIJob, AIArtifact, SchemeSearchDocument, ContentPublication, AIDailyBudget, AIWorkerSlot and AIProviderState. Existing Scheme gains a content-approval reference; Source gains conditional response metadata. No collection/index dropping or data reset occurs. Publication indexes are mutable current read models; approval/source/artifact revision history remains separately retained.

## Test evolution

Original positive/negative assertions are retained. The old positive Home-preview fixture now includes a **mock authoritative publication snapshot** satisfying the new approval/artifact/index gates, while an additional assertion proves that a legacy `PUBLISHED` flag alone is insufficient. Source fixtures are not reclassified as real live data. Contrast tests now read the actual Civic Blue tokens with the same AA threshold. Existing browser journeys still run before the separate synthetic content suite in fresh databases.

## Externally blocked / unverified

- Atlas DNS/connectivity: no Atlas writes or successful Atlas integration.
- Authorized government live collection: zero approved sources/runs; PIB access evidence incomplete; checked OGD host disallows crawling and documented APIs require suitable access/keys/dataset review; myScheme remains restricted.
- Real model generation: Gemini metadata reached successfully, but no selected model or confirmed free entitlement/paid permission; zero real generation calls/tokens. Mistral unconfigured/disabled.
- Physical device, native-speaker translation review, screen-reader and production penetration testing have not been performed.
- Full dependency audit reports an unpatched picomatch development-tool-chain advisory; production dependency audit is clear. Details in the completion report.
