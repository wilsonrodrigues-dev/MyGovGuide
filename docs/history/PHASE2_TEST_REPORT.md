# Phase 2 test report

Date: 16 November 2026, Asia/Kolkata. Results are actual local execution, not predicted results.

## Environment

- Windows PowerShell; Node.js **24.18.0**, npm **11.16.0**.
- Installed MongoDB Community **8.0.10**.
- Existing standalone database on 27017 left unchanged. A separate project-owned loopback replica set was initialized on **27018** with files under `.local/mongo-test/`.
- Ingestion requires transactions. Database-backed tests use fresh `mygovguide_phase2_test_<timestamp>` databases and retain them for inspection. The demonstration database is `mygovguide_phase2`.
- Dependency installation succeeded; exact dependency tree is in package-lock.json. npm registry queries confirmed Node engine compatibility. No claim of a fresh network security-advisory audit is made.

## Commands and actual outcomes

| Command/check | Actual result |
|---|---|
| `npm test` | **59 passed, 0 failed, 0 skipped** |
| `npm run test:integration` with explicit MONGODB_TEST_URI | **5 substantive MongoDB scenarios passed, 1 scenario skipped**; Node's totals include the parent test: **6 passed, 0 failed, 1 skipped** |
| `npm run import:available` | 43 read, 43 created, 0 rejected; reported PARTIAL because two original files are absent |
| Repeat `npm run import:available` | 43 unchanged, 0 created/updated/rejected, 0 new change events |
| `npm run collect:fixtures` | 4 successful sources, 4 synthetic notices created, 0 failed |
| Repeat `npm run collect:fixtures` | 4 unchanged, 0 new review items, 0 new change events |
| `npm run collect:dry-run` | Safe no-op; zero HTTP requests and database writes |
| `npm run collect:approved` | Safe no-op; empty registry and live collection disabled |
| `npm run registry:validate` | 0 entries, 0 invalid, default DENY |
| `npm run db:check` | Connected, transactions available |
| `npm start`; HTTP health and data status | Started successfully; health 200/connected; counts returned; release and eligibility flags false |
| API without database | Unit test confirms health 200, data status 503, no admin route, malformed JSON 400 |
| `npm run import:phase1` | Expected nonzero exit naming missing SOURCE_REGISTRY.json and NOTICES_AND_ALERTS.json; no partial write |
| `npm run report:phase2` | Generated runtime/input audit, source logs and project tree |
| `npm run db:local` | Existing isolated replica set detected without reconfiguration; native startup/restart also checked |

Actual runner output: [unit-tests.txt](test-artifacts-before-cleanup/backend/unit-tests.txt), [integration-tests.txt](test-artifacts-before-cleanup/backend/integration-tests.txt). Database evidence: [mongo-integration.json](../../backend/reports/mongo-integration.json), [phase2-status.json](../../backend/reports/phase2-status.json), [api-smoke.json](test-artifacts-before-cleanup/backend/api-smoke.json).

## Covered behavior

- Every required model rejects malformed documents; deny defaults, credential-free URL validation, typed/clause-backed nested rule structures, unique indexes, reference integrity and publication guards.
- Real supplied scheme/form mappings, aliases and editions; all-record-type synthetic import, rejection/recovery, missing-package preflight, idempotent upserts and incomplete eligibility blocking.
- Default-deny source handling with zero DNS/HTTP calls; expiry, rights/robots/API agreement requirements, protected paths, myScheme, private/metadata/IPv6 destinations, redirects, DNS pinning, request budgets, bounded retry/backoff and size/timeout settings.
- API JSON, RSS, Atom, HTML and PDF extraction; malformed/missing inputs, Unicode retention, fixture path containment and partial source failure.
- Date/money/age/category/state normalization; no inferred deadlines or units; similar-name programmes remain distinct.
- Meaningful changes and no-op repetitions; A-B-A version history; immutable source versions, rollback after a later write failure, approved snapshot retention across multiple unreviewed changes, conflict review, rule invalidation and stale caches.
- Internal reviewer evidence/transition enforcement, synthetic source-approval audit, and known private-field exclusion/redacted rejection copies. This is not a claim that arbitrary citizen data can be reliably de-identified; collectors are restricted to approved public research sources.

## Repairs made during validation

The first unit run was 51/52: a test incorrectly expected an undefined source access status although the importer correctly set denial. The assertion was corrected to require denial. Real MongoDB initialization exposed an eager Mongoose auto-create call before connection; automatic initialization was disabled and explicit collection/index initialization added. The report generator initially lacked its destination directory; it now creates it. Later complete runs passed as recorded above.

## Explicit limitations

