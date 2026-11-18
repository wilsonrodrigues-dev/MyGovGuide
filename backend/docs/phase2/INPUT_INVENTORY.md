# Supplied input inventory

Inspection date: 16 November 2026 (Asia/Kolkata). Original files were preserved in place. Additional scheme/form research files appeared during implementation and were inspected before real import mappings were written.

| Required input | Actual state |
|---|---|
| MyGovGuide_Project_Handoff.md | Present; original product/API plan |
| ORIGINAL_PROJECT_HANDOFF.md | Absent, optional alternate name |
| MyGovGuide_Phase2_Blueprint.md | Present |
| VERIFIED_SCHEMES.json | Present; metadata + schemes, 25 records |
| FORMS_REGISTRY.json | Present; metadata + forms (18) + brokenLinkDoNotUse (1) |
| NOTICES_AND_ALERTS.json | Missing; 12 notices / 12 topics are documented counts only |
| SOURCE_REGISTRY.json | Missing; 70 source entries are documented in CSV/Markdown |
| SOURCE_REGISTRY.md | Present; source identity/reference table |
| PHASE1_CLOSURE_REPORT.md | Present |
| PHASE1_COMPLETION_REPORT.md | Present |
| SOURCE_ACCESS_FINAL_DECISIONS.md | Missing |
| SOURCE_PERMISSION_DECISIONS.csv | Present, 70 rows; zero unattended authorization |
| SCHEME_VERIFICATION_MATRIX.csv | Present, 25 rows; zero approved rule sets |
| KARNATAKA_ORDERS_AUDIT.md | Present; all five Karnataka operative-order reviews held |
| DATASET_CLASSIFICATION_AND_RELEASE.md | Present |
| PILOT_SOURCE_SELECTION.md | Present |
| SCRAPING_FEASIBILITY.md | Present |
| SOURCE_TO_FEATURE_MATRIX.md | Missing |
| DATA_REQUIREMENTS.md | Present |
| ASSET_REGISTRY.md | Present |
| QUALITY_AUDIT.md | Present |
| OPEN_DATA_CATALOGS.md | Missing |
| OUTREACH_AND_EXTERNAL_APPROVALS.md | Present; no approvals or outreach inferred |

The scheme JSON uses `primaryCategory`, `responsibleAuthority`, `officialSourceUrl`, `benefitOrServiceSummary`, `eligibilityResearchSummary`, `aliases`, `applicationWindow`, `sourceEdition`, `keyFacts` and empty eligibility arrays. Every original value and package metadata is retained. `currentEligibilityFullyVerified=false` is respected.

Forms use `officialUrl`, `linkedSchemeIds`, `fieldNamesObserved`, `formKind` and verification notes. Eight original kinds map conservatively into PDF form, authenticated portal, public entry page or instructions. An unverified bank/offline form or reference inside governing rules remains instructions-only; no downloadable blank form is invented.

The unavailable source/notices JSON adapters are tested using labelled contract fixtures. Their original field mappings and full dataset counts cannot be verified until the original files are supplied. The strict import fails before writes. The partial importer creates real URL-reference identities from supplied research and labels them as supplemental, never as reconstructed registry entries.
