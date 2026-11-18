# Phase 2 pilot-source decision — permission-first

**Selected for a human-reviewed data pilot, not for online crawling:**

1. **PIB RSS + PIB-owned releases** — best automated-change-feed candidate because official RSS and an explicit reuse policy exist. **Status: TECHNICAL HOLD** until robots/terms for machine access verified. Never parse PIB releases as automatically enacted policy.
2. **Licensed data.gov.in resources** — best dataset/API candidate **if** a relevant individual dataset is identified and its licence, endpoint, token and access constraints are documented. **Status: DATASET-SPECIFIC HOLD.**
3. **Official department pages/PDFs for 3 controlled examples**: PMUY, PMMVY, and Department of Financial Services PMJJBY/PMSBY. Information is reviewed for research; **online automated extraction not authorized yet.**
4. **Karnataka Shakti and Anna Bhagya district summaries**, plus department-order follow-ups. **Status: HUMAN REVIEW ONLY** pending operative orders and host rules.

**Excluded from automatic collection:** myScheme (explicit contractual prohibition), authenticated citizen portals, beneficiary lists, CAPTCHA/OTP pages, and any source without an evidenced access grant.

### Demonstration data available now

- Research-only hand-curated scheme records (`VERIFIED_SCHEMES.json`), 25 items with source evidence notes.
- Official form references including PDFs and web application entry points, distinctly labelled.
- 12 dated notice research examples and 12 educational scam-awareness categories; these are **not** a live scam-alert feed.
- Zero completely verified deterministic eligibility rule sets; engine must refuse definitive results until sources and rules approved.

### Adapter activation checklist

A live adapter can be activated only after **all** fields are populated:
`sourceId`, `host`, `approvedPaths`, `method`, `sourceTermsUrl`, `rightsBasis`, `robotsUrl`, `robotsObservedAt`, `robotsAllowed`, `rateLimit`, `apiAgreement` (if relevant), `reviewedBy`, `approvalEvidence`, `approvalExpiry`, `testPlan`.

**Recommended first action in Phase 2:** implement schema/validation and imported curated test records, then activate a PIB RSS fetcher only after the technical gate is passed.
