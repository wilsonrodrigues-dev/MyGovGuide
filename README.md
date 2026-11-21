# MyGovGuide

MyGovGuide is a Karnataka-first citizen information assistant for government schemes, notices, forms and scam awareness. It provides English, Hindi and Kannada interfaces, optional voice controls, deterministic eligibility checks and an evidence-oriented administrator workspace.

The repository is a JavaScript MERN application. The current codebase contains the implemented demo system and its tests; it is not yet the final redesigned product. The next implementation direction is recorded in [docs/FINAL_REDESIGN_ROADMAP.md](docs/FINAL_REDESIGN_ROADMAP.md).

## Current status

Implemented and covered by automated tests:

- Language-first onboarding, anonymous preferences and editable settings.
- Citizen Home, scheme search/detail, notices, forms, eligibility and scam-awareness routes.
- English, Hindi and Kannada dictionaries and manual voice/search controls.
- Protected administrator workspace with Dashboard, Content and Needs Attention views.
- Existing collection monitor, persisted jobs and authenticated Socket.IO events.
- Government-source adapters, bounded HTTP collection and source-approval gates.
- Gemini primary/secondary and Groq provider routing, Tavily research, ImageKit storage.
- PDF extraction, local OCR with truthful fallbacks, form guidance and deterministic eligibility evaluation.
- Privacy, read-only legacy-database guards and source-version preservation.

Real-content acceptance is still incomplete. Some schemes, forms, notices and scam-awareness entries remain incomplete, unapproved or unsupported. A working fixture or architecture test is not evidence that real government content is complete. The current runtime database is `mygovguide_demo_v2`; legacy `mygovguide_dev` is read-only. The planned `mygovguide_final` database has not been created.

## Technology stack

- Frontend: React 19, Vite, React Router, react-i18next, Tailwind CSS, Lucide, PDF.js, Socket.IO client.
- Backend: Node.js 24, Express 5, Mongoose/MongoDB, Zod, Helmet, CORS, rate limiting.
- Collection and content: Cheerio, RSS Parser, CSV Parse, PDF Parse, Tesseract.js.
- AI and services: Google Gemini, Groq, Tavily, ImageKit.
- Tests: Node test runner, Playwright and isolated MongoDB integration suites.

## Requirements

- Node.js 24.x
- npm 11.x
- MongoDB Community 8 for local integration tests, preferably a replica set on port `27018`
- A reachable MongoDB Atlas or local application database for runtime use

## Installation

From the repository root:

```powershell
npm ci --ignore-scripts
```

The root package uses npm workspaces for `backend` and `frontend`.

## Configuration

Runtime secrets are read only from ignored local environment files. The committed examples contain variable names and safe placeholders:

- [backend/.env.example](backend/.env.example)
- [frontend/.env.example](frontend/.env.example)

Copy the examples to `backend/.env` and `frontend/.env` and fill values privately. Never commit real database URIs, API keys, session secrets, administrator passwords or backups.

Key backend variables:

- `MONGODB_URI`, `MONGODB_DB_NAME` — application database.
- `LEGACY_MONGODB_DB_NAME`, `DENY_LEGACY_DB_WRITES` — legacy read-only protection.
- `MONGODB_TEST_URI` — explicitly named isolated test database.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD` — administrator login.
- `ENABLE_LIVE_COLLECTION` — live collection gate; defaults to `false`.
- `GEMINI_API_KEY_PRIMARY`, `GEMINI_API_KEY_SECONDARY`, `GROQ_API_KEY_PRIMARY` — AI providers.
- `TAVILY_API_KEY`, `TAVILY_ENABLED` — bounded research.
- `IMAGEKIT_API`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`, `IMAGEKIT_UPLOADS_ENABLED` — permitted document hosting.
- `AI_PAID_USE_APPROVED`, `AI_MAX_COST_PER_DAY` — paid-use gate; zero-paid by default.

Frontend variables:

- `VITE_API_BASE_URL` — defaults to `/api`.
- `API_PROXY_TARGET` — local Vite proxy target, normally `http://127.0.0.1:3001`.

## Run locally

Start the local MongoDB replica set if needed:

```powershell
npm run db:local
```

Keep that terminal open. Then start the backend and frontend in separate terminals:

```powershell
npm run dev:backend
```

```powershell
npm run dev:frontend
```

Open `http://127.0.0.1:5173`. The API listens on `http://127.0.0.1:3001`.

The worker is separate:

```powershell
npm run worker
```

Live collection remains disabled unless an approved source, valid expiry and explicit environment gate all match.

## Tests and build

```powershell
npm test
npm run test:integration
npm run build
```

Integration tests require an explicitly isolated database name:

```powershell
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test_cleanup?directConnection=true'
$env:ENABLE_LIVE_COLLECTION='false'
npm run test:integration
```

Browser suites:

```powershell
npm run test:e2e
```

The browser harness starts owned test servers and uses installed Microsoft Edge on Windows. Do not point automated tests at the active Atlas databases, enable live collection, or use real provider calls in fixture runs.

## Repository structure

```text
backend/
  src/                  Express app, routes, models, services and adapters
  scripts/              Operational, migration and recovery scripts
  tests/                Unit and isolated integration tests
  fixtures/             Synthetic contract fixtures
  research/phase1/      Original research datasets and source evidence
  review-packets/       Editorial and source-review packets used by scripts
  config/               Source approvals and demo configuration
  docs/                 Backend contracts, source logs and historical inventories
  reports/              Runtime output directory; generated contents are ignored
frontend/
  src/                  React pages, components, admin workspace, i18n and styles
  tests/                Unit and Playwright browser tests
  scripts/              Test fixture and browser harness scripts
  public/               Local fonts, images and licenses
  reports/              Runtime output directory; generated contents are ignored
docs/
  guides/               Operating, database, AI, collection and quality guides
  history/              Dated implementation, acceptance and cleanup reports
  evidence/             Preserved source evidence
  requirements/         Project synopsis and SRS
  FINAL_REDESIGN_ROADMAP.md
  REPOSITORY_CLEANUP_REPORT.md
.github/workflows/      Manual collection workflow foundation
```

## Documentation

- [Documentation index](docs/README.md)
- [Final redesign roadmap](docs/FINAL_REDESIGN_ROADMAP.md)
- [Repository cleanup report](docs/REPOSITORY_CLEANUP_REPORT.md)
- [Product master plan](PRODUCT_MASTER_PLAN.md)
- [Backend guide](backend/README.md)
- [Frontend guide](frontend/README.md)
- [Demo operations runbook](docs/guides/DEMO_OPERATIONS_RUNBOOK.md)
- [Database configuration](docs/guides/DATABASE_CONFIGURATION.md)

## Data and safety rules

- Do not delete or mutate `mygovguide_dev` or `mygovguide_demo_v2` during development.
- Do not create or seed `mygovguide_final` until Phase 1 begins.
- Do not run live collection, paid AI calls or ImageKit uploads without the corresponding approval and entitlement.
- Do not treat public visibility, HTTP success or AI output as permission, currentness, completeness or approval.
- Keep source versions immutable and preserve genuine owner decisions with their exact reviewed scope.
- Keep credentials, private backups and personal documents out of Git.
