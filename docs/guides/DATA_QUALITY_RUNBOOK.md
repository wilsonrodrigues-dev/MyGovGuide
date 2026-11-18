# Data quality and review runbook

All operational commands run from the repository root. Review services are internal JavaScript functions; no public mutation API exists.

## Import and reconcile

1. Preserve the original package; run `npm run audit:data` and inspect root structures/counts.
2. Use `import:phase1` for a complete original package. Missing roots fail before writes. Use `import:available` explicitly for the supplied 25 schemes and 18 forms.
3. Inspect run counters: `read = created + updated + unchanged + rejected`. Supplemental source identities and generated facts/rules/reviews are reported separately from input record counts. Broken links are excluded with their original reasons.
4. Resolve `ImportRejection` records and unknown source/scheme references; rerun. Imports do not promote statuses or source permissions. Repeating an unchanged package creates a run record but no duplicate policy versions/events.
5. Inspect `npm run reviews`, `npm run runs`, and `npm run changes`. Keep research-only data out of public APIs.

## Evidence, versions and conflict handling

Original records, editions, historical names, application windows, amounts and limitations remain under `original`. Normalized fields add searchable categories/state/units without rewriting source strings. Dates require unambiguous ISO input; ambiguous dates and monetary units produce null plus review flags.

Each collected/imported entity links stable Source IDs and an immutable SourceVersion. SchemeFact records link the exact version, original/normalized value and research section. `keyFacts` numbers are stored as individual research facts; a research section is explicitly not an operative legal clause. Supporting-document URLs and editions are retained in normalized versions. Eligibility placeholders contain no inferred rules.

Different evidence for the same programme creates field-level versions and pending review. Conflicting values from different sources produce a conflict review item, withdraw the scheme and invalidate dependent rules. Similar titles alone never merge programmes. Operators must resolve identity and edition disputes with issuing-authority evidence.

## Fact review

Call `review(store, entityType, entityId, decision)` from `backend/src/services/verification/review.js` in an authenticated internal operator script. The decision requires a named reviewer, explicit evidence, clause references, a permitted status transition, and the current version ID (or the fact's sourceVersionId). A decision generates an immutable ReviewEvent and resolves the corresponding queue item.

Typical transition: RESEARCH_ONLY -> SOURCE_VERIFIED_FACT. Rejected/superseded records remain in history. Publication is a separate decision requiring rights basis, reviewer and evidence; merely verifying a fact does not publish it. Source access approval is a separate service and never upgrades fact trust.

## Eligibility-rule approval

1. Obtain current operative orders, amendments, authority, effective dates and exact clauses.
2. Human-author typed nested AND/OR/NOT predicates, limits, exceptions, missing/manual conditions and clause references. Money predicates require currency and period/unit. Every source version must exist.
3. Mark completeness COMPLETE only after all operative conditions have been reviewed. Record revision history and run meaningful profile cases before approval.
4. The internal review service only permits RULES_APPROVED_CURRENT for a complete human-curated EligibilityRuleSet with real evidence, rules, source versions and effective dates. The model validates the approval record as well.
5. `eligibilityReadiness` returns INFORMATION_INCOMPLETE for missing, unapproved, expired or incomplete rules. Phase 2 does not implement the Phase 3 citizen eligibility engine.

Zero imported rules are approved. AI or scraper output cannot activate eligibility.

## Changes and failed runs

Semantic hashes exclude transport timestamps, page navigation and superficial whitespace. Policy values, dates, editions and source-document URLs participate. An actual A -> B -> A transition keeps three historical version instances; an A -> A repetition does not. Version uniqueness is per entity/revision, with a source/hash lookup index. This preserves a return to an earlier policy without confusing it with a duplicate run.

Each meaningful change records both hashes, version IDs, changed fields, a source-linked summary and pending review. Approved values remain stored while changed observations are staged in new versions. Repeated unreviewed changes keep the approved snapshot; publication is withdrawn, caches are flagged stale, and dependent rules return to incomplete review. No eligibility notification is emitted.

Per-source batches are transactional. A fetch/parse/validation/write failure rolls back that source's staged records; other sources continue. Earlier versions remain available. Last-success/error metadata and IngestionRun counters describe each source. Do not resolve a failed run by disabling validation or authorizing a blocked URL.

## Collection approval and monitoring

Use the [approval log](../../backend/docs/phase2/SOURCE_APPROVAL_LOG.md). Both configuration approval and a matching database Source access decision are needed. `approveSource` in `services/verification/sourceApproval.js` records a reviewer-backed access decision without publishing facts. No approval examples are shipped as active grants.

`collect:dry-run` does not fetch or write to MongoDB; it evaluates configuration and explains that database evidence must also match. `collect:approved` safely no-ops without enabled approvals. No-op runs are retained in local JSONL audit history; real runs are stored in MongoDB. On failures use `runs`, reports and the source's last error; never print MongoDB URIs or raw credentials.

Before enabling a schedule, obtain genuine evidence, inspect the approved paths and method, run the test plan, validate the registry, then deliberately change both the deployment live setting and the commented workflow schedule. The workflow has not been exercised on GitHub.
