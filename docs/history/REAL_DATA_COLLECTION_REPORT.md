# Real government collection and five-scheme preparation — 18 November 2026

Subsequent same-day update: the owner approved copying content/review records to Atlas. Those records, including all 15 Gemini artifacts, now reside in Atlas `mygovguide_dev`; original local data remains preserved. [Current environment and storage verification](ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md).

This executes the owner's real-data priorities in the existing application. [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md) remains authoritative. No new dashboard, frontend redesign, repository restructuring or implementation phase was created.

## Actual outcome

- **One active authorized source:** NDMA SACHET's public RSS feed.
- **100 genuine notices stored**, with 100 immutable source versions, official links, original summaries, publisher attribution, publication dates, fetched timestamps and provenance.
- A second guarded worker run sent the stored ETag and received **HTTP 304**: no response body, no reparsing, no additional records/versions. The database retains exactly 100 source notices.
- **Five existing research schemes** received new source-evidence versions. The owner explicitly approved their limited fact packets for AI preparation; **five source-fact review snapshots** were recorded through the existing admin API.
- **15 real Gemini artifacts:** 5 English + 5 Hindi + 5 Kannada, all validated and `REVIEW_PENDING` in the application database.
- **Zero published schemes/indexes/publication events; zero approved eligibility rule sets; zero paid generation requests.**

These are actual application-database operations, not isolated fixture success. The scheme source-document research is **CURATED_PUBLIC**, distinct from the **LIVE** NDMA records. No claim is made that NDMA notices are schemes or that the stored warnings are currently active.

## 1. Ordered source investigation

| Candidate | Endpoint/access and rights findings | Result |
| --- | --- | --- |
| PIB RSS | Official [RSS index](https://www.pib.gov.in/ViewRss.aspx?lang=1&reg=1) and [copyright policy](https://www.pib.gov.in/content/102_2_Copyright-Policy.aspx?lang=1&reg=30) exist; attributed accurate reuse excludes third-party material. Robots URL again returned HTTP200 unavailable-page HTML, not a usable policy. | Retained blocked for collection; no genuine PIB collector run. Individually inspected PIB documents for curated fact research are not RSS scraping or eligibility-rule approval. |
| OGD/data.gov.in | Dataset APIs are documented, with resource-specific access/license review and suitable API credentials needed. Portal robots returned `Disallow: /`; API host robots returned 404, which does not itself supply credentials or a dataset grant. | No portal crawling or API dataset collection; no API credential was borrowed or fabricated. |
| RBI | Official RSS documentation invites subscriptions; policy probes returned HTTP418 unauthorized-access responses. | No attempt to bypass restriction. |
| Income Tax Department | [Official subscription instructions](https://www.incometaxindia.gov.in/tax-feeds) expressly invite RSS-reader/news-app use; [copyright policy](https://www.incometaxindia.gov.in/copyright-policy) permits accurate attributed reproduction excluding third-party material. Robots has no rule denying the exact query-free feed path. The advertised `wm` host redirects to canonical `www`. | Preflight HTTP200 parsed 10 historical entries. Actual DNS-pinned worker got HTTP403; source was disabled, stored no tax notices, and retains the error in Sources/history. No TLS/header/proxy/security workaround was used. |
| **NDMA SACHET** | [CapFeed](https://sachet.ndma.gov.in/CapFeed) expressly offers RSS to applications/aggregators. [Agency integration guide](https://sachet.ndma.gov.in/docs/Integration_Guide_For_Agencies.pdf) documents consumption/caching; [WMO authority register](https://alertingauthority.wmo.int/authorities.php?recId=331) confirms the endpoint. [Government Vikaspedia description](https://schemes.vikaspedia.in/viewcontent/social-welfare/disaster-management-1/national-disaster-alert-portal?lgn=en) describes dissemination/broadcast by subscribed agencies. | Approved narrowly for attributed RSS metadata, then genuinely collected through existing worker/transport. No credentials needed. |

NDMA endpoint: `https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml`. Its robots endpoint returned **HTTP404**, not a crawler denial. [RFC9309 §2.3.1.3](https://www.rfc-editor.org/rfc/rfc9309.html#section-2.3.1.3) allows access when that file is unavailable; **the explicit official RSS service, not robots absence or public visibility, is the authorization basis**. No permission was inferred for linked CAP documents, arbitrary pages, images, account data or other endpoints.

NDMA approval is restricted to that one HTTPS host/path without query, at most two HTTP requests per job with a 30-second minimum interval, expires **25 November 2026**, and requires renewed policy review thereafter. Robots/reuse/access controls remain unchanged. The source configuration was saved, separately validated and activated through the existing authenticated Source Manager APIs. The denied tax source is disabled. Original source permission decisions remain preserved; myScheme stays excluded.

## 2. Genuine HTTP and storage results

| Operation | HTTP | Parsed records | Application records created / updated / unchanged |
| --- | ---: | ---: | --- |
| Tax advertised-host preflight | 302 | 0 | 0 / 0 / 0; recorded canonical destination |
| Tax canonical preflight | 200 | 10 | 0 / 0 / 0; inspected response only |
| Tax guarded worker | **403** | 0 | 0 / 0 / 0; failed safely, disabled |
| NDMA bounded DNS-pinned preflight | 200 | 100 | 0 / 0 / 0; inspected response only |
| NDMA worker run 1 | **200** | **100** | **100 / 0 / 0**, plus 100 source versions/review items |
| NDMA worker run 2, rate-spaced | **304** | **0** | **0 / 0 / 0**; all 100 stored records retained, no duplicate versions |

The second run's machine counter is not “100 unchanged”: conditional HTTP avoided parsing entirely. It returned 304 with an empty body and no additional writes to notice/version collections. Adapter replay tests separately verify stable identity and repeat-ingest idempotency. RSS metadata does not provide verified current expiry: observed NDMA entries are dated **16 November 2026**, including short-duration forecasts, and remain internal pending currentness review. The tax preflight entries were dated **2025**, not today's announcements.

Receipts: [successful NDMA runs, hashes and ETag](../../backend/reports/ndma-live-collection.json), [tax guarded failure](../../backend/reports/first-authorized-live-collection.json), [tax preflight](../../backend/reports/tax-feed-inspection.json), [NDMA preflight](../../backend/reports/sachet-feed-test.json), policy evidence under `backend/reports/live-source-evidence/`.

## 3. Five real schemes and genuine human fact-review authorization

The five concrete [fact packets](../FIVE_SCHEME_FACT_REVIEW.md) were prepared before asking for approval, as required by master-plan §17.4. The owner replied **“Approve these five packets for AI preparation only.”** The existing admin fact-review endpoints recorded that authorization, current source-version references, rights basis, checked date, explicit gaps and seven-day review validity. No human approval was impersonated and no incomplete rule set was approved.

| Existing ID | Scheme and evidence | Prepared facts / remaining limits |
| --- | --- | --- |
| IN-FA-01 | PM-KISAN; [PIB PRID2238588](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238588&lang=1&reg=1) | Annual INR6000 assistance/DBT and farmer-family audience; operative exclusions, current window and document checklist not fully established by this release. |
| IN-ST-02 | NMMSS; [PIB PRID2323830](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323830&lang=1&reg=3) | Annual INR12000 scholarship, secondary-education audience and NSP route. Old October deadline is past; later extension document could not be retrieved. No open application deadline asserted; documents/full selection rules need review. |
| IN-WK-02 | PMJJBY; [DFS FAQ](https://financialservices.gov.in/pmjjby) | INR200000 life cover subject to terms, INR436 standard annual premium, entry-age/renewal/lien caveats, prescribed enrolment/auto-debit consent route. Bank-specific KYC/full policy terms remain review items. |
| IN-WK-03 | PMSBY; [DFS FAQ](https://financialservices.gov.in/pmsby) | Conditional accident cover INR200000 / INR100000 and INR20 annual premium; participating-bank/post-office route. Disability definitions, claim checklist and latest policy amendments still require editorial review. |
| IN-WO-02 | PMUY/Ujjwala2.0; [official application/document page](https://pmuy.gov.in/Ujjwala2.html) | Published audience, application route and conditional document requirements. No unsupported cash/refill/subsidy amount; source has rights/currentness limitations explicitly included in the approved packet. |

Summaries are limited public factual paraphrases with source references/minimal quotations; PMUY's rights-reserved footer was explicitly noted. Unknown documents are not represented as “no documents required.” Source announcements/FAQs are not a substitute for complete current operative eligibility rules. Original research files were not rewritten; five new immutable scheme source versions preserve the observations, previous-version references and gaps. Existing conflict/review history remains, with rule sets still incomplete.

Machine packets and staging: `backend/review-packets/five-scheme-facts.json`, [five-scheme version changes](../../backend/reports/five-real-schemes-staging.json).

## 4. Gemini results and publication state

Model: **`gemini-3.5-flash-lite`**, on the previously owner-confirmed primary-project Free tier. Paid approval stayed false and paid daily budget zero. Only non-sensitive approved public facts were sent. Existing router/leases/jobs/schema/factual checks were used; no key rotation or provider change.

| Result | Actual count |
| --- | ---: |
| Schemes with owner-approved source-fact snapshots | **5** |
| English / Hindi / Kannada artifacts | **5 / 5 / 5** |
| Structured/factual validation passed | **15** |
| Awaiting editorial review | **15** |
| AI jobs / total worker-generation attempts | **15 / 16** |
| Published indexes / publication events | **0 / 0** |
| Approved eligibility rule sets | **0** |
| Reported successful-artifact input / output / total tokens | **16,980 / 20,387 / 37,367** |
| Paid generation requests | **0** |

One request failed with `PROVIDER_TEMPORARY`/status0. A bounded retry resumed only the missing job with the same model, preserving completed artifacts and approval snapshots. All jobs eventually reached `REVIEW_PENDING`. The failed attempt has no token-usage receipt, so successful-artifact totals do not claim to measure its unknown usage. Free-tier estimated cost remains $0; invoice/account balances were not independently inspected. Evidence-length validation initially stopped a fact-review request before any AI call; exact source excerpts were extended without changing the owner-approved facts or weakening validation.

Receipt: [all schemes, language states, jobs, usage and keywords](../../backend/reports/five-real-schemes-ai.json). The earlier failed/resumed receipt is preserved as `five-real-schemes-ai-before-resume-*.json`.

## 5. Existing dashboard verification

The actual application database was rendered in the existing admin app, with no redesign. It shows:

- One approved/active source and the disabled tax-source failure.
- Notices split correctly as **100 LIVE, 12 RESEARCH and 4 SYNTHETIC**, separate from the 25 scheme research origins and their five fact-review approvals.
- Two successful genuine runs, one blocked/failed tax run, last successful timestamp and conditional request behavior.
- Five source-fact snapshots, five prepared artifacts in each language, all 15 pending editorial review, and zero published content/rule approvals.

Screenshots: [overview](../../frontend/reports/real-data-overview.png), [Sources](../../frontend/reports/real-data-sources.png), [Data Explorer](../../frontend/reports/real-data-explorer.png), [editorial queue](../../frontend/reports/real-data-editorial-pending.png). [Browser/API proof](../../backend/reports/real-data-dashboard-proof.json) reports no page errors. Credential display was masked in saved screenshots; passwords/API keys are not included.

The dashboard check exposed a legacy fixture-origin aggregation error: MongoDB's map variable needed `$$source`, rather than the document field `$source`. Corrected it and added a regression assertion for legacy fixture records that lack modern provenance flags. HTTP failures now retain a safe status-specific reason. Tests also caught and corrected eager URL parsing that broke custom registered adapters. These are focused repairs to existing components.

## 6. Database/configuration and verification

The private Atlas target was inspected read-only and again failed `DNS_OR_CONNECTION_FAILED`; no Atlas write occurred. The existing native application database was inspected before changes. Local backend configuration now explicitly selects it; the previous Atlas URI remains only in an ignored private comment. The live switch is enabled with only the reviewed NDMA source active. Other sources cannot bypass the unchanged approval checks. No new automatic schedule was created.

Current application inventory: **119 sources, 192 source versions, 25 schemes, 164 scheme facts, 25 unapproved rule sets, 18 forms, 116 notices, 12 awareness topics, 21 changes, 5 review events, 210 review items (205 pending), 12 retained historical rejections and 17 ingestion runs.** There are 5 ContentApprovals, 15 AIJobs, 15 AIArtifacts and no published search documents/publications. The original 17 research files remain byte-identical.

| Check | Final result | Evidence |
| --- | --- | --- |
| Backend unit/component | **85 passed**: previous82 + 3 official-feed regression tests | [Unit output](../../backend/reports/real-data-unit-tests.txt) |
| Frontend contracts | **4 passed** | Same unit output |
| Database integration | **31 test nodes passed**, no failures/skips | [Integration output](../../backend/reports/real-data-integration-tests.txt) |
| Existing browser journeys | **18 passed**, desktop/mobile | [Browser output](../../frontend/reports/real-data-browser-tests.txt) |
| Build | Passed | [Build output](../../frontend/reports/real-data-build.txt) |
| Actual dashboard/database proof | Passed | Dashboard proof linked above |
| Research/secret/config audit | 17 hashes match; configured private values absent from scanned shareable files | [Final audit](../../backend/reports/real-data-final-audit.json) |

Captured official RSS files under `backend/fixtures/captured/` have source/hash provenance. Their parser regression tests are **offline replay**, not additional live HTTP requests. Genuine network integration is evidenced by the guarded worker run receipts. Automated browser/unit environments now explicitly disable live collection/free AI instead of inheriting private operational enablement; existing assertions/timeouts were preserved. An initial browser run exposed that configuration leak; its output is retained separately. Tests use isolated databases and never delete application records.

## 7. Remaining blockers and next authorized operation

- **Editorial approval remains pending:** review all 15 language artifacts in `/admin/publish`, especially translation quality and each packet's document/currentness gaps. No automatic publication was performed.
- NDMA records are dated snapshots, not verified active warnings. Do not publish short-lived safety advice without expiry/currentness validation. CAP linked-document retrieval is outside the approved scope.
- PIB collection lacks usable robots/access evidence; OGD needs appropriate API access and dataset-specific review; RBI access was denied; Income Tax guarded transport returned403. No denied source was bypassed.
- Five fact packets are intentionally limited. NMMSS application timing is unresolved/expired; PM-KISAN and NMMSS document lists are not established by selected releases; bank-specific insurance requirements and PMUY subsidy/currentness remain gaps.
- Atlas DNS/access, independent native-speaker/physical-device QA, credential rotation confirmation and the previously recorded development-dependency advisory remain follow-up.

To inspect current results, restart any backend/worker process that was already running before the local environment change, then use the existing admin app. Start `npm run worker` for subsequent jobs. In Run collection choose LIVE and `live-ndma-sachet-rss`; honor the approved rate and caching behavior. Do not reactivate the tax source without resolving access with the publisher. Renew the NDMA policy evidence before its approval expires; source-access approval does not publish records.
