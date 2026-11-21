# Consolidated editorial review and catalog preparation

18 November 2026. [The master plan](../../PRODUCT_MASTER_PLAN.md) remains authoritative. No new phase, dashboard, automatic publication or eligibility decision.

The owner explicitly kept Batch3 pending and replaced per-batch approval interruptions with one consolidated review. All existing unapproved artifacts remain pending. Earlier Batch1/2 approvals and the15 published schemes remain intact.

## Actual results

| Measure | Actual |
| --- | ---: |
| Stored schemes |35|
| Limited human fact-reviewed schemes |25|
| Schemes with validated EN/HI/KN revisions |25|
| Published schemes /language indexes |15 /45|
| Existing unpublished prepared schemes /current revisions |10 /30|
| Additional official research records, not approved/prepared |10|
| All pending schemes in consolidated review |20|
| Ready for editorial review |9|
| Fact/rights review required |9|
| Blocked current evidence |2|
| New Gemini /paid /live-collector requests |0|
| Artifacts retained |117|
| Eligibility approvals |0|

The ten original pending schemes already had valid stored Gemini revisions. They were revalidated and reused, not regenerated. Invalid original responses and superseded revisions remain preserved separately; current prepared revisions are REVIEW_PENDING. The ten new records are source-backed research candidates, not generated summaries or verified complete eligibility rules.

## Existing admin implementation

`GET /api/admin/content/editorial-review` projects all pending schemes with pagination/readiness filters, current source evidence, benefits, document requirements, uncertainties, exact language revisions/keywords and snapshot/output hashes. Superseded originals are not mistaken for current corrected drafts. Malformed output is retained as raw evidence and labeled for correction. Synthetic provenance is excluded from real consolidated data. Browsing/export makes no AI or publication call.

The existing `/admin/publish` embeds this view. Editors inspect full source evidence and all three language revisions, select reviewed records, enter evidence and personally attest the decision. One explicit final `APPROVE_AND_PUBLISH` request checks all selected snapshots before using the existing artifact-review and publication workflows. No default selections, inferred approval or automatic publication. Incomplete/blocked rows cannot be selected. Changed sources/revisions and stale replay are rejected. A mid-operation failure reports completed records and stops; it does not silently claim that the whole decision succeeded.

[Consolidated exact review](../CONSOLIDATED_EDITORIAL_REVIEW.md), [machine snapshot](../../backend/reports/consolidated-editorial-review.json), [real Atlas verification](../../backend/reports/consolidated-atlas-verification.json). All20 pending records were visible on desktop/mobile; counts of artifacts117, published schemes15 and publication events15 were unchanged by the real review test.

## Additional official research

- **Pradhan Mantri Jan-Dhan Yojana (PMJDY)** — [official evidence](https://pmjdy.gov.in/scheme). KYC, account-opening requirements and current conditions for overdraft and insurance need operative-document review.
- **Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)** — [official evidence](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160081&id=160081&lang=2&reg=48). State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.
- **Pradhan Mantri Awaas Yojana-Gramin (PMAY-G)** — [official evidence](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210378&lang=1&reg=1). The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review.
- **Pradhan Mantri Awas Yojana-Urban 2.0 (PMAY-U 2.0)** — [official evidence](https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf). Income bands, property-ownership exclusions, beneficiary family definition, current amendments and vertical-specific document/application requirements need exact-clause review.
- **Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)** — [official evidence](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309204&lang=1&reg=6). Entry-age and land-record cutoffs, exclusions, contribution schedules and spouse/exit rules need operative review. The short checklist is reported in the announcement and is not certified complete.
- **Atal Pension Yojana (APY)** — [official evidence](https://financialservices.gov.in/atal-pension-yojana). The FAQ includes older provisions. Current income-taxpayer restrictions, entry conditions, contribution tables, nominee and exit rules require reconciliation with current PFRDA documents.
- **Pradhan Mantri MUDRA Yojana (PMMY)** — [official evidence](https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy). Lender appraisal, current loan categories including Tarun Plus, repayment terms, interest and documentation require current operative/lender review. No credit approval or rate is promised.
- **Prime Minister Street Vendor AtmaNirbhar Nidhi (PM SVANidhi)** — [official evidence](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2303797&lang=2&reg=48). The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review.
- **PM Vishwakarma** — [official evidence](https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159998&lang=1&reg=1). Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.
- **Prime Minister Employment Generation Programme (PMEGP)** — [official evidence](https://www.msme.gov.in/static/uploads/2025/06/a5d3bb85a742c20836cca93360cdd62e.pdf). The retrieved guidelines explicitly cover continuation through2025-26. Current2026-27 continuation/amendment evidence is required before publication; a statistics dashboard alone is insufficient. Project limits, subsidy percentages, training and documents need current review.

[First staging run](../../backend/reports/additional-official-research-first-run.json) created10 research schemes/versions; [repeat run](../../backend/reports/additional-official-research.json) left all10 unchanged, zero duplicates/new versions. [Candidate fact packets](../../backend/review-packets/additional-ten-official-facts.json) retain checked timestamps, short attributed excerpts, proposed rights, original facts and gaps. This is targeted official-document research, not an authorized live collector run. No crawler/feed/API/source permission was activated and no full page/form/image was mirrored. Existing PIB/myScheme/OGD restrictions remain.

## Actual blockers and control

Master plan §17.4 requires genuine human fact/rights/currentness review before Gemini. No such approval exists for the ten new candidates; an instruction to collect/prepare was not written into the database as a fictitious completed human review. They therefore have no AI artifacts yet. Their facts and missing information are visible together in the consolidated screen; no per-five-scheme chat question was sent.

Gruha Jyothi remains historical-only and publication-blocked despite having prepared internal translations. The retrieved PMEGP guidelines expressly continue only through2025-26; current2026-27 continuation evidence remains unresolved. Several other schemes have incomplete operative eligibility/documents; those uncertainties remain explicit. No guaranteed eligibility or application-open claim is inferred.

## Verification

[86 backend +5 frontend unit tests](../../backend/reports/consolidated-review-unit-tests.txt), [34 isolated database integration nodes](../../backend/reports/consolidated-review-integration-tests.txt), [full desktop/mobile browser run](../../frontend/reports/consolidated-review-all-browser-tests.txt), [build](../../frontend/reports/consolidated-review-build.txt). The browser run includes22 existing regression journeys and4 synthetic editorial/consolidation journeys. Tests verify missing attestation, stale snapshots, blocked evidence, malformed output, source-change review, one multi-scheme explicit decision and stale replay. Synthetic approvals/publications occur only in isolated native test databases, with mock outputs and zero real model calls.

The first browser attempt exposed an old assertion that assumed no other synthetic scheme could be published. It now checks the selected scheme’s missing translation specifically, preserving the intended gate while allowing independently published test schemes. The original failure log is preserved. A later run passed all checks.

[Final inventory/preservation](../../backend/reports/catalog-expansion-final-counts.json), [API/worker health](../../backend/reports/catalog-runtime-verification.json), [secret exclusions](../../backend/reports/atlas-secret-exclusions.json), [local documentation links](../../backend/reports/real-data-documentation-links.json). All baseline scheme IDs/source-version hashes/original artifact outputs remain preserved. Private backend credentials and backups remain ignored; no configured secrets were found in scanned shareable files. No deployment, unrelated citizen feature or source-access change.
