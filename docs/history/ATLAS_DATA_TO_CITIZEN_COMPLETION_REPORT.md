# Atlas data lineage and first citizen publication — 18 November 2026

The owner authorized the attached data-flow/citizen/API tasks and explicitly replied **“Approve all three revisions and publication”** for the concrete PM-KISAN editorial packet. This records the completed work in the existing application; it creates no new dashboard or implementation phase. [Master plan](../../PRODUCT_MASTER_PLAN.md) remains authoritative, with the owner's latest instruction authorizing the scheme discovery/detail slice.

## Actual outcome

- **One genuine scheme published:** PM-KISAN, `IN-FA-01`, in English, Hindi and Kannada. Three current approved search documents and one publication record exist in Atlas.
- **No new Gemini requests.** All 15 original artifacts validated/current for their reviewed snapshots; three editor draft revisions were created without a model call, then explicitly owner-approved and published. Originals remain intact. Atlas now has 18 artifacts: three approved published revisions and 15 review-pending originals/other scheme artifacts. Three pending originals are superseded drafts; the other 12 belong to four unpublished schemes.
- **Existing citizen pages now work:** `/schemes` uses `GET /api/content/search`; `/schemes/:id` uses `GET /api/content/schemes/:id`. Guest browsing works without onboarding/login; all existing onboarding/preferences/admin behavior remains.
- **NDMA separately reactivated in Atlas** after policy/expiry checks. Genuine worker HTTP200 parsed 100 and retained **100 unchanged**, followed by HTTP304 with no body/parse/write. Zero new notices or source versions; no public current warning claimed.
- No eligibility rule approval, paid request, auto-approval or synthetic public publication occurred.

## 1. Per-record lineage and database inventory

[JSON lineage](../../backend/reports/atlas-data-lineage.json) contains **949 individual content/evidence/review/derived rows**, including official URLs, source/version identities, origin, processor/evidence, timestamps when recorded, fact-review state, AI languages, publication state and visibility reasons. [CSV lineage](../../backend/reports/atlas-data-lineage.csv) provides a flat view. Operational records are inventoried separately; private sessions/accounts and credentials are not exported.

This audit reads Atlas `mygovguide_dev`. A source/version's original fetch time is not replaced by its migration time or a later unchanged fetch. Missing legacy timestamps/processor metadata remain explicitly null/unknown; reconstructed provenance is not fabricated. The old native database and earlier collection reports remain preserved; old ingestion job history was not bulk-copied to Atlas.

| Relevant collection | Current Atlas count |
| --- | ---: |
| Source | 119 |
| SourceVersion | 192 |
| Scheme | 25 |
| SchemeFact | 164 |
| Notice | 116 |
| ContentApproval | 5 |
| AIJob | 15 |
| AIArtifact | 18 |
| SchemeSearchDocument | 3 |
| ContentPublication | 1 |
| ReviewItem | 210 |
| EligibilityRuleSet | 25 |
| AdapterConfig | 1 |
| CollectionJob | 2 |
| IngestionRun | 2 |
| CollectionSchedule | 0 |

There are **205 pending content review items**, one published scheme and **zero approved eligibility rule sets**. Notice origins remain 100 LIVE / 12 historical research / four fixtures. Scheme originals are imported research; five current official-document fact packets are CURATED_PUBLIC derivatives, not live scheme scraping. Raw Scheme.simplifiedText is not the publication store: version-bound AIArtifact and SchemeSearchDocument records are used.

| Lineage grouping | Rows |
| --- | ---: |
| Source / RESEARCH_OR_METADATA | 115 |
| Source / SYNTHETIC | 4 |
| SourceVersion / RESEARCH_OR_METADATA | 87 |
| SourceVersion / LIVE | 100 |
| SourceVersion / CURATED_PUBLIC | 5 |
| Scheme / CURATED_PUBLIC | 5 |
| Scheme / RESEARCH_OR_METADATA | 20 |
| SchemeFact / RESEARCH_OR_METADATA | 134 |
| SchemeFact / CURATED_PUBLIC | 30 |
| EligibilityRuleSet / RESEARCH_OR_METADATA | 25 |
| FormTemplate / RESEARCH_OR_METADATA | 18 |
| Notice / RESEARCH_OR_METADATA | 15 |
| Notice / SYNTHETIC | 1 |
| Notice / LIVE | 100 |
| ScamAlert / RESEARCH_OR_METADATA | 12 |
| ChangeEvent / RESEARCH_OR_METADATA | 21 |
| ReviewItem / RESEARCH_OR_METADATA | 105 |
| ReviewItem / LIVE | 100 |
| ReviewItem / CURATED_PUBLIC | 5 |
| ReviewEvent / CURATED_PUBLIC | 5 |
| ContentApproval / CURATED_PUBLIC | 5 |
| AIJob / CURATED_PUBLIC | 15 |
| AIArtifact / CURATED_PUBLIC | 18 |
| SchemeSearchDocument / CURATED_PUBLIC | 3 |
| ContentPublication / CURATED_PUBLIC | 1 |

Metadata rows are not additional schemes or live government fetches. Sources are registry/evidence identities; review and publication rows describe actions on those identities. The JSON audit keeps counts and traceability separate.

## 2. Actual editorial decision and AI storage

[Concrete editorial review packet](../FIRST_PUBLICATION_EDITORIAL_REVIEW.md) shows the official PIB evidence alongside EN/HI/KN text, benefits, audiences, limitations and keywords. It flagged an unsupported English “central sector” addition, missing prominent source-date/later-amendment caveats in English/Hindi, and awkward operative-eligibility wording. Three EDIT revisions corrected these issues while preserving amounts, citations, approved facts and document unknowns. All passed the existing structured/factual validator.

The owner approved the identified three revisions **and publication**. The existing authenticated admin review APIs recorded that real decision; the publication API transaction created three indexes and one publication record. No fact approval was fabricated, no missing operative rule approved and no government approval guaranteed. [Approval/publication/search receipt](../../backend/reports/first-real-publication.json).

All 18 artifacts passed validation in the final audit; all source hashes match their approval snapshots. Source-fact approval expires 25 November 2026. PM-KISAN's official evidence release is dated **11 March 2026**. Verification date and source publication date are shown separately; the former does not certify all later amendments. English/Hindi/Kannada keywords, aliases, optional romanized terms and exact evidence references are stored. Original evidence, model/prompt metadata, jobs and earlier revisions were preserved.

Existing admin now offers a readable stored-artifact preview beside the original excerpt and JSON editor, including benefits, audiences, missing-document/currentness limits and search terms. Saving JSON changes still creates an unapproved revision; no automatic approval was introduced.

## 3. Citizen display, search and exclusion gates

Scheme discovery has typed search, state/category filters, an all-published view and an optional interests filter. Results link to actual details; existing Home previews also link to the detail page. Civic Blue tokens/fonts/layout are reused. Search runs on explicit submit/filter selection and retrieves stored indexes; browsing never calls Gemini.

Details show selected-language title/summary, benefits, audience information, explicit unapproved-eligibility warning, verified documents or a clear **unknown checklist** message, application guidance/official link, original source/excerpt and verification/source-publication dates. External links disclose the government handoff. No inferred “eligible” verdict appears.

Missing reviewed translations fall back transparently to reviewed English in search and detail. Search deduplicates a scheme and prefers a matching reviewed localized result. The regression suite found Home's older controller overwrote the per-item fallback flag; this was corrected and tested. Research-only, synthetic, withdrawn, expired, stale, invalid and version-mismatched content remain excluded by backend publication gates. A missing/unreviewed detail returns an honest unavailable state, never internal research.

Actual Atlas API searches succeeded for `PM-KISAN`, `किसान`, `ರೈತರು`, `Pradhan Mantri Kisan` and romanized `PM-Kisan`. All three actual detail endpoints returned HTTP200 with eligibilityAvailable false. **Real browser proof** used the running frontend/API/Atlas with no mocked responses: EN/HI/KN query → one result → localized detail, correct official link, zero page errors and no 390px overflow. [Browser receipt](../../backend/reports/real-citizen-publication-browser.json); screenshots: [English](../../frontend/reports/real-published-pmkisan-en.png), [Hindi](../../frontend/reports/real-published-pmkisan-hi.png), [Kannada](../../frontend/reports/real-published-pmkisan-kn.png).

## 4. Live execution after migration

Atlas initially had source records but zero AdapterConfig, CollectionJob, IngestionRun or schedules. Those are separate from source data. Current NDMA robots returned404 and official feed/policy pages200; recorded explicit RSS/redistribution scope and original 25 November expiry were retained. Source Manager save → validate → activate restored one executable configuration. Tax/PIB/OGD/myScheme were not activated; no schedules were created.

| Atlas NDMA worker run | HTTP | Bytes | Parsed | New / updated / unchanged |
| --- | ---: | ---: | ---: | --- |
| First after reactivation | 200 | 62234 | 100 | 0 / 0 / 100 |
| Conditional second run | 304 | 0 | 0 | 0 / 0 / 0; existing100 retained |

HTTP status and response byte metadata are now persisted safely in each successful live IngestionRun source result. No request headers, credentials or source response bodies are added to operational logs. [Actual Atlas collection receipt](../../backend/reports/atlas-ndma-collection.json). NDMA items remain internal short-lived alert snapshots dated 16 November, not current warnings or scheme records; CAP document traversal remains outside approved scope.

## 5. Official dataset API findings

[Detailed primary-source API investigation](../guides/OFFICIAL_DATASET_API_FINDINGS.md) records exact verified catalog/directory identities, available fields, dates, credential setup, permission and unresolved endpoint/UUID/rate/pagination details. PM-KISAN/PMAY-G OGD data found are beneficiary/housing statistics, not complete scheme rules; CGHS/Karnataka current resource views are incomplete. NSP's documented API inserts personal beneficiary XML, not a public scheme read API. API Setu services require provider integration/subscription, with credentials and permissions not established.

**Zero new dataset adapters/collections were activated.** No investigated new dataset had the complete verified endpoint, access/reuse contract and required credentials. No public/demo key or guessed endpoint was used. The only working newly verified live execution here is the existing authorized NDMA feed. No API account was created or provider contacted.

## 6. Verification, errors and limits

| Check | Final result | Evidence |
| --- | --- | --- |
| Backend unit/component | 85 passed | [Output](../../backend/reports/citizen-flow-unit-tests.txt) |
| Frontend contracts including new trilingual scheme labels | Five passed | Same unit output |
| Isolated native MongoDB integration | 31 nodes passed, zero failures/skips | [Output](../../backend/reports/citizen-flow-integration-tests.txt) |
| Desktop/mobile browser suite | 20 regular/new scheme journeys + two existing synthetic editor journeys passed | [Output](../../frontend/reports/citizen-flow-browser-tests.txt) |
| Production bundle | Passed | [Output](../../frontend/reports/citizen-flow-build.txt) |
| Actual Atlas publication, queries, browser and NDMA worker | Passed, separately evidenced above | Real receipts, not fixtures |

Initial restricted/parallel test connections timed out; explicit local test URI and network access resolved setup. An inherited private test target hit a database-name limit; no application data was deleted, and the final browser suite explicitly used isolated native test databases. The fallback regression was fixed without weakening assertions or increasing timeouts. An initial diagnostic used the unwrapped collection-job response shape; the actual successful run was retained, polling corrected and a second genuine run completed. The first browser proof tried an unavailable bundled Chromium; it used the already installed Edge channel matching the test harness instead. Earlier error outputs remain retained.

Remaining limits: only one scheme has actual editorial publication approval; four prepared schemes and 20 other research schemes remain unpublished. Fifteen artifacts retain REVIEW_PENDING, including three superseded originals. All 25 eligibility rule sets remain incomplete/unapproved. Full cross-site voice, forms/notices uploads, maps/centers, citizen accounts and other unrelated features were not started. Native-speaker/physical-device acceptance, credential rotation confirmation, existing dependency advisory and production hosting remain outstanding. Dataset API access/credentials and exact resource contracts remain external blockers. NDMA source authorization and fact snapshots require renewal before their recorded expiry.

Open **http://127.0.0.1:5173/schemes/IN-FA-01** for the real published record, **/schemes** for discovery, and the existing **/admin** for lineage/evidence/review/source operations. Backend and worker continue using private Atlas configuration; no URI/key is included in this report.
