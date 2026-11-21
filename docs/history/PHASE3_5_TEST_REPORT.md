# Phase 3.5 test report

Date: 17 November 2026. Native Windows, Node 24, MongoDB replica set on port 27018. No Docker. No public deployment.

## Final results

| Check | Result | Evidence |
| --- | --- | --- |
| Backend unit/component tests | 72 passed, zero failed/skipped | `docs/history/test-artifacts-before-cleanup/backend/phase35-unit-tests.txt` |
| Frontend contract tests | 4 passed, zero failed/skipped | Same combined report |
| Database integration | 22 passed test nodes including 3 parents; 19 substantive child scenarios, zero failed/skipped | `docs/history/test-artifacts-before-cleanup/backend/phase35-integration-tests.txt` |
| Desktop/mobile Edge browser suite | 14 passed: 12 existing citizen journeys and 2 complete admin journeys | `docs/history/test-artifacts-before-cleanup/frontend/phase35-e2e.txt`, `frontend/reports/e2e-results.json` |
| Admin after final responsive table adjustment | 2 passed | `docs/history/test-artifacts-before-cleanup/frontend/phase35-admin-e2e.txt` |
| Production frontend build | Passed; admin JS/CSS split from citizen bundle | `docs/history/test-artifacts-before-cleanup/frontend/phase35-build.txt` |
| Dependency audit | Install audit reports zero vulnerabilities after targeted patched dependencies | Lockfile and final install result |
| Research preservation | All 17 original files match their original SHA-256 manifest | `docs/history/test-artifacts-before-cleanup/backend/phase35-final-audit.json` |
| Secret scan | No private configured password/session-secret matches in 209 scanned source/document/report files; ignored private env excluded | `docs/history/test-artifacts-before-cleanup/backend/phase35-secret-scan.json` |
| Atlas | BLOCKED: DNS/connection failed, no writes | Sanitized `db:inspect` result; database guide |
| Genuine government live collection | NOT RUN: no source with complete verified access evidence | Policy probes and source approval log |

## Import regression and reconciliation

The importer missed `primaryOfficialUrl`, the actual source field used by all 12 scam-awareness inputs. It now maps that field, uses the actual safety/research summaries, retains observed notice announcement dates, and preserves the raw package records. Awareness topics remain `AWARENESS_TOPIC`, without an invented incident/publication date, and remain internal. Notice deadlines stay observed research, not actionable verified deadlines.

The full package contains 70 sources + 25 schemes + 18 forms + 12 notices + 12 awareness records = 137 inputs. Supplemental URL identities are separate deny-only provenance records, not extra research inputs.

| Existing local application database import | Read | Created | Updated | Unchanged | Rejected | New changes | New review items |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| First corrected run | 137 | 12 | 12 | 113 | 0 | 12 | 24 |
| Repeat | 137 | 0 | 0 | 137 | 0 | 0 | 0 |

The 12 updates are deliberate notice normalization corrections: the supplied research summary and observed announcement date now map into normalized content. They are preserved as new versions and changes rather than silently overwriting history. The recovered 12 awareness topics account for the new records. `pendingReview` in ingestion counters describes records requiring review, while `reviewItems` counts newly created queue items; the repeat creates zero new queue entries. Historical rejection rows are retained and are not counted as new rejected inputs.

Reports: `phase35-import-first.json`, `phase35-import-second.json`, `phase35-pre-import-audit.json`, and `phase35-final-audit.json` under `backend/reports/`.

Before repair there were exactly four ChangeEvents and 63 accumulated ReviewItems. The previous import's 16 new ReviewItems were four changed records plus 12 new notices, on top of 47 pre-existing entries. The four changes were `KA-WO-01`, `KA-WO-02`, `KA-GN-01` and `FORM-14`; **only sourceIds changed**, from the supplemental Seva Sindhu identity to registry source `K02` after the full registry became available. Benefits/eligibility text did not change. Version payloads were inspected and preserved.

## Security and worker coverage

Tests cover salted scrypt, wrong/unknown user passwords, opaque session hashes, HttpOnly/SameSite cookies, CSRF, origin rejection, logout revocation, every anonymous admin resource, secret-safe configuration errors, named/separate databases, restricted live enqueue and activation, closed fixture allowlist, 202 enqueue, active-source uniqueness, concurrent workers, real history/metrics, idempotent repeated collection, scheduler OFF/ON persistence, concurrent slot prevention, timezone and DST calculations, invalid cron, queued/running cancellation, lease recovery, retry exhaustion, injected failure followed by successful recovery, record explorer, old/new change versions, evidence-required rejection and blocked fact/eligibility approval.

Worker restart tests simulate a dead worker's expired lease and verify recovery/fencing behavior; they are not a claim that every operating-system crash timing was exhaustively tested. The actual dedicated worker starts and processes fixture jobs in browser tests. Test databases are timestamped and retained; no application database cleanup or drop operation is used.

The existing no-network access tests and all four API/RSS/HTML/PDF fixture adapter scenarios remain. New candidate PIB parsing tests use labeled synthetic XML and verify publisher identity, official release ID/link, observed date and provenance. Retry-After behavior and long cooldown termination are tested using controlled transport responses. These tests do not establish a genuine live adapter result.

## Browser verification

The admin journey signs in, compares actual seeded scheme counts, starts an offline job through the browser, observes SUCCEEDED, validates/creates a schedule, toggles ON, reloads to verify persistence, toggles OFF, browses history and undated awareness records, opens provenance/version details, compares changes, records evidence for further review, views system health and signs out. Desktop 1440×1000 and mobile 390×844 passed with no page errors or document-level horizontal overflow. Wide tables scroll within their own container. Dialogs support Escape, focus containment and focus restoration.

Screenshots: `frontend/reports/admin-overview-desktop.png` and `admin-overview-mobile.png`. Their numbers are real counts in isolated seeded test databases; they are not production/live metrics. Citizen onboarding, profile persistence, Hindi/Kannada, keyboard interactions, future routes, service errors/loading and local preference recovery all passed unchanged.

## Honest limitations

Atlas inspection was attempted with private configuration and approved network access but failed before capabilities/collections could be read. No Atlas import occurred. PIB policy investigation found an unusable HTML response at robots.txt; no actual RSS feed was collected or activated. data.gov.in access evidence remains incomplete; myScheme is excluded. Stitch native authentication and helper configuration were unavailable, so the admin UI was implemented from existing Calm Civic Editorial references. Physical device, screen-reader, penetration and production multi-process rate-limit testing have not been performed.
