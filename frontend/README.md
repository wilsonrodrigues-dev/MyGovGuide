# MyGovGuide frontend

React 19, Vite, JavaScript, Tailwind CSS, React Router, Axios, react-i18next, Lucide, PDF.js and Socket.IO client. There is no TypeScript source.

Implemented routes include language-first onboarding, Home, settings, scheme discovery/detail, notices, forms, deterministic eligibility, scam awareness and the protected administrator workspace. English, Hindi and Kannada dictionaries are included. Optional voice controls use the browser speech APIs and expose truthful unsupported states.

From this folder:

```powershell
npm install --ignore-scripts
npm run dev
```

The local URL is `http://127.0.0.1:5173`. Start the backend in another terminal from `backend/` with `npm run dev`. The same-origin Vite proxy forwards `/api` to the backend on `3001`. `API_PROXY_TARGET` changes the local proxy target. `VITE_API_BASE_URL` defaults to `/api`. No credentials belong in frontend configuration.

```powershell
npm run build
npm test
npm run test:e2e
```

Browser tests require a current production build and the isolated test setup described in the root README. The wrapper starts owned test servers on ports `3011` and `4173`, runs Playwright, and closes only those processes. On Windows it uses installed Microsoft Edge. On other platforms install the matching Playwright Chromium browser. Automated mobile viewports are not physical-device testing.

Profile preferences are stored locally. An HttpOnly cookie owns the anonymous server session; only its hash is stored in MongoDB. No session token, UUID ownership grant or government application record is stored in localStorage. Failed secure sync is visibly marked and retried safely.

Generated browser reports and screenshots are written under the ignored `reports/` directory. Pre-cleanup artifacts were removed on 21 November 2026 and remain in the local recovery branch. See [design tokens and component specifications](DESIGN_SYSTEM.md) and [asset licenses](ASSET_LICENSES.md). Fonts are local and their licenses are included.
