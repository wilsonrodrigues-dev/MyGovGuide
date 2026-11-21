# Forms Library and Form Explanation — implementation and verification

19 November 2026. **Locally actionable implementation delivered; full content acceptance remains pending.** The owner explicitly decided: “Keep preparation pending until fact, rights and currentness review is resolved.” No live form Gemini request, fact approval, editorial approval or publication was performed. Synthetic tests below are not real government guidance.

## Working routes and behavior

- Citizen `/forms`: prominent consented upload, searchable/filterable18-reference library, official links and trilingual loading/error/empty states. “Frequently used” explicitly says usage is unmeasured; no invented popularity ranking.
- Citizen `/forms/:id`: official document and application route shown separately, edition/check date, source quotes, ordered extracted labels, uncertainty/partial-coverage warnings and related published schemes. Source labels remain original English when reviewed translations are unavailable.
- Published PMUY `/schemes/IN-WO-02` links to KYC `/forms/FORM-01` and the appropriate supplementary/migrant references. PAHAL is excluded from PMUY application links; the mechanic checklist is not offered as a citizen application. Real Atlas browser verification passed.
- `POST /api/forms/uploads/extract?consent=local-only`: binary PDF/PNG/JPEG;5MB maximum;10 PDF pages;16MP image limit; signature/MIME checks, image decoding, malformed/encrypted/active-content rejection, isolated20-second/128MB-JS-heap parser process and2 concurrent parsers. Child receives no app credentials or database configuration. This is not an antivirus certification.
- Exact document SHA256 identifies a checked reference file. Title/edition markers plus labels can suggest a **possible** match only; unknown uploads remain unidentified. Output contains fixed-vocabulary labels and generic local EN/HI/KN reading aids, never filled values or raw extracted text. Scanned PDFs/images truthfully report OCR unavailable.
- Optional voice: open Forms Help; search/select only current form results with confirmation; read current field instructions; stop narration. Manual controls work independently; microphone never starts automatically. Native-language/device speech quality remains unverified.
- Existing `/admin/forms` workspace and protected `/api/admin/forms` routes: inspect identities/hash/edition/evidence/field extraction, human fact/rights/currentness decisions, queue preparation, inspect exact language revisions, reject or explicitly approve all three revisions for publication. Existing admin authentication is reused.

## Actual government evidence and Atlas storage

All18 existing `FormTemplate` records and their original versions remain unchanged. Five existing public PDF links were individually downloaded for the requested document audit, each HTTP200; these are **manual document checks, not permission-approved scraper runs**.

| Reference | Pages | Digital label evidence | Result |
| --- | ---:| ---:| --- |
| [Ujjwala KYC](https://pmuy.gov.in/documents/Ujjwala-KYC.pdf) / FORM-01 | 2 | 17 selected fields | Printed Version5.0; current operative edition requires review |
| [PAHAL/DBTL](https://pmuy.gov.in/Unified_form_DBTL_Eng.pdf) / FORM-02 | 1 | 0 | Image-only; OCR unavailable; not treated as Ujjwala application |
| [Supplementary KYC](https://pmuy.gov.in/documents/Supplementary%20KYC.pdf) / FORM-16 | 1 | 7 selected fields | Legal14-point declaration is not simplified or approved |
| [Migrant Annexure I](https://pmuy.gov.in/documents/Annexure%20I.pdf) / FORM-17 | 1 | 23 selected fields | Migrant-only; edition and current acceptance need review |
| [Mechanic Annexure II](https://pmuy.gov.in/documents/Annexure%20II.pdf) / FORM-18 | 1 | 8 selected fields | Staff checklist, not citizen application |

**Counts:**18 references;5 checked PDF versions;4 digitally extractable documents;55 selected labels, all required/optional conditions UNKNOWN;0 fully reviewed complete templates;0 approved form facts;0 real form AI artifacts/jobs/publications. All four preparation packets remain pending. The [official FAQ](https://pmuy.gov.in/faq.html) and [application page](https://pmuy.gov.in/ujjwala2.html) are context, not general reuse authorization. PDFs are not mirrored in the app; the source states All Rights Reserved.

Atlas database remains `mygovguide_dev`, selected by ignored `backend/.env`. New collections are `formdocuments`, `formguidanceartifacts`, `formpreparationjobs` and `formreviewevents`. Only five DOCUMENT_CHECKED documents were added, with five immutable `sourceversions`:263→268. Second staging run:5 UNCHANGED,0 new documents/versions. Source references, hashes, page evidence, printed instructions and explicit gaps are preserved; downloaded public evidence is private/ignored under `.local/forms-milestone/`.

Protected hashes match:35 schemes,18 original form references,117 existing scheme artifacts,15 publications,25 scheme approvals,45 published language search documents,148 sources,1 NDMA execution configuration and35 unapproved eligibility rule sets. All263 previous complete version records are preserved. Existing20 pending scheme records remain pending. No NDMA collection, schedule activation, source permission change or private environment change occurred.

## Remaining13 reference checks

Metadata-only HEAD checks do not validate content, forms, login flows or automation rights; no redirects/login/CAPTCHA were followed.

| ID | Reference | Actual HEAD result / usable field evidence |
| --- | --- | --- |
| FORM-03 | PM-KISAN registration | Unreachable in this runtime; four historical labels remain unverified |
| FORM-04 | NSP Students URL | HTTP404; no verified blank document |
| FORM-05 | PMFBY | HTTP200; authenticated portal, no verified fields |
| FORM-06 | PMMVY | HTTP200; sensitive citizen portal, no extracted fields |
| FORM-07 | e-NAM instructions | HTTP403; no bypass or field extraction |
| FORM-08 | JanSamarth | HTTP405 to HEAD; GET/access validity not inferred |
| FORM-09 | Maandhan | HTTP200; enrolment portal, no extracted fields |
| FORM-10 | PMJJBY | HTTP200; information reference, no verified blank enrolment form |
| FORM-11 | PMSBY | HTTP200; information reference, no verified blank enrolment form |
| FORM-12 | SSA rules PDF | Unreachable in this runtime; separate blank form not established |
| FORM-13 | SCSS rules PDF | Unreachable in this runtime; separate blank form not established |
| FORM-14 | Seva Sindhu | HTTP302 to official Kannada service route; no redirect/authentication followed |
| FORM-15 | Soil Health Card | HTTP200; public service entry, no verified application template |

Exact URLs and receipts: [machine verification](../../backend/reports/forms-milestone-verification.json). These references were preserved, not silently replaced from HEAD results.

## Privacy, cache and review

Citizen upload bytes are never written to disk, MongoDB, logs, analytics or Gemini. Raw buffers are cleared after extraction and on failure; parser processes are terminated on completion/timeout. Extracted text exists only in transient process/request memory, is discarded, and is not returned. There is no upload collection, retained upload ID or retrieval endpoint. The selected source file stays on the citizen's own device. Browser results are memory-only; **Delete result and clear file** aborts the request and clears the file selection/result/consent, and leaving the page aborts pending work. This does not claim forensic erasure of every runtime/browser memory copy. External-processing options are refused, including when supplied directly to the API.

Only fact-reviewed **blank public documents** can enter preparation. The existing Gemini router retains credentials, free/spending controls, quota/circuit rules and schema validation. Form jobs run through the existing worker, with version/language/prompt deduplication, persisted four-field chunks and quota/interruption recovery. Validated fields are not regenerated after interruption. Outputs preserve exact labels/instructions/conditions/quotes; unsupported numbers/dates, missing language scripts and erased uncertainty fail validation. Artifacts remain REVIEW_PENDING. All three exact current language revisions require genuine editorial publication; source change/expiry/rejection hides prior guidance and never falls back to old evidence. No on-open/on-language-change model call exists.

No model was used for real form generation in this milestone, in accordance with the owner's pending decision. Previous real Gemini scheme receipts remain intact. Live form-generation feasibility and native-speaker review are not established by the synthetic tests.

## Verification and screenshots

| Check | Actual result |
| --- | --- |
| `npm test` |106 backend +11 frontend unit tests passed |
| `npm run test:integration` |45 checks passed in isolated local databases; no Atlas test writes |
| `npm run test:e2e` |30 regression +4 existing editorial journeys passed |
| `npm run test:e2e:forms -w frontend` |10 desktop/mobile Forms journeys passed using explicitly synthetic offline artifacts |
| `npm run build` |Passed; existing bundle-size warning remains |
| Actual Atlas/browser verification |18 references, real PMUY→KYC link, real digital-PDF hash match, real scanned-PDF OCR fallback, clearing and14 screenshots; zero browser errors |
| Preservation / secrets |Protected hashes and263 old versions match; backend private env remains ignored/untracked; configured secret scan found0 shareable matches |

Coverage includes unknown/mismatched files, malformed/unsafe/type-spoofed/oversized/excess-page PDFs, validated images, no unapproved external processing, no upload database writes, source-version invalidation, interrupted/quota-deferred chunk recovery, cached EN/HI/KN output, explicit review gates, empty/error/retry states and optional voice read/stop. Physical-device speech, full antivirus scanning and production security/load acceptance are not claimed.

Real Atlas screenshots: [desktop library](../../frontend/reports/forms-real/library-desktop.png), [mobile library](../../frontend/reports/forms-real/library-mobile.png), [KYC evidence pending review](../../frontend/reports/forms-real/kyc-pending-en-desktop.png), [Hindi pending state](../../frontend/reports/forms-real/kyc-pending-hi-mobile.png), [Kannada pending state](../../frontend/reports/forms-real/kyc-pending-kn-mobile.png), [real digital upload](../../frontend/reports/forms-real/digital-upload-desktop.png), [real scanned fallback](../../frontend/reports/forms-real/scanned-fallback-desktop.png), [admin review](../../frontend/reports/forms-real/admin-pending-desktop.png). Cached translated **synthetic test** guidance screenshots are separately labeled in `frontend/reports/forms-fixtures/`.

**Outstanding:** resolve specific rights/currentness/identity and complete field/document evidence, then obtain genuine preparation/editorial decisions; keep the scanned form blocked until an evaluated OCR path exists. No fabricated approvals or paid requests. The milestone is not certified complete while real reviewed multilingual form guidance is pending.
