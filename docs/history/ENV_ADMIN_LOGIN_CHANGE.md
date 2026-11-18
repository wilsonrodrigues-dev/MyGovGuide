# Environment admin login — 18 November 2026

Owner-requested simplification of the existing administrator login. No new application phase or component rebuild.

- Credentials: `ADMIN_USERNAME` and `ADMIN_PASSWORD` in ignored `backend/.env`; compared on login. No database administrator lookup, password-hash lookup or database session lookup.
- Login/session/logout work with MongoDB disconnected. Dashboard content, jobs, reviews and operational audit still use MongoDB and report its availability separately.
- Removed admin CSRF generation/headers/checks and the admin-specific mutation Origin check. Citizen sessions, citizen CSRF and citizen ownership validation remain unchanged.
- The existing admin screen now accepts a username. A server-side in-memory session and HttpOnly cookie retain login for eight hours; logout revokes it. Restarting the backend clears sessions. Credentials are never put in frontend variables or browser storage.
- No session secret or database bootstrap is required. The old bootstrap command now checks environment setup only. Historical database users/sessions are preserved but unused for authentication. Authentication events no longer write MongoDB; operational decisions retain their audit trail.
- Private credential fields were added without creating or exposing a default password. Fill them privately and restart the backend. Existing Gemini/database credentials were retained.
- Basic login/API request limits and cookie settings remain. This local in-memory session model uses one backend process; it is not a shared multi-server session store.
- Government-source authorization, AI spending/content-review gates and application data were not changed.

Verification: existing backend/frontend tests, database integration, build and desktop/mobile journeys rerun with environment-only test credentials. API coverage explicitly signs in, restores and logs out with no Origin/CSRF header while MongoDB is disconnected, rejects wrong credentials, denies anonymous dashboard access and confirms data endpoints still report missing MongoDB. Integration verifies zero database admin accounts/sessions were created; citizen security checks remain intact.

Final results: **82 backend + 4 frontend tests, 31 database test nodes and 18 browser journeys passed; build passed.** Secret scan found no configured private values in shareable files; private environment files remain ignored/untracked. All 17 original research hashes and eight collection/verification gate files remain unchanged.

Evidence: [unit output](../../backend/reports/env-admin-unit-tests.txt), [database integration](../../backend/reports/env-admin-integration-tests.txt), [build](../../frontend/reports/env-admin-build.txt), [browser journeys](../../frontend/reports/env-admin-browser-tests.txt).

Setup and session behavior: [admin guide](../guides/ADMIN_DASHBOARD_GUIDE.md).
