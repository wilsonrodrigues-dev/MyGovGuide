# MyGovGuide data completeness audit

Audited 2026-11-20T16:09:31.873Z against **mygovguide_demo_v2**, using the existing application read-only guard. This task changed **zero MongoDB records, publication states or application features**. No server, collection worker, scheduler or AI generation was started. The legacy database was not accessed. All 17 audited collection hashes matched across the two read passes. The final end-of-audit read check also compared these collections against the initial snapshot; its receipt is in the machine report.

Machine-readable results: [data-completeness-audit.json](backend/reports/data-completeness-audit.json). This report inventories all 35 schemes, 19 form references and 163 notices; it does not promote research records to verified content.

## Meaning of the labels

| Label | Meaning |
|---|---|
| AVAILABLE | Stored traceable information/document exists; this alone does not mean approved, complete or current. |
| MISSING | The required stored fact, document, artifact or proof is absent. |
| INCOMPLETE | Partial, unapproved, contradictory, dated or insufficiently verified for the stated use. |
| READY | Passes the relevant current reviewed publication checks for the specified limited use; never equated with complete eligibility or a complete form journey. |

**READY applies only to the named use.** A published limited summary can be READY while the scheme's complete eligibility/form journey is INCOMPLETE. The exact existing eligibility validator was executed read-only for every stored rule set; an unapproved or incomplete set never counts as executable.

## Inventory findings

| Measure | Actual count |
|---|---:|
| Schemes / published schemes | 35 / 24 |
| Current limited fact approvals / READY limited EN-HI-KN summaries | 25 / 24 |
| Stored rule sets / complete approved executable rule sets | 38 / 0 |
| Form references / stored documents / hash-verified local PDFs | 19 / 8 / 8 |
| Complete approved EN-HI-KN form guides | 0 |
| Notices / published / stored multilingual notice artifacts | 163 / 0 / 0 |
| Genuine collected RSS / imported research / synthetic notice examples | 147 / 12 / 4 |
| Verified-current notices / historical / research-currentness-unverified | 0 / 107 / 56 |

The 404 SchemeFact rows include historical/research versions: their mere presence is not 404 approved current facts. Limited reviewed facts below come from the matching current ContentApproval and immutable source version. Existing valid language artifacts should be reused. The failed Gruha Jyothi Kannada attempt coexists with a structurally valid current REVIEW_PENDING Kannada artifact; neither establishes current official entitlement or publication approval. No regeneration was attempted.

## Five proposed demo forms: actual official PDFs

All five direct official-document requests returned HTTP 200 with valid PDF signatures and successful local parsing. The browser fetch initially failed for Form 6A/UIDAI; the ordinary direct HTTPS requests succeeded without changing TLS, authentication or source permissions. No proposed form was registered or inserted into MongoDB. Page counts cover the **whole downloaded packet**, not just applicant fields.

| Form | Actual pages | One page? | Availability / currentness | Suitability and exact limitation |
|---|---:|---|---|---|
| [UIDAI Aadhaar Enrolment/Update Form 1](https://uidai.gov.in/images/Form_1_Eng.pdf) | 2 | No | PDF AVAILABLE; currentness INCOMPLETE; guide INCOMPLETE | Short two-page candidate for adult resident Indians / NRIs with Indian proof of address; document-based and Head-of-Family branches require careful guidance. Not a one-page form. Officially served PDF is accessible, but its fee footnote ends the 7–15 biometric-update waiver on 30 September 2026; current UIDAI ASK page extends it to 30 September 2027. Do not reuse the stale fee footnote as current guidance. Not for children or all NRI situations; confirm applicable adult category and current supporting-document list. |
| [ECI Form 6 - application for new voters](https://voters.eci.gov.in/formspdf/Form_6_English.pdf) | 2 | No | PDF AVAILABLE; currentness AVAILABLE; guide INCOMPLETE | Strong general-purpose two-page demo candidate; not one page. Requires photo, identity/age/address options and declaration handling. Currently served at the official ECI download path; no explicit printed edition date proves all local/SIR requirements are satisfied. ECI portal separately lists SIR declaration documents. Applicability must be verified for the selected state/revision; the base PDF alone may not be the complete packet. |
| [ECI Form 8 - shifting/correction/replacement/PwD](https://voters.eci.gov.in/formspdf/Form_8_English.pdf) | 2 | No | PDF AVAILABLE; currentness AVAILABLE; guide INCOMPLETE | Compact but more complex than Form 6: four mutually selected routes. Suitable after branch-specific evidence and review; not one page. Current official download serves the modern combined four-purpose form, not old Form 8A. No explicit printed edition date is certified. Branch-specific attachments and optional Aadhaar/contacts must be preserved; no universal document list. |
| [ECI Form 7 - objection/deletion](https://voters.eci.gov.in/formspdf/Form_7_English.pdf) | 1 | Yes | PDF AVAILABLE; currentness AVAILABLE; guide INCOMPLETE | Only genuinely one-page candidate among these five, but substantively sensitive: objections/deletion affect electoral rights. Suitable only with precise branch and evidence guidance, not as a harmless default demo. Current official download is available; no explicit printed edition date is certified. Distinguish self-deletion, objection and deletion of another person; preserve legal declaration and death-certificate option. |
| [ECI Form 6A - overseas elector inclusion](https://voters.eci.gov.in/formspdf/Form_6A_English.pdf) | 4 | No | PDF AVAILABLE; currentness INCOMPLETE; guide INCOMPLETE | Not a one-page form and not the best first short demo: passport/visa/overseas-address requirements and dated appended guidance add complexity. Officially served PDF has a legacy guideline page using only a 1 January age-qualification explanation, a 2017 example and old NVSP links. The current ECI registration FAQ describes four qualifying dates and the current portal. Reconcile rather than automatically rejecting the entire base form or asserting current complete guidance. Official PDF page 4 is a scanned guideline page with a text layer; inspect it visually as well as extracting text. |

Recommended order for a future reviewed short demonstration: **Form 6**, then one carefully selected **Form 8** branch. **Form 7** is shortest but is an objection/deletion instrument and needs precise safeguards. **Aadhaar Form 1** is a viable adult form after reconciling fee/currentness evidence. **Form 6A** is a four-page overseas packet, not a preferred one-page substitute. This is a document-suitability assessment, not approval to publish guides or an eligibility opinion.

UIDAI's downloaded Form 1 fee table still ends a child biometric waiver in September 2026; the [current official ASK charges page](https://www.uidai.gov.in/en/aadhaar-seva-kendra) states September 2027. That footnote is stale even though Form 1 itself is an adult application. ECI Form 6A's appended page uses a 2017 example and legacy NVSP links; reconcile it with [ECI's current registration information](https://www.eci.gov.in/faq/en/how-to-register/) and [overseas-elector FAQ](https://www.eci.gov.in/faq/2/10). The [current ECI portal](https://voters.eci.gov.in/?content_type=cms&language=1) separately lists SIR declarations; do not assume the two-page Form 6 is every applicant's full packet. HTTP Last-Modified is not a certified edition/effective date.

All five PDFs expose text but **zero AcroForm widgets**: they are printable forms, not ready-made machine-readable field schemas. No complete field inventory, trilingual guide or publication approval was created. PDF hashes, Last-Modified, layout and specific documents needed next are in the machine report.

## Every scheme: overview

In the language columns READY means a valid current approved artifact with the current published index; AVAILABLE means a valid current prepared artifact still pending publication/review. All complete scheme journeys remain INCOMPLETE. Portal/PDF labels describe stored evidence, not a freshly tested government submission service.

| ID / name | Limited summary | Benefit facts | Conditions / exclusions | Documents / steps | EN / HI / KN | Application evidence | Linked forms | Complete executable rules |
|---|---|---|---|---|---|---|---|---|
| IN-EN-01: Pradhan Mantri MUDRA Yojana (PMMY) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-EN-02: Prime Minister Street Vendor AtmaNirbhar Nidhi (PM SVANidhi) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-EN-03: PM Vishwakarma | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-EN-04: Prime Minister Employment Generation Programme (PMEGP) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-FA-01: Pradhan Mantri Kisan Samman Nidhi (PM-KISAN) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-03 | No |
| IN-FA-02: Pradhan Mantri Fasal Bima Yojana (PMFBY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-05 | No |
| IN-FA-03: Kisan Credit Card (KCC) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-08 | No |
| IN-FA-04: Soil Health Card Programme | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | PUBLIC_PAGE_REFERENCE_ONLY | FORM-15 | No |
| IN-FA-05: National Agriculture Market (e-NAM) Farmer Registration | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-07 | No |
| IN-FA-06: Pradhan Mantri Kisan Maandhan Yojana (PM-KMY) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | INCOMPLETE / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-GN-01: Pradhan Mantri Jan-Dhan Yojana (PMJDY) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-GN-02: Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-GN-03: Pradhan Mantri Awaas Yojana-Gramin (PMAY-G) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-GN-04: Pradhan Mantri Awas Yojana-Urban 2.0 (PMAY-U 2.0) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-SR-01: Pradhan Mantri Vridhavastha Pension Yojana | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-SR-02: Senior Citizens Savings Scheme (SCSS) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-13 | No |
| IN-SR-03: Rashtriya Vayoshri Yojana (RVY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| IN-ST-01: PM-USP Central Sector Scholarship for College and University Students | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-04 | No |
| IN-ST-02: National Means-cum-Merit Scholarship Scheme (NMMSS) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-04 | No |
| IN-ST-03: AICTE Pragati Scholarship for Girl Students (Technical Degree) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-04 | No |
| IN-ST-04: AICTE Saksham Scholarship (Technical Degree) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-04 | No |
| IN-ST-05: PM YASASVI Top Class Education in College (OBC/EBC/DNT) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-04 | No |
| IN-WK-01: Pradhan Mantri Shram Yogi Maandhan (PM-SYM) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-09 | No |
| IN-WK-02: Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | INCOMPLETE / INCOMPLETE | READY / READY / READY | DOWNLOADABLE_PDF_REFERENCE | FORM-10 | No |
| IN-WK-03: Pradhan Mantri Suraksha Bima Yojana (PMSBY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | INCOMPLETE / INCOMPLETE | READY / READY / READY | DOWNLOADABLE_PDF_REFERENCE | FORM-11 | No |
| IN-WK-04: Atal Pension Yojana (APY) | INCOMPLETE; INTERNAL | INCOMPLETE | MISSING / MISSING | MISSING / INCOMPLETE | MISSING / MISSING / MISSING | DOWNLOADABLE_PDF_REFERENCE | FORM-19 | No |
| IN-WO-01: Pradhan Mantri Matru Vandana Yojana (PMMVY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | ONLINE_PORTAL_REFERENCE | FORM-06 | No |
| IN-WO-02: Pradhan Mantri Ujjwala Yojana (PMUY / Ujjwala 2.0) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | INCOMPLETE / INCOMPLETE | READY / READY / READY | DOWNLOADABLE_PDF_REFERENCE | FORM-01, FORM-02, FORM-16, FORM-17, FORM-18 | No |
| IN-WO-03: Sukanya Samriddhi Account (SSA) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-12 | No |
| IN-WO-04: Janani Suraksha Yojana (JSY) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| KA-GN-01: Gruha Jyothi | AVAILABLE; INTERNAL | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | AVAILABLE / AVAILABLE / AVAILABLE | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-14 | No |
| KA-GN-02: Anna Bhagya | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | MISSING | No |
| KA-ST-01: Yuva Nidhi | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-14 | No |
| KA-WO-01: Gruha Lakshmi | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-14 | No |
| KA-WO-02: Shakti Scheme (Karnataka) | READY; PUBLISHED | AVAILABLE | MISSING / MISSING | MISSING / INCOMPLETE | READY / READY / READY | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE | FORM-14 | No |

## Per-scheme facts, source references and exact gaps

### IN-EN-01 - Pradhan Mantri MUDRA Yojana (PMMY)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PMMY supports eligible micro-enterprises with institutional business credit, including term-loan or working-capital needs. It is repayable borrowing rather than an unconditional subsidy.. Missing/unverified: Lender appraisal, current loan categories including Tarun Plus, repayment terms, interest and documentation require current operative/lender review. No credit approval or rate is promised. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Lender appraisal, current loan categories including Tarun Plus, repayment terms, interest and documentation require current operative/lender review. No credit approval or rate is promised.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy
- APPLICATION_REFERENCE: https://financialservices.gov.in/pradhan-mantri-mudra-yojana-pmmy

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-EN-01: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Lender appraisal, current loan categories including Tarun Plus, repayment terms, interest and documentation require current operative/lender review. No credit approval or rate is promised.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-EN-02 - Prime Minister Street Vendor AtmaNirbhar Nidhi (PM SVANidhi)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PM SVANidhi supports qualifying street vendors through working-capital credit and related financial-inclusion measures. Repayment and vendor-verification conditions apply.. Missing/unverified: The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2303797&lang=2&reg=48"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2303797&lang=2&reg=48
- APPLICATION_REFERENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2303797&lang=2&reg=48

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-EN-02: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The August2026 announcement reports the restructured scheme; old loan limits must not be reused. Current tranches, vendor documents, municipal coverage, rates and application steps need review.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-EN-03 - PM Vishwakarma

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PM Vishwakarma combines recognition, training, tools, conditional credit and marketing support for qualifying traditional artisans and craftspeople. Each component has its own requirements.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159998&lang=1&reg=1"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159998&lang=1&reg=1
- APPLICATION_REFERENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=159998&lang=1&reg=1

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-EN-03: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Covered trades, family restrictions, prior-loan exclusions, current registration availability, component conditions and documents require governing-guideline review. A registration target being met is not proof that new applications are open.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-EN-04 - Prime Minister Employment Generation Programme (PMEGP)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: The cited PMEGP guidelines describe credit-linked support for new non-farm micro-enterprises. Bank lending, beneficiary contribution and subsidy conditions apply; the programme is not an unconditional cash payment.. Missing/unverified: The retrieved guidelines explicitly cover continuation through2025-26. Current2026-27 continuation/amendment evidence is required before publication; a statistics dashboard alone is insufficient. Project limits, subsidy percentages, training and documents need current review. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; The retrieved guidelines explicitly cover continuation through2025-26. Current2026-27 continuation/amendment evidence is required before publication; a statistics dashboard alone is insufficient. Project limits, subsidy percentages, training and documents need current review.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The retrieved guidelines explicitly cover continuation through2025-26. Current2026-27 continuation/amendment evidence is required before publication; a statistics dashboard alone is insufficient. Project limits, subsidy percentages, training and documents need current review.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.msme.gov.in/static/uploads/2025/06/a5d3bb85a742c20836cca93360cdd62e.pdf"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.msme.gov.in/static/uploads/2025/06/a5d3bb85a742c20836cca93360cdd62e.pdf
- APPLICATION_REFERENCE: https://www.msme.gov.in/static/uploads/2025/06/a5d3bb85a742c20836cca93360cdd62e.pdf

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-EN-04: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The retrieved guidelines explicitly cover continuation through2025-26. Current2026-27 continuation/amendment evidence is required before publication; a statistics dashboard alone is insufficient. Project limits, subsidy percentages, training and documents need current review.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-01 - Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Agriculture and Farmers Welfare; Farmer families meeting the scheme conditions; this packet is not an eligibility assessment. Source reports INR 6000 annual assistance to qualifying farmer families, split into three payments through DBT. Important limits: Complete current operative eligibility/exclusions not reviewed; Document checklist not verified in this release; Current application window not verified; Release dated 2026-03-11; does not certify all later amendments |
| benefits | AVAILABLE | Stored: Source reports INR 6000 annual assistance to qualifying farmer families, split into three payments through DBT.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete candidate audience information only. No rule set or personal eligibility assessment is approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility/exclusions not reviewed |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility/exclusions not reviewed |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Document checklist not verified in this release |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official PM-KISAN portal for registration/status and e-KYC guidance; the source does not establish a currently open application window."],"url":"https://pmkisan.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Current application window not verified |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 2 valid current prepared, 1 approved; hi: 2 valid current prepared, 1 approved; kn: 2 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-03 PM-KISAN New Farmer Registration: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238588&lang=1&reg=1
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2238588&lang=1&reg=1
- APPLICATION_REFERENCE: https://pmkisan.gov.in/
- SUPPORTING_EVIDENCE: https://pmkisan.gov.in/
- FORM_REFERENCE: https://www.pmkisan.gov.in/RegistrationFormupdated.aspx

Fact review: adb8396aa0a778acbcf9fe2e97b994352d0f98a84111efde572f538651d3a3a8; verified 2026-11-18T08:38:58.332Z; valid until 2026-11-25T08:42:54.323Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Complete current operative eligibility/exclusions not reviewed
- Document checklist not verified in this release
- Current application window not verified
- Release dated 2026-03-11; does not certify all later amendments
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-02 - Pradhan Mantri Fasal Bima Yojana (PMFBY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Agriculture and Farmers Welfare; Crop-loss insurance for participating farmers, including eligible tenants/sharecroppers, subject to notified crops, areas and policy conditions. Important limits: State/crop/season-specific premium, deadlines, insurable interest and claim requirements not fully verified.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Crop-loss insurance for participating farmers, including eligible tenants/sharecroppers, subject to notified crops, areas and policy conditions.. Missing/unverified: State/crop/season-specific premium, deadlines, insurable interest and claim requirements not fully verified. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Ask the official PMFBY portal or the implementing insurer/agriculture office about notified crops, current enrolment and claims."],"url":"https://pmfby.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-05 PMFBY Farmer Registration and Enrollment: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304549&lang=1&reg=48
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304549&lang=1&reg=48
- APPLICATION_REFERENCE: https://pmfby.gov.in/
- SUPPORTING_EVIDENCE: https://pmfby.gov.in/
- FORM_REFERENCE: https://pmfby.gov.in/

Fact review: 97ac0476371d1547a830172b4ff1cd166db23132eb6f0535270e69b27c3348ae; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:43:22.201Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- State/crop/season-specific premium, deadlines, insurable interest and claim requirements not fully verified.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-03 - Kisan Credit Card (KCC)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Financial Services / Banks; KCC is a bank credit facility for agriculture and allied working-capital/investment needs; it is a loan, not an unconditional grant. Important limits: The cited 2026 bank directions commence on 2027-01-01; do not present future limits or terms as operative now. Rates, limits and bank documentation are not asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: KCC is a bank credit facility for agriculture and allied working-capital/investment needs; it is a loan, not an unconditional grant.. Missing/unverified: The cited 2026 bank directions commence on 2027-01-01; do not present future limits or terms as operative now. Rates, limits and bank documentation are not asserted. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The cited 2026 bank directions commence on 2027-01-01; do not present future limits or terms as operative now. Rates, limits and bank documentation are not asserted. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult a participating bank for current KCC loan terms and its required supporting documents."],"url":"https://financialservices.gov.in/agriculture-credit"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-08 JanSamarth Credit Application Portal: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13525&Mode=0
- FACT_REVIEW_EVIDENCE: https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=13525&Mode=0
- APPLICATION_REFERENCE: https://financialservices.gov.in/agriculture-credit
- SUPPORTING_EVIDENCE: https://financialservices.gov.in/agriculture-credit
- FORM_REFERENCE: https://www.jansamarth.in/home

Fact review: b40d04770bf76f3745f1daaabc94c7eb660c0055d56f6468dcacfe8f302862cd; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:34.410Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-03: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The cited 2026 bank directions commence on 2027-01-01; do not present future limits or terms as operative now. Rates, limits and bank documentation are not asserted.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-04 - Soil Health Card Programme

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Agriculture and Farmers Welfare; Soil Health Cards give soil nutrient information and crop-wise fertilizer recommendations to support balanced nutrient management. This is advisory support, not a cash grant. Important limits: Exact local sampling procedure, charges if any and turnaround time not verified; the programme portal returned403 during inspection.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Soil Health Cards give soil nutrient information and crop-wise fertilizer recommendations to support balanced nutrient management. This is advisory support, not a cash grant.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Contact the local agriculture department or soil-testing service for sampling and access."],"url":"https://soilhealth.dac.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Exact local sampling procedure, charges if any and turnaround time not verified; the programme portal returned403 during inspection.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | PUBLIC_PAGE_REFERENCE_ONLY. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-15 Soil Health Card Portal: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294460&lang=1&reg=48
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294460&lang=1&reg=48
- APPLICATION_REFERENCE: https://soilhealth.dac.gov.in/
- SUPPORTING_EVIDENCE: https://soilhealth.dac.gov.in/
- FORM_REFERENCE: https://soilhealth.dac.gov.in/

Fact review: 50c63c384f6d51733c618f2ea8965870240ecfb8ab88a4bde85d0414725a9298; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:35.501Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-04: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Exact local sampling procedure, charges if any and turnaround time not verified; the programme portal returned403 during inspection.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-05 - National Agriculture Market (e-NAM) Farmer Registration

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Agriculture and Farmers Welfare; Farmer registration provides a route to participate in the e-NAM agricultural market platform, subject to APMC registration and approval. Important limits: No guaranteed price, buyer, cash payment or immediate approval. Full KYC checklist and current interface not verified.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Farmer registration provides a route to participate in the e-NAM agricultural market platform, subject to APMC registration and approval.. Missing/unverified: No guaranteed price, buyer, cash payment or immediate approval. Full KYC checklist and current interface not verified. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; No guaranteed price, buyer, cash payment or immediate approval. Full KYC checklist and current interface not verified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Use the official e-NAM registration guidance or contact the relevant Mandi/APMC. Registration/KYC needs APMC approval."],"url":"https://enam.gov.in/resources/registration-guideline"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No guaranteed price, buyer, cash payment or immediate approval. Full KYC checklist and current interface not verified.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-07 e-NAM Farmer Registration Guidelines: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://enam.gov.in/resources/registration-guideline
- FACT_REVIEW_EVIDENCE: https://enam.gov.in/resources/registration-guideline
- APPLICATION_REFERENCE: https://enam.gov.in/resources/registration-guideline
- SUPPORTING_EVIDENCE: https://enam.gov.in/resources/registration-guideline
- FORM_REFERENCE: https://enam.gov.in/resources/registration-guideline

Fact review: 8e15baf2fa521bdc76e5c66d205f36e815caa3137988f6b3e88c6eb771abb3a4; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:36.398Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-05: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- No guaranteed price, buyer, cash payment or immediate approval. Full KYC checklist and current interface not verified.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-FA-06 - Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PM-KMY is a contribution-based pension programme for qualifying small and marginal farmers. Subscriber contributions and government matching support form part of the pension arrangement; it is distinct from PM-KISAN income support.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Entry-age and land-record cutoffs, exclusions, contribution schedules and spouse/exit rules need operative review. The short checklist is reported in the announcement and is not certified complete.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Entry-age and land-record cutoffs, exclusions, contribution schedules and spouse/exit rules need operative review. The short checklist is reported in the announcement and is not certified complete.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | INCOMPLETE | Stored: Aadhaar card; Bank account details; Mobile number for OTP verification. Missing/unverified: Complete scheme-specific current document checklist is not certified.; Entry-age and land-record cutoffs, exclusions, contribution schedules and spouse/exit rules need operative review. The short checklist is reported in the announcement and is not certified complete.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309204&lang=1&reg=6"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309204&lang=1&reg=6
- APPLICATION_REFERENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2309204&lang=1&reg=6

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-FA-06: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Entry-age and land-record cutoffs, exclusions, contribution schedules and spouse/exit rules need operative review. The short checklist is reported in the announcement and is not certified complete.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-GN-01 - Pradhan Mantri Jan-Dhan Yojana (PMJDY)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PMJDY provides basic banking access for unbanked people, including a basic savings account without a minimum-balance requirement. Associated insurance and overdraft facilities have separate conditions.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; KYC, account-opening requirements and current conditions for overdraft and insurance need operative-document review.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; KYC, account-opening requirements and current conditions for overdraft and insurance need operative-document review.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://pmjdy.gov.in/scheme"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://pmjdy.gov.in/scheme
- APPLICATION_REFERENCE: https://pmjdy.gov.in/scheme

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-GN-01: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- KYC, account-opening requirements and current conditions for overdraft and insurance need operative-document review.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-GN-02 - Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (AB PM-JAY)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: AB PM-JAY supports cashless hospital care for covered beneficiaries through participating hospitals. Coverage depends on the relevant beneficiary category, verified enrolment, treatment package and implementation arrangements.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160081&id=160081&lang=2&reg=48"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160081&id=160081&lang=2&reg=48
- APPLICATION_REFERENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160081&id=160081&lang=2&reg=48

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-GN-02: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- State-specific coverage, senior-citizen category conditions, verification documents, exclusions and current hospital packages need review; no individual coverage decision is made.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-GN-03 - Pradhan Mantri Awaas Yojana-Gramin (PMAY-G)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PMAY-G supports rural housing for qualifying households without adequate housing. Assistance and basic amenities depend on official beneficiary selection and local implementation.. Missing/unverified: The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210378&lang=1&reg=1"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210378&lang=1&reg=1
- APPLICATION_REFERENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2210378&lang=1&reg=1

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-GN-03: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The source is a January2026 year-end announcement, not a complete governing guideline. Current selection lists, land conditions, assistance amounts, application steps and documents need review.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-GN-04 - Pradhan Mantri Awas Yojana-Urban 2.0 (PMAY-U 2.0)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: PMAY-U 2.0 supports qualifying urban households through different construction, purchase, rental and interest-subsidy arrangements. The applicable route and assistance depend on the scheme vertical and local implementation.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Income bands, property-ownership exclusions, beneficiary family definition, current amendments and vertical-specific document/application requirements need exact-clause review.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Income bands, property-ownership exclusions, beneficiary family definition, current amendments and vertical-specific document/application requirements need exact-clause review.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Income bands, property-ownership exclusions, beneficiary family definition, current amendments and vertical-specific document/application requirements need exact-clause review.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf
- APPLICATION_REFERENCE: https://pmay-urban.gov.in/uploads/guidelines/Operational-Guidelines-of-PMAY-U-2.pdf

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-GN-04: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Income bands, property-ownership exclusions, beneficiary family definition, current amendments and vertical-specific document/application requirements need exact-clause review.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-SR-01 - Pradhan Mantri Vridhavastha Pension Yojana

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Rural Development; The old-age social assistance pension is named Pradhan Mantri Vridhavastha Pension Yojana under the renamed national social assistance programme. Eligible poor older persons receive pension subject to applicable rules and state administration. Important limits: No state top-up or personal pension amount is asserted. Do not confuse recently revised disability-pension provisions with old-age pension.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: The old-age social assistance pension is named Pradhan Mantri Vridhavastha Pension Yojana under the renamed national social assistance programme. Eligible poor older persons receive pension subject to applicable rules and state administration.. Missing/unverified: No state top-up or personal pension amount is asserted. Do not confuse recently revised disability-pension provisions with old-age pension. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; No state top-up or personal pension amount is asserted. Do not confuse recently revised disability-pension provisions with old-age pension.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the state social welfare/rural development department or local body for the current pension application route."],"url":"https://nsap.dord.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160529&id=160529&lang=1&reg=32
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=160529&id=160529&lang=1&reg=32
- APPLICATION_REFERENCE: https://nsap.dord.gov.in/
- SUPPORTING_EVIDENCE: https://nsap.dord.gov.in/

Fact review: 627504480379ae52cddce5f3ed31ce550e770aa439438bd8884b88f59e19f3f3; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:37.312Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-SR-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- No state top-up or personal pension amount is asserted. Do not confuse recently revised disability-pension provisions with old-age pension.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-SR-02 - Senior Citizens Savings Scheme (SCSS)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | National Savings Institute / Ministry of Finance; SCSS is a government small-savings account product for the senior-citizen category, offered through eligible account providers. It requires a deposit and is not a welfare pension or free grant. Important limits: Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: SCSS is a government small-savings account product for the senior-citizen category, offered through eligible account providers. It requires a deposit and is not a welfare pension or free grant.. Missing/unverified: Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult a post office or authorized provider for current SCSS account opening, deposit and withdrawal terms."],"url":"https://www.indiapost.gov.in/banking-services/savings"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-13 SCSS account opening paperwork: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- FACT_REVIEW_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- APPLICATION_REFERENCE: https://www.indiapost.gov.in/banking-services/savings
- SUPPORTING_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- FORM_REFERENCE: https://www.nsiindia.gov.in/writereaddata/SchemeRules/SeniorCitizensSavingsSchemeRule.pdf

Fact review: 9a9034a4b948184d5ec19e5b1bd7c1dbb89ae552f306721d12110dc1b71f0400; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:38.217Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-SR-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Current notified interest period/rate, age exceptions, deposit limits, tax treatment and complete document checklist are not certified in this limited summary.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-SR-03 - Rashtriya Vayoshri Yojana (RVY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Social Justice and Empowerment; Rashtriya Vayoshri Yojana supports eligible senior citizens with assistive devices intended to improve mobility and daily functioning. Important limits: An evaluation report is not the full operative guideline; current income/age criteria, assessment camps and documents need confirmation.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Rashtriya Vayoshri Yojana supports eligible senior citizens with assistive devices intended to improve mobility and daily functioning.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; An evaluation report is not the full operative guideline; current income/age criteria, assessment camps and documents need confirmation.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; An evaluation report is not the full operative guideline; current income/age criteria, assessment camps and documents need confirmation. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Ask the social welfare department or implementing agency about current assessment/distribution arrangements."],"url":"https://socialjustice.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294289&lang=1&reg=48
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294289&lang=1&reg=48
- APPLICATION_REFERENCE: https://socialjustice.gov.in/
- SUPPORTING_EVIDENCE: https://socialjustice.gov.in/

Fact review: 8b4321800b33471f9450d30ec75995d6c7a27738c789c4195f3cb48510d326a5; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:39.114Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-SR-03: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- An evaluation report is not the full operative guideline; current income/age criteria, assessment camps and documents need confirmation.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-ST-01 - PM-USP Central Sector Scholarship for College and University Students

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Education / Department of Higher Education; The PM-USP college/university scholarship component provides higher-education financial assistance to qualifying students from economically weaker families, subject to scheme guidelines. Important limits: Exact scholarship rates, income/merit conditions, renewal rules and current application window are not certified; do not confuse with the separate J&K/Ladakh component.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: The PM-USP college/university scholarship component provides higher-education financial assistance to qualifying students from economically weaker families, subject to scheme guidelines.. Missing/unverified: Exact scholarship rates, income/merit conditions, renewal rules and current application window are not certified; do not confuse with the separate J&K/Ladakh component. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Exact scholarship rates, income/merit conditions, renewal rules and current application window are not certified; do not confuse with the separate J&K/Ladakh component.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official National Scholarship Portal and institution for the correct PM-USP college/university scheme and current requirements."],"url":"https://scholarships.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Exact scholarship rates, income/merit conditions, renewal rules and current application window are not certified; do not confuse with the separate J&K/Ladakh component.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-04 National Scholarship Portal: Student OTR & Scholarship Applications: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294003&lang=1&reg=6
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2294003&lang=1&reg=6
- APPLICATION_REFERENCE: https://scholarships.gov.in/
- SUPPORTING_EVIDENCE: https://scholarships.gov.in/
- FORM_REFERENCE: https://scholarships.gov.in/Students

Fact review: 8d23431d5b83605e2e4c97495f8a9b2a922a55dbabfcff5c6df81a63fa405fe4; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:40.004Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-ST-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Exact scholarship rates, income/merit conditions, renewal rules and current application window are not certified; do not confuse with the separate J&K/Ladakh component.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-ST-02 - National Means-cum-Merit Scholarship Scheme (NMMSS)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Education, Department of School Education and Literacy; Meritorious students from economically weaker families continuing secondary education after class VIII, subject to selection and scheme rules. Source reports an annual INR 12000 scholarship for selected qualifying students. Important limits: Required supporting documents are not specified in this release; Complete selection, renewal and income rules need operative-guideline review; October 31 registration date in this release is past; a later November 15 extension was found but its document could not be retrieved; no open deadline claimed |
| benefits | AVAILABLE | Stored: Source reports an annual INR 12000 scholarship for selected qualifying students.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete candidate audience information only. No rule set or personal eligibility assessment is approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Required supporting documents are not specified in this release; October 31 registration date in this release is past; a later November 15 extension was found but its document could not be retrieved; no open deadline claimed |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Selection is conducted by States/UTs; scholarship registration and disbursement use NSP. Confirm the current application window with the issuing authority."],"url":"https://scholarships.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; October 31 registration date in this release is past; a later November 15 extension was found but its document could not be retrieved; no open deadline claimed |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 2 valid current prepared, 1 approved; kn: 2 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-04 National Scholarship Portal: Student OTR & Scholarship Applications: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323830&lang=1&reg=3
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323830&lang=1&reg=3
- APPLICATION_REFERENCE: https://scholarships.gov.in/
- SUPPORTING_EVIDENCE: https://scholarships.gov.in/
- FORM_REFERENCE: https://scholarships.gov.in/Students

Fact review: 99ac04636daadc0da4d00372eac2a83042b75722cfefffa402c3047d1f322b6f; verified 2026-11-18T08:38:58.332Z; valid until 2026-11-25T08:43:46.290Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-ST-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Required supporting documents are not specified in this release
- Complete selection, renewal and income rules need operative-guideline review
- October 31 registration date in this release is past; a later November 15 extension was found but its document could not be retrieved; no open deadline claimed
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-ST-03 - AICTE Pragati Scholarship for Girl Students (Technical Degree)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | AICTE; Pragati supports girls pursuing eligible AICTE-approved technical degree education. The inspected degree guideline describes scholarship support and institution verification. Important limits: The official 2026-27 listing links a July2020 guideline. Current amendments, grant rate, income and merit limits, documents and interaction with other scholarships require review.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Pragati supports girls pursuing eligible AICTE-approved technical degree education. The inspected degree guideline describes scholarship support and institution verification.. Missing/unverified: The official 2026-27 listing links a July2020 guideline. Current amendments, grant rate, income and merit limits, documents and interaction with other scholarships require review. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The official 2026-27 listing links a July2020 guideline. Current amendments, grant rate, income and merit limits, documents and interaction with other scholarships require review. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Use the official NSP listing for the Pragati technical-degree scheme and institution verification; confirm current-year conditions."],"url":"https://scholarships.gov.in/All-Scholarships"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-04 National Scholarship Portal: Student OTR & Scholarship Applications: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2010_G.pdf
- FACT_REVIEW_EVIDENCE: https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2010_G.pdf
- APPLICATION_REFERENCE: https://scholarships.gov.in/All-Scholarships
- SUPPORTING_EVIDENCE: https://scholarships.gov.in/All-Scholarships
- FORM_REFERENCE: https://scholarships.gov.in/Students

Fact review: 3ddd27c47cac6097b7ff113ba554162416e2164b32de62990086b032b4ef6a54; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:40.944Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-ST-03: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The official 2026-27 listing links a July2020 guideline. Current amendments, grant rate, income and merit limits, documents and interaction with other scholarships require review.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-ST-04 - AICTE Saksham Scholarship (Technical Degree)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | AICTE; Saksham supports students with disabilities pursuing eligible AICTE-approved technical degree education, subject to scheme conditions and verification. Important limits: The official 2026-27 listing links a July2020 guideline. Current disability/income criteria, grant rates, documents and amendments need review; no personal eligibility verdict.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Saksham supports students with disabilities pursuing eligible AICTE-approved technical degree education, subject to scheme conditions and verification.. Missing/unverified: The official 2026-27 listing links a July2020 guideline. Current disability/income criteria, grant rates, documents and amendments need review; no personal eligibility verdict. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; The official 2026-27 listing links a July2020 guideline. Current disability/income criteria, grant rates, documents and amendments need review; no personal eligibility verdict.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The official 2026-27 listing links a July2020 guideline. Current disability/income criteria, grant rates, documents and amendments need review; no personal eligibility verdict. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Use the official NSP listing for the Saksham technical-degree scheme; obtain institution verification and confirm current-year requirements."],"url":"https://scholarships.gov.in/All-Scholarships"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-04 National Scholarship Portal: Student OTR & Scholarship Applications: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2012_G.pdf
- FACT_REVIEW_EVIDENCE: https://scholarships.gov.in/public/schemeGuidelines/AICTE/AICTE_2012_G.pdf
- APPLICATION_REFERENCE: https://scholarships.gov.in/All-Scholarships
- SUPPORTING_EVIDENCE: https://scholarships.gov.in/All-Scholarships
- FORM_REFERENCE: https://scholarships.gov.in/Students

Fact review: c6b60fa78ed754c83794a3eb68869082686e65d4267a7b0cf97bb87dd161b443; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:41.836Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-ST-04: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The official 2026-27 listing links a July2020 guideline. Current disability/income criteria, grant rates, documents and amendments need review; no personal eligibility verdict.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-ST-05 - PM YASASVI Top Class Education in College (OBC/EBC/DNT)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Social Justice and Empowerment; The ministry letter confirms continuation and institution-slot allocation for Top Class Education in Colleges for OBC, EBC and DNT students for academic year2026-27. Important limits: Letter/slot allocation is not a complete benefit or eligibility guideline; grant rates, family-income ceilings, documents and deadline must be reviewed.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: The ministry letter confirms continuation and institution-slot allocation for Top Class Education in Colleges for OBC, EBC and DNT students for academic year2026-27.. Missing/unverified: Letter/slot allocation is not a complete benefit or eligibility guideline; grant rates, family-income ceilings, documents and deadline must be reviewed. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Letter/slot allocation is not a complete benefit or eligibility guideline; grant rates, family-income ceilings, documents and deadline must be reviewed.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Letter/slot allocation is not a complete benefit or eligibility guideline; grant rates, family-income ceilings, documents and deadline must be reviewed. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official NSP and institution for the college scheme, allotted slots and current requirements."],"url":"https://scholarships.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-04 National Scholarship Portal: Student OTR & Scholarship Applications: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.mnnit.ac.in/images/newstories/2026/notices/Slots_of_Colleges_under_Top_Class_College_for_OBCs.pdf
- FACT_REVIEW_EVIDENCE: https://www.mnnit.ac.in/images/newstories/2026/notices/Slots_of_Colleges_under_Top_Class_College_for_OBCs.pdf
- APPLICATION_REFERENCE: https://scholarships.gov.in/
- SUPPORTING_EVIDENCE: https://scholarships.gov.in/
- FORM_REFERENCE: https://scholarships.gov.in/Students

Fact review: 3c7417ce96c4ba462dcc3629f9e18d83ee1ecad6bee29885fb783f4fda4ece6e; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:42.762Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-ST-05: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Letter/slot allocation is not a complete benefit or eligibility guideline; grant rates, family-income ceilings, documents and deadline must be reviewed.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WK-01 - Pradhan Mantri Shram Yogi Maandhan (PM-SYM)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Labour and Employment; PM-SYM is a contributory pension programme for eligible unorganised workers. The official scheme description identifies pension support after the specified pension age; contributions and conditions apply. Important limits: Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: PM-SYM is a contributory pension programme for eligible unorganised workers. The official scheme description identifies pension support after the specified pension age; contributions and conditions apply.. Missing/unverified: Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Use the official e-Shram scheme reference and confirm PM-SYM enrolment requirements with its implementing service."],"url":"https://www.eshram.gov.in/Schemes"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-09 Maandhan PM-SYM Enrollment: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.eshram.gov.in/Schemes
- FACT_REVIEW_EVIDENCE: https://www.eshram.gov.in/Schemes
- APPLICATION_REFERENCE: https://www.eshram.gov.in/Schemes
- SUPPORTING_EVIDENCE: https://www.eshram.gov.in/Schemes
- FORM_REFERENCE: https://maandhan.in/

Fact review: c7a3e91a334958d1576dd7c67c274ccb6511d874ad22cdb6723007c58662e8b1; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:43.661Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-WK-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Full contribution schedule, eligibility/exclusion conditions, survivor terms and documents not comprehensively reviewed. No unconditional pension entitlement asserted.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WK-02 - Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Financial Services, Ministry of Finance; Individual account holders of participating banks/post offices; entry age 18 to 50. Continued cover to age 55 is subject to renewal and policy conditions. No personal eligibility conclusion. One-year renewable life cover of INR 200000 for death from any cause, subject to policy terms. Standard annual renewal premium INR 436; first-time mid-year entry has pro-rata options. A 30-day non-accidental-death lien applies on first entry. Important limits: Bank-specific identity/KYC checklist not verified; Full insurance policy/claims exclusions and all amendments need editorial review; Official FAQ lists last updated 2026-01-05; retrieval alone is not certification of later policy changes |
| benefits | AVAILABLE | Stored: One-year renewable life cover of INR 200000 for death from any cause, subject to policy terms. Standard annual renewal premium INR 436; first-time mid-year entry has pro-rata options. A 30-day non-accidental-death lien applies on first entry.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete candidate audience information only. No rule set or personal eligibility assessment is approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Exact new-entry versus renewal/re-entry scope and nearest-birthday treatment require review; Coverage termination at 55 and first-entry/re-entry 30-day lien are source-preserved; no claims assessment is offered; Effective/currentness window and full fact/rights review remain pending |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Full insurance policy/claims exclusions and all amendments need editorial review |
| documents | INCOMPLETE | Stored: Prescribed enrolment and auto-debit consent/declaration form. Missing/unverified: Complete scheme-specific current document checklist is not certified.; Bank-specific identity/KYC checklist not verified |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Request enrolment with a participating bank/post office using its prescribed form and consent to premium auto-debit. Confirm applicable first-entry premium and terms."],"url":"https://financialservices.gov.in/pmjjby"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal. |
| Application mode | AVAILABLE evidence only | DOWNLOADABLE_PDF_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-10 PMJJBY consent-cum-declaration and auto-debit form: PDF AVAILABLE, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://financialservices.gov.in/pmjjby
- FACT_REVIEW_EVIDENCE: https://financialservices.gov.in/pmjjby
- APPLICATION_REFERENCE: https://financialservices.gov.in/pmjjby
- SUPPORTING_EVIDENCE: https://financialservices.gov.in/pmjjby
- FORM_REFERENCE: https://jansuraksha.gov.in/Files/PMJJBY/PMJJBY_Enrollment_Form.pdf

Fact review: 2bd09de0ed1d71ce96e79adef90da3f1bd7364ae2e323899e2c2343a9d92f920; verified 2026-11-18T08:38:58.332Z; valid until 2026-11-25T08:47:41.461Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set proposed-rules-c3ef9f6fb3b4ae9fa1f4f2ec: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.
- Rule set rules-IN-WK-02: stored RULES_APPROVED_CURRENT, declared COMPLETE; runtime inspection: ONE_ACCOUNT_RESTRICTION_NOT_MODELED.

Exact unresolved facts/documents to obtain or review next:

- Bank-specific identity/KYC checklist not verified
- Full insurance policy/claims exclusions and all amendments need editorial review
- Official FAQ lists last updated 2026-01-05; retrieval alone is not certification of later policy changes
- Exact new-entry versus renewal/re-entry scope and nearest-birthday treatment require review
- Coverage termination at 55 and first-entry/re-entry 30-day lien are source-preserved; no claims assessment is offered
- Effective/currentness window and full fact/rights review remain pending
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WK-03 - Pradhan Mantri Suraksha Bima Yojana (PMSBY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Department of Financial Services, Ministry of Finance; Individual account holders of participating banks/post offices, entry age 18 to 70, subject to policy conditions and one-account restriction; no eligibility verdict. Renewable annual accident insurance: INR 200000 for accidental death or specified total disability and INR 100000 for specified partial disability, subject to policy definitions. Annual premium INR 20 by consented auto-debit. Important limits: Bank-specific identity/KYC requirements not verified; Exact disability definitions, claim documents and latest policy amendments require editorial review; FAQ availability does not independently certify all current terms |
| benefits | AVAILABLE | Stored: Renewable annual accident insurance: INR 200000 for accidental death or specified total disability and INR 100000 for specified partial disability, subject to policy definitions. Annual premium INR 20 by consented auto-debit.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete candidate audience information only. No rule set or personal eligibility assessment is approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; FAQ joining range includes 70 but cover terminates on attaining 70 (nearest birthday); boundary requires authoritative resolution; Renewal/re-entry/accident exclusions are captured but this is not a claim-coverage decision; Effective/currentness window and full fact/rights review remain pending |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored. |
| documents | INCOMPLETE | Stored: Prescribed enrolment and auto-debit consent/declaration form. Missing/unverified: Complete scheme-specific current document checklist is not certified.; Bank-specific identity/KYC requirements not verified; Exact disability definitions, claim documents and latest policy amendments require editorial review |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Apply through a participating bank/post office using its prescribed enrolment/auto-debit consent form; verify coverage start and renewal conditions."],"url":"https://financialservices.gov.in/pmsby"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal. |
| Application mode | AVAILABLE evidence only | DOWNLOADABLE_PDF_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-11 PMSBY consent-cum-declaration and auto-debit form: PDF AVAILABLE, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://financialservices.gov.in/pmsby
- FACT_REVIEW_EVIDENCE: https://financialservices.gov.in/pmsby
- APPLICATION_REFERENCE: https://financialservices.gov.in/pmsby
- SUPPORTING_EVIDENCE: https://financialservices.gov.in/pmsby
- FORM_REFERENCE: https://jansuraksha.gov.in/Files/PMSBY/PMSBY_Enrollment_Form.pdf

Fact review: 9c8e2e94f2d8f1fc29026b6d41b1d72781bad820d9be653d515f499859ae29f2; verified 2026-11-18T08:38:58.332Z; valid until 2026-11-25T08:48:41.619Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set proposed-rules-3e2a15a4570a644bdd9e47ba: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.
- Rule set rules-IN-WK-03: stored RULES_APPROVED_CURRENT, declared COMPLETE; runtime inspection: ONE_ACCOUNT_RESTRICTION_NOT_MODELED.

Exact unresolved facts/documents to obtain or review next:

- Bank-specific identity/KYC requirements not verified
- Exact disability definitions, claim documents and latest policy amendments require editorial review
- FAQ availability does not independently certify all current terms
- FAQ joining range includes 70 but cover terminates on attaining 70 (nearest birthday); boundary requires authoritative resolution
- Renewal/re-entry/accident exclusions are captured but this is not a claim-coverage decision
- Effective/currentness window and full fact/rights review remain pending
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WK-04 - Atal Pension Yojana (APY)

**Overall INCOMPLETE. Limited summary INCOMPLETE; stored RESEARCH_ONLY / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | MISSING | No matching valid current fact approval. Existing content is research only. |
| benefits | INCOMPLETE | Stored: APY provides a contribution-based retirement pension arrangement. Contributions and the pension option depend on entry age and scheme rules; it is not a free cash grant.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Unreviewed research; full operative eligibility and exclusions are not approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; DFS FAQ contradicts itself at the 40-year entry boundary; verify applicable age basis before execution; Regulator confirms current-or-former taxpayer exclusion from 1 October 2022; distinguish existing subscriber continuation and old co-contribution conditions; APY remains research-only; full scheme fact/publication, rights and operative-rule review are pending; Full operative clauses and human approval missing; The FAQ includes older provisions. Current income-taxpayer restrictions, entry conditions, contribution tables, nominee and exit rules require reconciliation with current PFRDA documents.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified.; No open application window, personal eligibility or guaranteed approval is asserted. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; The FAQ includes older provisions. Current income-taxpayer restrictions, entry conditions, contribution tables, nominee and exit rules require reconciliation with current PFRDA documents.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; The FAQ includes older provisions. Current income-taxpayer restrictions, entry conditions, contribution tables, nominee and exit rules require reconciliation with current PFRDA documents.; Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.; Complete current eligibility, exclusions, operative amendments and document requirements are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the cited official document and responsible implementing authority for current application and document requirements."],"url":"https://financialservices.gov.in/atal-pension-yojana"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window, personal eligibility or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | DOWNLOADABLE_PDF_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | MISSING / MISSING / MISSING | en: 0 valid current prepared, 0 approved; hi: 0 valid current prepared, 0 approved; kn: 0 valid current prepared, 0 approved |
| Linked application guides | INCOMPLETE | FORM-19 APY subscriber registration form: PDF AVAILABLE, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://financialservices.gov.in/atal-pension-yojana
- APPLICATION_REFERENCE: https://financialservices.gov.in/atal-pension-yojana
- FORM_REFERENCE: https://pfrda.org.in/documents/33652/252002/APY+Subscriber+Registration+Form+-+English.pdf

Fact review: MISSING; verified MISSING; valid until MISSING; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set proposed-rules-1d70b064a46fdbe43ff7eb95: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, PUBLISHED_CURRENT_SCHEME_REQUIRED, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.
- Rule set rules-IN-WK-04: stored RESEARCH_ONLY, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The FAQ includes older provisions. Current income-taxpayer restrictions, entry conditions, contribution tables, nominee and exit rules require reconciliation with current PFRDA documents.
- Human fact, rights and currentness review is pending. This is official-document research, not approved scheme content.
- Complete current eligibility, exclusions, operative amendments and document requirements are not certified.
- No open application window, personal eligibility or guaranteed approval is asserted.
- DFS FAQ contradicts itself at the 40-year entry boundary; verify applicable age basis before execution
- Regulator confirms current-or-former taxpayer exclusion from 1 October 2022; distinguish existing subscriber continuation and old co-contribution conditions
- APY remains research-only; full scheme fact/publication, rights and operative-rule review are pending
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WO-01 - Pradhan Mantri Matru Vandana Yojana (PMMVY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Women and Child Development; PMMVY provides conditional maternity assistance: the cited release describes INR5000 for the first living child and INR6000 for a second child when the second child is a girl, linked to health milestones. Important limits: Full exclusions, health-milestone evidence and current amendment/application procedures remain to be reviewed; the national page timed out.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: PMMVY provides conditional maternity assistance: the cited release describes INR5000 for the first living child and INR6000 for a second child when the second child is a girl, linked to health milestones.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Full exclusions, health-milestone evidence and current amendment/application procedures remain to be reviewed; the national page timed out.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Full exclusions, health-milestone evidence and current amendment/application procedures remain to be reviewed; the national page timed out.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Ask the official women-and-child-development service or local implementing office for enrolment and milestone documentation."],"url":"https://www.wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; Full exclusions, health-milestone evidence and current amendment/application procedures remain to be reviewed; the national page timed out.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | ONLINE_PORTAL_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-06 PMMVY Citizen Portal: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2270668&lang=1&reg=48
- FACT_REVIEW_EVIDENCE: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2270668&lang=1&reg=48
- APPLICATION_REFERENCE: https://www.wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana
- SUPPORTING_EVIDENCE: https://www.wcd.gov.in/offerings/pradhan-mantri-matru-vandana-yojana
- FORM_REFERENCE: https://pmmvy.wcd.gov.in/

Fact review: c600db0b6d112eb5a4b1d57ab687f25c9d1a34a29fac29c9d6f1ec1bb98e0828; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:44.552Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-WO-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Full exclusions, health-milestone evidence and current amendment/application procedures remain to be reviewed; the national page timed out.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WO-02 - Pradhan Mantri Ujjwala Yojana (PMUY / Ujjwala 2.0)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Ministry of Petroleum and Natural Gas / participating oil marketing companies; Adult women in poor households, with the published age/no-existing-household-LPG and deprivation-declaration conditions; incomplete criteria, not an eligibility decision. Application route for a new PMUY LPG connection. This page does not establish a specific cash grant, deposit subsidy or refill amount, so no monetary benefit is asserted. Important limits: Page has no reliable current amendment/effective-date statement; Specific connection assistance/refill subsidy not verified; Original form annexures and full exceptions need human review; Site footer reserves rights: use factual paraphrases, do not copy protected expressive content |
| benefits | AVAILABLE | Stored: Application route for a new PMUY LPG connection. This page does not establish a specific cash grant, deposit subsidy or refill amount, so no monetary benefit is asserted.. Missing/unverified: Specific connection assistance/refill subsidy not verified |
| conditions | MISSING | Stored: Incomplete candidate audience information only. No rule set or personal eligibility assessment is approved.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Page has no reliable current amendment/effective-date statement |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Original form annexures and full exceptions need human review |
| documents | INCOMPLETE | Stored: KYC application form; Applicant identity evidence; Current-address evidence when required; migrant declaration alternative; Ration card or recognised family-composition evidence; migrant declaration alternative; Identity copies for adult family members as required; Passbook copy or cancelled cheque; Prescribed deprivation declaration. Missing/unverified: Complete scheme-specific current document checklist is not certified.; Original form annexures and full exceptions need human review |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Submit the prescribed application to a chosen participating distributor or use the official page links to participating oil-company portals."],"url":"https://pmuy.gov.in/Ujjwala2.html"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal. |
| Application mode | AVAILABLE evidence only | DOWNLOADABLE_PDF_REFERENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-01 PMUY Ujjwala KYC PDF: PDF AVAILABLE, approved usable guide false; FORM-02 PAHAL/DBTL unified LPG form: PDF AVAILABLE, approved usable guide false; FORM-16 Supplementary KYC and 14-point deprivation undertaking: PDF AVAILABLE, approved usable guide false; FORM-17 PMUY Migrant Self Declaration Annexure I: PDF AVAILABLE, approved usable guide false; FORM-18 PMUY pre-installation check Annexure II: PDF AVAILABLE, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://pmuy.gov.in/Ujjwala2.html
- FACT_REVIEW_EVIDENCE: https://pmuy.gov.in/Ujjwala2.html
- APPLICATION_REFERENCE: https://pmuy.gov.in/Ujjwala2.html
- SUPPORTING_EVIDENCE: https://pmuy.gov.in/Ujjwala2.html
- FORM_REFERENCE: https://pmuy.gov.in/documents/Ujjwala-KYC.pdf
- FORM_REFERENCE: https://pmuy.gov.in/Unified_form_DBTL_Eng.pdf
- FORM_REFERENCE: https://pmuy.gov.in/documents/Supplementary%20KYC.pdf
- FORM_REFERENCE: https://pmuy.gov.in/documents/Annexure%20I.pdf
- FORM_REFERENCE: https://pmuy.gov.in/documents/Annexure%20II.pdf

Fact review: c38d8e80a63e00e74f85d8219f957ab97e2a7650a8f70e36ec443a8358456425; verified 2026-11-18T08:38:58.332Z; valid until 2026-11-25T08:49:45.717Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-WO-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Page has no reliable current amendment/effective-date statement
- Specific connection assistance/refill subsidy not verified
- Original form annexures and full exceptions need human review
- Site footer reserves rights: use factual paraphrases, do not copy protected expressive content
- Full operative clauses and human approval missing
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WO-03 - Sukanya Samriddhi Account (SSA)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | National Savings Institute / Department of Economic Affairs; Sukanya Samriddhi Account is a government small-savings product listed by India Post. It is a savings/deposit account, not an automatic cash benefit. Important limits: Current notified interest period/rate, girl-child age/account limits, withdrawals, tax treatment and document checklist are not certified.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Sukanya Samriddhi Account is a government small-savings product listed by India Post. It is a savings/deposit account, not an automatic cash benefit.. Missing/unverified: Current notified interest period/rate, girl-child age/account limits, withdrawals, tax treatment and document checklist are not certified. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Current notified interest period/rate, girl-child age/account limits, withdrawals, tax treatment and document checklist are not certified.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Current notified interest period/rate, girl-child age/account limits, withdrawals, tax treatment and document checklist are not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult a post office or authorized provider for current SSA account-opening, deposit and withdrawal requirements."],"url":"https://www.indiapost.gov.in/banking-services/savings"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-12 SSA Account Opening Form-1 (referenced in regulations): PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- FACT_REVIEW_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- APPLICATION_REFERENCE: https://www.indiapost.gov.in/banking-services/savings
- SUPPORTING_EVIDENCE: https://www.indiapost.gov.in/banking-services/savings
- FORM_REFERENCE: https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf

Fact review: 0032b43c89d1e7b10773bf19085b8e04213b2f6b085f8fad4ea26f8a347d9166; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:45.452Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-WO-03: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Current notified interest period/rate, girl-child age/account limits, withdrawals, tax treatment and document checklist are not certified.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### IN-WO-04 - Janani Suraksha Yojana (JSY)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | National Health Mission / Ministry of Health; JSY promotes institutional delivery among poor pregnant women and links conditional cash assistance to delivery and post-delivery care. Important limits: Mother and ASHA payment components differ; no combined or statewide cash amount asserted. Current category/state rules and document checklist require review.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: JSY promotes institutional delivery among poor pregnant women and links conditional cash assistance to delivery and post-delivery care.. Missing/unverified: Mother and ASHA payment components differ; no combined or statewide cash amount asserted. Current category/state rules and document checklist require review. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; Mother and ASHA payment components differ; no combined or statewide cash amount asserted. Current category/state rules and document checklist require review. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the local public health facility or ASHA/health worker for applicable state/category rules and required maternal records."],"url":"https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841
- FACT_REVIEW_EVIDENCE: https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841
- APPLICATION_REFERENCE: https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841
- SUPPORTING_EVIDENCE: https://nhm.gov.in/nhm/index1.php?lang=1&level=3&lid=309&sublinkid=841

Fact review: 53bd67af744b5d13605b9714ec197455f1e51ad2790c4c24438d2caa31659888; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:46.343Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-IN-WO-04: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Mother and ASHA payment components differ; no combined or statewide cash amount asserted. Current category/state rules and document checklist require review.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### KA-GN-01 - Gruha Jyothi

**Overall INCOMPLETE. Limited summary AVAILABLE; stored SOURCE_VERIFIED_FACT / INTERNAL.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Government of Karnataka / Energy; Historical Karnataka legislative proceedings describe Gruha Jyothi as household electricity assistance. This packet does not certify current consumption entitlements or enrolment status. Important limits: CURRENTNESS BLOCKER: operative 2026 verification requirements and current entitlement not retrieved. Historical evidence can support an internal explanation only; publication needs refreshed authoritative evidence.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Historical Karnataka legislative proceedings describe Gruha Jyothi as household electricity assistance. This packet does not certify current consumption entitlements or enrolment status.. Missing/unverified: CURRENTNESS BLOCKER: operative 2026 verification requirements and current entitlement not retrieved. Historical evidence can support an internal explanation only; publication needs refreshed authoritative evidence. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official Seva Sindhu service and electricity supply company for current verification and application requirements."],"url":"https://sevasindhu.karnataka.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; CURRENTNESS BLOCKER: operative 2026 verification requirements and current entitlement not retrieved. Historical evidence can support an internal explanation only; publication needs refreshed authoritative evidence.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | AVAILABLE / AVAILABLE / AVAILABLE | en: 1 valid current prepared, 0 approved; hi: 1 valid current prepared, 0 approved; kn: 1 valid current prepared, 0 approved |
| Linked application guides | INCOMPLETE | FORM-14 Karnataka Seva Sindhu service/application directory: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://kla.kar.nic.in/council/houseproceedings/150/debates03072023.pdf
- FACT_REVIEW_EVIDENCE: https://kla.kar.nic.in/council/houseproceedings/150/debates03072023.pdf
- APPLICATION_REFERENCE: https://sevasindhu.karnataka.gov.in/
- SUPPORTING_EVIDENCE: https://sevasindhu.karnataka.gov.in/
- FORM_REFERENCE: https://sevasindhu.karnataka.gov.in/

Fact review: 3c3f4262377a861e5235851797046befd5d423ea4f21b8de0146d03271a45335; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:47.231Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-KA-GN-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, PUBLISHED_CURRENT_SCHEME_REQUIRED, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- CURRENTNESS BLOCKER: operative 2026 verification requirements and current entitlement not retrieved. Historical evidence can support an internal explanation only; publication needs refreshed authoritative evidence.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### KA-GN-02 - Anna Bhagya

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Government of Karnataka / Food and Civil Supplies; Anna Bhagya is Karnataka food-security assistance for qualifying BPL/AAY ration-card households. Important limits: Sources describe differing rice/cash/nutritional-kit delivery. No current quantity, cash amount, automatic eligibility or last distribution is asserted until reconciled.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Anna Bhagya is Karnataka food-security assistance for qualifying BPL/AAY ration-card households.. Missing/unverified: Sources describe differing rice/cash/nutritional-kit delivery. No current quantity, cash amount, automatic eligibility or last distribution is asserted until reconciled. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Sources describe differing rice/cash/nutritional-kit delivery. No current quantity, cash amount, automatic eligibility or last distribution is asserted until reconciled.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official Karnataka food/civil-supplies authority or local ration service for current entitlement and documentation."],"url":"https://ahara.karnataka.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | MISSING | No linked form reference. |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://bengaluruurban.nic.in/en/scheme/anna-bhagya/
- FACT_REVIEW_EVIDENCE: https://bengaluruurban.nic.in/en/scheme/anna-bhagya/
- APPLICATION_REFERENCE: https://ahara.karnataka.gov.in/
- SUPPORTING_EVIDENCE: https://ahara.karnataka.gov.in/

Fact review: 892fa3b12a6440adf7b02092f31a0c73c5527fa4a35b72a4d3d775efcc8e5be7; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:48.127Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-KA-GN-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Sources describe differing rice/cash/nutritional-kit delivery. No current quantity, cash amount, automatic eligibility or last distribution is asserted until reconciled.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### KA-ST-01 - Yuva Nidhi

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Government of Karnataka; Yuva Nidhi provides conditional financial assistance to eligible unemployed graduates and diploma holders in Karnataka. Important limits: District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Yuva Nidhi provides conditional financial assistance to eligible unemployed graduates and diploma holders in Karnataka.. Missing/unverified: District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified.; District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official Seva Sindhu guarantee service and employment office for current cohort eligibility and required declarations."],"url":"https://sevasindhugs.karnataka.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-14 Karnataka Seva Sindhu service/application directory: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://bangalorerural.nic.in/en/district-skill-development-office-2/
- FACT_REVIEW_EVIDENCE: https://bangalorerural.nic.in/en/district-skill-development-office-2/
- APPLICATION_REFERENCE: https://sevasindhugs.karnataka.gov.in/
- SUPPORTING_EVIDENCE: https://sevasindhugs.karnataka.gov.in/
- FORM_REFERENCE: https://sevasindhu.karnataka.gov.in/

Fact review: ab609534477f584b35d4a2a95160dc4733f68c8fbe54bc8b067805b74f06a1ff; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:49.031Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-KA-ST-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- District text contains stale2023-cohort information and an employment-wording typo; current cohorts, benefit period, monthly declarations and checklist need current operative verification. No current payment amount or open window asserted.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### KA-WO-01 - Gruha Lakshmi

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Government of Karnataka / Women and Child Development; Gruha Lakshmi is conditional Karnataka financial assistance directed to qualifying women heads of households. Important limits: The short directory description omits exclusions and payment/currentness detail; do not repeat its universal-every-household phrasing as a verified entitlement. No current monthly payment or guaranteed disbursement asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Gruha Lakshmi is conditional Karnataka financial assistance directed to qualifying women heads of households.. Missing/unverified: The short directory description omits exclusions and payment/currentness detail; do not repeat its universal-every-household phrasing as a verified entitlement. No current monthly payment or guaranteed disbursement asserted. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; The short directory description omits exclusions and payment/currentness detail; do not repeat its universal-every-household phrasing as a verified entitlement. No current monthly payment or guaranteed disbursement asserted.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Consult the official Seva Sindhu service or women-and-child-development office for enrolment and current eligibility/document rules."],"url":"https://sevasindhu.karnataka.gov.in/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-14 Karnataka Seva Sindhu service/application directory: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://chamrajnagar.nic.in/en/welfareschemes/
- FACT_REVIEW_EVIDENCE: https://chamrajnagar.nic.in/en/welfareschemes/
- APPLICATION_REFERENCE: https://sevasindhu.karnataka.gov.in/
- SUPPORTING_EVIDENCE: https://sevasindhu.karnataka.gov.in/
- FORM_REFERENCE: https://sevasindhu.karnataka.gov.in/

Fact review: f909fe543aaba96aa0986f6f74cd9c1c25ba54398ec8b01128f206710b801f55; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:49.942Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-KA-WO-01: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- The short directory description omits exclusions and payment/currentness detail; do not repeat its universal-every-household phrasing as a verified entitlement. No current monthly payment or guaranteed disbursement asserted.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

### KA-WO-02 - Shakti Scheme (Karnataka)

**Overall INCOMPLETE. Limited summary READY; stored SOURCE_VERIFIED_FACT / PUBLISHED.**

| Information | Status | Available information and missing proof |
|---|---|---|
| Reviewed facts | AVAILABLE | Government of Karnataka / Transport; Shakti provides fare-free travel on specified Karnataka state-run ordinary/express services for qualifying residents, including the covered passenger categories. Premium and other excluded services are outside this summary. Important limits: Exact passenger categories, interstate exceptions and service exclusions must be checked in operative rules. No universal free-bus claim.; Complete current operative eligibility, exclusions and latest amendments require editorial review.; No open application window or guaranteed approval is asserted. |
| benefits | AVAILABLE | Stored: Shakti provides fare-free travel on specified Karnataka state-run ordinary/express services for qualifying residents, including the covered passenger categories. Premium and other excluded services are outside this summary.. Missing/unverified: No additional field-specific gap recorded; limited scope only. |
| conditions | MISSING | Stored: Incomplete descriptive audience information only; no approved rules or personal eligibility decision.. Missing/unverified: Complete operative conditions are not encoded and currently approved.; Full operative clauses and human approval missing; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| exclusions | MISSING | Stored: MISSING. Missing/unverified: No complete reviewed exclusion/exception inventory is stored.; Exact passenger categories, interstate exceptions and service exclusions must be checked in operative rules. No universal free-bus claim.; Complete current operative eligibility, exclusions and latest amendments require editorial review. |
| documents | MISSING | Stored: . Missing/unverified: Complete scheme-specific current document checklist is not certified. |
| applicationSteps | INCOMPLETE | Stored: {"steps":["Carry accepted government photo identification and confirm permitted bus/service routes with the state transport operator."],"url":"https://bengaluruurban.nic.in/en/scheme/shakti-scheme/"}. Missing/unverified: End-to-end current route, submission steps, applicable window and attachments are not fully verified. Information links are not proof of an operational application portal.; No open application window or guaranteed approval is asserted. |
| Application mode | AVAILABLE evidence only | NOT_VERIFIED_FROM_STORED_APPLICATION_EVIDENCE. Live submission availability not checked. |
| EN / HI / KN explanations | READY / READY / READY | en: 1 valid current prepared, 1 approved; hi: 1 valid current prepared, 1 approved; kn: 1 valid current prepared, 1 approved |
| Linked application guides | INCOMPLETE | FORM-14 Karnataka Seva Sindhu service/application directory: PDF MISSING, approved usable guide false |

Stored official references (metadata checked; not newly fetched):

- OFFICIAL_EVIDENCE: https://bengaluruurban.nic.in/en/scheme/shakti-scheme/
- FACT_REVIEW_EVIDENCE: https://bengaluruurban.nic.in/en/scheme/shakti-scheme/
- APPLICATION_REFERENCE: https://bengaluruurban.nic.in/en/scheme/shakti-scheme/
- SUPPORTING_EVIDENCE: https://bengaluruurban.nic.in/en/scheme/shakti-scheme/
- FORM_REFERENCE: https://sevasindhu.karnataka.gov.in/

Fact review: b93214f7e3755fb2d6eddefc721546a08046bae95399f2459b2b4b8120ccbf20; verified 2026-11-18T10:19:17.918Z; valid until 2026-11-25T13:47:50.885Z; source integrity matched. The complete rule set is **not approved/executable**.

- Rule set rules-KA-WO-02: stored REVIEW_REQUIRED, declared INFORMATION_INCOMPLETE; runtime inspection: OPERATIVE_RULES_INCOMPLETE, RULES_NOT_HUMAN_APPROVED, RULE_CACHE_STALE, RULES_UNDATED_OR_EXPIRED, EMPTY_OR_UNSUPPORTED_RULES, SOURCE_VERSION_SUPERSEDED_OR_UNRELATED, EXACT_OPERATIVE_CLAUSES_MISSING, FULL_RULE_FACT_RIGHTS_CURRENTNESS_REVIEW_MISSING.

Exact unresolved facts/documents to obtain or review next:

- Exact passenger categories, interstate exceptions and service exclusions must be checked in operative rules. No universal free-bus claim.
- Complete current operative eligibility, exclusions and latest amendments require editorial review.
- No open application window or guaranteed approval is asserted.
- Full operative clauses and human approval missing
- A verified scheme-specific application route and actual blank form if one is required.
- Complete current operative eligibility and exclusions with exact clause/version bindings; then genuine full-scope rule approval.
- Complete current document/application checklist; do not infer it from a short announcement.

## Every existing form

PDF availability below is demonstrated by stored HTTP evidence and an exact SHA-256 match to existing local official PDF bytes. These eight URLs were not re-fetched. Eleven other references are portals/instructions; a regulations PDF is not assumed to be a blank application. No form has a stored complete-coverage attestation or approved trilingual guidance.

| Form ID / title | Kind | Actual PDF / edition | Pages / recorded fields | All fields extracted? | EN / HI / KN guidance | Approved usable? |
|---|---|---|---|---|---|---|
| FORM-01: PMUY Ujjwala KYC PDF | PDF_FORM | AVAILABLE; Version 5.0 (printed; current operative edition not certified) | 2 / 17 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-02: PAHAL/DBTL unified LPG form | PDF_FORM | AVAILABLE; Not established: image-only reference | 1 / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-03: PM-KISAN New Farmer Registration | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-04: National Scholarship Portal: Student OTR & Scholarship Applications | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-05: PMFBY Farmer Registration and Enrollment | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-06: PMMVY Citizen Portal | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-07: e-NAM Farmer Registration Guidelines | INSTRUCTIONS_ONLY | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-08: JanSamarth Credit Application Portal | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-09: Maandhan PM-SYM Enrollment | AUTHENTICATED_PORTAL | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-10: PMJJBY consent-cum-declaration and auto-debit form | PDF_FORM | AVAILABLE; Official consent-cum-declaration form PDF; printed annual premium Rs.330 is outdated (current DFS FAQ says Rs.436). | 2 / 20 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-11: PMSBY consent-cum-declaration and auto-debit form | PDF_FORM | AVAILABLE; Official consent-cum-declaration form PDF; printed annual premium Rs.12 is outdated (current DFS FAQ says Rs.20). | 2 / 22 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-12: SSA Account Opening Form-1 (referenced in regulations) | INSTRUCTIONS_ONLY | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-13: SCSS account opening paperwork | INSTRUCTIONS_ONLY | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-14: Karnataka Seva Sindhu service/application directory | INSTRUCTIONS_ONLY | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-15: Soil Health Card Portal | PUBLIC_APPLICATION_PAGE | MISSING; No checked blank edition | Unknown / 0 | MISSING | MISSING / MISSING / MISSING | No |
| FORM-16: Supplementary KYC and 14-point deprivation undertaking | PDF_FORM | AVAILABLE; Edition/date not printed in extracted text | 1 / 7 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-17: PMUY Migrant Self Declaration Annexure I | PDF_FORM | AVAILABLE; ANNEXURE - I; printed edition/date not established | 1 / 23 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-18: PMUY pre-installation check Annexure II | PDF_FORM | AVAILABLE; ANNEXURE - II; printed edition/date not established | 1 / 8 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |
| FORM-19: APY subscriber registration form | PDF_FORM | AVAILABLE; PFRDA subscriber registration form PDF; currentness and current eligibility restrictions are not independently certified. | 4 / 29 | INCOMPLETE: full coverage unproven | MISSING / MISSING / MISSING | No |

### FORM-01 - PMUY Ujjwala KYC PDF

Official reference: https://pmuy.gov.in/documents/Ujjwala-KYC.pdf. Linked schemes: IN-WO-02.

Document: FORM-01-ccbec5ce1bf6dabac93b; edition: Version 5.0 (printed; current operative edition not certified); checked: 2026-11-19T12:58:40.011Z; pages: 2. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 17 recorded labels; pages with labels 1, 2; unknown requiredness 17. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- PARTIAL_FIELD_GUIDANCE_NOT_COMPLETE_FORM_INSTRUCTIONS
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-02 - PAHAL/DBTL unified LPG form

Official reference: https://pmuy.gov.in/Unified_form_DBTL_Eng.pdf. Linked schemes: IN-WO-02.

Document: FORM-02-80c8553aff6a705a613f; edition: Not established: image-only reference; checked: 2026-11-19T12:58:40.708Z; pages: 1. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- No fields extracted; stored OCR_UNAVAILABLE evidence is not replaced by a separately recorded later OCR experiment.
- Document fact, reuse basis and currentness review is not approved.
- OCR_UNAVAILABLE
- NOT_A_PMUY_APPLICATION
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-03 - PM-KISAN New Farmer Registration

Official reference: https://www.pmkisan.gov.in/RegistrationFormupdated.aspx. Linked schemes: IN-FA-01.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-04 - National Scholarship Portal: Student OTR & Scholarship Applications

Official reference: https://scholarships.gov.in/Students. Linked schemes: IN-ST-01, IN-ST-02, IN-ST-03, IN-ST-04, IN-ST-05.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-05 - PMFBY Farmer Registration and Enrollment

Official reference: https://pmfby.gov.in/. Linked schemes: IN-FA-02.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-06 - PMMVY Citizen Portal

Official reference: https://pmmvy.wcd.gov.in/. Linked schemes: IN-WO-01.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-07 - e-NAM Farmer Registration Guidelines

Official reference: https://enam.gov.in/resources/registration-guideline. Linked schemes: IN-FA-05.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-08 - JanSamarth Credit Application Portal

Official reference: https://www.jansamarth.in/home. Linked schemes: IN-FA-03.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-09 - Maandhan PM-SYM Enrollment

Official reference: https://maandhan.in/. Linked schemes: IN-WK-01.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-10 - PMJJBY consent-cum-declaration and auto-debit form

Official reference: https://jansuraksha.gov.in/Files/PMJJBY/PMJJBY_Enrollment_Form.pdf. Linked schemes: IN-WK-02.

Document: FORM-10-34fc1d0ab44444076008; edition: Official consent-cum-declaration form PDF; printed annual premium Rs.330 is outdated (current DFS FAQ says Rs.436).; checked: 2026-11-20T08:43:21.920Z; pages: 2. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 20 recorded labels; pages with labels 1, 2; unknown requiredness 20. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- PRINTED_PREMIUM_OUTDATED_RS330_CURRENT_FAQ_RS436
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-11 - PMSBY consent-cum-declaration and auto-debit form

Official reference: https://jansuraksha.gov.in/Files/PMSBY/PMSBY_Enrollment_Form.pdf. Linked schemes: IN-WK-03.

Document: FORM-11-3ff64f7db179322f9044; edition: Official consent-cum-declaration form PDF; printed annual premium Rs.12 is outdated (current DFS FAQ says Rs.20).; checked: 2026-11-20T08:43:21.920Z; pages: 2. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 22 recorded labels; pages with labels 1, 2; unknown requiredness 22. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- PRINTED_PREMIUM_OUTDATED_RS12_CURRENT_FAQ_RS20
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-12 - SSA Account Opening Form-1 (referenced in regulations)

Official reference: https://www.nsiindia.gov.in/writereaddata/SchemeRules/SukanyaSamriddhiAccountSchemeRule.pdf. Linked schemes: IN-WO-03.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-13 - SCSS account opening paperwork

Official reference: https://www.nsiindia.gov.in/writereaddata/SchemeRules/SeniorCitizensSavingsSchemeRule.pdf. Linked schemes: IN-SR-02.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-14 - Karnataka Seva Sindhu service/application directory

Official reference: https://sevasindhu.karnataka.gov.in/. Linked schemes: KA-WO-01, KA-WO-02, KA-ST-01, KA-GN-01.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-15 - Soil Health Card Portal

Official reference: https://soilhealth.dac.gov.in/. Linked schemes: IN-FA-04.

Document: MISSING; edition: MISSING; checked: MISSING; pages: not established. Stored PDF availability MISSING; matching local bytes not present.

Field inventory: 0 recorded labels; pages with labels none; unknown requiredness 0. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Portal/instructions/reference only; no verified blank PDF or field inventory is stored.
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Confirm the scheme-specific current application route
- For PDF-based use, obtain an actual blank form, edition and complete field evidence; do not treat a portal/regulation as a blank template

### FORM-16 - Supplementary KYC and 14-point deprivation undertaking

Official reference: https://pmuy.gov.in/documents/Supplementary%20KYC.pdf. Linked schemes: IN-WO-02.

Document: FORM-16-e3fcb1e7cf279bb3b81b; edition: Edition/date not printed in extracted text; checked: 2026-11-19T12:58:41.339Z; pages: 1. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 7 recorded labels; pages with labels 1; unknown requiredness 7. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- PARTIAL_FIELD_GUIDANCE_NOT_COMPLETE_FORM_INSTRUCTIONS
- DECLARATION_CRITERIA_REQUIRE_SEPARATE_REVIEW
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-17 - PMUY Migrant Self Declaration Annexure I

Official reference: https://pmuy.gov.in/documents/Annexure%20I.pdf. Linked schemes: IN-WO-02.

Document: FORM-17-3420e3c82c3bc4d8bc3c; edition: ANNEXURE - I; printed edition/date not established; checked: 2026-11-19T12:58:42.033Z; pages: 1. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 23 recorded labels; pages with labels 1; unknown requiredness 23. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- PARTIAL_FIELD_GUIDANCE_NOT_COMPLETE_FORM_INSTRUCTIONS
- MIGRANT_ONLY_CONDITIONAL_DOCUMENT
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-18 - PMUY pre-installation check Annexure II

Official reference: https://pmuy.gov.in/documents/Annexure%20II.pdf. Linked schemes: IN-WO-02.

Document: FORM-18-0160014b219b96ce3b38; edition: ANNEXURE - II; printed edition/date not established; checked: 2026-11-19T12:58:42.658Z; pages: 1. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 8 recorded labels; pages with labels 1; unknown requiredness 8. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- DISTRIBUTOR_MECHANIC_CHECKLIST_NOT_CITIZEN_APPLICATION
- PARTIAL_FIELD_GUIDANCE_NOT_COMPLETE_FORM_INSTRUCTIONS
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

### FORM-19 - APY subscriber registration form

Official reference: https://pfrda.org.in/documents/33652/252002/APY+Subscriber+Registration+Form+-+English.pdf. Linked schemes: IN-WK-04.

Document: FORM-19-7673d3db86008658f8d2; edition: PFRDA subscriber registration form PDF; currentness and current eligibility restrictions are not independently certified.; checked: 2026-11-20T08:43:21.920Z; pages: 4. Stored PDF availability AVAILABLE; matching local bytes verified.

Field inventory: 29 recorded labels; pages with labels 1, 2; unknown requiredness 17. No complete field/condition/declaration verification is stored. General local reading aids are not reviewed form-specific EN/HI/KN artifacts.

Exact blockers:

- Partial/unattested field coverage: required/optional/conditional choices and declarations are not fully verified.
- Document fact, reuse basis and currentness review is not approved.
- CURRENT_EDITION_REQUIRES_HUMAN_CONFIRMATION
- REUSE_BASIS_REQUIRES_HUMAN_REVIEW
- SCHEME_RESEARCH_ONLY_NOT_PUBLISHED
- No complete approved EN/HI/KN field-by-field guide.

Obtain next:

- Current operative blank edition / amendment confirmation
- Complete field, conditional section, declaration and instruction inventory
- Document-specific reuse basis and genuine fact/currentness review
- Reviewed EN/HI/KN guidance linked to this document hash

## Every notice

No notice is certified CURRENT or ready for public use. HISTORICAL RSS means the existing 48-hour internal snapshot archive policy, **not a claim that the hazard ended**. RESEARCH includes recent RSS snapshots whose current validity is unknown, imported research and four explicit synthetic fixtures. The original stored states remain unchanged. No CAP URLs were fetched.

All 163 notices have missing EN/HI/KN public artifacts and remain INTERNAL; the three real Gemini notice outputs from earlier private QA are not MongoDB notice publications. Each row below records the individual source/date, extracted description, specific gaps and temporal basis. The machine file also includes all source-version IDs, structured-date checks and exact missing-detail arrays. Missing-detail codes below: **RSS_SCOPE** = CAP area/severity/expiry/instructions unverified and outside existing permission; **NO_BODY** = description absent; **NO_FULL_TEXT** = complete original absent; **NO_VERIFIED_DATES** = no verified structured date clauses; **NO_DATE** = publication date absent; **REVIEW_MISSING** = public fact/rights/currentness and editorial review absent; **FIXTURE** = synthetic, not government content. Each row retains its exact applicable codes.

| Notice ID / title | Source / official date | Classification / temporal basis | Extracted body and reported dates | Missing details / explanation / publication |
|---|---|---|---|---|
| N-01: NMMSS 2026–27 application deadline extended to 15 November | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330936&lang=1&reg=3); 2026-10-31 | IMPORTED_RESEARCH; HISTORICAL; STORED_APPLICATION_DEADLINE_PASSED | Student submissions ended 15 Nov 2026; post-submission institute/district verifications continue.; reported deadline 2026-11-15; research process dates {"stage":"student_application","date":"2026-11-15","asOfResearch":"expired"}; {"stage":"institute_L1_verification","date":"2026-11-30","asOfResearch":"future_after_submitted_application"}; {"stage":"district_L2_verification","date":"2026-12-15","asOfResearch":"future_after_submitted_application"}; source note: Application date expired; later verification milestones apply to officers and already-submitted applications. Must not show “apply now”. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-02: NMMSS earlier extension to 31 October 2026 | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2317657&lang=2&reg=48); 2026-10-01 | IMPORTED_RESEARCH; HISTORICAL; STORED_APPLICATION_DEADLINE_PASSED | Superseded by 31 Oct announcement extending student deadline to 15 Nov 2026.; reported deadline 2026-10-31; source note: SUPERSEDED: keep for Change Radar history only. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-03: NMMSS earlier application deadline announcement | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2305633&lang=2&reg=48); 2026-09-01 | IMPORTED_RESEARCH; HISTORICAL; STORED_APPLICATION_DEADLINE_PASSED | Historical NMMSS deadline; later extensions supersede it.; reported deadline 2026-09-30; source note: SUPERSEDED; validate exact press-note date if re-ingested. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-04: PM-KISAN 24th instalment announcement | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2330171&lang=1&reg=3); 2026-10-29 | IMPORTED_RESEARCH; HISTORICAL; PAST_OR_SUPERSEDED_RESEARCH_EVENT | Government announced 24th instalment event for 30 Oct 2026.; source note: News event, not citizen-specific payment confirmation. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-05: PM-KISAN 24th instalment release coverage | [Official reference](https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2330414&lang=2&reg=48); 2026-10-30 | IMPORTED_RESEARCH; HISTORICAL; PAST_OR_SUPERSEDED_RESEARCH_EVENT | Release coverage; distinguish event reporting from an individual beneficiary statement.; source note: Related to N-04. Deduplicate by event in Change Radar. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-06: Cabinet approves continuation of PM-KISAN from 2026–27 to 2030–31 | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2292460&lang=2&reg=48); 2026-07-31 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | Scheme continuation approved for 2026–27 to 2030–31; not an application action notice.; source note: No implied action deadline. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-07: National social assistance programme renamed | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2323266); 2026-10-14 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | NSAP renamed Pradhan Mantri Samajik Sahayata Yojana and old-age pension renamed Pradhan Mantri Vridhavastha Pension Yojana.; source note: Major alias/version event; programme continued from 2026–27 through 2030–31. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-08: Further national social assistance update | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2326529&lang=1&reg=48); 2026-10-22 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | Additional government programme coverage; related to October pension updates.; source note: Deduplicate related underlying policy changes and verify page dates. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-09: PMFBY August 2026 programme backgrounder | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2304549&lang=1&reg=48); 2026-08-29 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | 2026 update describes insurance coverage, farmer inclusions, and state-dependent crop notifications.; source note: Reference for research, not an individual application deadline. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-10: PM-SYM August 2026 programme update | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2293891&lang=2&n=csc&reg=48); 2026-08-03 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | Programme update with membership and pension information.; source note: Not an application closure notice. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-11: PMMVY June 2026 implementation update | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2270668&lang=1&reg=3); 2026-06-09 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | Maternity benefit programme status and support amounts.; source note: Reports programme background; do not invent notice checklist dates. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| N-12: PM-KISAN 23rd instalment June 2026 announcement | [Official reference](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2274616&lang=1&reg=20); 2026-06-18 | IMPORTED_RESEARCH; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | Government announced 23rd instalment event for 20 June 2026; past event, not current citizen task.; source note: Confirm publication metadata on source before ingesting. | NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| collected-021277c6b557339d3d242c2b: SYNTHETIC HTML information | [Official reference](https://example.test/html/item-1); MISSING | SYNTHETIC; RESEARCH; SYNTHETIC_FIXTURE | ಕನ್ನಡ • हिंदी • English. This project-authored example has no operative policy. | FIXTURE, NO_FULL_TEXT, NO_VERIFIED_DATES, NO_DATE, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| collected-506f167ab1019a3490a50896: SYNTHETIC feed item | [Official reference](https://example.test/rss/item-1); MISSING | SYNTHETIC; RESEARCH; SYNTHETIC_FIXTURE | General information only; no verified deadline. | FIXTURE, NO_FULL_TEXT, NO_VERIFIED_DATES, NO_DATE, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| collected-ef8881908ae8a880c1b9b6bd: SYNTHETIC PDF | [Official reference](https://example.test/pdf); MISSING | SYNTHETIC; RESEARCH; SYNTHETIC_FIXTURE | SYNTHETIC local document. No operative government policy. -- 1 of 1 -- | FIXTURE, NO_FULL_TEXT, NO_VERIFIED_DATES, NO_DATE, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| fixture-api-notice: SYNTHETIC public information notice | [Official reference](https://example.test/api/notice-1); MISSING | SYNTHETIC; RESEARCH; SYNTHETIC_FIXTURE | ಕನ್ನಡ ಮಾಹಿತಿ • हिंदी जानकारी • English information. No application deadline is specified. | FIXTURE, NO_FULL_TEXT, NO_VERIFIED_DATES, NO_DATE, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1793874925336014: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1793874925336014); 2026-11-05T12:27:48.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1793874925396020: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1793874925396020); 2026-11-05T10:35:27.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794370676002017: আগামী ২-৩ ঘণ্টায় কলকাতা, হাওড়া, দক্ষিণ ২৪ পরগনা ও পূর্ব মেদিনীপুরের কিছু অংশে হালকা থেকে মাঝারি বৃষ্টি বা বজ্রসহ বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794370676002017); 2026-11-11T04:21:24.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794375480207035: Thunderstorm/Lightning accompanied with Light to Moderate Rain and Gusty winds with possibility of Hailstorm is very likely to occur  at isolated places over Eastern West Khasi Hills, East Khasi Hills, Ri Bhoi, West Jaintia Hills, West Khasi Hills in next 24 hours. Citizens are to be cautious. IMD, SDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794375480207035); 2026-11-11T06:01:41.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794377277619038: Heavy  rain (07-11 cm) accompanied with thunderstorm and lightning are very likely to occur at one or two places over Andaman and Nicobar Islands in the next 24 hours. People are advised to stay at safe places. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794377277619038); 2026-11-11T06:23:25.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794388708984017: দুপুর ২:৪১ থেকে পরবর্তী ২-৩ ঘণ্টায় দক্ষিণ ২৪ পরগনা জেলার কিছু অংশে হালকা থেকে মাঝারি বৃষ্টিসহ বজ্রবিদ্যুৎ ও হালকা থেকে মাঝারি ঝড়ের সম্ভাবনা। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794388708984017); 2026-11-11T09:21:58.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794389077372017: বেলা ২:৪১ থেকে পরবর্তী ২-৩ ঘণ্টায় দক্ষিণ ২৪ পরগনা জেলার কিছু অংশে হালকা থেকে মাঝারি বৃষ্টিসহ বজ্রবিদ্যুৎ ও ঝড় হওয়ার সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794389077372017); 2026-11-11T09:26:48.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794389225351017: দার্জিলিং জেলার কিছু অংশে দুপুর ২:৪৯ থেকে পরবর্তী ২-৩ ঘণ্টার মধ্যে হালকা থেকে মাঝারি বজ্রবিদ্যুৎ ও বিদ্যুৎ চমকানো সহ হালকা থেকে মাঝারি বৃষ্টির প্রবল সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794389225351017); 2026-11-11T09:28:34.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794389306217011: Heavy Rain is Likely to occur over 4 districts of Jammu and Kashmir. Please follow SDMA guidelines. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794389306217011); 2026-11-11T09:29:49.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794389806879037: Light Thunderstorm and lightning accompanied with light to moderate rain, snowfall (at higher altitude) very likely to continue over some parts of Mangan, Gangtok, Pakyong, Gyalshing, Soreng, Namchi districts during next 2-3 hours from 15:15, 11-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794389806879037); 2026-11-11T09:49:53.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794391029778017: ১১/১১/২০২৬ দুপুর ৩:১৮ থেকে আগামী ২-৩ ঘণ্টায় দক্ষিণ দিনাজপুর, মালদা ও উত্তর দিনাজপুরের কিছু অংশে বজ্রবিদ্যুৎসহ হালকা থেকে মাঝারি এবং কোথাও ভারী বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794391029778017); 2026-11-11T09:59:26.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794391334068017: দার্জিলিং ও কালিম্পং জেলার কিছু অংশে আগামী ২-৩ ঘণ্টায় বজ্রপাতসহ মাঝারি থেকে তীব্র বৃষ্টির সম্ভাবনা (সময়: দুপুর ৩:২৫, ১১/১১/২০২৬)। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794391334068017); 2026-11-11T10:05:14.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794391504767017: ১১/১১/২০২৬ বিকেল ৩:৩০ থেকে আগামী ২-৩ ঘণ্টা দক্ষিণ ২৪ পরগনা জেলার কিছু অংশে বজ্রবিদ্যুৎসহ মাঝারি ঝড় ও প্রবল বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794391504767017); 2026-11-11T10:08:26.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794391698959017: পূর্ব মেদিনীপুর জেলার কিছু অংশে আগামী ২-৩ ঘণ্টার মধ্যে (বিকেল ৩:৩৪ থেকে) বজ্রপাত ও বিদ্যুৎ চমকানোসহ হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794391698959017); 2026-11-11T10:10:46.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794392304121017: উত্তর ২৪ পরগনা ও নদীয়া জেলার কিছু অংশে ১৫:৪০ (১১-১১-২০২৬) থেকে পরবর্তী ২-৩ ঘণ্টার মধ্যে হালকা থেকে মাঝারি বজ্রবিদ্যুৎ সহ হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794392304121017); 2026-11-11T10:19:44.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794392730071017: আজ বিকেল ১৫:৫০ থেকে পরবর্তী ২-৩ ঘণ্টায় জলপাইগুড়ি জেলার কিছু অংশে বজ্রবিদ্যুৎসহ তীব্র বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794392730071017); 2026-11-11T10:26:58.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794393210079015: Moderate Rain with thunderstorms and lightning is very likely to continue at a few places over Gomati, Sepahijala and West Tripura in next 1 to 2 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794393210079015); 2026-11-11T10:35:11.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794400544097017: উত্তর দিনাজপুর জেলার কিছু অংশে আজ সন্ধ্যা ৬টা থেকে পরবর্তী ২-৩ ঘণ্টার মধ্যে বজ্রবিদ্যুৎ ও তীব্র বৃষ্টিসহ মাঝারি ঝড়ের সম্ভাবনা রয়েছে। সতর্ক থাকুন। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794400544097017); 2026-11-11T12:37:13.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794402456051017: ১১-১১-২০২৬ সন্ধ্যা ৬:৩৪ থেকে আগামী ২-৩ ঘণ্টায় হুগলি জেলার কিছু অংশে বজ্রবিদ্যুৎসহ হালকা থেকে মাঝারি বৃষ্টির প্রবল সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794402456051017); 2026-11-11T13:09:02.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794403796943007: Light to Moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Cuddalore, Mayiladuthurai, Ramanathapuram in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794403796943007); 2026-11-11T13:29:59.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794405112044025: Thunderstorm with Lightning along with light to moderate rain is very likely to occur at a few places over Longleng, Mon, Noklak, Shamator, Tuensang, Zunheboto in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794405112044025); 2026-11-11T13:51:56.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794407605024017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of Jalpaiguri, Coochbehar, Alipurduar districts during next 2-3 hours from 20:05, 11-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794407605024017); 2026-11-11T14:34:51.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794408148451017: লকা বজ্রবিদ্যুৎ সহ হালকা থেকে মাঝারি বৃষ্টি। আগামী ২-৩ ঘণ্টায় পূর্ব বর্ধমান, নদীয়া, হুগলি, উত্তর ২৪ পরগনা জেলার কিছু অংশে প্রভাব পড়ার সম্ভাবনা (রাত ৮:১০ থেকে)। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794408148451017); 2026-11-11T14:43:54.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794408267099027: Light Thunderstorm accompanied with rain  surface wind (30-40 kmph) is likely to occur at isolated places over Giridih, Hazaribagh in next 3 hours. Disaster Management Department Ranchi Jharkhand. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794408267099027); 2026-11-11T16:23:29.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794410070787027: Light Thunderstorm accompanied with rain surface wind (30-40 kmph) is likely to occur at isolated places over Deoghar, Dumka, Jamtara in next 3 hours. Disaster Management Department Ranchi Jharkhand | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794410070787027); 2026-11-11T16:24:28.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794410655133017: নদীয়া জেলার কিছু অংশে রাত ৮:৫৩ থেকে আগামী ২-৩ ঘণ্টার মধ্যে বজ্রপাতসহ মাঝারি ধরনের বৃষ্টি ও তীব্র বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794410655133017); 2026-11-11T15:27:12.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794413364886017: হালকা থেকে মাঝারি বৃষ্টির সঙ্গে বজ্রপাত ও বজ্রবিদ্যুৎ সহ ঝড়ের সম্ভাবনা। ১১-১১-২০২৬ তারিখে রাত ২১:৩৫ থেকে আগামী ২-৩ ঘণ্টার মধ্যে মালদা জেলার কিছু অংশে প্রভাব পড়ার সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794413364886017); 2026-11-11T16:13:58.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794413723678007: Light to moderate  Rain with Thunderstorm and lightning  is likely to occur at isolated places over Coimbatore, Cuddalore, Mayiladuthurai, Ramanathapuram, Tenkasi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794413723678007); 2026-11-11T16:15:26.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794415559286010: IMD Guwahati has issued forecast for Thunderstorm with Lightning with light to moderate rain which is very likely to occur at a few places over Charaideo and Sivasagar in next 1-3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794415559286010); 2026-11-11T16:48:00.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794415560086025: Thunderstorm with Lightning with light to moderate rain is very likely to occur at a few places over Charaideo, Sivasagar in next 1-3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794415560086025); 2026-11-11T16:46:04.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794422625486017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of Birbhum, West Burdwan districts during next 2-3 hours from 00:14, 12-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794422625486017); 2026-11-11T18:45:07.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794422995522017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of North 24 Parganas, South 24 Parganas districts during next 2-3 hours from 00:20, 12-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794422995522017); 2026-11-11T18:51:45.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794424313724017: Moderate Thunderstorm  lightning accompanied with intense rain. very likely to affect over some parts of Birbhum district during next 2-3 hours from 00:41, 12-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794424313724017); 2026-11-11T19:13:27.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794424850211017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of Murshidabad district during next 1-2 hours from 00:50, 12-11-2026.. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794424850211017); 2026-11-11T19:23:04.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794425982814007: Light to moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Cuddalore, Mayiladuthurai, Nagapattinam, Namakkal, Perambalur, Ramanathapuram, Salem, Thanjavur, Thiruvarur, Karaikal in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794425982814007); 2026-11-11T19:39:46.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794425985471041: Light to moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Cuddalore, Mayiladuthurai, Nagapattinam, Namakkal, Perambalur, Ramanathapuram, Salem, Thanjavur, Thiruvarur, Karaikal in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794425985471041); 2026-11-11T19:46:37.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794429981316017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of East Burdwan district during next 2-3 hours from 02:17, 12-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794429981316017); 2026-11-11T20:50:32.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794433128856017: Light Thunderstorm  lightning accompanied with light to moderate rain. very likely to affect over some parts of Birbhum, Murshidabad, Nadia, East Burdwan districts during next 2-3 hours from 03:07, 12-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794433128856017); 2026-11-11T21:40:40.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794436340824010: IMD Guwahati has issued forecast for Thunderstorm with Lightning along with one or two spells of light to moderate rain which is very likely to occur at isolated places over Dhemaji, Dibrugarh andTinsukia in next 1-3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794436340824010); 2026-11-11T22:35:30.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794437673006007: Moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Namakkal, Perambalur, Salem, Tiruchirappalli in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794437673006007); 2026-11-11T22:54:35.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794437673962007: Light to Moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Coimbatore, Dindigul, Kanniyakumari, Karur, Mayiladuthurai, Nagapattinam, Ramanathapuram, Tenkasi, The Nilgiris, Viluppuram, Karaikal in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794437673962007); 2026-11-11T22:54:37.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794437676709041: Light to Moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Coimbatore, Dindigul, Kanniyakumari, Karur, Mayiladuthurai, Nagapattinam, Ramanathapuram, Tenkasi, The Nilgiris, Viluppuram, Karaikal in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794437676709041); 2026-11-11T22:57:37.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794447373524007: Light to moderate Rain with thunderstorm and lightning is likely to occur at isolated places over Kanniyakumari, Mayiladuthurai, Ramanathapuram, Thoothukkudi, Tirunelveli in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794447373524007); 2026-11-12T01:36:16.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794464241647038: Heavy  rain (07-11 cm) accompanied with thunderstorm and lightning are very likely to occur at one or two places over Andaman and Nicobar Islands in the next 24 hours. People are advised to stay at safe places | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794464241647038); 2026-11-12T06:29:03.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794464325012010: IMD Guwahati has issued forecast for Thunderstorms with Hail which is very likely to occur at isolated places over Karbi Anglong in next 2 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794464325012010); 2026-11-12T06:24:38.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794464405414038: Squally weather with strong surface wind 40-50 Kmph gusting to 60 kmph very likely along and off  Andaman and Nicobar coast. Sea conditions are very likely to be  rough. Fishermen are advised not to venture into the Andaman sea till 16-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794464405414038); 2026-11-12T06:57:52.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794472313619027: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days.please be safe. Disaster Management Department Ranchi Jharkhand. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794472313619027); 2026-11-12T09:04:51.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794472313722020: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794472313722020); 2026-11-12T08:31:56.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794476828676011: Avalanche with low danger level is likely to occur above 2800 meters over Ganderbal in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794476828676011); 2026-11-12T10:02:48.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794480259134007: Light to Moderate Rain is likely to occur at isolated places over Kanniyakumari in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794480259134007); 2026-11-12T10:44:21.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794490679196007: Light to Moderate Rain is likely to occur at isolated places over Tenkasi, Tirunelveli in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794490679196007); 2026-11-12T13:38:01.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794508177874011: Lightning/Thunderstorms/Rainfall is Likely to occur over 17 districts of Jammu and Kashmir-Anantnag,Bandipora,Baramulla,Budgam,Doda,Ganderbal,Kishtwar,Kulgam,Kupwara,Poonch,Pulwama,Rajouri,Ramban,Reasi,Shopian,Srinagar,Udhampur.Please follow SDMA guidelines. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794508177874011); 2026-11-12T18:30:42.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794552471979009: 2026/11/13 12:15 अगले ३ घंटो में, आपके क्षेत्र में कहीं-कहीं गर्जन के साथ आकाशीय बिजली चमकने/ बहुत हल्की से हल्की वर्षा होने की संभावना है\| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794552471979009); 2026-11-13T06:49:34.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794554803589038: Squally weather with strong surface wind 40-50 Kmph gusting to 60 kmph very likely along and off  Andaman and Nicobar coast. Sea conditions are very likely to be  rough. Fishermen are advised not to venture into the Andaman sea till 16-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794554803589038); 2026-11-13T07:30:31.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794554954326038: अगले 24 घंटों में अंडमान एवं निकोबार  द्वीप समूह में एक या दो स्थानों पर गरज और बिजली के साथ भारी  वर्षा (07-11 सेमी) होने की संभावना है। लोगों को सुरक्षित स्थानों पर रहने की सलाह दी जाती है। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794554954326038); 2026-11-13T07:32:18.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794565243439007: Light to Moderate Rain is very likely to occur at isolated places over Chengalpattu in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794565243439007); 2026-11-13T10:20:45.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794565244098007: Light Rain is very likely to occur at isolated places over Chennai, Kancheepuram, Ranipet, Thiruvallur in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794565244098007); 2026-11-13T10:20:47.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794567324681011: Avalanche with low danger level is likely to occur above 2800 meters over Ganderbal in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794567324681011); 2026-11-13T16:02:19.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794567325126011: Avalanche with low danger level is likely to occur above 2600 meters over Bandipora, Kupwara in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794567325126011); 2026-11-13T15:59:36.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794576029043007: Light to moderate Rain with thunderstorm  is very likely to occur at isolated places over Kanniyakumari in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794576029043007); 2026-11-13T13:20:31.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794635684561028: Thunderstorm with Lightning/Gusty winds speed 30-40 kmph is likely to occur at isolated places over Bikaner, Churu, Ganganagar, Hanumangarh, Jaisalmer, Jodhpur, Nagaur, Phalodi in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794635684561028); 2026-11-14T06:08:26.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794638215944028: Thunderstorm/Lightning with light to moderate rain and strong surface wind 30-40 kmph is likely to occur at isolated places over Bikaner, Ganganagar, Hanumangarh, Jaisalmer, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794638215944028); 2026-11-14T06:41:22.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794641379977038: Heavy  rain (07-11 cm) accompanied with thunderstorm and lightning are very likely to occur at one or two places over Andaman and Nicobar  Islands in the next 24 hours. People are advised to stay at safe places. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794641379977038); 2026-11-14T07:42:55.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794641510931038: Squally weather with strong surface wind 40-50 Kmph gusting to 60 kmph very likely along and off  Andaman and Nicobar coast. Sea conditions are very likely to be  rough. Fishermen are advised not to venture into the Andaman sea till 17-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794641510931038); 2026-11-14T07:45:11.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794645298737028: Thunderstorm/Lightning, light to moderate rain with wind speed 30-40 Kmph is likely to occur at isolated places over Bikaner, Ganganagar, Hanumangarh, Jaisalmer, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794645298737028); 2026-11-14T08:41:42.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794651799602007: Light To Moderate  Rain with Light thunderstrom and Lightning is very likely to occur at isolated places over Chengalpattu, Chennai, Kanniyakumari, Thiruvallur in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794651799602007); 2026-11-14T10:23:22.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794655829652008: నవంబర్13సా.4.00 నుంచి నవంబర్15రా. 07.00 గంటల వరకు సముద్రంలో 3-6.2 మీటర్ల ఎత్తులో భారీఅలలు వచ్చే అవకాశం ఉంది.కావున ప్రజలు,మత్స్యకారులు,అప్రమత్తంగాఉండి బీచ్ లకు వెళ్లవద్దు-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794655829652008); 2026-11-14T11:31:42.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794656207045028: Thunderstorm/Lightning, light to moderate rain with wind speed 30-40 Kmph is likely to occur at isolated places over Bikaner, Jaisalmer, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794656207045028); 2026-11-14T11:38:32.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794666438454028: Thunderstorm/Lightning, light to moderate rain with wind speed 30-40 Kmph is likely to occur at isolated places over Bikaner, Jaisalmer, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794666438454028); 2026-11-14T14:29:03.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794668699487028: Thunderstorm with Lightning, Light to Moderate Rain with Gusty wind(30-40kmph) is very likely to occur at a few places over Bikaner, Churu, Didwana-Kuchaman, Ganganagar, Hanumangarh, Jaisalmer, Jodhpur, Nagaur, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794668699487028); 2026-11-14T15:08:29.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794682450167028: Thunderstorm with Lightning, Light to Moderate Rain with Gusty wind(30-40kmph) is very likely to occur at a few places over Bikaner, Churu, Ganganagar, Hanumangarh, Jodhpur, Nagaur, Phalodi in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794682450167028); 2026-11-14T19:56:09.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794691906311028: Thunderstorm with Lightning, Light to Moderate Rain with Gusty wind(30-40kmph) is very likely to occur at a few places over Bikaner, Churu, Didwana-Kuchaman, Hanumangarh, Jhunjhunu, Jodhpur, Nagaur, Phalodi, Sikar in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794691906311028); 2026-11-14T21:31:50.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794702917634028: Thunderstorm with Lightning, Light to Moderate Rain with Gusty wind(30-40kmph) is very likely to occur at a few places over Bikaner, Churu, Didwana-Kuchaman, Jhunjhunu, Jodhpur, Nagaur, Phalodi, Sikar in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794702917634028); 2026-11-15T00:50:17.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794712992001028: Thunderstorm/Lightning, light to moderate rain with wind speed 30-40 Kmph is likely to occur at isolated places over Didwana-Kuchaman, Jaipur, Jhunjhunu, Kotputli-Behror, Nagaur, Sikar in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794712992001028); 2026-11-15T03:32:20.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794723397006007: Light to Moderate with Thunderstorm and Lightning Rain is very likely to occur at isolated places over Cuddalore, Mayiladuthurai, Nagapattinam, Pudukkottai, Thanjavur, Thiruvarur, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794723397006007); 2026-11-15T06:16:40.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794723398986041: Light to Moderate with Thunderstorm and Lightning Rain is very likely to occur at isolated places over Cuddalore, Mayiladuthurai, Nagapattinam, Pudukkottai, Thanjavur, Thiruvarur, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794723398986041); 2026-11-15T06:20:12.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794723722587028: Thunderstorm with Lightning/Gusty winds speed 30-40 kmph is likely to occur at isolated places over Alwar, Bharatpur, Deeg, Jhunjhunu, Khairthal-Tijara, Kotputli-Behror, Sikar in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794723722587028); 2026-11-15T06:49:19.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794725545573028: Thunderstorm, light to moderate rain with wind speed 30-40 Kmph is likely to occur at isolated places over Alwar, Deeg, Didwana-Kuchaman, Jaipur, Nagaur in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794725545573028); 2026-11-15T07:24:50.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794726140255038: Squally weather with strong surface wind 40-50 Kmph gusting to 60 kmph very likely along and off  Andaman and Nicobar coast. Sea conditions are very likely to be  rough. Fishermen are advised not to venture into the Andaman sea till 17-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794726140255038); 2026-11-15T07:06:50.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794728622884007: Light to Moderate Rain with Thunderstorm and Lightning is very likely to occur at isolated places over Chengalpattu, Chennai, Cuddalore, Mayiladuthurai, Nagapattinam, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794728622884007); 2026-11-15T07:43:45.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794728624051041: Light to Moderate Rain with Thunderstorm and Lightning is very likely to occur at isolated places over Chengalpattu, Chennai, Cuddalore, Mayiladuthurai, Nagapattinam, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794728624051041); 2026-11-15T07:45:57.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794728723301009: उक्त जनपदों में कहीं-कहीं गर्जन के साथ आकाशीय बिजली चमकने / झोंकेदार हवाएं (30-40 कि.मी प्रति घंटा) चलने की संभावना है \| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794728723301009); 2026-11-15T07:47:09.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794728982581009: [2026/11/15 13:10आपके क्षेत्र  में कहीं-कहीं गर्जन के साथ आकाशीय बिजली चमकने /झोंकेदार हवाएं (30-40 KMPH /हल्की से मध्यम वर्षा  /बर्फ़बारी (3000 मीटर व उससे अधिक ) क्षेत्रो में  की संभावना है \| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794728982581009); 2026-11-15T08:00:51.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794735414687009: अगले 3 घंटो में कहीं-कहीं हल्की से मध्यम वर्षा/बर्फ़बारी (3000 मीटर व उससे अधिक ऊँचाई वाले क्षेत्रो के साथ गर्जन /आकाशीय बिजली चमकने / झोंकेदार हवाएं (३०-४० kmph) होने की संभावना है \| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794735414687009); 2026-11-15T09:39:45.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794738481839007: Light to Moderate Rain is likely to occur at isolated places over Chengalpattu, Chennai, Cuddalore, Viluppuram, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794738481839007); 2026-11-15T10:28:04.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794738483089041: Light to Moderate Rain is likely to occur at isolated places over Chengalpattu, Chennai, Cuddalore, Viluppuram, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794738483089041); 2026-11-15T10:30:27.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794740880003009: अगले 3 घंटो में कहीं-कहीं हल्की से मध्यम वर्षा/बर्फ़बारी (3000 मीटर व उससे अधिक ऊँचाई वाले क्षेत्रो के साथ गर्जन /आकाशीय बिजली चमकने / झोंकेदार हवाएं (३०-४० kmph) होने की संभावना है \| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794740880003009); 2026-11-15T11:10:15.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794745524167009: अगले 3 घंटो में कहीं-कहीं हल्की से मध्यम वर्षा/बर्फ़बारी (3000 मीटर व उससे अधिक ऊँचाई वाले क्षेत्रो के साथ गर्जन /आकाशीय बिजली चमकने / झोंकेदार हवाएं (३०-४० kmph) होने की संभावना है \| | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794745524167009); 2026-11-15T12:34:40.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794772193063007: Light to moderate Rain is likely to occur at isolated places over Ariyalur, Cuddalore, Namakkal, Perambalur, Salem, Thanjavur, Thiruvarur, Tiruchirappalli, Viluppuram in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794772193063007); 2026-11-15T19:49:56.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794777328423007: Light to Moderate Rain is very likely to occur at isolated places over Kanniyakumari, Tirunelveli in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794777328423007); 2026-11-15T21:15:31.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794781934911010: IMD Guwahati has issued forecast for Light Thunderstorms with light to moderate rain which is very likely to occur at isolated places over Charaideo, Dhemaji, Dibrugarh, Lakhimpur, Sivasagar and Tinsukia in next 1-3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794781934911010); 2026-11-15T22:35:55.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794782079959007: Light to Moderate Rain is likely to occur at isolated places over Chengalpattu, Chennai, Dharmapuri, Namakkal, Perambalur, Pudukkottai, Salem, Thanjavur, Thiruvallur, Tiruchirappalli, Viluppuram districts in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794782079959007); 2026-11-15T22:34:43.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794791847032007: Light to Moderate Rain is very likely to occur at isolated places over Ariyalur, Cpattu, Chennai, Cuddalore, Kalla, Kanche, Mthurai, Npatinam, Namakkal, Perambalur, Pudukottai, Raman, Salem, Sivaganga, Tnjvur, Thiruvallur, Thiruvarur, Tirichi,Tmalai, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794791847032007); 2026-11-16T01:17:32.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794791850683041: Light to Moderate Rain is very likely to occur at isolated places over Ariyalur, Cpattu, Chennai, Cuddalore, Kalla, Kanche, Mthurai, Npatinam, Namakkal, Perambalur, Pudukottai, Raman, Salem, Sivaganga, Tnjvur, Thiruvallur, Thiruvarur, Tirichi,Tmalai, Viluppuram, Karaikal, Pondicherry in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794791850683041); 2026-11-16T01:20:23.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794805423229008: నవంబర్15 సా.4.0 నుంచి నవంబర్17 సా7.00 గంటల వరకు సముద్రంలో 1.3-1.4 మీటర్ల ఎత్తులో భారీఅలలు వచ్చే అవకాశం ఉంది.కావున ప్రజలు, మత్స్యకారులు,అప్రమత్తంగాఉండి బీచ్ లకు వెళ్లవద్దు -ఆంధ్రప్రదేశ్ ప్రభ | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794805423229008); 2026-11-16T05:04:55.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794808686215038: Squally weather with strong surface wind 40-50 Kmph gusting to 60 kmph very likely along and off  Andaman and Nicobar coast. Sea conditions are very likely to be  rough. Fishermen are advised not to venture into the Andaman sea till 16-11-2026. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794808686215038); 2026-11-16T06:04:00.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794822213748010: IMD Guwahati has issued forecast for Light Thunderstorms and light to moderate rain which is very likely to occur at many places over Baksa, Dhemaji, Dibrugarh, Tamulpur, Tinsukia and Udalguri in next 3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794822213748010); 2026-11-16T09:46:05.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794833494909010: IMD Guwahati has issued forecast for Light Thunderstorms and light to moderate rain which is very likely to occur at many places over Baksa, Biswanath, Chirang, Dhemaji, Dibrugarh, Lakhimpur, Sonitpur, Tamulpur, Tinsukia and Udalguri in next 3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794833494909010); 2026-11-16T12:54:20.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794850780088010: IMD Guwahati has issued forecast for Thunderstorm with Lightning which is very likely to occur at a few places over Kamrup and Kamrup Metropolitan in next 3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794850780088010); 2026-11-16T17:42:52.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1794853111405010: IMD Guwahati has issued forecast for Light to Moderate Rain with thunderstorm which is very likely to occur at a few places over Biswanath in next 2 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1794853111405010); 2026-11-16T18:23:27.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795000640273008: The SEVERE CYCLONIC STORM AKVAN with maximum wind speed of 90-100 gusting to 110 Kmph lays centred at 1130 IST of 18.11.26 near latitude 13.1N and longitude 85.4E, 540 Km southeast of Narsapur, Andhra Pradesh. Cyclone Warning for Alluri Sitharama Raju, Anakapalli, Srikakulam, Visakhapatnam, Vizianagaram. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795000640273008); 2026-11-18T11:17:26.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795002709049008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో  రేపు మీ ప్రాంతంలో  ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795002709049008); 2026-11-18T11:53:10.000Z | LIVE_RSS_SNAPSHOT; HISTORICAL; INTERNAL_FEED_SNAPSHOT_48H_ARCHIVE_NOT_HAZARD_EXPIRY | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795018046372012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ସୂଚନା ଅନୁଯାୟୀ, ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ବଜ୍ରପାତ ସହିତ ମଧ୍ୟମ ଧରଣର ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795018046372012); 2026-11-18T16:40:28.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795018909404008: SEVERE CYCLONIC STORM AKVAN with maximum wind speed of 90-100 gusting to 110 Kmph lays centred at 1730 IST of 18.11.26 near latitude 13.6N and longitude 85.3E, 540 Km  of Kalingapatnam,  Cyclone Warning for ASR, Anakapalli, Parvathipuram Manyam, Srikakulam, Visakhapatnam, Vizianagaram. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795018909404008); 2026-11-18T16:21:58.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795038751023015: Light to Moderate Rain is very likely to occur at a few places over Dhalai, North Tripura in next 30 minutes to 1 hour. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795038751023015); 2026-11-18T23:41:27.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795039977725008: The SEVERE CYCLONIC STORM AKVAN with maximum wind speed of 90-100 gusting to 110 Kmph lays centred at 2330 IST of 18.11.26 near latitude 13.9N and longitude 85.3E, 510 Km south-southeast of Kalingapatnam, Andhra Pradesh. Cyclone Warning for ASR, PVP Manyam, Srikakulam, VSKP, Vizianagaram, AKP. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795039977725008); 2026-11-18T22:13:07.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795040226348008: Extremely Heavy Rain is very likely to occur at isolated places over Alluri Sitharama Raju, Anakapalli, Kakinada, Srikakulam, Visakhapatnam, Vizianagaram in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795040226348008); 2026-11-18T22:17:10.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795040432375008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో ఈ రోజు మీ ప్రాంతంలో ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795040432375008); 2026-11-18T22:53:28.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795041240659015: Light to Moderate Rain is very likely to occur at many places over Unakoti in next 30 minutes to 1 hour. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795041240659015); 2026-11-18T23:40:25.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795041656904008: Heavy Rain with Gale wind speed reaching 60-70 Kmph Gusting to 80 Kmph  is very likely to occur at a few places over Anakapalli, Kakinada, Srikakulam, Visakhapatnam, Vizianagaram in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795041656904008); 2026-11-18T22:40:59.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795046532238008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో ఈ రోజు మీ ప్రాంతంలో ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795046532238008); 2026-11-19T00:03:29.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795049088155012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ସୂଚନା ଅନୁଯାୟୀ, ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ବଜ୍ରପାତ ସହିତ ମଧ୍ୟମ ଧରଣର ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795049088155012); 2026-11-19T00:54:47.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795050596037008: నవంబర్ 18 సా.4 గంటల నుండి 20 సా.7 గంటల వరకు సముద్రంలో 1.4-1.6 మీటర్ల ఎత్తులో అలలు ఎగిసిపడే అవకాశం ఉన్నందున ప్రజలు, మత్స్యకారులు అప్రమత్తంగా ఉండాలి. బీచ్ లకు వెళ్లవద్దు. -ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795050596037008); 2026-11-19T01:12:21.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795051101919008: నవంబర్ 18 సా.4 గంటల నుండి 20 సా.4 గంటల వరకు సముద్రంలో 1.1-1.3 మీటర్ల ఎత్తులో అలలు ఎగిసిపడే అవకాశం ఉన్నందున ప్రజలు, మత్స్యకారులు అప్రమత్తంగా ఉండాలి. బీచ్ లకు వెళ్లవద్దు. -ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795051101919008); 2026-11-19T01:19:27.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795051765894012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆଗାମୀ ତିନି ଘଣ୍ଟା ମଧ୍ୟରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ପ୍ରବଳ ଘଡ଼ଘଡ଼ି, ବିଜୁଳି, ଏବଂ ପୃଷ୍ଠ ପବନ ହେବାର ସମ୍ଭାବନା ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795051765894012); 2026-11-19T01:40:00.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795052475922012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ସୂଚନା ଅନୁଯାୟୀ, ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ବଜ୍ରପାତ ସହିତ ମଧ୍ୟମ ଧରଣର ବର୍ଷା ହେବାର ସମ୍ଭାବନା ଅଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795052475922012); 2026-11-19T02:21:03.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795060199066015: Light To Moderate Rain is very likely to occur/ continue at a few places over Dhalai, South Tripura in next 30 mts to 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795060199066015); 2026-11-19T03:51:12.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795063687933012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆପଣଙ୍କ ଅଞ୍ଚଳର ଅନେକ ସ୍ଥାନରେ ମଧ୍ୟମ ଧରଣର ବର୍ଷା ସହିତ ପବନ ହେବାର ସମ୍ଭାବନା  ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795063687933012); 2026-11-19T05:08:49.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795063890471008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో ఈ రోజు మీ ప్రాంతంలో ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795063890471008); 2026-11-19T04:52:31.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795064783267008: Gale wind speed reaching 60-70 kmph Gusting 80 kmph is very likely to occur at most places over Alluri Sitharama Raju, Anakapalli, Kakinada, Parvathipuram Manyam, Srikakulam, Visakhapatnam, Vizianagaram in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795064783267008); 2026-11-19T05:06:27.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795065066057015: Light to Moderate Rain is very likely to occur/continue at a few places over Khowai, West Tripura in next 30 mts to 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795065066057015); 2026-11-19T05:13:09.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795069769169008: SCS AKVAN with maximum wind speed of 90-100 gusting to 110 Kmph lays centred at 0530 IST of 19.11.26 440 Km south-southeast of Kalingapatnam, Andhra Pradesh. Cyclone Warning for ASR, Anakapalli, Konaseema, EG, Kakinada, Parvathipuram Manyam, Polavaram, Srikakulam, Visakhapatnam, Vizianagaram, WG | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795069769169008); 2026-11-19T06:29:33.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795072404321015: Light to Moderate Rain is very likely to occur/continue  at a few places over Gomati, Sepahijala, South Tripura in next 30 mts to 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795072404321015); 2026-11-19T07:19:44.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795072648185008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో ఈ రోజు మీ ప్రాంతంలో ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795072648185008); 2026-11-19T07:19:18.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795075459882017: আগামী ২৪ ঘণ্টায়, ১৯ নভেম্বর ১৩:৩০ থেকে পূর্ব মেদিনীপুর ও দক্ষিণ ২৪ পরগনা জেলার দু-একটি স্থানে মাঝারি ঝড়ের সঙ্গে দমকা হাওয়া এবং ভারী থেকে অতি ভারী বৃষ্টিপাত হওয়ার খুবই সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795075459882017); 2026-11-19T08:07:41.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795076518848015: Light to Moderate Rain is very likely to occur at a few places over Khowai, West Tripura in next 30 mimutes to 1 hour. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795076518848015); 2026-11-19T08:24:02.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795077705945017: ১৯ নভেম্বর ১৪:০০ থেকে আগামী ২৪ ঘণ্টার মধ্যে উত্তর ২৪ পরগনা, কলকাতা, হাওড়া, হুগলী, পশ্চিম মেদিনীপুর এবং ঝাড়গ্রাম জেলার এক-দু'টি জায়গায় ভারী বৃষ্টিপাত (০৭-১১ সেমি) হওয়ার প্রবল সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795077705945017); 2026-11-19T08:46:24.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795078209488008: బంగాళాఖాతంలోని అక్వాన్ తుపాను ప్రభావంతో ఈ రోజు మీ ప్రాంతంలో ఈదురుగాలులతో కూడిన భారీ వర్షాలు కురిసే అవకాశం ఉంది.ప్రజలు అప్రమత్తంగా ఉండి తగిన జాగ్రత్తలు తీసుకోవాలి-ఆంధ్రప్రదేశ్ ప్రభుత్వం | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795078209488008); 2026-11-19T08:51:04.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795078859954015: Light to Moderate Rain is very likely to occur at a few places over Dhalai, North Tripura in next 30 minutes to 1 hour. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795078859954015); 2026-11-19T09:03:19.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795083340956015: Moderate Rain is very likely to continue at many places over Gomati, Sepahijala, South Tripura, West Tripura in next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795083340956015); 2026-11-19T10:18:40.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795083588474015: Light to Moderate Rain is very likely to continue at many places over Dhalai, Khowai, North Tripura, Unakoti for next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795083588474015); 2026-11-19T10:22:32.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795084881556013: अगले 7 दिनों में आपके आस-पास के वन क्षेत्रों में जंगल की आग का बहुत अधिक खतरा होने की संभावना है। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795084881556013); 2026-11-19T10:44:10.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795084881627021: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795084881627021); 2026-11-19T10:41:24.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795084881697020: Very High Forest Fire Risk is likely to occur over forest area near you, in next 7 days. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795084881697020); 2026-11-19T10:41:24.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795084976206012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆଗାମୀ ତିନି ଘଣ୍ଟା ମଧ୍ୟରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ମଧ୍ୟମ ଧରଣର ଘଡ଼ଘଡ଼ି, ବିଜୁଳି, ଏବଂ ପବନ ହେବାର ସମ୍ଭାବନା ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795084976206012); 2026-11-19T11:50:07.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795085041598010: IMD Guwahati has issued forecast for  Moderate Rain which is very likely to occur at a few places over Hailakandi and Sribhum in next 3 hours. Issued in Public Interest by ASDMA. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795085041598010); 2026-11-19T10:49:25.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795086564057008: Extremely Heavy Rain is most likely to occur at most places over Srikakulam in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795086564057008); 2026-11-19T11:09:26.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795086645139012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆଗାମୀ ତିନି ଘଣ୍ଟା ମଧ୍ୟରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ପ୍ରବଳ ଘଡ଼ଘଡ଼ି, ବିଜୁଳି ଏବଂ ବର୍ଷା ହେବାର ସମ୍ଭାବନା ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795086645139012); 2026-11-19T11:47:36.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795086710000008: Heavy to Very Heavy Rain is very likely to occur at a few places over Vizianagaram in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795086710000008); 2026-11-19T11:11:51.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795086886189008: Heavy Rain is very likely to occur at a few places over Alluri Sitharama Raju, Anakapalli, Kakinada, Parvathipuram Manyam, Visakhapatnam in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795086886189008); 2026-11-19T11:14:49.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795088623046015: Moderate Rain is very likely to continue at many places over Dhalai, Khowai, North Tripura, Unakoti for next 3 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795088623046015); 2026-11-19T11:46:48.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795162562135030: Thunderstorm accompanied with lightning and Gusty winds (30-40 kmph) is very likely to occur  at isolated places over Adilabad, Bhadradri Kothagudem, Jayashankar Bhupalapally, Karimnagar, Kumuram Bheem Asifabad, Mancherial, Mulugu, Peddapalli in next 24 hours. | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795162562135030); 2026-11-20T08:16:04.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795163949391016: अगले 3 घंटों (02:10 PM से 05:10 PM) में आपके क्षेत्र में कुछ स्थानों पर हल्के से मध्यम दर्जे की वर्षा के साथ (30-40 kmph) तेज हवा होने की संभावना है। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795163949391016); 2026-11-20T09:04:18.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795171180987012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆଗାମୀ ତିନି ଘଣ୍ଟା ମଧ୍ୟରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ମଧ୍ୟମ ଧରଣର ଘଡ଼ଘଡ଼ି, ବିଜୁଳି ଏବଂ ପୃଷ୍ଠ ପବନ ସହିତ ବର୍ଷା ହେବାର ସମ୍ଭାବନା ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795171180987012); 2026-11-20T10:46:08.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795179653696017: ২০-১১-২০২৬ সন্ধ্যা ৬:২৫ থেকে আগামী ২-৩ ঘণ্টায় পশ্চিম মেদিনীপুর, পূর্ব মেদিনীপুর ও ঝাড়গ্রাম জেলার কিছু অংশে বজ্রবিদ্যুৎ-সহ হালকা থেকে মাঝারি বৃষ্টির সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795179653696017); 2026-11-20T13:02:20.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795180754573017: ২০-১১-২০২৬ তারিখের ১৮:৫০ থেকে পরবর্তী ২-৩ ঘণ্টার মধ্যে পশ্চিম মেদিনীপুর ও পূর্ব মেদিনীপুর জেলার কিছু অংশে হালকা থেকে মাঝারি বৃষ্টি অথবা বজ্রসহ তীব্র বৃষ্টিপাতের প্রবল সম্ভাবনা রয়েছে। | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795180754573017); 2026-11-20T13:20:49.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |
| ndma-alert-1795181471028012: ଭାରତ ପାଣିପାଗ ବିଭାଗର ତଥ୍ୟ ଅନୁଯାୟୀ, ଆଗାମୀ ତିନି ଘଣ୍ଟା ମଧ୍ୟରେ ଆପଣଙ୍କ ଅଞ୍ଚଳରେ ମଧ୍ୟମ ଧରଣର ଘଡ଼ଘଡ଼ି, ବିଜୁଳି ଏବଂ ପୃଷ୍ଠ ପବନ ସହିତ ବର୍ଷା ହେବାର ସମ୍ଭାବନା ରହିଛି । ଏଥିପ୍ରତି ସତର୍କ ରହିବାକୁ ଅନୁରୋଧ । SRC, Odisha | [Official reference](https://sachet.ndma.gov.in/cap_public_website/FetchXMLFile?identifier=1795181471028012); 2026-11-20T13:35:34.000Z | LIVE_RSS_SNAPSHOT; RESEARCH; CURRENTNESS_UNVERIFIED; date alone does not establish an active notice | MISSING description; headline only | RSS_SCOPE, NO_BODY, NO_FULL_TEXT, NO_VERIFIED_DATES, REVIEW_MISSING EN/HI/KN MISSING; INTERNAL; INCOMPLETE |

## Reuse and the specific next evidence

Reuse the 24 current approved limited scheme summaries and their existing EN/HI/KN artifacts. Retain research facts, immutable source versions, all eight hash-matched blank/reference PDFs and any structurally valid REVIEW_PENDING outputs as preparation material; they are not automatically approved. Do not regenerate valid artifacts merely because a different failed attempt exists.

For full eligibility, obtain the exact current operative clauses, exceptions, date/boundary treatment and amendments listed per scheme, then review the complete encoded rule set. For forms, prioritize a current actual blank document plus all fields/conditional sections/instructions, not a portal reference; current insurance editions and PMUY/APY declarations need the recorded corrections/review. The five proposed forms now have verified whole-packet page counts but no published guidance.

For notices, the 147 genuine RSS snapshots offer titles/dates/links, not verified current safety instructions. Full current messages and any expanded access scope must be obtained legitimately before richer guidance. The 12 imported notices need original-document/date/currentness/reuse review. Keep the four synthetic examples separated from real government content. No source permissions, eligibility decisions or editorial approval were granted by this audit.

Audit-only verification: exhaustive ID/count reconciliation, existing rule-validator inspection, stored source hash checks, exact local PDF hash matches, five bounded official PDF fetches/parses and no database mutations. Application tests/build were not run because no application feature was changed.

