# MyGovGuide backend

Run directly from this folder with Node.js 24:

```powershell
npm install --ignore-scripts
npm run db:local
```

Keep the native MongoDB terminal open. In a second terminal, from backend/:

```powershell
npm run db:check
npm run import:available
npm run collect:fixtures
npm test
$env:MONGODB_TEST_URI='mongodb://127.0.0.1:27018/mygovguide_phase2_test?directConnection=true'
npm run test:integration
npm run dev
```

Configuration is loaded from backend/.env; copy .env.example when needed. The existing database name, replica set, port 27018 and root .local/mongo-test data directory are preserved. Paths resolve from this backend folder. Research now lives in research/phase1; its bytes were checked against the original manifest.

All four research JSON files are now supplied. The full import reads 137 records, including 12 undated awareness topics, with zero rejections; repeating it creates no duplicate versions or changes. Contract fixtures remain explicitly synthetic. Collection authorization defaults to deny; no eligibility rule sets are approved.

Phase 3.5 adds protected administrator APIs, native collection jobs and persisted schedules. Set ADMIN_USERNAME and ADMIN_PASSWORD privately in backend/.env, restart the backend, and run `npm run worker` in a separate terminal. See [admin setup](../docs/guides/ADMIN_DASHBOARD_GUIDE.md), [database configuration](../docs/guides/DATABASE_CONFIGURATION.md), [collection operations](../docs/guides/SCRAPING_OPERATIONS_GUIDE.md) and [scheduler configuration](../docs/guides/SCHEDULER_CONFIGURATION.md). Atlas inspection currently fails at DNS/connectivity; use an explicitly selected local URI for local development. No silent fallback occurs.

## Phase 3 API

POST /api/session creates/resumes an opaque-cookie session. GET /api/profile retrieves only its owning preferences; PUT /api/profile updates exactly state/category/language using the owning cookie, without a separate verification token. DELETE /api/session revokes it. GET /api/schemes/preview returns publication-cleared, reviewed metadata matched to the profile. Research is not published.

The same existing database is used. AnonymousSession is the only added persistence model; it stores a token hash and TTL, not client UUID ownership or citizen application information. CLIENT_ORIGINS must contain exact frontend origins. Production cookies require HTTPS. See the [API/security contract](docs/phase3/API_AND_SECURITY.md).
