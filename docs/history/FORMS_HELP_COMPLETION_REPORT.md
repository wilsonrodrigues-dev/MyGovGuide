# Forms Help implementation results — 21 November 2026

**Preparation and persistence are implemented; verified citizen guidance is not released.** Five real official PDFs now have 15 current EN/HI/KN source-grounded Gemini candidates in Atlas. Human fact/reuse/currentness and exact editorial decisions remain ungranted under master plan §17.4. No approval or hosting permission was fabricated. This is not a claim that the entire citizen milestone is complete.

| Form | Source-mapped units* | EN | HI | KN | Saved in MongoDB | Actual desktop/mobile UI |
|---|---:|---|---|---|---|---|
| FORM-20 — ECI Form 6 - Application for New Voters | 56 | Draft ✓ | Draft ✓ | Draft ✓ | Yes | PDF + private draft preview; public guide blocked |
| FORM-21 — ECI Form 8 - Shifting, Correction, Replacement EPIC or PwD | 45 | Draft ✓ | Draft ✓ | Draft ✓ | Yes | PDF + private draft preview; public guide blocked |
| FORM-22 — UIDAI Aadhaar Enrolment/Update Form 1 - Adults | 44 | Draft ✓ | Draft ✓ | Draft ✓ | Yes | PDF + private draft preview; public guide blocked |
| FORM-23 — ECI Form 7 - Electoral Objection or Deletion | 33 | Draft ✓ | Draft ✓ | Draft ✓ | Yes | PDF + private draft preview; public guide blocked |
| FORM-24 — ECI Form 6A - Overseas Elector Application | 63 | Draft ✓ | Draft ✓ | Draft ✓ | Yes | PDF + private draft preview; public guide blocked |

*241 guidance units, not 241 applicant inputs: headings, instructions, attachments and office-only areas are distinguished. All 162 pre-existing field IDs/labels/pages are preserved. Complete machine-readable [coverage](../../backend/reports/forms-help-coverage.json) lists every current unit, page, required/optional/conditional/unknown state, evidence reference and three artifact IDs. UNKNOWN and procedural gaps remain Needs verification. The 723 current language entries passed structural/source-binding/native-script/numeric checks; these checks do not certify linguistic or legal interpretation.

## Implemented in the existing system

Evidence-identified blank forms can enter the existing worker before publication review. Eight-unit bounded requests save resumable parts; compact AI output supplies meaning and what to enter while the server retains exact labels, page, conditions, instructions and evidence. PDF/inventory/immutable-version binding prevents stale cache use. Changed individual units can regenerate while source-identical units reuse validated prior output and recorded lineage. Rejections do not become approvals.

Existing routes remain `/api/forms`, `/api/forms/:id?language=en|hi|kn`, `/forms/:id`, and `/admin/forms?formId=FORM-20`. The admin's original-document preview now selects a field and EN/HI/KN saved draft together. Citizen readiness and per-language preparation are separate; pending text is not exposed as verified public guidance. Missing translations retain their original inventory labels instead of disappearing. Retry hides a failed language's previous explanation. No private upload enters the public provider chain.

## Genuine generation and storage

Active database: `mygovguide_demo_v2`, using the existing ignored backend `.env`. Actual provider/model: **Gemini / gemini-3.1-flash-lite**. The [official Standard pricing table](https://aistudio.google.com/docs/pricing#gemini-3.1-flash-lite) lists free-tier input/output; account free entitlement is the owner's prior attestation. Paid approval remained false and budget zero. No grounding/tools, paid fallback or key rotation was used.

**18 persisted artifacts: 15 current and three superseded Form 7 revisions**, all REVIEW_PENDING. **99 successful real generation responses** are recorded in artifact parts. Four rejected validation responses were detected; the initial uncertainty error was corrected by retaining server-owned classification. UIDAI identifier-length assertions absent from the supplied evidence were rejected and corrected through explicit validator feedback. Two later rejected-part diagnostics remain in jobs; earlier failures retain operation events, not full response bodies. One HTTP 429 was retained, cooldown respected, and progress resumed. Cooldown-only skips made no model request. Form 7's unsupported optional-phone classification became UNKNOWN: only that unit was generated again, with **96 unchanged language units reused**. No valid full guide was needlessly regenerated.

Mongo read-back verified every current artifact, its full unit coverage, PDF hash and source version. Six new immutable inventory versions preserve all old source evidence. Existing counts remain 35 schemes, 24 scheme publications, 24 form references, 13 inspected documents, 163 notices and 117 scheme AI artifacts. Zero scheme/notice/form publication actions occurred. [Sanitized acceptance receipt](../../backend/reports/forms-help-acceptance.json).

## Source checks and unresolved release gates

All five targeted PDF requests returned HTTP 200 and unchanged hashes. Three ECI filling-guideline PDFs and the current UIDAI charge page also returned 200. These were bounded development document inspections, not authorized scheduled scraping.

- [FORM-20: official PDF](https://voters.eci.gov.in/formspdf/Form_6_English.pdf) — 2 pages; SHA-256 `2d89e57e2e530989e628872a19c1334a0d968e081ffb542c55e9336ca714a179`.
- [FORM-21: official PDF](https://voters.eci.gov.in/formspdf/Form_8_English.pdf) — 2 pages; SHA-256 `41d815f8462f48e130f001882b5a0c26e32540e8b2f6b7e589edd03c92c75c90`.
- [FORM-22: official PDF](https://uidai.gov.in/images/Form_1_Eng.pdf) — 2 pages; SHA-256 `68b2eac3796a0d658b04b4c2398c08c950ff46e6d85995bc942130d3cec300d4`.
- [FORM-23: official PDF](https://voters.eci.gov.in/formspdf/Form_7_English.pdf) — 1 pages; SHA-256 `f5cc8c6b30a4d948a403cda8ba5b8f9743cf285537da8f6b952330d3fd7d8d66`.
- [FORM-24: official PDF](https://voters.eci.gov.in/formspdf/Form_6A_English.pdf) — 4 pages; SHA-256 `650b15022cabb2c824be06f2bb45c969caed1a97a6837bccbb761bcaac3b5620`.

- FORM-20: source-grounded Aadhaar alternative, photo, proof alternatives, family details, declarations and accessibility instructions are retained. Current/local SIR supplementary-declaration applicability still needs ERO confirmation; never sign an untrue first-enrolment assertion. [Official Form 6 instructions](https://voters.eci.gov.in/guidelines/Form-6_en.pdf).
- FORM-21: shifting, correction, replacement and PwD branches stay separate, including conditional photo/FIR/old-EPIC requirements. [Official Form 8 instructions](https://voters.eci.gov.in/guidelines/Form-8_en.pdf).
- FORM-22: the adult form's printed child-waiver end date is superseded by the [current UIDAI charges page](https://www.uidai.gov.in/en/aadhaar-seva-kendra). Centre services, online document updates and age exceptions are distinct; no blanket free-service claim is made.
- FORM-23: deletion of another entry, proposed-inclusion objection and self-deletion remain separate; mobile requiredness is explicitly uncertain. [Official Form 7 instructions](https://voters.eci.gov.in/guidelines/Form-7_en.pdf).
- FORM-24: four-page packet includes an office-only page and historical appendix. The old example/January-only wording and NVSP references are not current deadlines or application directions. [Current ECI registration guidance](https://www.eci.gov.in/faq/en/how-to-register/) differs; overseas-specific reconciliation requires ERO confirmation.

All five lack genuine fact/rights/currentness and exact multilingual editorial decisions. PDF embedding/rehosting rights remain unestablished: the real viewer was tested with locally selected official downloads and SHA verification, not an unauthorized proxy or fabricated ImageKit permission. Public verified guides remain **zero**. Currentness and translation accuracy must be resolved in the existing review workspace before release. Optional read-aloud/manual controls are preserved; browser speech behavior is tested with explicit synthetic speech controls, not claimed as a physical microphone/native-voice certification.

## Verification and screenshots

**307 automated cases passed**: 159 backend units, 21 frontend units, 55 isolated integrations and 72 browser cases. Final failures: zero. Production build passed. Coverage includes source-inventory mismatch, missing/failed language, safe/unsafe/scanned uploads, retention/privacy, cached reuse, quota recovery, unchanged evidence, review/publication gates and existing citizen/admin flows. Synthetic tests are not described as real Gemini or government collection.

Additionally, **ten actual Atlas desktop/mobile journeys** checked the five official PDFs, every page (including all four Form 6A pages), field selection, exact saved language text, refresh persistence, no invented PDF widgets and no mobile overflow. All 72 language responses for existing 24 published schemes passed. All **39 legacy collections / 3,215 documents** match the verified backup hashes using original Mongo ordering; all 22 task-baseline protected hashes also match. Both databases were read-only for acceptance. Secrets remain Git-ignored; no environment configuration was changed.

[Real desktop draft preview](../../frontend/reports/forms-help/FORM-20-desktop-admin-draft.png) · [Real mobile draft preview](../../frontend/reports/forms-help/FORM-20-mobile-admin-draft.png) · [Citizen original PDF](../../frontend/reports/forms-help/FORM-20-desktop-citizen-original.png) · [Citizen mobile PDF](../../frontend/reports/forms-help/FORM-20-mobile-citizen-original.png). The acceptance JSON lists all 12 genuine screenshots.

Temporary web servers and the verified project test replica set were stopped after verification.
