# Scraping feasibility and access-control assessment

**As of 16 November 2026** — research and architecture decision, **not** a crawler authorization.

## Assessment by source class

| Source | Confirmed | Priority method | Permission outcome | Risk |
|---|---|---|---|---|
| myScheme | Public scheme pages; its terms explicitly restrict bots/scrapers | Manual research or ask for written API/bulk-data authorization | **Blocked for automated access absent written permission** | High |
| data.gov.in | Open-data licensing framework and API catalogue | Licensed dataset download or documented API | Dataset-level rights, access and relevance must be checked | Medium |
| PIB | Official public release pages and RSS index | Public RSS if usage terms permit, then linked releases | Feeds identified; licence/robots/polite rate limits outstanding | Medium |
| e-Shram | Structured public scheme content | Prefer authorized download/API; HTML only after policy review | Not cleared | Medium |
| National Scholarship Portal | 2026–27 public scholarship list + linked documents | Public documents and listing, no login | Not cleared; historic guideline editions can be stale | High |
| Seva Sindhu and Seva One | Karnataka service directories | Official catalogues and department PDFs | No confirmed official bulk API or automated collection permission | High |
| Owning ministry / department sites | Official public HTML and PDF guidelines | Manually verify and then permit download only after rights review | Host/path-specific review | Medium |
| PM-KISAN, PMFBY, PMMVY | Public guidance plus citizen authentication | Public notices and official documents; **never** private applications | Public-content permissions pending | High |
| RBI/NPCI/I4C | Consumer fraud awareness pages | Permitted feed or curated public guidance | No permission to bulk-copy inferred | Medium |
| CERT-In | Public technical advisories | Official advisory feed or human-reviewed extraction | Must avoid confusing vulnerability bulletins with citizen scams | Medium |

## Technical pipeline, only after permissions are approved

1. Registry allowlist (host + path + permitted method + expiry + licence) → scheduler.
2. HTTP downloader (retries, timeout, polite delay, conditional HTTP GET if supported).
3. HTML/PDF/RSS/API extraction adapters; unsupported or uncertain source goes to manual queue.
4. Normalize source identity, effective date, section/paragraph provenance and content hash.
5. Validate mandatory fields; reject untrusted new rules into review queue.
6. Store raw permitted source **metadata** and minimal excerpts where licensed; store normalized records and source URL.
7. Compare semantic changes with previous *approved* version; preserve full source/version history.
8. Review rule-changing updates; publish verified records and notify on actual published changes.

## Explicitly disallowed

- Bypassing CAPTCHA, authentication, bot blocks, rate limits or anti-bot services.
- Harvesting Aadhaar, phone numbers, application data, beneficiary lists or user-uploaded documents.
- Inventing undocumented JSON APIs from frontend network traffic and assuming their automated use is allowed.
- Mirroring copyrighted PDF/documents or official symbols without applicable permissions.
- Scheduling myScheme crawling without written authorization.
- Automatically converting AI-extracted scheme criteria into definitive eligibility rules.

## Source authorization record (mandatory before code)

Each entry in `SOURCE_REGISTRY.json` must gain: `termsUrl`, `robotsUrl`, `robotsReviewedAt`, `licenceId`, `citationRequirements`, `allowedPaths`, `disallowedPaths`, `approvedMethod`, `rateLimit`, `authorizationEvidence`, `reviewedBy`, `recheckDate`.

**Open blockers:** robot directives for target hosts were not reliably retrievable in this research environment; existing site terms were not conclusively established for most sites; no approved source API credentials or written myScheme permission have been obtained. Until those checks pass, seed curated records with clear provenance instead of running live crawlers.
