# Phase 3 anonymous preferences and previews

The existing Express application, MongoDB connection/database and Scheme model are reused. AnonymousSession is the only new persistence model. No new production database or account system was introduced.

| Endpoint | Contract |
|---|---|
| POST /api/session | Empty object only; random cookie or resume; returns profile and expiry |
| GET /api/session | Owning cookie; own profile/expiry |
| GET /api/profile | Owning cookie; own preferences only |
| PUT /api/profile | Owning cookie and trusted origin; strict state/category/language body |
| DELETE /api/session | Cookie and trusted origin; revoke own session and clear cookie |
| GET /api/schemes/preview?q= | Completed owning profile; at most 120 search characters and four safe previews |

No client UUID or profile-ID route authorizes access. Errors retain `{error:{code,message}}`: invalid preferences 422; absent/expired sessions 401; disallowed origin 403; unavailable database 503. Sensitive responses use no-store. Writes have bounded in-process rate limits; raw tokens/errors are not logged.

## Sessions

Tokens contain 32 random bytes encoded as base64url. Only their SHA-256 hash is stored, together with the three preferences and a fixed 30-day expiry. Unique hash and TTL indexes are explicitly initialized after connection. Each request checks expiry independently of eventual TTL cleanup.

Development cookies are HttpOnly, SameSite=Strict and scoped to /api. Production adds Secure, Path=/ and the __Host- prefix, with no Domain. CORS grants credentials to exact configured origins; mutation middleware separately validates Origin and cross-site Fetch Metadata. No separate verification token is generated, returned, stored by the frontend or required on writes. The owner requested this simplification on 18 November 2026.

Clearing a cookie loses that server session. Locally saved preferences can initialize a new anonymous session, without recovering another person's data. These are preferences, not government-benefit applications.

The implementation distinguishes [cookie attributes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Set-Cookie), [CORS response permissions](https://expressjs.com/en/resources/middleware/cors/), and server authorization. Future deployment requires HTTPS and exact production origins.

## Preview release gate

The Scheme query requires PUBLISHED, a reviewed trust status, active programme state, fresh cache, approved version pointer, human review date and publication-rights evidence. Effective dates and server-owned state/category preferences filter the records. Search is escaped and only title, source URL, review date and classification are projected. EligibilityAvailable stays false in this Phase 3 endpoint.

The frontend also checks returned profile criteria against visible preferences, preventing unsynced changes from displaying another profile selection's previews. Research remains internal; the current public result is empty. Synthetic published fixtures exist only inside isolated test databases.

## Limits

Tests do not constitute a penetration test or production certification. Physical-device, screen-reader, native-speaker and voice-quality reviews remain separate. Future accounts, uploads, eligibility and AI features need their own authorization/privacy work.
