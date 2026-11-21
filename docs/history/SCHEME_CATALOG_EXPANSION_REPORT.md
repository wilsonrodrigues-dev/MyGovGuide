# Scheme catalog expansion — execution report

**Latest owner-approved publication:** Batch 2 brings the catalog to fifteen published schemes; ten remain pending. [Actual execution and verification](BATCH_TWO_PUBLICATION_REPORT.md). Older counts below are historical.

**Later owner-approved publication:** Batch 1 added five schemes; ten are now published and fifteen remain pending. [Actual publication and verification](BATCH_ONE_PUBLICATION_REPORT.md). Counts below preserve the earlier preparation checkpoint.

18 November 2026. This records the existing pipeline expansion, not a new implementation phase. [The master plan](../../PRODUCT_MASTER_PLAN.md) remains authoritative.

The catalog contains **25 researched schemes, 25 limited fact-reviewed schemes, 25 with validated EN/HI/KN revisions, and 5 published schemes** in Atlas `mygovguide_dev`. 20 schemes have 60 current revisions awaiting editorial decisions. Eligibility-rule approvals remain zero. “Fact-reviewed” means the limited packet and its explicit gaps were approved; it does not certify complete eligibility or all current operative terms.

| Measure | Actual count |
| --- | ---: |
| researched | 25 |
| factReviewed | 25 |
| factApprovals | 25 |
| published | 5 |
| artifacts | 117 |
| originalGeminiResponses | 75 |
| editorialRevisions | 42 |
| jobs | 76 |
| publicIndexes | 15 |
| publicationEvents | 5 |
| eligibilityRulesApproved | 0 |
| pendingContentReviewItems | 265 |
| sources | 138 |
| sourceVersions | 212 |
| liveNotices | 100 |
| geminiPrepared | 25 |
| reviewPendingSchemes | 20 |
| currentPendingRevisions | 60 |
| rawReviewPendingArtifacts | 65 |
| validationFailedArtifacts | 37 |

## Decisions and evidence

The owner approved all twelve identified revisions in [the four-scheme packet](../FOUR_SCHEME_EDITORIAL_REVIEW.md) and publication. [The receipt](../../backend/reports/four-scheme-publications.json) records the existing admin API decisions. Together with PM-KISAN, five schemes are genuinely published, each in three languages. No eligibility rules were approved.

The owner then replied “all” to [twenty concrete fact packets](../TWENTY_SCHEME_FACT_REVIEW.md) for Gemini preparation only. All twenty decisions were persisted before generation. Each packet preserves official evidence, checked date, currentness/reuse limitations and previous research versions. Empty document lists mean unverified requirements, not none required. Gruha Jyothi cannot be published until current operative evidence is refreshed and reviewed. KCC future-effective terms are not advertised as current; deposit savings are not free grants; scholarship listings do not certify open application windows.

## Gemini preparation

The additional twenty produced **60 real Gemini responses: 23 passed directly and 37 retained invalid originals required separate validated, unapproved drafts**. The original fifteen responses for the first five schemes were reused. Atlas holds 117 artifacts in total: 75 original responses and 42 editorial revisions. There are 60 current pending revisions for twenty schemes; the raw pending count of65 additionally includes five superseded earlier originals.

The failure audit records three earlier-model HTTP503 attempts, followed by nine HTTP503, three HTTP504 and two transport failures without an HTTP response on the selected model. These were transient failures, not successful generation; all missing outputs ultimately completed. Failed-attempt token usage is unknown. See the exact attempt list in the final reconciliation JSON. The final resume receipt's worker-attempt counter covers that resume only, not the whole task.

Status: `TWENTY_SCHEMES_SIXTY_LANGUAGES_PREPARED_PENDING_EDITORIAL`. Model: `gemini-3.1-flash-lite`. Selected valid revisions for the additional twenty: **60/60**. [Incremental generation receipt](../../backend/reports/twenty-scheme-gemini.json). The existing fifteen Gemini outputs for the first five schemes were not regenerated.

Repeated HTTP503 failures from the earlier model led to a model-specific availability recovery, not credential rotation. Official [model capabilities](https://aistudio.google.com/docs/models/gemini-3.1-flash-lite) and [standard free-tier pricing](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite) were checked before configuring 3.1; metadata was also checked. The same owner-attested Free-tier project and primary credential were used, paid authorization false and budget zero. No grounding tools, paid requests or quota bypass. Transient 503 responses used bounded existing-job retries and cooldowns. Failed requests may have unknown token usage; successful-response token reports are not invoices.

Some provider outputs invented placeholder document entries for an explicitly unknown checklist. Invalid originals remain stored; separate unapproved drafts remove those entries and pass the complete existing validator. A false positive on the exact negative caveat “No open application window or guaranteed approval is asserted” was corrected narrowly; positive promises still fail regression tests. Corrected drafts may be review-ready while the original generation job remains FACT_VALIDATION_FAILED; the job error is preserved, not relabeled as a clean provider response.

One or more outputs may also omit preserved-fact metadata. Where every supplied metadata value exactly matched the approved snapshot, omitted entries were restored verbatim in separate unapproved drafts with prose unchanged and full revalidation. [Correction receipt](../../backend/reports/catalog-metadata-corrections.json). No fact value was invented and no additional model request was needed for those corrections.

Review the actual stored revisions: [batch 1](../SCHEME_BATCH_1_EDITORIAL_REVIEW.md), [batch 2](../SCHEME_BATCH_2_EDITORIAL_REVIEW.md), [batch 3](../SCHEME_BATCH_3_EDITORIAL_REVIEW.md), [batch 4](../SCHEME_BATCH_4_EDITORIAL_REVIEW.md). Exact IDs/output hashes are preserved in [the editorial manifest](../../backend/reports/twenty-scheme-editorial-packet.json). These packets do not record human editorial acceptance.

## Existing application changes and verification

Public search streams matching publication indexes without the previous silent 200-candidate cutoff, deduplicates language fallback, applies current source/artifact gates, then returns totals and bounded pages. Existing React discovery supports all published schemes, filters/search and previous/next navigation. Profile recommendations treat General as unrestricted and retain state/category relevance with no eligibility conclusion. The publication and public-read gates explicitly reject historical-only publication-blocked facts.

Existing admin supports at most five reviewed schemes per preparation batch, reuses jobs and reports per-scheme blockers. Editors must inspect and select individual current revisions, provide evidence and explicitly attest review before selected approvals. The existing separate publication action remains. No dashboard or UI redesign.

[Real Atlas verification](../../backend/reports/catalog-real-citizen-verification.json) covers three search pages in each language, all fifteen detail responses/pages, official evidence and Farmer/Student/Worker/Woman/General recommendations. No mocks or generation calls in that verification.

Checks: [86 backend + five frontend unit tests](../../backend/reports/catalog-expansion-unit-tests.txt), [32 isolated native database integration nodes](../../backend/reports/catalog-expansion-integration-tests.txt), [22 regression plus two synthetic browser journeys](../../frontend/reports/catalog-expansion-browser-tests.txt), [two additional batch-control browser checks](../../frontend/reports/catalog-batch-review-browser-tests.txt), [production build](../../frontend/reports/catalog-expansion-build.txt). Synthetic fixture publication is isolated local test behavior, not Atlas publication or live government collection.

## Errors and remaining blockers

The existing API, frontend proxy and normal native worker were restored and verified against Atlas after the controlled batch runner finished. Admin metrics returned HTTP200, the worker heartbeat was current, the configured model was `gemini-3.1-flash-lite`, paid approval was false and the paid budget zero. Zero schedules were created. [Actual runtime verification](../../backend/reports/catalog-runtime-verification.json).

An initial Atlas staging write returned code8000: an internal space-quota calculation/dbStats timeout, not proof that the database was full. One idempotent retry completed twenty versioned packets; no data deletion, plan upgrade or charge. Initial stopped local test database/API/frontend errors were resolved by restoring existing services. An initial browser diagnostic without an explicit local test URI selected the configured test URI and failed on the database-name constraint before fixture initialization; rerunning with the explicit isolated native URI passed. Original error receipts remain preserved.

The other twenty schemes require actual editorial/native-language review; publication is not authorized by AI-only approval. Full operative eligibility and several document/application/currentness gaps remain explicit in the packets. Gruha Jyothi additionally needs current authoritative evidence before publication. No guaranteed entitlement or application-open claim is inferred.

[Additional official source investigation](../guides/SCHEME_CATALOG_SOURCE_FINDINGS.md) identifies PMJDY, PM-Kisan Maandhan, AB-PMJAY and PMAY-G as candidates beyond the existing25. They were not added to scheme counts or collected automatically. No new documented permitted scheme feed/API met all requirements. PIB/myScheme/OGD/API Setu restrictions remain; statistical and beneficiary APIs are not scheme descriptions. NDMA retains100 real internal notice snapshots from earlier runs; this task made no new NDMA collection request or schedule.

[Final count/preservation reconciliation](../../backend/reports/catalog-expansion-final-counts.json), [secret exclusions](../../backend/reports/atlas-secret-exclusions.json) and [documentation links](../../backend/reports/real-data-documentation-links.json) record the final checks. Keys and Atlas connection details remain only in ignored backend configuration. No deployment, new phase or unrelated citizen feature was started.
