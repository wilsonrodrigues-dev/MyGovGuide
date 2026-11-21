# MyGovGuide — Complete project status report

Latest Milestones 3/4: [working notice and eligibility tools, actual data preservation, 265 tests and remaining content blockers](history/MILESTONES_3_4_COMPLETION_REPORT.md). Both implementations are delivered; real approved eligibility sets and public notices remain zero. The 24 published schemes and72 indexes are unchanged.

Latest admin workflow: [no evidence typing,103 additional observations handled and nine owner-confirmed schemes published](history/SIMPLE_ADMIN_APPROVAL_REPORT.md). The catalog now has24 publications /72 language indexes; all original15 publications and source history remain preserved.


Earlier Forms/admin/AI checkpoint: [original PDF viewer, three-entry admin, guarded Gemini/Groq fallback, real-document screenshots and exact acceptance blockers](history/FORMS_AI_ADMIN_COMPLETION_REPORT.md). Atlas content and pending owner decisions remain unchanged.

Earlier review-automation checkpoint: [104 administrative observations handled,212 active records in118 packets](history/EVIDENCE_REVIEW_AUTOMATION_REPORT.md). All341 original review rows and25 human decisions remain unchanged; no permission, fact or publication approval was automated.

Latest Forms implementation: [working catalog/upload/admin routes, actual PDF checks and pending-content limits](history/FORMS_MILESTONE_REPORT.md). All four form preparation packets remain pending under the latest owner decision.

Earlier acquisition/SRS checkpoint: [requirements mapping, official-source findings and actual worker results](history/SRS_ALIGNMENT_AND_SOURCE_ACQUISITION.md). The latest two authorized NDMA checks added41 notice candidates; scheme/publication/AI decisions remain unchanged.

**As of 20 November 2026, Asia/Calcutta.** This is the consolidated implementation report, not a new master plan or development phase. [PRODUCT_MASTER_PLAN.md](../PRODUCT_MASTER_PLAN.md) remains authoritative.

Status is based on inspected application code and the latest saved Atlas preservation, browser and test receipts. The earlier status-report-only pass made no runtime changes. The subsequent Forms task fetched five public blank PDFs, added five unapproved document/source versions and ran temporary isolated checks; no Gemini request or editorial publication occurred. All local project servers, the worker and local MongoDB remain intentionally stopped at the owner’s request. Atlas content remains stored in the existing cloud database.

## 1. Overall result

MyGovGuide now has a working source-to-citizen scheme-information flow: evidence and review → Gemini preparation → multilingual validation → genuine editorial publication → searchable React pages. The backend, Atlas storage, collection framework, scheduler, admin dashboard and first citizen UI milestone are implemented and tested. The full citizen product and public production deployment are not complete.

The catalog has **35 records: 25 original researched schemes plus 10 additional official-source research candidates**. Of those, **25 have validated selected EN/HI/KN revisions and24 are published**. The remaining11 schemes stay internal: nine require fact/rights/currentness review and two need refreshed operative evidence. Published summaries retain their limited review scope and factual caveats; publication does not establish complete eligibility or guaranteed benefits.

## 2. Current database and catalog

Application data is stored in MongoDB Atlas database **`mygovguide_dev`**, selected through the ignored private **`backend/.env`**. The frontend reads it through the backend APIs; it has no direct MongoDB connection or database credentials. Browser localStorage holds non-sensitive preferences and the optional voice setting, not the scheme database or authentication tokens.

| Stored data / state | Last verified count | Meaning |
|---|---:|---|
| Scheme/candidate records | 35 | 25 original research records +10 additional official-source candidates |
| Limited human fact-reviewed scheme packets | 25 | Approved preparation scope with explicit gaps; not complete eligibility |
| Schemes with selected validated EN/HI/KN revisions | 25 | 75 current language revisions across published and unpublished schemes |
| Published schemes |24| Genuine editorial decisions; visible through public content gates |
| Published language search documents |72| Three approved language indexes per published scheme |
| Prepared but unpublished schemes / current revisions |1 /3| Remain internal and review-pending |
| Additional research candidates without Gemini preparation | 10 | Need actual fact/rights/currentness review first |
| Consolidated pending records |11|0 editorial-ready +9 fact-review-required +2 current-evidence-blocked |
| Total stored AI artifacts | 117 | Originals, revisions and unsuccessful/superseded outputs; not 117 publishable summaries |
| Source identities | 148 | Registry references; not 148 approved live scrapers |
| Immutable source versions | 268 | Preserved evidence/revision history across record types |
| Stored scheme-fact records | 404 | Extracted/versioned facts; not 404 independently approved eligibility claims |
| Notices | 157 | 141 genuine NDMA snapshots +12 research notices +4 fixtures |
| Form/application references | 18 | Working catalog;5 checked PDF versions,4 digital documents,55 selected unreviewed labels;0 reviewed complete templates or real form AI artifacts |
| Scam-awareness topics | 12 | Undated awareness material, not 12 verified current scam incidents |
| Approved complete eligibility rule sets | 0 | No personal eligibility verdict can be issued |
| Active source execution configurations | 1 | Existing NDMA notice-feed configuration; not a new scheme source |
| Configured collection schedules | 0 | Scheduling framework is built; no automatic schedule is activated |

These counts include the actual owner-confirmed Atlas publication and subsequent read-only API/browser verification. Before publication all19 protected hashes matched; afterwards15 unaffected collections and existing publications/artifact outputs remained preserved, with only the approved publication changes applied.

Useful Atlas collections: `schemes`, `sourceversions`, `schemefacts`, `sources`, `aiartifacts`, `aijobs`, `contentapprovals`, `schemesearchdocuments`, `contentpublications`, `reviewitems`, `schemeidentities`, `identityreviewcandidates` and `collectionobservations`. Inspect them using the owner’s existing private Atlas/Compass connection; credentials are not reproduced here.

## 3. Completed citizen interface

| Feature | Completed implementation |
|---|---|
| First visit | Checks valid browser preferences and the owning anonymous server profile; new visitors enter onboarding, returning profiles go Home. |
| Onboarding | Visible English/हिन्दी/ಕನ್ನಡ choices, user-activated Hear choices, manual default, optional voice guidance, editable state/category and visible choice summary. No Aadhaar, name, phone, bank or GPS prerequisite. |
| Preference restore | Cookie-owned server synchronization, non-sensitive local cache, offline retry, profile editing and language persistence without silently replacing newer unsynced choices. |
| Home | Required order: navbar → educational banner → published recommendations → typed search/optional voice → six feature links → optional-account information → footer. |
| Banner | One clearly branded MyGovGuide educational panel with licensed documentary photography, source/credit/date, linked destination, indicator, keyboard handling and pause announcement. Single-panel previous/next arrows are disabled; no fake government poster or autoplay. |
| Recommendations | Current published schemes matching state/category where possible; explicit “may be relevant, not an eligibility decision” label and real loading/error/empty states. |
| Scheme discovery | Actual `/api/content/search`, text search, state/category filters, pagination, Explore all and Recommended controls. Research, stale and synthetic content is excluded by public backend gates. |
| Scheme details | Reviewed explanation first; benefits, limited audience/eligibility information, known/unknown documents, application guidance, official links, limitations, expandable original evidence and source/review dates. |
| Languages | Citizen UI and stored approved explanations in EN/HI/KN; explicit English fallback where a translation is unavailable. Browsing does not call Gemini. |
| Navigation | Responsive menu, six service entries, settings, language changes, account-information entry, privacy/help/source-policy links and keyboard skip link. |
| Design | Civic Editorial ink/cobalt/warm-paper/lavender styling scoped to citizens, locally served Manrope and Noto script fonts, credited licensed photograph, responsive layouts and reduced-motion support. Admin retains its existing theme. |

Working citizen routes include `/onboarding`, `/home`, `/schemes`, `/schemes/:id`, `/forms`, `/forms/:id`, `/settings`, `/how-it-works`, `/privacy` and `/help`. Forms now has a working library, temporary extraction and existing-admin review; real multilingual preparation remains pending by owner decision. Notice-to-Action now works at `/notices`; `/eligibility` and `/eligibility/:schemeId` implement deterministic questions/results with genuine rule gates and an explicitly fictional practice example. Scanned notices can retain their original preview while users supply a labeled transcription. Scam alerts, centers, accounts, bookmarks and notifications retain honest limited-state entries where full services are not built. A clickable entry is not counted as completion of that service.

## 4. Voice implementation and its limits

The shared citizen assistant is implemented with browser speech services, deterministic commands, current page/result context and a typed-command alternative. It is separate from admin and never starts microphone capture or narration on page load.

Implemented actions: `change_language`, `set_onboarding_field`, `navigate`, `search`, `open_scheme`, `read_section`, `stop_readback` and `disable_voice`. The widget shows microphone/readback state and the last transcript, provides stop/off controls, asks for confirmation, opens only IDs in the current results and rejects changed/ambiguous context. Voice/manual onboarding uses the same editable fields. Transcripts are not saved to MongoDB or localStorage.

**Tested:** injected browser SpeechRecognition events and speech-synthesis doubles on desktop/mobile Edge automation; language selection → state/category confirmation → manual switch → search → result confirmation → detail → benefit reading → stop. EN/HI/KN command parsing and script rendering passed. **Not certified:** physical microphone/accent accuracy, real phone recognition, native-speaker translation/readback quality, installed Hindi/Kannada voices or continuous wake-word listening. Unsupported/missing voices show explicit text/manual fallback.

## 5. Completed backend, database and AI pipeline

- Existing JavaScript MERN architecture retained: React/Vite, Express/Node, Mongoose/MongoDB and shared validation; no rebuild or database reset.
- Research import, API contracts, normalized records, original evidence, immutable source versions, fact records, changes and review records retained.
- Authorized content/review data was copied to Atlas with counts/hashes verified and local data preserved. Earlier environment/DNS issues were corrected without disabling TLS or source restrictions.
- Gemini is the sole implemented provider; active Mistral code/dependencies/configuration were removed. Primary/secondary credentials remain private. Keys are not treated as permission to bypass project quotas.
- Real Gemini EN/HI/KN preparation succeeded in earlier authorized free-only runs. Every artifact retains provider/model/source-version/prompt provenance; successful catalog generation includes `gemini-3.1-flash-lite`, with earlier outputs carrying their own recorded model. This report performs no fresh model/pricing/availability check.
- Durable version-bound AI jobs, leases, retry/backoff/defer states, quota/cost controls and stale-result fencing are implemented. Browsing/search never generates per keystroke.
- Structured output checks preserve approved facts, amounts, dates, documents, links and citations. Invalid output is retained but excluded from publishable selections. Corrections create revisions rather than overwriting originals.
- Source/fact approval, AI preparation, language editorial approval, publication and deterministic eligibility-rule approval remain separate. No generated output automatically becomes public.

The existing working flow is:

```text
Approved source access / reviewed official-document research
  → original evidence + immutable source version
  → normalization + canonical identity / duplicate check
  → genuine fact / rights / currentness review
  → Gemini EN/HI/KN preparation + structured validation
  → MongoDB review-pending artifacts
  → explicit human editorial publication
  → approved search indexes + citizen Home/search/details
```

## 6. Completed collection, deduplication and scheduling

| Capability | Implemented behavior |
|---|---|
| Adapters | Existing API/RSS/HTML/PDF framework, source-specific parsers and explicit fixture/test separation. |
| Source controls | Default-deny permission/rights/path/method/expiry checks, bounded retries/rate budgets, DNS/SSRF/redirect controls and matching database authorization. myScheme restrictions remain enforced. |
| Canonical scheme identity | Existing IDs retained; normalized official URLs, source-local keys, documented official-ID namespaces and explicit human cross-source mappings. Similar names/shared portals/conflicting IDs require review. |
| Four outcomes | `NEW`, `UNCHANGED`, `UPDATED`, `NEEDS_IDENTITY_REVIEW`, recorded with durable run/source evidence. |
| Unchanged results | Refresh check metadata; no duplicate scheme/version or repeated Gemini work; existing valid artifacts/publications remain intact. |
| Material updates | Preserve old evidence, store the new version, record exact before/after fact changes, invalidate stale derivatives and queue renewed fact review. No automatic approval/publication. |
| Incremental transport | Existing ETag/Last-Modified plus reviewed cursor/offset/updated-since contracts; loop/page/record bounds and atomic all-page validation/checkpoint commit. |
| History | Immutable per-record observations, canonical metadata and an existing-admin table showing source, scheme, checks, changes, status and history. Legacy research is labeled `NO_COLLECTED_OBSERVATION`. |
| Workers/jobs | Durable manual jobs, unique active-source jobs, leases, cancellation, recovery, stale-worker fencing and idempotent retry after interruption. |
| Scheduler | Existing persistent timezone/cron schedules, ON/OFF, next/last run and history. The worker must be running; no hosted/free-tier always-on guarantee. No schedule is currently configured. |

**Actual live collection accomplished:** the latest existing-approved NDMA worker fetch returned HTTP200 with100 parsed notices (41 new,59 unchanged), followed by HTTP304 with zero parsed/new records. Earlier snapshots remain preserved;141 distinct NDMA notices are now stored. These are stored historical notice snapshots, not scheme rules or a citizen current-alert feed.

**Not accomplished:** activating a documented authorized live scheme-description API/feed. PIB/OGD/Income Tax and other investigations retain their endpoint, robots/rights, credential or HTTP-access blockers. Public visibility does not authorize scraping. Manual official-document research and injected/fixture integration tests are not labeled live scheme collection. Existing NDMA approval must be rechecked for expiry before future collection.

## 7. Completed administrator workspace and authentication

The existing `/admin` includes overview/metrics, Sources and permission evidence, manual collection/jobs, scheduler, Data Explorer, raw/current versions, changes, review queues, AI preparation/status, language previews, edit/reject/approve, publication/withdrawal history and operational status/audit. The Collection page also contains canonical scheme history and identity review. `/admin/publish` consolidates the remaining11 pending schemes with benefits, original evidence, documents, language revisions, uncertainties and readiness.

Admin login compares the private environment username/password directly and uses in-memory cookie sessions; it does not authenticate against a database admin-user collection. Admin and citizen APIs no longer use a separate CSRF token as requested. Cookie ownership, session expiry, origin checks, credential privacy and admin/source/publication boundaries remain. The anonymous citizen profile is not a registered account.

## 8. The24 published schemes

The following are the existing catalog entries with genuine publication decisions and EN/HI/KN versions. Names below reflect the stored catalog, not a fresh official-source recertification. Eligibility rules remain unapproved for every entry.

| Catalog ID | Published scheme / entry |
|---|---|
| IN-FA-01 | Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) |
| IN-FA-02 | Pradhan Mantri Fasal Bima Yojana (PMFBY) |
| IN-FA-03 | Kisan Credit Card (KCC) |
| IN-FA-04 | Soil Health Card Programme |
| IN-FA-05 | National Agriculture Market (e-NAM) Farmer Registration |
| IN-SR-01 | Pradhan Mantri Vridhavastha Pension Yojana |
| IN-SR-02 | Senior Citizens Savings Scheme (SCSS) |
| IN-SR-03 | Rashtriya Vayoshri Yojana (RVY) |
| IN-ST-01 | PM-USP Central Sector Scholarship for College and University Students |
| IN-ST-02 | National Means-cum-Merit Scholarship Scheme (NMMSS) |
| IN-ST-03 | AICTE Pragati Scholarship for Girl Students (Technical Degree) |
| IN-ST-04 | AICTE Saksham Scholarship (Technical Degree) |
| IN-WK-02 | Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) |
| IN-WK-03 | Pradhan Mantri Suraksha Bima Yojana (PMSBY) |
| IN-WO-02 | Pradhan Mantri Ujjwala Yojana (PMUY / Ujjwala 2.0) |
| KA-GN-02 | Anna Bhagya |
| KA-WO-01 | Gruha Lakshmi |
| IN-WO-04 | Janani Suraksha Yojana (JSY) |
| IN-ST-05 | PM YASASVI Top Class Education in College (OBC/EBC/DNT) |
| IN-WO-01 | Pradhan Mantri Matru Vandana Yojana (PMMVY) |
| IN-WK-01 | Pradhan Mantri Shram Yogi Maandhan (PM-SYM) |
| KA-WO-02 | Shakti Scheme (Karnataka) |
| IN-WO-03 | Sukanya Samriddhi Account (SSA) |
| KA-ST-01 | Yuva Nidhi |

## 9. Pending editorial and factual work

The owner explicitly approved the nine exact schemes /27 revisions in the retained review packet. They were published transactionally; Ready is0. The previous blanket Keep Pending decision remains effective only for the unapproved remainder. [Approval and preservation receipt](../backend/reports/owner-confirmed-publication.json).

**Fact/rights/currentness review required:9 candidates.** They have official research evidence but no invented fact approval or Gemini preparation:

- Atal Pension Yojana (APY).
- Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY).
- PM Vishwakarma.
- Pradhan Mantri Awaas Yojana-Gramin (PMAY-G).
- Pradhan Mantri Awas Yojana-Urban 2.0 (PMAY-U 2.0).
- Pradhan Mantri Jan-Dhan Yojana (PMJDY).
- Pradhan Mantri Kisan Maandhan Yojana (PM-KMY).
- Pradhan Mantri MUDRA Yojana (PMMY).
- Prime Minister Street Vendor AtmaNirbhar Nidhi (PM SVANidhi).

**Current evidence blockers:2.** Gruha Jyothi has historical-only evidence and remains publication-blocked despite internal prepared translations. PMEGP’s retrieved guidelines run through 2025-26; current continuation/amendment evidence is missing. They must not be published as current complete claims.

A limited reviewed summary is not a complete rule set. Missing operative conditions, exclusions, documents, current application windows or inconsistent benefit terms must remain explicit and require evidence-led review.

## 10. Not yet complete

| Product area | Remaining implementation / acceptance |
|---|---|
| Eligibility content acceptance | Deterministic engine, citizen question/results flow, privacy, EN/HI/KN, voice and grouped admin review are implemented/tested. All35 real rule sets lack complete current approved operative evidence; approved-rule count remains0. Practice is explicitly synthetic. |
| Forms content acceptance | Library/detail/upload/extraction/identity and review implementation is built. Four digital documents have55 selected unreviewed labels; one scanned form needs OCR. Full evidence/rights/currentness review and actual reviewed EN/HI/KN guidance remain pending by owner decision. |
| Notice content acceptance | Guest upload/paste, original viewer, extraction/transcription, grounded checklist and consented private trilingual AI are implemented/tested. Verified OCR and approved public notice content remain unavailable. NDMA snapshots are not current alerts. |
| Scam alerts | Source-reviewed dated public advisories separated from undated awareness lessons, reporting guidance and publication-ready language content. |
| Centers/maps | Authorized verified directory, addresses/services/hours/coordinates, manual location search, accessible list/map and optional geolocation. No invented centers. |
| Citizen accounts | Optional registration/login/recovery, bookmarks, follows, consented personal updates and notification storage/delivery. Anonymous preferences are already implemented separately. |
| Government banner management | Reviewed poster/banner inventory, rights/currentness/expiry controls and admin publishing. The current branded educational panel is complete; a government-poster CMS is not. |
| Additional scheme collection | An actually authorized description endpoint, source-specific production verification and genuine network counts; existing framework tests do not resolve source permissions. |
| Voice acceptance | Real microphone/device/accent and Hindi/Kannada TTS tests; human/native-reader QA. No full automation for unimplemented features or always-listening wake word. |
| Production release | Public deployment, hosted worker/scheduler, current dependency/security review, production configuration/monitoring, performance and screen-reader/device/user acceptance. |

No overall completion percentage is assigned: a tested milestone and stored research are not equivalent to completing every required citizen service.

## 11. Latest verification and preservation

Passed121 backend and14 frontend unit tests,48 isolated MongoDB checks,32 regression +4 existing editorial +16 Forms +2 new approval browser journeys (237 checks), final focused checks and production build. After explicit owner confirmation, all24 real citizen pages and72 language HTTP responses passed. Eighteen form references remain browsable. [Full verification and screenshots](history/SIMPLE_ADMIN_APPROVAL_REPORT.md).

The original15 publications and45 indexes, all117 artifact outputs,26 unselected scheme documents and15 unaffected collection hashes were preserved. Nine editorial decisions/publications and27 indexes were deliberately added. Source permissions, facts, source versions and eligibility rules were not changed. Private credentials remain excluded from Git and built bundles. Tests do not certify new government scraping, native speech quality or complete personal eligibility.

## 12. Documentation, cleanup, recovery and current runtime

- The root retains the authoritative master plan, README and PROGRESS. Guides, historical reports and old plans/prompts are organized under their existing documentation folders.
- The audited cleanup removed 46 redundant project files plus regenerable output/cache, repaired references and retained unique reports/research. Two sensitive source captures were retained privately with only embedded credential-like strings redacted from public copies. Later tests naturally regenerated build/test output.
- Git recovery checkpoints preserve earlier public work and the pre-citizen milestone snapshot without altering the main repository’s HEAD/index. Private environments/local databases/backups are excluded. See the cleanup manifest and citizen milestone report for exact receipts.
- **Runtime:** regular frontend, backend API and persistent worker remain stopped as requested; temporary isolated test processes/local MongoDB used for the acquisition verification are stopped after completion. Project ports 3001/3011/4173/5173/27018 were verified not listening. No background collection or AI work runs from these stopped local services. The Atlas cloud database was not deleted or shut down.
- This report records the implemented admin workflow and explicit nine-scheme publication; source permissions and private configuration remain unchanged.

## 13. Supporting reports and screenshots

- [Citizen UI completion, all 18 screenshots and voice limitations](history/CITIZEN_UI_MILESTONE_REPORT.md).
- [Incremental identity/collection audit: existed versus added](history/INCREMENTAL_SCHEME_COLLECTION_REPORT.md).
- [Consolidated editorial review](CONSOLIDATED_EDITORIAL_REVIEW.md) and [catalog/review preparation evidence](history/CONSOLIDATED_REVIEW_AND_CATALOG_PREPARATION.md).
- [Catalog generation/publication execution](history/SCHEME_CATALOG_EXPANSION_REPORT.md), [Batch 1 publication](history/BATCH_ONE_PUBLICATION_REPORT.md), [Batch 2 publication](history/BATCH_TWO_PUBLICATION_REPORT.md).
- [Actual government-source collection results](history/REAL_DATA_COLLECTION_REPORT.md) and [permitted-source findings](guides/SCHEME_CATALOG_SOURCE_FINDINGS.md).
- [Atlas configuration/migration and AI diagnosis](history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md).
- [Repository cleanup and recovery manifest](CLEANUP_MANIFEST.md), [asset licenses](../frontend/ASSET_LICENSES.md) and [documentation index](README.md).
- [Previous whole-project report, retained as historical evidence](history/PROJECT_STATUS_REPORT_BEFORE_2026_11_19.md).
