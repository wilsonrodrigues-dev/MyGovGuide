# MyGovGuide backend

Node.js 24, Express 5, Mongoose and MongoDB. The API serves the citizen application, protected administrator workspace, content review and collection jobs.

## Local setup

From this folder:

```powershell
npm install --ignore-scripts
npm run db:local
```

Keep the native MongoDB terminal open. In a second terminal:

```powershell
npm run db:check
npm run import:available
npm run collect:fixtures
npm test
```

For integration tests, select an explicitly isolated local database and keep live collection disabled:

```powershell
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test_cleanup?directConnection=true'
$env:ENABLE_LIVE_COLLECTION='false'
npm run test:integration
```

Start the API with `npm run dev`. Configuration is loaded from ignored `backend/.env`; copy `.env.example` and fill values privately. Never point automated tests or fixture runs at `mygovguide_demo_v2` or the read-only legacy `mygovguide_dev`.

## Worker and administration

Set `ADMIN_USERNAME` and `ADMIN_PASSWORD` privately, restart the API, and run `npm run worker` in a separate terminal. The administrator workspace remains Dashboard, Content and Needs Attention. Collection authorization defaults to deny, and live collection requires an approved source, valid expiry and the explicit environment gate.

See [admin setup](../docs/guides/ADMIN_DASHBOARD_GUIDE.md), [database configuration](../docs/guides/DATABASE_CONFIGURATION.md), [collection operations](../docs/guides/SCRAPING_OPERATIONS_GUIDE.md) and [scheduler configuration](../docs/guides/SCHEDULER_CONFIGURATION.md).

## Session and profile API

`POST /api/session` creates or resumes an opaque-cookie session. `GET /api/profile` returns only the owning preferences; `PUT /api/profile` updates state, category and language using the owning cookie without a separate verification token. `DELETE /api/session` revokes it. `GET /api/schemes/preview` returns publication-cleared metadata matched to the profile. Research records are not published by import alone.

`AnonymousSession` stores a token hash and TTL, not a client UUID ownership grant or citizen application record. `CLIENT_ORIGINS` must contain exact frontend origins; production cookies require HTTPS. See the [API and security contract](docs/phase3/API_AND_SECURITY.md).

## Data rules

- Runtime target is `mygovguide_demo_v2` through private configuration.
- Legacy `mygovguide_dev` is read-only: never seed, initialize indexes, migrate into it or run a worker against it.
- Keep source versions immutable; new evidence creates a new version.
- Do not treat public visibility, HTTP success or AI output as source permission or content approval.
- Generated reports belong under ignored `backend/reports/`.
