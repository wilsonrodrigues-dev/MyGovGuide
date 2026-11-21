# MyGovGuide six-stage implementation and demo acceptance

Verified 20 November 2026 against `mygovguide_demo_v2`. Implementation and local verification have finished; **the full real-content demo is not complete**. The application has 24 published schemes, but zero complete executable real eligibility rule sets, zero complete reviewed multilingual form guides, and zero public notice/scam publications. These are content/evidence/review gates, not successful journeys hidden behind passing fixture tests.

Machine-readable evidence: [final acceptance](backend/reports/final-demo-acceptance.json), [six-stage checkpoint](backend/reports/final-demo-progress.json), [exact curated graph](backend/config/demo-manifest.json). Operation instructions: [existing runbook](docs/guides/DEMO_OPERATIONS_RUNBOOK.md).

## Six-stage result

| Stage | Before | After | Real acceptance | Remaining blocker |
|---|---|---|---|---|
| 1. Database safety and focused inventory | Demo/legacy split, backup and guards already existed; worklist included all history | Verified restore receipt and 22 legacy hashes; eight-scheme graph and optional DEMO worklist scope; history retained | Passed preservation checks | Encrypted backup recovery is tied to this Windows account |
| 2. Real eligibility | 35 stored rule sets; two limited historical decisions; no complete executable rules | Three new immutable PMJJBY/PMSBY/APY evidence and rule packets; native questions/gap messages; boolean tax-field validator fixed | Real PMJJBY/PMSBY show honest incomplete results in EN/HI/KN; no positive verdict claimed | Full conditions, boundary conflicts, currentness and exact human review unresolved |
| 3. Forms | 19 references, eight documents, no reviewed complete guides | Ordered labels, bounded unfamiliar-label extraction, original image/PDF view, native local field help and manual controls; fixed accidental upload resubmission from nested buttons | Genuine four-page APY upload extracted 20 labels; unknown identity clearly labeled; no external processing | Outdated insurance form premiums, APY edition/reuse review, prior pending human decision; no complete reviewed guides |
| 4. Notices and scams | Private notice tool existed; no public notice/scam publications | Three genuine free Gemini explanations; recorded browser replay/deletion; past-deadline warning; integrated scam AI/review/public routes and seven evidence candidates | Real notice output validated in all three languages; public empty state remains truthful | Public fact/rights/currentness/editorial decisions absent; six scam topics lack complete instructions |
| 5. Live monitor | Source gate, worker, persisted events and replay existed | Persisted hard live cap 1–3; selected-job CLI; request timing; staged/validated events; paged replay and sanitized export | Two real NDMA requests: three new, then three unchanged; cross-process frames and refresh replay verified | NDMA approval expires 25 November; other endpoints remain research-only |
| 6. Regression and freeze | Earlier acceptance did not finish the full frozen demo | 295 distinct automated tests passed, production build, 72 real language responses and 24 published detail pages verified | Local verification passed; original publications preserved | Real content gates above remain; physical microphone/native speech quality untested |

## Actual inventory and evidence

The eight-scheme graph below is a focused review inventory, **not eight fully enriched eligibility-to-form journeys**. Existing limited published summaries remain available; APY remains internal research. Exact source-version, rule, artifact and form IDs are in the linked manifest.

| Scheme ID | Title | Official source |
|---|---|---|
| IN-WK-02 | PMJJBY | [Department of Financial Services](https://financialservices.gov.in/pmjjby) |
| IN-WK-03 | PMSBY | [Department of Financial Services](https://financialservices.gov.in/pmsby) |
| IN-WK-04 | Atal Pension Yojana | [Department of Financial Services](https://financialservices.gov.in/atal-pension-yojana) |
| IN-FA-01 | PM-KISAN | [PIB source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238588&lang=1&reg=1) |
| IN-WO-02 | PMUY | [Official Ujjwala site](https://pmuy.gov.in/Ujjwala2.html) |
| IN-ST-02 | NMMSS | [PIB source](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323830&lang=1&reg=3) |
| IN-SR-02 | Senior Citizens Savings Scheme | [India Post](https://www.indiapost.gov.in/banking-services/savings) |
| IN-WO-03 | Sukanya Samriddhi Account | [India Post](https://www.indiapost.gov.in/banking-services/savings) |

Fresh targeted official-page research returned HTTP 200 for DFS PMJJBY, PMSBY and APY, the PFRDA APY page, and the MoLE PM-SYM page. The latter was an application shell without usable rule text. Manual research does not grant automated collection rights. New sources remain `NOT_AUTHORIZED_FOR_AUTOMATION`. Existing source versions and limited historical decisions were not expanded or rewritten.

Three unapproved packets were stored:

- PMJJBY: `proposed-rules-c3ef9f6fb3b4ae9fa1f4f2ec`, evidence `rule-evidence-4afecea1fc91078c80fb618c`.
- PMSBY: `proposed-rules-3e2a15a4570a644bdd9e47ba`, evidence `rule-evidence-95dfd3edfca8a5f888a2ecef`.
- APY: `proposed-rules-1d70b064a46fdbe43ff7eb95`, evidence `rule-evidence-c0237ffdec649406d7676f42`.

All remain `REVIEW_REQUIRED` / `INFORMATION_INCOMPLETE`. PMJJBY needs complete entry/renewal/re-entry, termination/lien and effective-date treatment. PMSBY has joining-through-70 versus termination-at-70 ambiguity. APY sources differ on maximum-age wording; the current/former income-taxpayer exclusion effective 1 October 2022 must be reviewed with the complete rule set. No unsupported eligibility decision was enabled.

Forms remain 19 references / eight stored documents / zero complete reviewed EN/HI/KN guides. The genuine APY blank form exercised extraction and the original viewer, including Next/Previous without resubmitting. It was deliberately unidentified in the isolated no-catalog match test. Existing local English OCR evidence covers the scanned PAHAL document; unsupported languages/pages/low confidence remain explicit. A UIDAI PDF fetch returned 503. FORM-10/FORM-11 display old premiums (330/12 versus current 436/20); FORM-19 APY edition/currentness/reuse remains pending. No fresh form preparation or publication was granted. No successful authorized ImageKit upload is claimed.

Seven scam research topics are retained: A-01 UPI, A-11 phishing, A-10 digital arrest, A-12 romance, A-08 fake jobs, A-13 OTP and A-09 social media. The [MyGov CyberDost campaign](https://www.mygov.in/campaigns/cybercrime-awareness-campaign-2026/) returned valid HTML but only category coverage. A-10 has actual advisory text from [PIB/MHA, 14 May 2024](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=2020570&lang=2&reg=48). This is historical/evergreen research, not a fresh incident. The direct I4C PDF returned HTTP 200 with a non-PDF body; a MoHFW handbook returned 404; another host failed certificate validation. No bypass or successful-PDF claim was made. None of these seven entries was AI-prepared, approved or published without the required review.

## Genuine network and provider results

The existing authorized [NDMA SACHET RSS endpoint](https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml) was fetched through the real selected-job worker, started from the authenticated admin interface:

| Job | HTTP / duration | Parsed | Committed classification |
|---|---|---:|---|
| `ded01619-eaf0-4307-969c-0486655b682d` | 200 / 334 ms | 100 | 3 NEW |
| `75659580-401a-442b-b4b9-1793a60042c4` | 200 / 300 ms | 100 | 3 UNCHANGED |

The hard commit cap was three. Repeat collection created no duplicates or new versions. These are announcement records, not scheme eligibility rules. Permission expiry is `2026-11-25T08:35:51.133Z`; CAP attachments and images remain outside scope. Seven genuine worker socket frames, persisted refresh replay and safe JSON export were observed. The first completed job was recovered after a browser test used an incorrect relative export URL; it was not rerun or reported as a newly observed stream. New VALIDATED/STAGED event handling was tested separately; it was not retroactively claimed in that pilot.

**Gemini model: `gemini-3.1-flash-lite`.** Primary account free-tier eligibility and [official Standard free-tier pricing](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite) were checked before generation. Paid budget remained zero. Three actual SDK calls used a short non-sensitive excerpt from the [Meghalaya CMSS deadline notice](https://megeducation.gov.in/dhte/notices_and_circulars/2026/Extension%20of%20Chief%20Minister%20Scholarship%202026.pdf), excluding contact numbers and the distribution list. EN/HI/KN outputs passed source-line/fact/date validation and preserved **13 November 2026**, with a past-deadline warning in the citizen UI.

| Language | Input tokens | Output tokens | Validation |
|---|---:|---:|---|
| English | 687 | 362 | Passed |
| Hindi | 687 | 383 | Passed |
| Kannada | 687 | 366 | Passed |

The existing router exposes SDK success, not raw response HTTP status; no invented HTTP 200 is attributed to these generation calls. Outputs are private QA receipts/cache, not new public scheme artifacts. The subsequent browser test used these exact recorded real outputs through a QA cache adapter, explicitly labeled recorded. It exercised real upload/extraction/private-consent/deletion endpoints, three cache reads and zero additional provider calls. Memory was empty after deletion; raw files were not retained. Groq, Tavily and ImageKit had zero live acceptance calls/uploads in this task.

## Database preservation and pending work

Runtime uses ignored `backend/.env` and Atlas `mygovguide_demo_v2`. Legacy `mygovguide_dev` remains write-denied. All 22 protected legacy collection hashes match the initial snapshot. Every pre-existing protected demo scheme, source version, rule set, form reference/document, AI artifact, content approval/publication and search index is byte-for-byte unchanged. Research scam candidates received new immutable versions through the existing ingestion workflow; their old evidence remains.

| Collection / state | Before | After |
|---|---:|---:|
| Schemes / published | 35 / 24 | 35 / 24 |
| Sources / source versions | 151 / 277 | 157 / 290 |
| Eligibility rule sets | 35 | 38 |
| Form references / documents / approved guides | 19 / 8 / 0 | 19 / 8 / 0 |
| Internal notices / scam records | 160 / 12 | 163 / 13 |
| Scheme AI artifacts / jobs | 117 / 76 | 117 / 76 |
| Content approvals / publications / search documents | 25 / 24 / 72 | 25 / 24 / 72 |
| Review observations / raw pending | 344 / 319 | 354 / 329 |
| Administrative triage events | 347 | 359 |

No migration, new editorial approval, new publication, legacy write or deletion was performed. The earlier encrypted AES-256-GCM backup receipt covers 39 collections / 3,215 documents, with decryption and isolated document/index restore verified. Key wrapping uses Windows CurrentUser DPAPI: it is not portable recovery to another account. Temporary restore databases were removed.

The existing administrative handler added 12 routine/historical dispositions without approvals. At final triage, 329 raw pending observations remain: **209 automatically handled, 120 active** (79 blocked, 41 review-required), grouped into 101 active packets. Raw observations and audit history were preserved. Of 37 retained failed AI attempts, 36 have a proven valid current replacement; one genuine unresolved failure remains: Gruha Jyothi `KA-GN-01`, Kannada, job `a6301ea4-4ff9-47be-9adc-2a4c95367fa2`, `FACT_VALIDATION_FAILED`. Its historical-only evidence requires correction; it was not blindly retried or published.

## Verification and screenshots

Passed: **152 backend + 20 frontend unit/API tests, 53 isolated integration tests, 70 distinct desktop/mobile browser cases = 295 tests**, plus production build. The browser total comprises 48 base journeys, four editorial cases, 16 form/viewer cases and two simplified-approval cases. Focused reruns overlap these totals and were not counted twice. The build retains the existing large-bundle advisory.

Actual read-only Atlas acceptance additionally verified all **24 published scheme pages**, correct eligibility links and **72 EN/HI/KN HTTP 200 responses**, with no browser errors. API rate limits were respected by waiting for their reset window. These checks prove existing public content availability, not full eligibility/form completeness. Physical microphone behavior and native speech quality remain device checks; mocked speech callbacks are not physical voice evidence.

| Journey | Actual screenshot |
|---|---|
| Real eligibility gap, EN / HI / KN | [EN](frontend/reports/final-demo/real-eligibility-gap-en.png), [HI](frontend/reports/final-demo/real-eligibility-gap-hi.png), [KN](frontend/reports/final-demo/real-eligibility-gap-kn.png) |
| Genuine unfamiliar APY form / original viewer | [Desktop](frontend/reports/final-demo/unfamiliar-real-form-desktop.png), [mobile](frontend/reports/final-demo/unfamiliar-real-form-mobile.png) |
| Real catalog edition warning | [Forms catalog](frontend/reports/final-demo/real-catalog-form-warning.png) |
| Real Gemini outputs replayed with recorded label | [EN](frontend/reports/final-demo/recorded-real-notice-en.png), [HI](frontend/reports/final-demo/recorded-real-notice-hi.png), [KN](frontend/reports/final-demo/recorded-real-notice-kn.png), [mobile](frontend/reports/final-demo/recorded-real-notice-mobile.png) |
| Actual pending awareness inventory | [Desktop](frontend/reports/final-demo/real-awareness-pending.png), [mobile](frontend/reports/final-demo/real-awareness-pending-mobile.png) |
| Genuine live collection / persisted replay | [Worker run](frontend/reports/final-demo/live-collection-2.png), [mobile replay](frontend/reports/final-demo/live-replay-mobile.png) |

Automated fixture suites separately cover complete deterministic rules, malformed uploads, multilingual guidance contracts, scam publication gates, cancellation/replay, permission failures and transactional review. The synthetic awareness screenshots are named `awareness-synthetic-ui-*`; they are not evidence of public government scam publications.

Final secret checks found no configured credential matches in 626 shareable files or 25 built frontend files. Private environments/backups remain ignored; `backend/.env` is not tracked. Owned temporary API/preview services are closed and the verified isolated test replica set was stopped. Git's whitespace check still reports existing whitespace in `PRODUCT_MASTER_PLAN.md`, `AdminApp.jsx` and `ContentWorkspace.jsx`; unrelated work was preserved.

## What remains genuinely incomplete

Three complete real eligibility journeys require resolved full rule evidence and exact human decisions; two old limited approvals do not authorize the expanded packets. Two or three complete form journeys require current blank editions, legitimate reuse basis and resolved fact/currentness review before AI, followed by actual multilingual artifact review. Public notice/scam examples require complete appropriate evidence and genuine review/publication decisions. Six scam categories still lack source-backed prevention passages. Other source domains require their own express automation permission; myScheme restrictions remain intact.

No routine permissions are needed to inspect the implemented work. Content approvals, source rights and unavailable provider/rehosting entitlements were not invented. Use the existing admin Content preview and review controls after resolving these specific gaps; the full demo stays marked incomplete until the real journeys pass.
