# Phase 1 closure audit — 2026-11-16

## Decision: RESEARCH COMPLETE; SOURCE AUTHORIZATION AND OPERATIVE RULE SIGN-OFF STILL BLOCKED

This is the most rigorous conclusion supported by the accessible evidence. It is **not** a claim that the complete set of government webpages may be scraped, that all scheme rules are current, or that all original Karnataka government orders have been obtained.

### Work actually completed

- Audited the original 70 government/source-reference entries, including explicit restriction and permission status for each in `SOURCE_PERMISSION_DECISIONS.csv`.
- Cross-referenced 25 scheme records with an official source and wrote fact-level verification and missing-evidence notes for each in `SCHEME_VERIFICATION_MATRIX.csv` and `VERIFIED_SCHEMES.json`.
- Checked the five Karnataka guarantee programmes against available government-operated summaries; documented failure to obtain current original operative orders for all five.
- Confirmed myScheme's express written-authorization requirement; confirmed PIB copyright reuse policy and official RSS directory; distinguished OGD dataset licensing from ordinary portal content rights.
- Reclassified all records into research-only / independently fact-checked / fully approved operative rule states.
- Selected a permission-first potential pilot and documented a **default-deny allowlist** design.
- Preserved original forms, notice and scam-awareness research inventories, without treating portal links as actual downloadable forms or educational topics as live incidents.

### Final gate results

| Gate | Outcome | Why |
|---|---|---|
| G1 — initial official source registry | **PASS** | 70 referenced entries, documented and classified |
| G2 — scheme/source evidence inventory | **PASS (research level)** | 25 records with individual official evidence pointer, limitations and review class |
| G3 — original current Karnataka operative order verification | **BLOCKED** | Five programmes have government summaries or reports, but not a complete current GO/amendment chain |
| G4 — source-specific scraping permission and robots approval | **BLOCKED** | Host robots access unavailable, multiple source terms unconfirmed, myScheme explicitly prohibits automation |
| G5 — vetted eligibility rule data | **BLOCKED** | 0/25 whole rule sets reviewed against all operative clauses / exceptions |
| G6 — data models and release gates | **PASS** | `DATA_REQUIREMENTS.md`, `DATASET_CLASSIFICATION_AND_RELEASE.md` |
| G7 — research assets and references | **PASS** | forms, notices, scam research assets and metadata classified |
| G8 — unattended scraper activation | **BLOCKED** | 0 source adapters have complete authorization/access evidence |

**What this means:** Phase 1 *planning and research* can be archived as delivered. A claim that *all source permissions and scheme-law verifications are complete* would be false. Phase 2 can start only with non-network data/schema/validation work and research-only seed import. No live scraper or final eligibility checker should be enabled until their gates are signed off.

### Exact remaining external dependencies (cannot be fabricated)

1. Confirm robots/automated access policies for selected hosts in a networked environment.
2. Obtain myScheme written permission **only if** scraping its pages is desired, otherwise keep it excluded indefinitely.
3. Select specific OGD datasets with verified licence, usable API and allowed request method.
4. Obtain current Karnataka GO numbers, PDFs and amendments from responsible departments.
5. Have all per-scheme eligible/not-eligible rule sets approved against the exact operative clauses.
6. Provision project-specific keys/account permissions if the owner elects to use an authenticated API.

### Key source-evidence URLs

- https://search.myscheme.gov.in/terms-of-use
- https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6
- https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=1
- https://data.gov.in/policies
- https://scholarships.gov.in/All-Scholarships
- https://www.eshram.gov.in/Schemes
- https://pmuy.gov.in/ujjwala2.html
- https://www.wcd.gov.in/women/pradhan-mantri-matru-vandana-yojna
- https://bengaluruurban.nic.in/en/scheme/shakti-scheme/
- https://bengaluruurban.nic.in/en/scheme/anna-bhagya/
- https://www.pib.gov.in/PressReleasePage.aspx?PRID=2326529&lang=1&reg=48
