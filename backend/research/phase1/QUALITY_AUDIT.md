# Phase 1 research integrity & acceptance audit

## What is actually confirmed

- The project handoff and revised 12-phase development order were read.
- 20 central-government research records span student, farmer, woman, worker and senior citizen categories.
- Five Karnataka candidates are tracked separately and marked for state-order verification.
- 18 publicly linked form/document/application resources are catalogued. **Five were visually inspected PDF forms, all connected to the Ujjwala LPG process; the remainder includes web application entry points, guidelines, and references rather than verified downloadable blank forms.**
- 12 notices are historical government announcements; many are not personally actionable and some refer to the same underlying event.
- 12 distinct scam/fraud awareness **topics** are sourced to official citizen-protection organizations. These are not individually timestamped live scams.
- myScheme has an explicit automation restriction. Open Government Data supports licensing at dataset level with attribution and exemptions.

## Corrections to earlier high-level planning

- Do not assume myScheme public pages are legally scrapable.
- Do not assume the National Scholarship Portal 2026–27 scheme list makes older PDFs governing guidelines for this academic year.
- After the Union Cabinet decision on 14 October 2026, the current national social assistance programme name is **Pradhan Mantri Samajik Sahayata Yojana**; IGNOAPS is now **Pradhan Mantri Vridhavastha Pension Yojana**. Keep old names as search aliases.
- PMJJBY/PMSBY serve multiple citizen groups, not only workers; e-NAM/Soil Health Card are services, and SCSS/SSA are savings products, not free direct benefits. Do not mix those in a government grant filter.
- NMMSS 2026–27 **student application deadline passed 15 November 2026**; newer announcements override older extensions.
- Some visible application resources are authenticated; MyGovGuide should never attempt to retrieve private application information or automate official form submissions.

## Fatal publication blockers

| Blocker | Current state | Required clearance |
|---|---|---|
| Crawler legal approval | No per-host/path authorizations completed | Terms/robots/licence recorded; explicit permission if necessary |
| Scheme-rule completeness | Zero of 25 rule sets clause-reviewed and signed off | Active governing document, precise rules & exceptions, independent manual review |
| Karnataka current entitlement | Five state candidates need operative government orders | State department order/notification, service entry point, edition verification |
| Time-bound schemes | 2026–27 NSP windows change and may expire | Date-aware recheck, application and verification stage separation |
| Source/URL reliability | Public pages sampled; no bulk URL reliability/HTTP validation | Phase 2 source-by-source endpoint tests and monitored failures |
| Privacy | Planning complete, but system not built | Enforce no-PII ingestion and anonymous session ownership |
| API credentials | Not held by research assistant | Owner creates API keys and verifies quotas/terms |

## Phase gate

- **Phase 1 inventory/research package:** assembled with transparent limitations.
- **Phase 1 sign-off for unattended live scraping:** **NOT APPROVED**.
- **Phase 2 allowed preliminary work:** architecture, staging DB schemas, curated seed import, validation/QA tooling, and permission-cleared source adapters only.
- **Phase 2 disallowed until clearance:** myScheme crawling and any unreviewed source automated content harvesting.

## Recommended manual review protocol for each scheme

1. Identify owner department, 2026–27 programme status, current primary order and amendments.
2. Inspect exact current source text/page/PDF, version, effective date and application window.
3. Capture line/page/section for benefit, eligibility criteria, exclusions, documents and how to apply.
4. Translate complex AND/OR logic into reviewable rules; add unknown/manual conditions.
5. Compare output against three test profiles (eligible, ineligible and insufficient-information).
6. Have a second reviewer or explicit review record sign off; set `APPROVED` only after agreement.
7. Re-evaluate whenever a source has materially changed.

## Key audit references

- myScheme terms: https://search.myscheme.gov.in/terms-of-use
- Government Open Data License: https://data.gov.in/Godl
- NSP current scheme list: https://scholarships.gov.in/All-Scholarships
- NMMSS October 2026 deadline extension: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330936&lang=1&reg=3
- 2026 national pension programme rename: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2326529&lang=1&reg=48
- PMUY original KYC PDF: https://pmuy.gov.in/documents/Ujjwala-KYC_englishnew.pdf
- NPCI citizen scam awareness: https://www.npci.org.in/fraud-awareness
- Bhashini API onboarding/use scope: https://bhashini.gitbook.io/bhashini-apis
