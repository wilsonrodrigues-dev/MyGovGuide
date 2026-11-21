# Repository cleanup report

Date: 21 November 2026.

## Scope

Phase 0 cleanup only. No feature redesign, database migration, live collection, paid AI call or external publication was performed.

The existing JavaScript MERN application was preserved. Source, tests, fixtures, research datasets, review packets, source approvals, evidence captures, local fonts and requirements documents remain in the repository.

## Recovery checkpoint

A local checkpoint was created before cleanup:

- Branch: `cleanup/recovery-20261121`
- Commit: `e9ebd964`
- Contents: the pre-cleanup tracked and untracked working tree, excluding ignored private files.

The checkpoint contains 850 files. It is the reference for any removed historical artifact. The cleaned index contains 433 tracked files; the cleanup commit changes 573 paths, including 28 detected renames.

## What was removed

- Generated report JSON, screenshots and test logs from `backend/reports/` and `frontend/reports/`.
- Obsolete one-off prompts, UI previews, old cleanup manifests and superseded status snapshots.
- `frontend/design/stitch/` generated design metadata and reference images.
- Duplicate copies of the SRS and synopsis PDFs.
- Historical test-artifact directories that duplicated reports already summarized in dated history documents.

Runtime output directories are retained with `.gitkeep`. Generated report contents are ignored by `.gitignore`.

## What was moved

- Root reports and status snapshots to `docs/history/` with dates.
- Project synopsis and SRS PDFs to `docs/requirements/`.
- Pre-redesign workflow and implementation brief to `docs/`.
- Live source captures to `docs/evidence/live-source/`.
- Project handoff to `docs/history/PROJECT_HANDOFF_2026_11_18.md`.

## Documentation changes

- Root `README.md` now describes the actual current system, local setup, tests, database safety and the next roadmap.
- `docs/README.md` is the documentation index.
- `docs/FINAL_REDESIGN_ROADMAP.md` records the next implementation phase.
- `PROGRESS.md` is a concise current-status log; the detailed pre-cleanup log is archived at `docs/history/PROGRESS_2026_11_21.md`.
- Key guide links to moved or removed receipts were corrected or explicitly marked as available only in the recovery branch.
- `AGENTS.md` points to the new roadmap and documentation locations.
- Backend and frontend READMEs were refreshed for the current code and safety rules.

## Dependencies and source

- 39 dependency entries across backend and frontend were checked against source, tests, scripts and build configuration.
- No dependency was removed because no unused package was confirmed.
- No application source file was deleted.
- The removed `frontend/design/stitch` directory was generated design metadata, not application source.

## Verification

Executed from the repository root:

```text
npm test                162 backend tests passed, 21 frontend tests passed
npm run test:integration 56 isolated integration tests passed
npm run build            production frontend build succeeded
```

Integration tests used:

```text
MONGODB_TEST_URI=mongodb://127.0.0.1:27018/mygovguide_phase2_test_cleanup?directConnection=true
ENABLE_LIVE_COLLECTION=false
```

No automated test or fixture run targeted `mygovguide_demo_v2`, `mygovguide_dev` or any Atlas database.

## Secret scan

The working tree was scanned for Google, Groq, Tavily, OpenAI-style, GitHub and AWS keys, private-key blocks, Mongo credentials and assigned secrets.

Four matches were reviewed and are false positives:

- `backend/.env.example` lines 5 and 9: local MongoDB URIs without credentials.
- `backend/tests/admin.test.js` lines 34 and 47: synthetic `user:password@example.test` test fixtures.

No live credential was found in the cleaned working tree.

Git history still contains Google-key-like strings in historical source-capture reports. The affected current files were redacted during earlier work. History was not rewritten; the remaining risk and any key rotation decision require the owner.

## Database state

- No database was created, migrated, seeded or deleted during cleanup.
- Runtime target remains `mygovguide_demo_v2`.
- Legacy `mygovguide_dev` remains read-only.
- `mygovguide_final` has not been created.

## Remaining limitations

- Real-content acceptance for schemes, forms, notices and scam awareness remains incomplete.
- Some records remain unsupported, expired, incomplete or pending evidence review.
- Eligibility remains withheld when clauses, exclusions or boundaries are incomplete.
- The final redesigned administrator and citizen experiences are not implemented.

## Commit and push

Commit: `e6b9dc8` (`chore: clean repository and prepare final system redesign`).

Pushed to the existing `origin/main` as a fast-forward from `ca73ecf`, without force-push. The local branch and `origin/main` both point to `e6b9dc8` after verification.
