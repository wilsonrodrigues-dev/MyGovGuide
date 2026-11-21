# Milestones 3 & 4 — implementation and verification

20 November 2026, Asia/Calcutta. Baseline: [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md) and the owner's combined Milestones 3/4 request. Existing MERN components were extended; Milestone 5 was not started.

**Both citizen tool implementations are delivered. Real government rule approval and public notice publication remain blocked; they are not represented by practice fixtures or private document interpretations.** OCR is explicitly unavailable, with a working transcription fallback.

## Delivered workflows

**Notice-to-Action:** open `/notices` → choose PDF/PNG/JPEG or paste text → consent to temporary server extraction → inspect the original beside exact source passages → select/check/read actions. Mobile uses original/explanation tabs. Existing PDF.js page/zoom controls are reused; source references use actual extracted pages and lines, with no guessed coordinates. Issuer, title, reference, audience, actions, documents, methods, contacts, links and date candidates retain original passages. Missing/ambiguous fields remain visible. Issue/event/deadline roles are distinguished conservatively; wrapped deadline context and past dates are handled. Source detection is not government authentication.

Scans/images receive a truthful unsupported-OCR result. Users can enter or correct a transcription while retaining the original preview. Transcription references explicitly identify the user's text, not verified positions in the original. Checklist entries distinguish stated passages, suggested checks and information needing verification. Manual controls work without voice.

**Optional notice AI:** review/edit the redacted excerpt → select available providers → attest adult/non-sensitive content and consent to named-provider processing → prepare a language. Strict structured output is validated for source IDs, date identity/role, numeric preservation, missing information, optionality and unsupported links/claims. Edited-excerpt citations remain attached to that excerpt; they are not silently mapped to different original passages. Gemini/Groq use the existing free-entitlement/router/error controls. Language switching reuses validated memory caches; it does not initiate generation. Unavailable/quota-limited work has explicit failure/deferred/retry states.

**Eligibility:** open `/eligibility` or the check link on a published scheme → select a scheme → answer only questions supported by a complete approved rule set → inspect condition-by-condition results, supplied values, recorded thresholds, reasons, clauses and official next-step references → edit or clear answers. AND/OR/NOT/IF rules, numeric/date boundaries, currency/period metadata, unknown answers and incompatible conjunctions are deterministic. Empty, partial, conflicting, superseded, stale, expired, unapproved or unsupported rules return **Cannot determine**. AI never makes the decision.

Because no real rule set qualifies, `/eligibility/PRACTICE-ONLY` demonstrates age, state-or-income and conditional enrollment/worker questions using explicitly invented requirements. It is not a government scheme, human government approval or real eligibility advice. All 24 actual published schemes remain selectable; blocked schemes ask zero personal questions.

EN/HI/KN interface text, questions, result labels and native-script AI explanations are supported. Language switching preserves answers, results and checklist state. Optional voice commands read/explain notices, summaries, actions, questions and results; next/previous/repeat/stop use the same manual controls. Browser tests instrument speech callbacks. Physical microphone recognition, installed native voice quality and device accuracy were **not** verified.

## Privacy, retention and integration

- Originals are parsed in the existing credential-free, bounded child process: 5 MB, 10 PDF pages, 18 KB notice text, image dimension limits, real type checks and unsafe-PDF rejection. No original file or private notice text is inserted into public MongoDB collections, ImageKit, admin research or logs.
- Local extraction works without external AI consent. Free Gemini processing is restricted to a user-reviewed non-sensitive excerpt, with explicit provider selection and adult attestation. Automated redaction is imperfect and is not a guarantee that arbitrary private documents are safe to transmit. Google's [unpaid-service terms](https://aistudio.google.com/docs/terms) prohibit sensitive/confidential/personal submissions and allow product-improvement use.
- Private AI sessions use process memory, scoped ownership tokens and a 15-minute expiry. Clear/navigation requests deletion; expiry is the fallback if the deletion request cannot reach the server. Deletion cannot recall an already consented provider request. Restart loses private sessions/jobs; the UI asks for resubmission rather than persisting private uploads. Eligibility answers remain in React memory and temporary evaluation requests; no profile, durable answer history, local-storage answer cache or AI transmission is created.
- Existing profile bootstrap is skipped on guest notice/eligibility routes. Public scheme/form/profile/admin functionality is retained.
- Public notice preparation reuses `AIJob`, `AIArtifact`, the worker, shared worker leases, provider controls and Content preview/publication. It requires complete bounded public evidence with an exact-version fact/rights/currentness review. Restarted public jobs recover within bounded attempts; scheme workers cannot claim notice jobs. Valid language artifacts are reused. Public publication requires all three validated revisions and an explicit transactional editorial decision. Private jobs never become public artifacts.

## Actual data and evidence

All 22 protected Atlas collection hashes matched the pre-task baseline. There were **zero new real fact approvals, rule approvals, source grants or publications**.

| Atlas data | Preserved result |
| --- | ---: |
| Researched schemes / published schemes | 35 / 24 |
| Published language search documents | 72 |
| Existing AI artifacts | 117 |
| Sources / source versions | 148 / 268 |
| Original review items / human review events | 341 / 25 |
| Form references / stored form documents | 18 / 5 |
| Notice records / published notices | 157 / 0 |
| Real eligibility rule sets / usable approved sets | 35 / 0 |

All 35 real rule sets have zero operative conditions, incomplete clause/currentness/rights evidence, missing effective review bounds and stale caches: 25 are `REVIEW_REQUIRED`, 10 `RESEARCH_ONLY`. Twenty-five reference superseded or unrelated current scheme evidence; 11 also lack a currently published scheme. No summaries were promoted into legal eligibility rules. PM-KISAN's real citizen check was verified to return a blocked state with no personal questions.

Official evidence considered for a possible real demonstration included [NMMSS's current announcement](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2330936&lang=1&reg=3), [PMSBY's official FAQ](https://www.jansuraksha.gov.in/Files/PMSBY/ENGLISH/FAQ.pdf) and [India Post's PMSBY SOP](https://www.indiapost.gov.in/Financial/DOP_PDFFiles/sopPMSBY.pdf). Announcement dates are not complete operative eligibility clauses; FAQ access and older/contradictory premium/age material do not resolve policy interpretation or currentness. No complete fact/rights/currentness-reviewed rule packet was available. The permitted practice example therefore remains separate from Atlas government records.

The existing NDMA SACHET source/records are preserved. Its official RSS reference is available as a source link; the public library exposes **zero** unreviewed notices, including the 41 previously unresolved snapshots. No snapshot is described as an active emergency. A valid historical publication would show attribution/history without current action explanations. An ISO-string authorization-expiry query bug was corrected without changing the stored permission or fetching the feed.

## Genuine notice QA and real AI

These exact official PDFs each returned **HTTP 200** in a one-time local parser check. This is **not** a successful authorized collection run, ongoing scraping permission, public rehosting or government publication.

| Official document | Bytes | Pages | Extracted text characters | Current detected fact passages |
| --- | ---: | ---: | ---: | ---: |
| [Haryana NMMSS press note](https://cdnbbsr.s3waas.gov.in/s323d2e1578544b172cca332ff74bddf5f/uploads/2026/09/20260922134149139.pdf) | 204869 | 1 | 2241 | 6 |
| [Meghalaya CMSS extension](https://megeducation.gov.in/dhte/notices_and_circulars/2026/Extension%20of%20Chief%20Minister%20Scholarship%202026.pdf) | 1385376 | 2 | 3353 | 18 |
| [Haryana NMMSS prospectus](https://cdnbbsr.s3waas.gov.in/s323d2e1578544b172cca332ff74bddf5f/uploads/2026/09/202609221715930345.pdf) | 541868 | 3 | 6277 | 28 |

The original Meghalaya PDF rendered in desktop/mobile browser tests; its November 13 deadline is past, not an open-application claim. A raster of that real document and an explicitly synthetic textless PDF exercised the actual unsupported-OCR path. No successful OCR or original incoming government scan is claimed. Haryana text/date/field gaps remain flagged; text extraction does not establish a complete verified interpretation. [Tesseract.js](https://github.com/naptha/tesseract.js) was evaluated as an OCR option; a verified local engine/language-model path is not installed, and PDF OCR is not automatic in that library.

**Actual model:** `gemini-3.1-flash-lite`, primary credential only. The [official pricing table](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite) confirmed free input/output eligibility; the owner's project free-tier attestation and existing free-entitlement configuration were retained. Paid usage was disabled with a zero paid budget. Secondary authorization remains false and Groq free entitlement remains unconfirmed; neither was used for real generation.

The internally authored, non-sensitive notice test generated and validated **one final EN, HI and KN result**, with 1106 / 1134 / 1193 total tokens respectively, **3433 final-run tokens**. These are real network generations of synthetic test content, not reviewed government publications or Atlas artifacts. Earlier requests exposed four HTTP-400 schema-complexity failures, which were fixed by simplifying only the provider transport schema while retaining strict local validation. An intermediate Kannada HTTP-504 was resolved by one bounded retry. Final generation: 3 validated results, 0 final errors, 0 paid requests. Mock fallback/quota/private-session tests remain explicitly synthetic.

## Existing admin workflow

Content → Preview → Approve & Publish / Keep Pending / Reject remains the only everyday dashboard workflow. There is no mandatory evidence typing. Source/version/clauses/questions/uncertainties are attached from MongoDB. Eligibility is grouped once per scheme; publication cannot turn missing clauses into approved rules. Public notice preparation appears only after its evidence prerequisites are satisfied.

The worklist now includes 35 existing rule groups: **24 Published, 0 Ready, 0 Needs Attention, 104 Automatically Handled, 129 Blocked**. The prior 94 blocked content groups are retained; the added 35 rule groups explain the increase. Raw pending observations are unchanged at **316**, with **207 handled / 109 active**. No historical record or audit event was deleted or rewritten.

## Verification and routes

**265 distinct automated cases passed:** 134 backend unit/API, 17 frontend unit, 50 isolated MongoDB integration, 42 desktop/mobile citizen/admin cases, 4 editorial publication, 16 Forms/viewer and 2 exact-approval browser cases. Focused final milestone reruns cover ten desktop/mobile cases. Production build passed. Existing chunk-size warnings remain non-blocking. All automated fixtures use isolated `mygovguide_phase2_test_*` databases; real Atlas checks are separate and do not run a worker or publication action.

Citizen routes: `/notices`, `/notice`, `/notice/checklist`, `/eligibility`, `/eligibility/:schemeId`. `/eligibility/results` redirects to selection; actual results remain with the selected scheme and memory-only answers. APIs: `/api/notices/{capabilities,extract,analyze,library}`, `/api/notices/private` and ownership-scoped status/explain/delete endpoints; `/api/eligibility`, detail and `/:id/evaluate`. Admin additions reuse `/api/admin/content-workbench`, its decisions endpoint and `/notices/:id/prepare`. The existing worker runs persisted public notice work.

The secret scan found **zero configured-secret matches in 562 shareable files** after documentation and receipts were added. Private `.env`, backups and local QA artifacts remain excluded from Git; no credential values changed. Temporary application/browser/test-database services are stopped after verification. [Machine verification receipt](../../backend/reports/milestones-3-4-verification.json) records final counts, hashes, source QA, synthetic/live distinctions and tests.

### Screenshots

Twenty feature/Atlas screenshots are in `frontend/reports/milestones-3-4/`, including:

- Real PDF: [desktop](../../frontend/reports/milestones-3-4/notice-official-pdf-desktop.png) / [mobile](../../frontend/reports/milestones-3-4/notice-official-pdf-mobile.png).
- Raster fallback: [desktop](../../frontend/reports/milestones-3-4/notice-raster-fallback-desktop.png).
- Explicitly synthetic AI UI contract: [English](../../frontend/reports/milestones-3-4/notice-ai-contract-en-desktop.png), [Hindi](../../frontend/reports/milestones-3-4/notice-ai-contract-hi-desktop.png), [Kannada](../../frontend/reports/milestones-3-4/notice-ai-contract-kn-mobile.png). These screenshots use cached test responses, not new real provider calls.
- Explicit practice rules: [desktop](../../frontend/reports/milestones-3-4/eligibility-practice-desktop.png) / [mobile](../../frontend/reports/milestones-3-4/eligibility-practice-mobile.png).
- Actual Atlas: [blocked PM-KISAN check](../../frontend/reports/milestones-3-4/atlas-eligibility-blocked-desktop.png), [public notice gate](../../frontend/reports/milestones-3-4/atlas-public-notices-desktop.png), [grouped admin rules](../../frontend/reports/milestones-3-4/atlas-admin-rule-review-desktop.png).

## Remaining limits

Real government eligibility needs complete current operative clauses, correct version bindings, translated questions and genuine grouped human approval. Public notices need exact-text fact/rights/currentness evidence, validated languages and editorial publication. Existing source restrictions and the owner's pending form decisions remain intact. OCR installation/quality verification, physical speech recognition/native voices and durable opt-in citizen saving remain unavailable or outside this scope. Neither milestone is represented as a fully populated government-verified content release; the implemented tools and permitted practice/fallback paths are usable now.
