# OpenCode audit and continuation — 20 November 2026

**Result:** recovered and audited OpenCode's project-specific local chat, preserved its working changes, corrected database/monitor/AI/OCR gaps, and executed a genuine bounded NDMA collection. The frozen V3 demo is **not fully complete**: three genuinely complete approved eligibility checks, complete reviewed multilingual form guides, and published notice/scam examples are not established. No new publication, source permission or human approval was fabricated.

The implementation target was `OPENCODE_IMPLEMENTATION_BRIEF.md` and `MYGOVGUIDE_FINAL_WORKFLOW_V3.md`, within the master plan's evidence/privacy/publication safeguards. Original academic documents remain unchanged. The existing dirty worktree was preserved; unrelated earlier changes were not reverted or represented as newly implemented here.

## What OpenCode had actually completed

| Area | Evidence and actual state on resumption |
|---|---|
| Database switch | Private backend configuration selects `mygovguide_demo_v2`; additive migration had already copied the legacy business records **and operational backlog**, rather than only selected demo evidence. Legacy remained intact. |
| Jan Suraksha | PMJJBY/PMSBY three-condition packets and native questions existed. The local OpenCode question response contains genuine owner approval of those exact age/account/auto-debit packets. It does **not** approve APY, new rule conditions, form rights or publication. |
| Form staging | FORM-10, FORM-11 and new FORM-19 had 20, 22 and 29 extracted labels respectively. They were `DOCUMENT_CHECKED`, not fact/rights approved or complete translated guides. PMJJBY/PMSBY PDFs print outdated premiums. |
| Admin streaming | Socket.IO authentication, event model, monitor route and Vite proxy existed. The worker/API event bridge was process-local; some events were not persisted, and events had no replay sequence. |
| Not completed | Encrypted restore-tested backup, robust read-only rollback guard, complete real rule/form acceptance, bounded discovery, reliable separate-worker streaming, and the full notice/scam demo. |

OpenCode's running terminal was not interrupted or controlled. Its local SQLite history was opened read-only and filtered to this repository. Provider authentication files were not read. A private sanitized continuation receipt is retained under ignored `.local/opencode-continuation/`.

## Added and corrected

- Added a runtime read-only database guard for Mongoose/driver writes, HTTP mutation rejection, worker refusal and startup without index creation in rollback mode. This protects application code; Atlas read-only roles remain the stronger database-level control.
- Created a locally encrypted AES-256-GCM legacy backup with a Windows CurrentUser DPAPI-protected key; verified decryption and actual isolated restoration of **39 collections / 3,215 documents**, including indexes. Removed both temporary restored databases after verification. The encrypted backup and key remain ignored. Recovery to a different Windows account/computer is not established.
- Restricted future migration to one to ten explicitly selected reviewed schemes and their evidence graph. Citizen/admin sessions, operational jobs and raw pending-observation backlog are excluded. The historical full copy was preserved, not deleted or silently rewritten.
- Persisted monotonic events before broadcast, added cross-process database delivery, sequence-based REST replay, authenticated run subscription, origin/session checks and revoked-session disconnect. Added source selection, start/stop, execution selection and retry to `/admin/monitor`. HTTP status, source URL, parsed count and actual stages come from collection. Public scheme/form AI and search operations also record bounded metadata; prompts, extracted private text and credentials are excluded. Monitoring failure does not invalidate already committed AI content.
- Added a three-record pilot cap and explicit job selection. A bounded partial feed never saves a validator implying the entire response was committed. Incremental API traversal fails closed rather than advancing a partial checkpoint.
- Added a versioned evidence completeness assessment to existing source coverage. Recorded fields remain distinct from reviewed facts, operative rules and publication; missing conditions/documents/dates/amendments are visible. This is not automatic legal or editorial certification.
- Added authenticated official-domain Tavily discovery with disabled-by-default free-entitlement checks, two-attempt UTC daily cap, 24-hour cache and bounded response handling. No live Tavily call was made. Search results remain unverified candidates without automation permission. Implementation follows [Tavily's Search API reference](https://docs.tavily.com/documentation/api-reference/endpoint/search); account-specific free entitlement must be configured privately before use.
- Preserved the exact two genuine rule approvals but added a runtime completeness blocker: their captured FAQ explicitly permits enrolment through only one account, while the three-rule packets omit that restriction. Merely mentioning the field or putting it in an optional OR branch cannot satisfy the guard. Historical seed/approval replay scripts refuse `--apply`; they cannot mutate old source versions or approve future revisions.
- Added locally bundled English Tesseract OCR in the credential-free extraction child: up to two scanned pages/images, confidence/partial results, existing upload/type/page/time limits, and no runtime language download or external OCR service. The real scanned PAHAL PDF produced 3,198 characters at reported confidence 85. That is extraction proof, not approval of the form or OCR correctness. Its historical database warning is preserved.
- Fixed provider transport schema complexity while retaining local structured/factual validation. Form guidance now supports meaning, what-to-enter and source-only examples; made form chunks resumable with lease tokens, heartbeats and fenced final writes, and stopped retrying permanent validation failures. Valid scheme artifacts are reused across model changes; retries can reuse an existing valid artifact without overwriting failed-job history or making another model request.
- Added native **Check Eligibility** links and useful already-reviewed facts/documents/application steps when a full real check is blocked. Form viewers can render the additional reviewed guidance fields. Existing voice/manual controls remain.

## Real data and live collection

| Database measurement | Before continuation | After |
|---|---:|---:|
| Schemes / published schemes | 35 / 24 | 35 / 24 |
| Source registry entries | 151 | 151 |
| Source versions | 274 | 277 |
| Notices, internal/research | 157 | 160 |
| Form references / stored documents | 19 / 8 | 19 / 8 |
| Form guidance artifacts / preparation jobs | 0 / 0 | 0 / 0 |
| Scheme AI artifacts | 117 | 117 |
| Review observations, all / raw pending | 341 / 316 | 344 / 319 |
| Persisted monitor events | 0 | 14 |
| Newly published / new provider generation requests | — | 0 / 0 |

The 117 existing Gemini artifacts include 72 approved, eight review-pending revisions and 37 failed validation attempts. Revision history is retained; these are not 117 complete current translations. Existing valid outputs were not regenerated. Historical failed jobs remain auditable rather than being relabelled successful.

**Actual source:** [NDMA SACHET RSS](https://sachet.ndma.gov.in/cap_public_website/rss/rss_india.xml), existing source `live-ndma-sachet-rss`, through the existing authorized worker. Two separate jobs ran at approximately 11:04 UTC, with no scheduler start and no consumption of other queued jobs.

| Job | Actual HTTP | Parsed | Committed/checks | New | Unchanged | New versions | Persisted events |
|---|---:|---:|---:|---:|---:|---:|---:|
| `1d8ade28-42ac-4b5a-876d-14b5cf8897d7` | 200 | 100 | 3 | 3 | 0 | 3 | 7 |
| `2986fd58-c41e-4248-8f85-b33ff435a877` | 200 | 100 | 3 | 0 | 3 | 0 | 7 |

Both responses were 66,669 bytes. No duplicate records, extra review observations or additional versions were created on the repeat. The three new notices retain official URLs, fetched/publication timestamps, original evidence and pending review. They are **announcements, not government schemes, verified active hazard advice or eligibility rules**. No CAP documents/images were fetched. Source expiry and matching approval/configuration gates remained intact.

PIB and Jan Suraksha automated access was not newly authorized; I4C/CyberDost remains curated research. Targeted official DFS page research is not reported as permission to automate a catalog. Tavily, Groq fallback and ImageKit rehosting were not exercised live. No paid requests or new Gemini generation requests were made in this continuation; the configured primary remains Gemini 3.1 Flash-Lite, and all 117 existing artifacts are preserved.

## Selected real demo item audit

This table distinguishes already reviewed limited summaries from the missing full-rule/form requirements. Exact artifact IDs, source versions, editions, official URLs, related form references and warnings are in the [machine-readable receipt](../../backend/reports/opencode-continuation-acceptance.json).

| ID / official source | Recorded source edition | Fact/rule scope | Rules | Forms | EN/HI/KN artifacts | Publication / citizen check |
|---|---|---|---|---|---|---|
| [IN-WK-02](https://financialservices.gov.in/pmjjby) Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) | Edition not established | Reviewed limited summary; full rules incomplete | 3 stored; runtime blocked | FORM-10 (20 labels); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-WK-03](https://financialservices.gov.in/pmsby) Pradhan Mantri Suraksha Bima Yojana (PMSBY) | Edition not established | Reviewed limited summary; full rules incomplete | 3 stored; runtime blocked | FORM-11 (22 labels); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-WK-04](https://financialservices.gov.in/atal-pension-yojana) Atal Pension Yojana (APY) | Edition not established | Research only; current fact review required | 0 stored; runtime blocked | FORM-19 (29 labels); 0 approved complete guides | EN: not prepared; HI: not prepared; KN: not prepared | Internal; no public acceptance claimed |
| [IN-FA-01](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238588&lang=1&reg=1) Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-03 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-WO-02](https://pmuy.gov.in/Ujjwala2.html) Pradhan Mantri Ujjwala Yojana (PMUY / Ujjwala 2.0) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-01 (17 labels), FORM-02 (reference), FORM-16 (7 labels), FORM-17 (23 labels), FORM-18 (8 labels); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-ST-02](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323830&lang=1&reg=3) National Means-cum-Merit Scholarship Scheme (NMMSS) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-04 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-FA-03](https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13525&Mode=0) Kisan Credit Card (KCC) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-08 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-SR-02](https://www.indiapost.gov.in/banking-services/savings) Senior Citizens Savings Scheme (SCSS) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-13 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-WO-03](https://www.indiapost.gov.in/banking-services/savings) Sukanya Samriddhi Account (SSA) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-12 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |
| [IN-WK-01](https://www.eshram.gov.in/Schemes) Pradhan Mantri Shram Yogi Maandhan (PM-SYM) | Edition not established | Reviewed limited summary; full rules incomplete | 0 stored; runtime blocked | FORM-09 (reference); 0 approved complete guides | EN: APPROVED; HI: APPROVED; KN: APPROVED | Published; all 3 detail responses HTTP 200 |

FORM-10/11 contain outdated printed premiums (330 versus current FAQ 436; 12 versus 20). FORM-19 has 29 labels but unresolved edition/currentness/reuse review and an unpublished APY parent scheme. The previous owner decision keeping form fact/rights/currentness preparation pending is preserved. None is represented as a completed approved trilingual guide. Other original references retain their own coverage warnings; FORM-18 is a distributor/mechanic checklist, not a citizen application.

## Verification and preservation

- **145 backend + 18 frontend unit/API tests; 52 isolated MongoDB integration cases passed.** Includes read-only rollback through actual Mongoose/driver/HTTP paths, separate-process socket delivery/replay/session revocation, duplicate/version preservation, worker interruption, form lease fencing, permanent-error handling, cache reuse, native labels and source-only examples.
- **66 distinct desktop/mobile browser cases verified:** 44 base regression/monitor cases, 16 Forms/viewer cases, four content/editorial cases and two simplified-approval cases. The base run passed 43 cases before an old mobile OCR assertion incorrectly required a hidden original-document panel to be visible; both actual-government-PDF/raster cases then passed with the correct manual tab selection. Content and approval fixtures intentionally publish the same revisions and conflicted when combined in one DB; both suites passed in separate isolated harnesses. These are test corrections, not evidence of government-content approval.
- Production build passed. Existing bundle-size advisory remains; it does not prevent the build. Unit/browser fixtures and recorded RSS rehearsals are explicitly offline and separate from the two real requests above.
- Actual read-only demo acceptance returned **HTTP 200 for all 72 published scheme/language detail requests**. All 24 remain visible to the existing catalog. PMJJBY/PMSBY correctly return a blocked real check rather than asking personal questions or giving an incomplete verdict. Real public notice publications and published scam lessons remain **zero**.
- All **22 protected legacy collection hashes** match the pre-OpenCode baseline. All pre-existing demo schemes, AI artifacts, source versions, content approvals, form references and documents match the continuation snapshot byte-for-byte under the recorded JSON hash method; only the reported new RSS versions/records and operational log entries were added.
- Backend `.env`, local chat receipts, encrypted backups and test databases remain excluded from Git. Configured-secret scanning found no matches in shareable files. Application configuration and credentials were not printed or replaced.

Screenshots of actual demo Atlas data:

- [Live monitor — desktop](../../frontend/reports/opencode-continuation/demo-live-monitor-desktop.png) / [mobile](../../frontend/reports/opencode-continuation/demo-live-monitor-mobile.png): persisted genuine run history, clearly described as recent events, not a new live fetch on page load.
- [Forms library](../../frontend/reports/opencode-continuation/demo-forms-library.png).
- [PMJJBY reviewed information and rule gap](../../frontend/reports/opencode-continuation/demo-eligibility-gap.png).

## Remaining acceptance failures and next work

1. **Zero fully executable real rule sets.** The exact two approved three-rule packets are preserved but incomplete; the one-account exclusion and governing age/renewal/termination scope need a new complete source-bound revision and genuine review. APY additionally lacks a complete approved current packet, including its applicable tax-payer exclusion/current rules. Development authorization is not a government fact approval.
2. **Zero approved complete form guides.** Eight documents are stored, but edition, complete conditions/declarations, reuse and multilingual editorial prerequisites remain unresolved. No source rights or prior negative/pending review decision was overridden to make Gemini preparation run.
3. **Zero public notice/scam publications.** Three genuinely fetched new notices are staged; the original 12 scam-awareness research topics remain internal. The frozen notice/scam slice still needs current source-specific review, complete multilingual reviewed content and public acceptance. Do not count existing research or the working upload tool as that completed catalog.
4. **Source/discovery/provider limits.** No new Jan Suraksha/PIB/I4C automation grant exists. Tavily is implemented but disabled/unverified for this account. Gemini secondary authorization and Groq entitlement remain unchanged. ImageKit has no new approved rehosting proof. Offline adapter/provider tests do not satisfy these live requirements.
5. **Remaining engineering acceptance.** Full four-source enrichment/state-machine acceptance, a complete reviewed scheme → real eligibility → approved form journey, physical microphone/native voice assessment and the 5–8 public scam lesson slice are not complete. The completeness assessment and existing workers are building blocks, not a claim that those end-to-end gates passed.

Raw pending observations rose by three because genuine new evidence requires review. No count was forced to zero and no original historical record was deleted. Continue from the existing admin worklist and reviewed revisions; do not rerun the old full migration or rebuild the application. See the [operations/rollback runbook](../guides/DEMO_OPERATIONS_RUNBOOK.md).
