# Documentation cleanup verification — 18 November 2026

This records documentation organization and existing-test verification only. [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md) remains the sole product specification. No application phase, feature development, rebuild, dependency update, migration or deployment was performed.

## Organization and preservation

- Root: `PRODUCT_MASTER_PLAN.md`, `README.md`, `PROGRESS.md` remain in place.
- [history](./): 10 existing phase completion/test/verification documents, including the Phase 1 completion/closure reports, Phase 2 completion/test reports, Phase 3 completion/restructuring verification, Phase 3.5 completion/test reports and Phase 3.6 completion/traceability.
- [guides](../guides/): six existing admin, scraping, AI, scheduler, database and data-quality guides.
- [plans](../plans/): three archived documents: the Phase 3.6 prompt, original handoff and Phase 2 blueprint. They are historical context, subordinate to the master plan.
- [Documentation index](../README.md) provides current navigation. Local Markdown link targets were checked and repaired, including links within moved files and the backend evidence index.
- All 17 original research files match their existing SHA-256 manifest after mapping the two moved phase reports to their new locations. Datasets, CSV evidence and remaining research audits stay under `backend/research/phase1/`.
- All 66 pre-existing execution-report/screenshot files were copied to [test-artifacts-before-cleanup](test-artifacts-before-cleanup/) before running the unchanged test harness. Existing runtime report paths remain in place. Older JSON manifests, source trees and archived command output retain historical execution-time paths.
- [Previous progress](PROGRESS_BEFORE_DOCUMENTATION_CLEANUP.md) is retained separately. Current progress removes outdated missing-input blockers: all four research JSON datasets are supplied.
- A pre/post hash comparison of 155 non-documentation application/configuration/research/design files found zero changes. Backend/frontend source, AI router, tests, dependencies, lockfile, environment examples and Git ignore rules were not modified.

## Active technology decision

The master plan and active AI guide now specify Gemini as the selected provider. Removed the obsolete independent-provider proposal, configuration recommendations and future activation instructions from the active plan. Current operations defer unavailable Gemini work and use current reviewed cache/original-text fallback. Existing disabled Mistral compatibility code/placeholders and its regression tests were preserved. Historical prompts/reports retain their original implementation context and do not authorize provider activation.

No real generation, provider metadata check, external source probe or paid API request was made during this cleanup. External results below are the last Phase 3.6 observations, not new live checks.

## Secret exclusions

`git check-ignore --quiet` confirms exclusion of backend/frontend `.env` files and checked production/local variants. `git ls-files` contains no private environment file; `.env.example` remains eligible for version control. An in-memory scan compared configured private key/session values and database passwords against shareable source/docs/reports, including copied report artifacts. No configured values were found or printed.

This verifies current tracked/working-tree exclusions and configured-value absence, not arbitrary secret detection or every historical Git object. Previously exposed credentials still require private rotation/confirmation; ignore rules cannot revoke them. No private configuration was changed.

## Existing tests rerun

Commands ran from the project root:

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run test:e2e
```

| Check | Actual result | Evidence |
| --- | --- | --- |
| Backend unit/component | 82 passed, zero failures/skips | [Unit output](cleanup-unit-tests.txt) |
| Frontend contract/contrast | 4 passed, zero failures/skips | Same unit output |
| Native MongoDB integration | 31 passed test nodes, including 4 parents / 27 child scenarios; zero failures/skips | [Integration output](cleanup-integration-tests.txt) |
| Existing browser regression/theme | 16 passed | [Browser output](cleanup-browser-tests.txt) |
| Synthetic content/editor browser | 2 passed, desktop/mobile | Same browser output |
| Local Markdown targets, research hashes, code hashes, secret exclusions | Passed | [Machine-readable cleanup audit](documentation-cleanup-audit.json) |

The first browser attempt inherited the configured test URI and failed with the sanitized MongoDB-unavailable message before browser journeys began. It was rerun with the explicit local isolated-test URI shown above and all 18 journeys passed. No code, assertions or environment files were changed to obtain that result. The existing built frontend was reused; no application rebuild was requested or performed. Test output was redirected to these new cleanup files; previous report artifacts were retained before their fixed paths refreshed.

The unchanged test harness seeds timestamped isolated databases, uses deterministic offline provider fixtures and stops its owned API/frontend/worker processes. It preserves the native MongoDB process and application database. Passing these tests is not evidence of real government scraping or real model-generated translations.

## Still unresolved

- No approved live government source/run; permissions and source-specific access/reuse evidence remain incomplete. myScheme remains blocked.
- Real Gemini generation awaits model selection and confirmed entitlement; paid use is unapproved and budget remains zero. Last primary-key metadata check succeeded; no generation calls/tokens/spending.
- Atlas read-only inspection last failed DNS/connection; no Atlas writes. Local verification remains usable.
- Real scheme publication needs authorized fact/rights/editor review; 25 eligibility rule sets remain incomplete/unapproved.
- Previously exposed credentials need private rotation/confirmation.
- Last dependency audit recorded one unpatched picomatch advisory through three development-chain packages; runtime dependencies audited cleanly then. This cleanup did not change dependencies or rerun a network audit.
- Native Stitch authentication, physical-device/screen-reader/native-speaker QA, production penetration testing and deployment acceptance remain outstanding.
- Future citizen features remain as specified in the master plan and were not begun here.

See [current progress](../../PROGRESS.md) for the exact completed-feature and blocker inventory.
