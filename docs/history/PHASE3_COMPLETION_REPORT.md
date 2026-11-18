# MyGovGuide restructuring and Phase 3 completion

**Verified: 17 November 2026 (Asia/Kolkata).**

The local restructuring, UI foundation, onboarding, personalized Home, multilingual preferences and secure anonymous-profile integration are implemented. The existing Phase 2 pipeline remains functional. No site was deployed and no government source was scraped.

## Restructuring and preserved data

- The two application folders are **backend/** and **frontend/**. The previous server/client folders are gone.
- Backend implementation, scripts, fixtures, tests and reports are in backend/. Original research is in backend/research/phase1; the original handoff/blueprint are in backend/docs/specifications; technical documentation is in backend/docs/.
- Native MongoDB keeps the existing database name `mygovguide_phase2`, replica set, port 27018 and root .local/mongo-test storage. The service on 27017 and existing databases were not deleted or reconfigured.
- The previous container setup file and operational instructions were removed. Native MongoDB is the supported local setup.
- All **17 original research/specification files passed byte-for-byte SHA-256 preservation checks**. [Move evidence](../../backend/reports/restructure-preservation.json) and [final workspace audit](../../backend/reports/phase3-workspace-audit.json) record the checks.
- The original 59 Phase 2 tests were rerun after the move before frontend feature work began. Five original substantive MongoDB scenarios passed; the missing-package scenario was skipped honestly. [Part A verification](RESTRUCTURE_VERIFICATION.md).

## Implemented Phase 3 functionality

| Area | Result |
|---|---|
| Frontend | React, Vite, JavaScript, Tailwind, Radix/shadcn-style Button, Router, Axios, react-i18next and Lucide |
| Onboarding | State/union territory, eight citizen categories and English/Hindi/Kannada; no account or personal identifiers |
| Preferences | Validated local persistence, secure server sync, editing, pending-change recovery and accurate unavailable/visit-only states |
| Personalized Home | State/category context, language switcher, search navigation, five primary action cards, profile editing and source transparency |
| Public scheme previews | Read-only reviewed/publication-cleared metadata matched to the owning profile; current research correctly produces an empty state |
| Anonymous ownership | Server-generated high-entropy HttpOnly cookie, hash-only token storage, TTL and request-time expiry checks |
| Mutation protection | CSRF tokens, explicit allowed origins, input validation, write limits and ownership derived from the cookie, not client UUIDs |
| Multilingual UI | Matching static translation keys, translated states/categories, bundled Noto fonts, persistent language and script-sensitive wrapping |
| Responsive/accessibility foundation | Desktop/mobile navigation, native radio/select keyboard behavior, skip link, visible focus, reduced motion and checked core contrast pairs |
| Voice controls | Browser-dependent speech recognition/read-aloud with typing fallback; no claim of on-device speech processing |

Backend routes: POST/GET/DELETE /api/session; GET/PUT /api/profile; GET /api/schemes/preview. The existing health and data-status endpoints remain. The single added AnonymousSession model uses the existing application database. [API/security details](../../backend/docs/phase3/API_AND_SECURITY.md).

No session secret or client ownership UUID is stored in localStorage. Unsynced local choices are not silently replaced with older server values. The frontend rejects previews whose server matching criteria differ from the preferences it displays.

## Actual Stitch deliverables

- Private project: **projects/16872371074444001614**.
- Shared system: **Calm Civic Editorial**, **assets/f4f532eee653402a9fea5b48978c8032**.
- **14 real generated screens**, each with a unique resource and preserved generation artifact: Home, Onboarding, Scheme Discovery, Scheme Details, Eligibility Checker, Eligibility Results, Forms Library, Form Guidance, Notice Explainer, Notice Action Checklist, Scam Alerts, Notifications/Change Radar, Profile/Language Settings, and Optional Login/Bookmarks.
- The list endpoint returned ten entries; direct get_screen reads verified the other four. All **14 references were independently verified**. [Verification](../../frontend/design/stitch/verification.json), [screen manifest](../../frontend/design/stitch/manifest.json), [shared theme](../../frontend/design/stitch/design-system.json), [downloaded Home reference](../../frontend/design/stitch/home-reference.png).
- Stitch initially was not exposed as a native tool, so the configured MCP endpoint was used directly with credentials held only in memory. Native tools later became visible, but their read returned **Authentication required**. Direct MCP generation and final reads succeeded; that native-connection issue does not invalidate the saved design artifacts.
- [DESIGN_SYSTEM.md](../../frontend/DESIGN_SYSTEM.md) records actual generated theme values and deliberate React overrides for warm paper, accessible text and multilingual fonts. Generated references include illustrative copy and an unsupported old-cycle stamp; these are not government evidence and were not copied into the application. The React app uses real components, not an embedded screenshot.

## Actual final verification

| Check | Final actual outcome |
|---|---|
| Backend unit/component tests | **63 passed**, including all original 59 plus four profile-security contract tests |
| Frontend contract/translation/storage/contrast tests | **4 passed** |
| MongoDB integration | **11 substantive scenarios passed**, **1 missing-input scenario skipped**; Node totals include two parent tests: **13 passed, 1 skipped** |
| Frontend production build | **Passed** with local Latin, Devanagari and Kannada font assets |
| Edge browser journeys | **12 passed**, zero failed/skipped/flaky; desktop and mobile projects |
| Narrow viewport checks | Kannada onboarding has no horizontal overflow at 390, 360 and 320px |
| Native MongoDB | Connected with transactions; original data retained |
| Existing research imports | Two post-move runs: **43 unchanged** each; zero rejections or new change events |
| Existing offline collection | Two post-move runs: **4 unchanged** each; zero failed sources or new change events |
| HTTP foundation | Health and data-status smoke checks passed after restructuring |
| Source release gates | Zero approved live sources and zero approved rule sets |
| Workspace audit | Original bytes preserved, no obsolete application folders/container artifacts, no configured credential value found in source |

Actual evidence: [component output](../../backend/reports/phase3-component-tests.txt), [integration output](../../backend/reports/phase3-integration-tests.txt), [profile DB evidence](../../backend/reports/profile-integration.json), [build output](../../frontend/reports/build.txt), [browser JSON](../../frontend/reports/e2e-results.json), [browser output](../../frontend/reports/e2e-run.txt), [screenshots ](../../frontend/reports/screenshots/), [current data status](../../backend/reports/phase2-status.json).

Browser checks cover onboarding validation, real API persistence, state/category edits, language switching/reload, all action routes and search, keyboard radios/skip link, honest loading/error/retry states, offline-to-online sync and Unicode rendering. Backend scenarios exercise ownership isolation, UUID/ID rejection, CSRF, origin checks, cookie attributes, hash storage, expiry/revocation and the preview release gate.

During verification, Windows npm/cmd test-server teardown initially stalled after successful scenarios. A direct Node process wrapper now closes only owned test servers. A later full run failed because the native MongoDB process had stopped; the same replica set was restarted from existing files and the complete database/browser checks passed again. The browser runner now fails immediately with a useful message if the database is unavailable. No assertions were removed or relaxed to hide those failures.

## Future features and external limits

1. SOURCE_REGISTRY.json and NOTICES_AND_ALERTS.json are still absent from **backend/research/phase1/**. Synthetic files under fixtures/research-package are not originals. Full-package acceptance remains blocked; the skip is not counted as a pass.
2. All 25 actual schemes remain research-only. All 25 rule sets remain incomplete. No source permission, publication clearance, current deadline or eligibility decision was invented.
3. Discovery/details, eligibility/results, notice/checklist, forms/guidance, scam feeds, notifications, accounts and bookmarks are future routes with explicit upcoming states. Their Stitch designs are references, not implemented citizen features.
4. Native Stitch tool authentication still needs configuration/session attention. A literal credential was briefly exposed by the first connection diagnostic; rotate it if it has not already been replaced. No credential was copied into application source.
5. Physical phones, screen readers, native-speaker translation review and actual speech quality were not tested. Automated Edge viewport/font checks are the tested scope.
6. No Gemini citizen feature, production deployment, external outreach or live government collection was performed.

## Run and inspect

```powershell
npm ci --ignore-scripts
npm run db:local
```

Keep the database terminal open. Run the backend and frontend in separate terminals:

```powershell
npm run dev:backend
npm run dev:frontend
```

Open **http://127.0.0.1:5173**. To reproduce verification:

```powershell
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run build
npm run test:e2e
```

See [root setup](../../README.md), [backend setup](../../backend/README.md), [frontend setup](../../frontend/README.md), [progress](../../PROGRESS.md), and [complete source inventory](../../backend/docs/phase2/PROJECT_STRUCTURE.txt). Browser test servers are closed after checking; native MongoDB is intentionally preserved for continued development.
