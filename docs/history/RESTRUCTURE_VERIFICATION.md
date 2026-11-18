# Part A restructuring verification

Recorded 16 November 2026, before Phase 3 feature implementation.

- Existing implementation moved from server/ to backend/; reserved client/ moved to frontend/.
- Research moved intact to backend/research/phase1. Specifications moved intact to backend/docs/specifications. Backend-specific reports and documentation are under backend/.
- Seventeen original research/specification files passed byte-for-byte SHA-256 checks against the prior manifest. Evidence: reports/restructure-preservation.json. Baseline Git status and file inventory are retained as historical snapshots in reports/restructure-before-*.
- The project-owned native MongoDB was shut down cleanly to release Windows directory handles, then restarted with the same port, replica set, database names and data files. The existing service on 27017 was not changed.
- All 59 existing Phase 2 unit/component tests passed after the move. Test assertions were unchanged. Five substantive MongoDB scenarios passed; the full-package scenario remained skipped because SOURCE_REGISTRY.json and NOTICES_AND_ALERTS.json are absent from the real research package.
- Database connectivity and transactions, two research imports (43 unchanged each), two offline runs (four unchanged each), both Express status endpoints, reporting and denied live collection were verified after the move.
- Operational container configuration and setup instructions were removed; native MongoDB is the supported local path.
- Root npm workspace and workflow report paths now target backend/. Backend commands run from backend/ without the previous folder names.

Actual evidence: ../../reports/restructure-unit-tests.txt, ../../reports/restructure-integration-tests.txt and ../../reports/restructure-api-smoke.json. Historic Phase 2 reports retain the original execution facts, with relocated links.
