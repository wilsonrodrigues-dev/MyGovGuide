# Repository cleanup manifest

18 November 2026. [The product master plan](../PRODUCT_MASTER_PLAN.md) remains authoritative. This is the single cleanup inventory/manifest, not a new phase or specification.

## Outcome and counting scope

| Measure | Result |
| --- | ---: |
| Original filesystem file entries |30313|
| Final filesystem file entries |29760|
| Original project files (tracked + untracked, excluding ignored) |530|
| Final project files (same scope) |483|
| Files deleted |1158|
| Verified redundant project files deleted |46|
| Project/documentation paths moved |0|
| Sensitive original captures privately archived |2|
| File bytes removed (gross) |338.27 MiB|
| Observed inventory size reduction |321.17 MiB|
| Private recovery bookkeeping retained |10.70 MiB|
| Approximate net reduction including recovery bookkeeping |310.47 MiB|

Counts include ignored dependencies, local data/backups and Git metadata, with symlinks counted once and not followed. `.local/cleanup-recovery/**` is excluded from both inventory snapshots and separately reported above. Directory sizes are logical file bytes, not allocated disk blocks. Test-created isolated MongoDB files and recovery metadata add entries/bytes, so the file-count difference is smaller than the deletion count. No existing local database files were removed to manufacture savings. The required build/browser verification passed; generated `frontend/dist/` and `frontend/test-results/` were then removed. Run `npm run build` before another browser suite or deployment preview. Installed packages remain available.

## Recovery point and existing work

Recovery branch: `cleanup/recovery-20261118T160138`

Recovery commit: `0161a1ce4a667ad12c9bea71f16bba108911113f`

Original main HEAD: `ca73ecfc225470d777356ffae70e3a6228f9a6e0`. A separate temporary Git index captured530 existing project files after secret scanning. Main HEAD and the original staging area were unchanged; no reset, checkout, main-branch commit or push occurred. Existing source changes and untracked editorial/data reports are in the recovery snapshot.

Recover an individual public file without resetting other work:

```powershell
git restore --source cleanup/recovery-20261118T160138 --worktree -- path/to/file
```

Complete inventories, file hashes, reference analysis, deletion ledger, validation logs and the checkpoint record are in ignored `.local/cleanup-recovery/`. Private environments, keys and backups were never included in the new commit. Two captured government HTML reports contained embedded API-key-like strings; their exact original bytes and checksums are retained under `.local/cleanup-recovery/sensitive-originals/`, and shareable reports redact only those strings. Do not restore those raw captures into a shareable Git commit. This does not claim removal of secrets from historical Git objects or credential rotation.

## Inventory by directory

| Directory | Before files | Before size | After files | After size |
| --- | ---: | ---: | ---: | ---: |
| `.local` |15134|666.27 MiB|15727|683.32 MiB|
| `.npm-cache` |1091|335.28 MiB|0|0.00 MiB|
| `node_modules` |12238|284.27 MiB|12238|284.27 MiB|
| `frontend` |200|33.87 MiB|164|31.08 MiB|
| `.git` |1263|31.61 MiB|1274|31.64 MiB|
| `backend` |267|4.88 MiB|236|4.69 MiB|
| `docs` |113|3.36 MiB|114|3.39 MiB|
| `package-lock.json` |1|0.14 MiB|1|0.14 MiB|
| `PRODUCT_MASTER_PLAN.md` |1|0.08 MiB|1|0.08 MiB|
| `PROGRESS.md` |1|0.03 MiB|1|0.03 MiB|
| `README.md` |1|0.02 MiB|1|0.02 MiB|
| `package.json` |1|0.00 MiB|1|0.00 MiB|
| `.github` |1|0.00 MiB|1|0.00 MiB|
| `.gitignore` |1|0.00 MiB|1|0.00 MiB|

## Inventory by category

| Category | Before files | Before size | After files | After size |
| --- | ---: | ---: | ---: | ---: |
| Protected local database or backup |14990|665.85 MiB|15576|682.86 MiB|
| Regenerable npm cache |1091|335.28 MiB|0|0.00 MiB|
| Installed dependencies |12269|293.57 MiB|12269|293.57 MiB|
| Git metadata |1263|31.61 MiB|1274|31.64 MiB|
| Historical reports and audit evidence |314|28.38 MiB|270|26.42 MiB|
| Potentially obsolete: further verification required |34|1.95 MiB|34|1.95 MiB|
| Regenerable build or test output |21|1.03 MiB|0|0.00 MiB|
| Current documentation |32|0.63 MiB|33|0.66 MiB|
| Required tests fixtures or original research |53|0.44 MiB|53|0.44 MiB|
| Essential application and operational files |83|0.44 MiB|83|0.44 MiB|
| Ignored local tools and experiments |144|0.43 MiB|151|0.46 MiB|
| Active configuration and dependencies |10|0.14 MiB|8|0.14 MiB|
| Archived unique prompts and plans |3|0.06 MiB|3|0.06 MiB|
| Public assets requiring reference verification |3|0.01 MiB|3|0.01 MiB|
| Protected private environment |1|0.00 MiB|1|0.00 MiB|
| Linked dependency or external path: preserved |2|0.00 MiB|2|0.00 MiB|

## Tracked, untracked and ignored

| State | Before files | After files |
| --- | ---: | ---: |
| ignored |28518|28001|
| Git metadata |1263|1274|
| untracked project |65|56|
| tracked |465|427|
| link |2|2|

Git metadata and installed `node_modules` are not ordinary project files. The original installed dependency files/links remain; no package, lockfile or dependency version changed. Ignored MongoDB data, native binaries and backups remain intact.

## Deleted project paths and retained canonical copies

Every report/image below was byte-identical to its retained copy immediately before deletion. Runtime report writers, captured regression fixtures, source provenance and unique audit evidence were preserved. Historical JSON manifests/plain command logs keep their execution-time paths; active Markdown links and complete inline file references were updated.

| Deleted path | Retained copy /reason |
| --- | --- |
| `backend/reports/api-smoke.json` | `docs/history/test-artifacts-before-cleanup/backend/api-smoke.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/available-import-first.json` | `docs/history/test-artifacts-before-cleanup/backend/available-import-first.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/fixtures-first.json` | `docs/history/test-artifacts-before-cleanup/backend/fixtures-first.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-import-second.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-import-second.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/integration-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/integration-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase3-5-before.json` | `docs/history/test-artifacts-before-cleanup/backend/phase3-5-before.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase3-component-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase3-component-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase3-integration-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase3-integration-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase3-workspace-audit.json` | `docs/history/test-artifacts-before-cleanup/backend/phase3-workspace-audit.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-final-audit.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-final-audit.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-import-first.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-import-first.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-integration-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase35-integration-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-policy-probes.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-policy-probes.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-pre-import-audit.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-pre-import-audit.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-secret-scan.json` | `docs/history/test-artifacts-before-cleanup/backend/phase35-secret-scan.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase35-unit-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase35-unit-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-baseline.json` | `docs/history/test-artifacts-before-cleanup/backend/phase36-baseline.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-final-audit.json` | `docs/history/test-artifacts-before-cleanup/backend/phase36-final-audit.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-integration-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase36-integration-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-local-migration.json` | `docs/history/test-artifacts-before-cleanup/backend/phase36-local-migration.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-ogd-policy.json` | `docs/history/test-artifacts-before-cleanup/backend/phase36-ogd-policy.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/phase36-unit-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/phase36-unit-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/research-input-manifest.json` | `docs/history/test-artifacts-before-cleanup/backend/research-input-manifest.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-api-smoke.json` | `docs/history/test-artifacts-before-cleanup/backend/restructure-api-smoke.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-before-status.txt` | `docs/history/test-artifacts-before-cleanup/backend/restructure-before-status.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-before-tree.txt` | `docs/history/test-artifacts-before-cleanup/backend/restructure-before-tree.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-integration-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/restructure-integration-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-preservation.json` | `docs/history/test-artifacts-before-cleanup/backend/restructure-preservation.json` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/restructure-unit-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/restructure-unit-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `backend/reports/unit-tests.txt` | `docs/history/test-artifacts-before-cleanup/backend/unit-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/build.txt` | `docs/history/test-artifacts-before-cleanup/frontend/build.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/e2e-run.txt` | `docs/history/test-artifacts-before-cleanup/frontend/e2e-run.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/phase35-admin-e2e.txt` | `docs/history/test-artifacts-before-cleanup/frontend/phase35-admin-e2e.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/phase35-build.txt` | `docs/history/test-artifacts-before-cleanup/frontend/phase35-build.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/phase35-e2e.txt` | `docs/history/test-artifacts-before-cleanup/frontend/phase35-e2e.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/phase36-browser-tests.txt` | `docs/history/test-artifacts-before-cleanup/frontend/phase36-browser-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/phase36-build.txt` | `docs/history/test-artifacts-before-cleanup/frontend/phase36-build.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/unit-tests.txt` | `docs/history/test-artifacts-before-cleanup/frontend/unit-tests.txt` — Byte-identical historical snapshot already retained under docs/history; no active code/package/test consumer. |
| `frontend/reports/catalog-batch-one-en.png` | `frontend/reports/catalog-batch-two-en.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `frontend/reports/catalog-expanded-en.png` | `frontend/reports/catalog-batch-two-en.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `frontend/reports/catalog-batch-one-hi.png` | `frontend/reports/catalog-batch-two-hi.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `frontend/reports/catalog-expanded-hi.png` | `frontend/reports/catalog-batch-two-hi.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `frontend/reports/catalog-batch-one-kn.png` | `frontend/reports/catalog-batch-two-kn.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `frontend/reports/catalog-expanded-kn.png` | `frontend/reports/catalog-batch-two-kn.png` — Same exact detail-page image; distinct publication events remain preserved in their separate JSON receipts. |
| `backend/.gitignore` | `.gitignore` — Root ignore rules already apply recursively; nested copies repeat the same rules and add no effective exclusion. |
| `frontend/.gitignore` | `.gitignore` — Root ignore rules already apply recursively; nested copies repeat the same rules and add no effective exclusion. |

## Regenerable directories removed

| Deleted path | Files | Bytes | Reason /recovery |
| --- | ---: | ---: | --- |
| `.npm-cache/**` |1091|335.28 MiB|Disposable npm download/index/log cache. Npm repopulates it when required; installed dependencies were retained.|
| `frontend/dist/**` |20|1.03 MiB|Reproducible build/test output. Regenerate with `npm run build` /`npm run test:e2e`; current test receipts remain in the recovery log folder.|
| `frontend/test-results/**` |1|0.00 MiB|Reproducible build/test output. Regenerate with `npm run build` /`npm run test:e2e`; current test receipts remain in the recovery log folder.|

## Reference checks and preserved items

- Traced103 JavaScript/JSX operational/source/test modules and295 relative import references, including the lazy admin bundle, routes, package scripts and runtime file readers. All29 frontend source modules are reachable/referenced. No dead source deletion was justified. Two static-parser warnings were import strings evaluated by subprocesses with backend working directories; existing tests confirm those paths resolve.
- Verified 149 application/configuration/test/fixture/research files against the original audit hashes: no changes or deletions. Source approval configuration, source models/adapters, workers/scheduler, Gemini integration, admin auth/sessions, multilingual code and original research remain intact.
- Root ignore rules replace two semantically identical nested copies. Added `frontend/reports/*.log` to prevent disposable runtime logs entering future commits. No environment or private key was removed.
- Retained installed dependencies and the active Vite dependency cache. Retained all three public Noto font-license files and their runtime font imports.
- Retained captured government XML fixtures and duplicate raw-source bodies where provenance differs; a shared body does not erase distinct request evidence. Retained active/latest report outputs alongside immutable historical snapshots.
- Retained34 unique design/config metadata files (about1.95 MiB), including Stitch reference artifacts and component-generator configuration, because they document original/future screen work and are not verified disposable assets. They are not citizen runtime bundles.
- Retained three archived prompts/plans (about0.06 MiB) as unique historical scope/decision evidence. They are already under `docs/plans/` and do not override the master plan.
- Ignored local one-off debug/design/research scripts remain for manual review because some are the only reproducibility record for source collection, Atlas migration or genuine editorial decisions. Protected `.local/mongo-test/`, environment backups and content backups were not traversed for deletion. These uncertain files were not moved merely to create another directory tree.

## Redacted captures with exact private originals

| Shareable capture | Archived original |
| --- | --- |
| `backend/reports/live-source-evidence/extra-2.txt` | `.local/cleanup-recovery/sensitive-originals/backend/reports/live-source-evidence/extra-2.txt` |
| `backend/reports/live-source-evidence/feed-links-0.txt` | `.local/cleanup-recovery/sensitive-originals/backend/reports/live-source-evidence/feed-links-0.txt` |

Both captures each contained one embedded API-key-like string. Original checksums and redaction counts are in ignored `redactions.json`; values were not printed. The configured-secret scan found no project credential values in shareable files.

## Verification

| Check | Result |
| --- | --- |
| Backend unit tests |86 passed;0 failed/skipped|
| Frontend tests |5 passed;0 failed/skipped|
| Isolated MongoDB integration |34 test nodes passed;0 failed/skipped|
| Desktop/mobile browser regressions |22 ordinary journeys +4 isolated synthetic editorial journeys passed|
| Production frontend build |Passed; generated output removed after verification|
| Actual Atlas read-only checks |35 schemes;15 published;117 artifacts;75 current validated language revisions;20 pending review records; existing NDMA config;0 schedules|
| PM-KISAN/public UI |Published listing12+3, EN/HI/KN detail/source links, no eligibility claim; admin overview and consolidated review passed|
| Atlas preservation |Protected content/config collection counts and hashes identical before/after;0 database writes from validation|
| Source/model activity |0 live collection requests,0 model calls,0 paid requests,0 new approvals/publications|
| Documentation/secrets |Local link checks pass; private environment/backups ignored; configured and generic credential patterns absent from scanned shareable content|

Validation logs/results are in `.local/cleanup-recovery/validation/`. Existing test-harness reports remain at their active paths; pre-test versions are recoverable from the checkpoint. The real UI check intercepted citizen-session bootstrap only to prevent Atlas session writes; actual public scheme and admin reads used the real Atlas API. Admin login/logout used existing in-memory sessions. Background native worker operation was preserved.

One initial integration command was rejected because application and test URI names matched. The guard was preserved, the verification command was corrected to separate names, and the suite then passed. That setup-error log is retained. The ordinary tests used explicitly named isolated local databases with live collection/real Gemini/paid use disabled. No database cleanup, drop or production-data mutation was performed.
