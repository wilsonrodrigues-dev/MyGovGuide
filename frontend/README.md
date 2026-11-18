# MyGovGuide frontend

React, Vite, JavaScript, Tailwind CSS, a JavaScript shadcn-style Button using Radix Slot, React Router, Axios, react-i18next and Lucide. No TypeScript source. The implemented Phase 3 screens are onboarding, Home, preferences/language and the source-transparency explanation. Future feature routes are clearly labelled.

From this folder:

```powershell
npm install --ignore-scripts
npm run dev
```

The local URL is http://127.0.0.1:5173. Start the backend in another terminal from backend/ with `npm run dev`. The same-origin Vite proxy forwards /api to the backend on 3001. An optional API_PROXY_TARGET environment variable changes that local proxy target. VITE_API_BASE_URL defaults to /api; no credentials belong in frontend configuration.

```powershell
npm run build
npm test
npm run test:e2e
```

Browser tests require the existing native MongoDB replica set and a current production build. The wrapper starts its own direct Node test servers on 3011 and 4173, runs tests, and closes only those owned processes. It refuses to replace existing listeners. On Windows the tests use installed Microsoft Edge. On other platforms install the matching Playwright Chromium browser first. No physical mobile device has been tested.

Profile preferences are stored locally. An HttpOnly cookie owns the anonymous server session; only its hash is stored in MongoDB. No additional request-verification token is used. There are no session tokens, UUID ownership grants or government application records in localStorage. Failed secure sync is visibly marked and retried on the next visit; cached pending choices are not silently discarded.

The safe preview endpoint currently returns no public schemes because the available dataset is research-only. The UI renders a genuine empty state. The original Phase 1 source/notices JSON files remain missing; synthetic fixtures are not published.

See [design tokens and component specifications](DESIGN_SYSTEM.md), [actual Stitch references](design/stitch/manifest.json), [browser results](reports/e2e-results.json), and [application screenshots](reports/screenshots/). Generated Stitch references are kept outside src/ and public/ and are not embedded as screenshots in the React app. Fonts are local and their licenses are included.
