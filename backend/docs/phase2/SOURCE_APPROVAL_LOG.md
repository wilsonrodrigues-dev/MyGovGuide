# Current source decision — 18 November 2026

NDMA SACHET RSS `live-ndma-sachet-rss` is approved only for its exact official RSS metadata endpoint, until 25 November. Explicit official RSS and redistribution guidance supports use; robots returned 404. Two guarded worker runs returned 200 (100 Notices and SourceVersions) then 304 (no writes). Income Tax RSS permission evidence exists, but guarded HTTP403 prevented ingestion; its approval is revoked/disabled. No source security control was bypassed. Original research source denials remain unchanged. [Full authorization evidence and HTTP receipts](../../../docs/history/REAL_DATA_COLLECTION_REPORT.md).

Earlier decisions follow unchanged.

# Source approval log

## Phase 3.6 policy recheck — 18 November 2026 (local date)

No automation approvals were added. PIB RSS directory/copyright policy were reachable during limited policy review, but `/robots.txt` was HTTP 200 HTML reporting an unavailable page; no valid automation allowance was established. `https://www.data.gov.in/robots.txt` returned `User-agent: *` with `Disallow: /`. Do not collect datasets or RSS from that host. Official [OGD help](https://data.gov.in/help) documents API-key access; a separately authorized API host/resource, private key and applicable dataset license still need review. myScheme remains excluded pending written permission.

Source-specific PIB parsing and conditional HTTP behavior are fixture-tested only. AI fact review does not authorize collection. Current results are in [Phase 3.6 completion](../../../docs/history/PHASE3_6_COMPLETION_REPORT.md). The generated source-policy receipt was removed during the 21 November 2026 cleanup and remains in the local recovery branch. Government live runs remain zero.

## Phase 3.5 update — 17 November 2026

All four research JSON files are now supplied. The registry's 70 original permission decisions remain deny-only. No source has been activated, and the live approval file remains empty. Current evidence and bounded direct probes are documented in [collection operations](../../../docs/guides/SCRAPING_OPERATIONS_GUIDE.md); the raw pre-cleanup receipts remain in the local recovery branch.

PIB's copyright policy permits attributed accurate reuse of its own material with third-party exclusions, but `/robots.txt` returned an HTML unavailable page rather than a usable policy. The RSS index redirected to a region/language URL. This is insufficient evidence to approve unattended access. The candidate PIB RSS parser has synthetic format tests only. data.gov.in remains an investigation candidate without an established suitable endpoint and access evidence. myScheme remains excluded by its written-authorization requirement.

The new dashboard stores evidence separately from activation and requires a separate validation step. The dedicated native worker reads MongoDB schedules; no GitHub Actions cron rewriting occurs. This update supersedes the older missing-file and commented-scheduler notes below; the original phase evidence is retained for audit.

Generated 2026-11-17T13:31:06.234Z. Original source decisions: [Phase 1 CSV](../../research/phase1/SOURCE_PERMISSION_DECISIONS.csv). No approvals have been fabricated. 70 evidence rows are preserved below; none permits live collection.

Live configuration: backend/config/source-approvals.json is empty. ENABLE_LIVE_COLLECTION defaults to false. Public access, content reuse rights, and robot access are separate. myScheme remains excluded even if a malformed local approval is supplied.

| ID | Source | Live | Unresolved decision | Supporting evidence |
|---|---|---|---|---|
| S01 | [myScheme](https://www.myscheme.gov.in/) | DENIED | BLOCKED_UNTIL_WRITTEN_PERMISSION | [evidence](https://search.myscheme.gov.in/terms-of-use) |
| S02 | [National Portal of India — Schemes](https://www.india.gov.in/my-government/schemes) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S03 | [Open Government Data (OGD) India](https://data.gov.in/) | DENIED | DATASET_SPECIFIC_APPROVAL_NEEDED | [evidence](https://data.gov.in/policies) |
| S04 | [National Scholarship Portal — schemes](https://scholarships.gov.in/All-Scholarships) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://scholarships.gov.in/All-Scholarships) |
| S05 | [e-Shram — Schemes](https://www.eshram.gov.in/Schemes) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.eshram.gov.in/Schemes) |
| S06 | [MSME Ministry — schemes and services](https://www.msme.gov.in/offerings) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S07 | [MSME RAMP scheme guidelines](https://ramp.msme.gov.in/ramp/index.php/scheme-guidelines) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S08 | [PM-KISAN](https://pmkisan.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://pmkisan.gov.in/) |
| S09 | [PM-KISAN revised operational guidelines](https://pmkisan.gov.in/Documents/RevisedPM-KISANOperationalGuidelines%28English%29.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S10 | [National Scholarship Portal — eligibility guidance](https://scholarships.gov.in/scholarshipEligibility/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S11 | [PMAY-G](https://pmayg.dord.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| S12 | [National e-Gazette](https://egazette.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| K01 | [Karnataka Seva One](https://sevaone.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://sevaone.karnataka.gov.in/) |
| K02 | [Seva Sindhu](https://sevasindhu.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://sevasindhu.karnataka.gov.in/) |
| K03 | [Karnataka Directorate of Minorities](https://dom.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| K04 | [Karnataka Labour Welfare Board](https://klwb.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| K05 | [Karnataka Revenue Department](https://revenue.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| K06 | [Seva One / Karnataka department catalogue](https://sevaone.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| N01 | [Press Information Bureau](https://www.pib.gov.in/) | DENIED | POTENTIAL_RSS_AFTER_ROBOTS_AND_ACCESS_REVIEW | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| N02 | [PIB RSS index](https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=1) | DENIED | POTENTIAL_RSS_AFTER_ROBOTS_AND_ACCESS_REVIEW | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| N03 | [PIB press release RSS](https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=1) | DENIED | POTENTIAL_RSS_AFTER_ROBOTS_AND_ACCESS_REVIEW | [evidence](https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=1) |
| C01 | [National Cyber Crime Reporting Portal — Awareness](https://cybercrime.gov.in/Webform/CyberAware.aspx) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| C02 | [MyGov Cybercrime Awareness 2026](https://www.mygov.in/campaigns/cybercrime-awareness-campaign-2026/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| C03 | [RBI Kehta Hai](https://rbikehtahai.rbi.org.in/index.html) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| C04 | [RBI Cautions](https://www.rbi.org.in/Scripts/RBICautions.aspx) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| C05 | [NPCI Fraud Awareness](https://www.npci.org.in/fraud-awareness) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| C06 | [CERT-In advisory index](https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST) |
| C07 | [CERT-In 2026 advisories](https://www.cert-in.org.in/s2cMainServlet?pageid=PUBADVLIST02&year=2026) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X001 | [Authority reference: PM-USP Central Sector Scholarship for College and University Students](https://www.education.gov.in/sites/upload_files/mhrd/files/upload_document/FAQs_PM_USP2526.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X002 | [Authority reference: National Means-cum-Merit Scholarship Scheme (NMMSS)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330936&lang=1&reg=3) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X003 | [Authority reference: AICTE Pragati Scholarship for Girl Students (Technical Degree)](https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2010_G.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X004 | [Authority reference: AICTE Saksham Scholarship (Technical Degree)](https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2012_G.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X005 | [Authority reference: PM YASASVI Top Class Education in College (OBC/EBC/DNT)](https://socialjustice.gov.in/schemes/101) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X006 | [Authority reference: Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)](https://www.pmkisan.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X007 | [Authority reference: Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330171&lang=1&reg=3) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X008 | [Authority reference: Pradhan Mantri Fasal Bima Yojana (PMFBY)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304549&lang=1&reg=48) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X009 | [Authority reference: Pradhan Mantri Fasal Bima Yojana (PMFBY)](https://pmfby.gov.in/faq) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X010 | [Authority reference: Kisan Credit Card (KCC)](https://financialservices.gov.in/agriculture-credit) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X011 | [Authority reference: Kisan Credit Card (KCC)](https://www.financialservices.gov.in/jansamarth) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X012 | [Authority reference: Soil Health Card Programme](https://soilhealth.dac.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X013 | [Authority reference: Soil Health Card Programme](https://support.soilhealth.dac.gov.in/kb/faq.php?id=38%3Fid%3D38&lang=en-US) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X014 | [Authority reference: National Agriculture Market (e-NAM) Farmer Registration](https://enam.gov.in/resources/registration-guideline) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X015 | [Authority reference: Pradhan Mantri Matru Vandana Yojana (PMMVY)](https://www.wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X016 | [Authority reference: Pradhan Mantri Matru Vandana Yojana (PMMVY)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2270668&lang=1&reg=3) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X017 | [Authority reference: Pradhan Mantri Matru Vandana Yojana (PMMVY)](https://spniwcd.wcd.gov.in/pradhan-mantri-matru-vandana-yojna/faqs) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X018 | [Authority reference: Pradhan Mantri Ujjwala Yojana (PMUY/Ujjwala 2.0)](https://pmuy.gov.in/Ujjwala2.html) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X019 | [Authority reference: Pradhan Mantri Ujjwala Yojana (PMUY/Ujjwala 2.0)](https://pmuy.gov.in/documents/Ujjwala-KYC_englishnew.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X020 | [Authority reference: Pradhan Mantri Ujjwala Yojana (PMUY/Ujjwala 2.0)](https://pmuy.gov.in/faq.html) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X021 | [Authority reference: Pradhan Mantri Ujjwala Yojana (PMUY/Ujjwala 2.0)](https://pmuy.gov.in/documents/Supplementary%20KYC.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X022 | [Authority reference: Sukanya Samriddhi Account (SSA)](https://www.nsiindia.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X023 | [Authority reference: Sukanya Samriddhi Account (SSA)](https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X024 | [Authority reference: Janani Suraksha Yojana (JSY)](https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X025 | [Authority reference: Pradhan Mantri Shram Yogi Maandhan (PM-SYM)](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2293891&lang=2&n=csc&reg=48) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X026 | [Authority reference: Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)](https://financialservices.gov.in/pmjjby) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X027 | [Authority reference: Pradhan Mantri Suraksha Bima Yojana (PMSBY)](https://financialservices.gov.in/pmsby) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X028 | [Authority reference: Pradhan Mantri Vridhavastha Pension Yojana](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323266) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X029 | [Authority reference: Pradhan Mantri Vridhavastha Pension Yojana](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2326529&lang=1&reg=48) | DENIED | MANUAL_RESEARCH_ONLY | [evidence](https://www.pib.gov.in/content/3604_2_CopyrightPolicy.aspx?lang=1&reg=6) |
| X030 | [Authority reference: Senior Citizens Savings Scheme (SCSS)](https://www.nsiindia.gov.in/writereaddata/SchemeRules/SeniorCitizensSavingsSchemeRule.pdf) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X031 | [Authority reference: Rashtriya Vayoshri Yojana (RVY)](https://socialjustice.gov.in/index.php/schemes/43/archive) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X032 | [Authority reference: Gruha Lakshmi](https://fpibengaluru.karnataka.gov.in/) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X033 | [Authority reference: Yuva Nidhi](https://varthe.karnataka.gov.in/newsdetails/6911cd3790ac450c69745b53) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| X034 | [Authority reference: Anna Bhagya](https://www.ahara.karnataka.gov.in/Home/AnnaBhagyaYojana) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| P01 | [myScheme official terms](https://search.myscheme.gov.in/terms-of-use) | DENIED | DO_NOT_CRAWL | [evidence](https://search.myscheme.gov.in/terms-of-use) |
| P02 | [Government Open Data License India](https://data.gov.in/Godl) | DENIED | REFERENCE_ONLY | [evidence](https://data.gov.in/policies) |
| P03 | [OGD India data terms](https://www.data.gov.in/terms-of-use) | DENIED | REFERENCE_ONLY | [evidence](https://data.gov.in/policies) |
| A11 | [Bhashini developer onboarding](https://bhashini.gitbook.io/bhashini-apis/pre-requisites-and-onboarding) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| A12 | [Noto Sans Kannada OFL](https://github.com/google/fonts/blob/main/ofl/notosanskannada/OFL.txt) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| A13 | [Material Symbols documentation](https://developers.google.com/fonts/docs/material_symbols) | DENIED | MANUAL_RESEARCH_ONLY | Evidence pending |
| D01 | [OGD PM-KISAN aggregate catalogue](https://data.gov.in/catalog/pm-kisan-scheme) | DENIED | DATASET_SPECIFIC_APPROVAL_NEEDED | [evidence](https://data.gov.in/policies) |
| D02 | [OGD NSAP historical beneficiary catalogue](https://data.gov.in/catalog/national-social-assistance-programmensap-beneficiaries-abstract) | DENIED | DATASET_SPECIFIC_APPROVAL_NEEDED | [evidence](https://data.gov.in/policies) |

## Offline adapters

- fixture-api: api; local api.json; synthetic, offline only.
- fixture-rss: rss; local feed.xml; synthetic, offline only.
- fixture-html: html; local page.html; synthetic, offline only.
- fixture-pdf: pdf; local document.pdf; synthetic, offline only.

## Supplemental URL identities

The partial importer creates stable deny-only Source identities for actual official URLs in supplied research. These are labelled SUPPLEMENTAL_RESEARCH_REFERENCE; they do not substitute for the missing 70-entry SOURCE_REGISTRY.json. Current database counts are generated at runtime; the pre-cleanup receipt remains in the local recovery branch. No field-name labels in form metadata are citizen application data.

## Before activation

Obtain source-specific access and reuse evidence; review host, exact paths, method, robots URL/observation/permission, terms, rights basis, API agreement if relevant, reviewer, expiry, rate limit and test plan. Add the reviewed record to the approval file and call the internal approveSource service to record a matching database decision. Validate with registry:validate, inspect collect:dry-run, and set ENABLE_LIVE_COLLECTION=true only after both approvals match. Scheduling remains commented out.


**18 November 2026, after Atlas migration:** Current NDMA robots404/feed-policy200 checked; same exact RSS scope and original 25 November expiry retained. Config was separately saved, validated and activated in Atlas. Two genuine jobs: 200/100 unchanged, then304/no writes. No schedules created. Other sources remain inactive. The collection receipts were removed during the 21 November 2026 cleanup and remain in the local recovery branch.
