# MyGovGuide Phase 2 implementation report

Date: **16 November 2026** (Asia/Kolkata).

**Outcome: the local backend, controlled collection pipeline and available-data import are implemented and tested. Full Phase 2 dataset acceptance remains blocked by two missing original datasets. Live collection and definitive eligibility remain unauthorized.**

## Delivered modules

- Node.js 24/JavaScript monorepo with pinned dependencies, environment configuration, loopback Express server, health/data status endpoints, safe errors and logging.
- Source, SourceVersion, Scheme, SchemeFact, EligibilityRuleSet, FormTemplate, Notice, ScamAlert, ChangeEvent, ReviewEvent and IngestionRun models; internal ReviewItem and ImportRejection models; unique indexes and reference validation.
- Zod contracts; actual scheme/form import mapping; preserved original metadata, aliases, editions and uncertainty; stable identities, rejected-record audits and repeatable upserts.
- JSON API, RSS/Atom, HTML and text-PDF adapters with local fixtures and a common discover/fetch/parse/normalize/validate/stage interface. Site-specific adapters can register without changing the ingestion pipeline.
- Default-deny collection gate; independent matching configuration/database approval; host/path/query/method/expiry checks, protected-path and myScheme exclusion, public DNS validation/pinning, redirect checks, request budgets, rate limits, retry/backoff, timeouts and byte limits.
- Unicode-preserving normalization; research facts, incomplete rules, evidence-backed internal review, conflict review, publication safeguards and explicit private-field exclusion.
- Transactional source batches, immutable versions, meaningful changed-field summaries, review events, rule/cache invalidation, history and repeat-run deduplication.

## Actual research import

The demonstration database is **mygovguide_phase2** on the isolated local replica set at **127.0.0.1:27018**. The pre-existing standalone MongoDB on 27017 was not modified.

| Supplied research group | Read | Created first run | Unchanged second run | Rejected |
|---|---:|---:|---:|---:|
| Schemes | 25 | 25 | 25 | 0 |
| Forms/application references | 18 | 18 | 18 | 0 |
| **Total actual supplied input records** | **43** | **43** | **43** | **0** |

Both partial imports correctly report `PARTIAL` for missing datasets. Repeat import produced zero updates and zero change events. One broken form link was retained as excluded evidence.

Current demonstration collections after two imports and two offline runs:

| Collection | Actual count / meaning |
|---|---|
| Source | 36: 32 supplemental URL-reference identities + 4 synthetic fixture sources |
| Scheme | 25 actual research schemes, all RESEARCH_ONLY |
| FormTemplate | 18 actual form references, all RESEARCH_ONLY |
| SchemeFact | 122 research facts, not operative-rule approvals |
| EligibilityRuleSet | 25 incomplete/unapproved placeholders |
| SourceVersion | 47 source-linked entity versions |
| Notice | 4 synthetic fixture results; **zero imported original notices** |
| ScamAlert | 0 original records; synthetic alert contract covered in isolated tests |
| ReviewItem | 47 pending reviews |
| IngestionRun | 4 database-backed demo runs |
| ChangeEvent / ReviewEvent / ImportRejection | 0 / 0 / 0 in the unchanged demo |
| Approved sources / approved rule sets | **0 / 0** |

These are demonstration-database counts, not integration-test database counts. Test databases intentionally include synthetic changes/reviews and are named separately. [Runtime evidence](../../backend/reports/phase2-status.json), [first actual import](../../backend/reports/available-import-first.json), [repeat actual import](../../backend/reports/import-available-latest.json).

## Collection and change results

All four fixture adapters collected successfully and saved four clearly synthetic notices. The second run reported four unchanged records, no new versions, no new review items and no change events. A real government page was never fetched.

Changed-content tests created a reviewable event and historical versions; repeated changed input created no duplicate event. Invalid/missing references and forced later write failures rolled back. Approved snapshots remained available across multiple unreviewed changes. The unchanged demonstration database correctly has zero ChangeEvents. [Integration evidence](../../backend/reports/mongo-integration.json) and [fixture evidence](../../backend/reports/fixtures-first.json) preserve actual counters.

The Phase 1 permissions CSV contains 70 source decisions. All remain denied for live collection. They are listed in [SOURCE_APPROVAL_LOG.md](../../backend/docs/phase2/SOURCE_APPROVAL_LOG.md); the 32 generated research URL identities are separately listed in [SUPPLEMENTAL_SOURCE_LOG.md](../../backend/docs/phase2/SUPPLEMENTAL_SOURCE_LOG.md). The original source-registry JSON has not been reconstructed. The shipped approval configuration is empty, live mode is false, and scheduled execution is commented out.

## Actual verification

- `npm test`: **59 passed, 0 failed, 0 skipped**.
- Real MongoDB integration: **five substantive scenarios passed, one missing-input scenario skipped**. Node reports **6 passed / 1 skipped**, including the parent suite test.
- Native MongoDB connectivity and transactional writes work. Server startup, `/api/health` and `/api/data/status` were checked with the real database; the unavailable-database API path is also tested.
- Source-registry validation, safe dry run, safe approved-collection no-op, actual imports/reimports, all four fixtures/repeats and report generation executed.
- Strict full import failed as intended before writes and named the missing original files.

Details, environment, repaired failures and exact commands: [PHASE2_TEST_REPORT.md](PHASE2_TEST_REPORT.md). Raw output is retained under backend/reports.

## Blockers and limits

1. **SOURCE_REGISTRY.json and NOTICES_AND_ALERTS.json are absent.** The documented 70 original source entries and 12 notices / 12 awareness topics cannot be certified or fully imported from those files. All source/notices/scam record types are exercised by synthetic contract tests; their unseen original mappings remain unverified.
2. SOURCE_ACCESS_FINAL_DECISIONS.md, SOURCE_TO_FEATURE_MATRIX.md and OPEN_DATA_CATALOGS.md are also absent. [Input inventory](../../backend/docs/phase2/INPUT_INVENTORY.md) records all requested documents.
3. No genuine approval exists for live government collection. myScheme remains excluded. Approval-shaped test objects exist only in automated synthetic tests.
4. No operative eligibility rule set is approved. Karnataka GO/amendment review and other scheme clause review remain external human dependencies.
6. No React UI, Gemini feature, production deployment or external notification was built in Phase 2. No public administrative endpoint exists. Original research files were preserved.

## Reproduce and operate

```powershell
npm ci --ignore-scripts
npm run db:local
```

Keep the database terminal open. In another terminal:

```powershell
npm run db:check
npm run import:available
npm run collect:fixtures
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run collect:dry-run
npm run collect:approved
npm run audit:data
npm run report:phase2
npm run dev
```

Use `npm run import:phase1` only after supplying the complete original package and verifying the remaining mappings. Environment, troubleshooting and operator inspection commands are in [README.md](../../README.md).

## Files and Phase 3 readiness

[Complete generated folder/file structure](../../backend/docs/phase2/PROJECT_STRUCTURE.txt). Main implementation areas:

```text
MyGovGuide/
  MyGovGuide_Phase1_Pack/     preserved research and evidence
  backend/
    config/                 empty live approval registry
    src/
      adapters/             API, RSS/Atom, HTML, PDF and offline support
      config/               environment and MongoDB connection
      models/               all data and audit models
      services/             ingestion, normalization, review and change detection
      utils/                hashing and logging
      validators/           Zod contracts and private-field exclusion
      app.js
      server.js
    fixtures/               synthetic examples and contract package
    scripts/                CLI, reporting and database helper
    tests/                  independent tests plus MongoDB integration
    reports/                actual execution evidence
    seed-data/phase1/       original-input location policy
  docs/phase1/
  docs/phase2/
  frontend/                   reserved for Phase 3
  .github/workflows/collect.yml
  package.json
  package-lock.json
  README.md
  PROGRESS.md
  PHASE2_COMPLETION_REPORT.md
```

Phase 3 can develop against the tested internal data layer and synthetic fixtures. Citizen-facing publication, definitive eligibility and live Change Radar feeds still require the missing data and independent access/rule/publication approvals. [Implementation decisions and handoff](../../backend/docs/phase2/IMPLEMENTATION_NOTES.md) explain the extension points.
