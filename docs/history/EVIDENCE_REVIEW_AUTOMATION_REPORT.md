# Evidence review automation — 19 November 2026

Implemented inside the existing `/admin/reviews` workspace. This automates evidence assembly and administrative triage, **not government permission, fact approval, eligibility or editorial publication**.

## Actual Atlas before / after

| Measure | Before | After |
| --- | ---: | ---: |
| Original ReviewItem records | 341 | 341, unchanged |
| Original PENDING / RESOLVED flags | 316 /25 | 316 /25, unchanged |
| Active observations needing attention | 316 | 212 |
| Active grouped evidence packets | 222 | 118 |
| Administratively handled observations | 0 | 104 |
| Human-decision packets | — | 38, covering132 observations |
| Externally/evidence-blocked packets | — | 80, covering80 observations |

The104 handled records comprise **100 older internal NDMA snapshots +4 explicitly synthetic test observations**. No government facts were automatically approved. The repeat triage run added0 dispositions; all original review rows and human decision history remain intact. The new worklist uses version-bound administrative annotations rather than rewriting legacy queue flags.

Risk classes: ROUTINE4, HISTORICAL100, BLOCKED80, REVIEW_REQUIRED132. Pending observations by type: Scheme116, Notice169, FormTemplate19, ScamAlert12. There are **0 exact duplicate pending observations** in the actual Atlas audit; many records concern the same entity, different versions or separate conflicting fields. Per-source reference counts and reasons are recorded in the [machine receipt](../../backend/reports/evidence-review-automation.json).

NDMA archival requires a validated source payload/raw-record hash, explicit internal/non-actionable RSS-snapshot provenance, recorded publication date at least48 hours old and the existing warning that these are not verified active alerts. **48 hours is an internal archival policy, not an inferred government expiry or a statement that a hazard ended.** The other41 NDMA snapshots remain blocked on currentness. No CAP documents were fetched.

## What already worked / what changed

Existing ingestion already skipped duplicate versions and new ReviewItems for unchanged content. Canonical identities, four collection outcomes, immutable source versions, field differences, source permissions, Gemini validation and publication gates were preserved.

Added deterministic source/version/URL/date/number/field checks and consolidated packets with descriptive titles, issuing authority, exact source version, original passages where actually stored, page/field references, extracted facts, missing evidence, before/after values, conflicting sources, currentness/access status and current AI revisions with fact comparison. Research summaries are labeled separately from original quotations. Missing evidence is never synthesized.

Approvals are reusable only for unchanged recorded scope and valid dependencies. Metadata-only checks do not expand an approval to missing eligibility rules. Hash integrity alone grants no rights. Changed versions, rights/dependencies, expiry or AI mismatches prevent inappropriate reuse; incidental check timestamps/ETags do not force another review. Duplicate queue observations can be handled administratively while retaining the primary unresolved decision.

The existing admin now provides workload totals, content/reason/risk/search/worklist filters, grouped source evidence, differential facts, safe batch triage and per-record audit history. Legacy individual actions remain available and wait for evidence to load. Permission/fact/publication decisions still use their existing protected workspaces. The existing worker prepares evidence snapshots every five minutes; it does not automatically grant approvals or start collection for this feature.

Citizen form pages now display clearly labeled local EN/HI/KN general reading aids alongside original labels/source links and unresolved instructions. Pending AI text stays private. Upload consent, temporary processing, redaction/minimization and deletion behavior are unchanged; no citizen document is sent to Gemini.

## Routes, operations and preservation

- Existing citizen routes remain; improved limited guidance at `/forms/:id`.
- Existing admin `/admin/reviews`; protected API `/api/admin/review-evidence`, `/packet?packetKey=…`, `/refresh`, `/triage`.
- `npm run reviews:prepare`: cache evidence packets; `npm run reviews:triage`: handle eligible routine/historical observations using deterministic reasons. No repetitive typed reason or human attestation is manufactured for these administrative actions.
- New additive collections: `reviewevidenceassessments`, `reviewtriageevents`. Snapshot-bound append-only history retains prior rule evaluations;208 audit entries represent104 distinct effectively handled observations across two rule versions, not208 government decisions. Repeated processing preserves audit timestamps.

All19 protected collection hashes match the baseline:35 schemes,15 publications,117 existing Gemini artifacts,268 source versions,341 reviews,25 human ReviewEvents,18 form references,5 form documents and the existing source/configuration/content records. No private environment changes, deleted review records, new government requests, Gemini requests, paid requests, source grants, fact approvals, eligibility approvals or publications. All20 pending scheme records and the four owner-deferred form preparation packets stay pending.

## Verification and remaining work

Passed:110 backend +11 frontend unit tests;46 isolated MongoDB checks;32 regression +4 existing editorial +10 Forms desktop/mobile browser journeys; production build. Focused admin checks passed again after the final responsive/evidence-loading changes. Synthetic cases cover unchanged approved scope, amended eligibility, conflicts, duplicate observations, NDMA snapshots, unresolved rights, complete structured form packets, stale snapshots and immutable/idempotent triage. Existing scheme/Atlas/source/voice/upload regressions remain covered. Six screenshots use the real Atlas backend:

[Desktop workload](../../frontend/reports/evidence-review-real/workload-desktop.png) · [Mobile workload](../../frontend/reports/evidence-review-real/workload-mobile.png) · [Consolidated form packet](../../frontend/reports/evidence-review-real/form-packet-desktop.png) · [Mobile form packet](../../frontend/reports/evidence-review-real/form-packet-mobile.png) · [Historical audit](../../frontend/reports/evidence-review-real/historical-audit-desktop.png) · [Citizen limited guidance](../../frontend/reports/evidence-review-real/citizen-limited-guidance-desktop.png).

Remaining blockers are substantive: source rights/access, current operative documents, conflicting or incomplete facts, complete legal instructions and genuine editorial decisions. Hashes cannot resolve them. Form evidence still covers55 selected labels, not complete verified templates; OCR and real form AI preparation remain blocked. Assessments currently bound a complete scan to10,000 pending records; larger deployments need partitioned projections. No production/load, native-speaker, antivirus or physical-device certification is claimed. The existing bundle-size warning remains. Temporary test services were stopped after verification.
