# Dataset classification and release policy

## Three classes of records

| Class | Meaning | Shown in production? | May drive deterministic eligibility? |
|---|---|---|---|
| `RESEARCH_ONLY` | Source-backed notes, incomplete/old/risky edition | No, except separate developer/reviewer environment | **No** |
| `SOURCE_VERIFIED_FACT` | Specific fact checked against authoritative live source, provenance available | Only with verification date and clear context, if publication rights are clear | **No by itself** |
| `RULES_APPROVED_CURRENT` | Every mandatory condition, disjunction/exemption, region, date and operative amendment has clause evidence and reviewer approval | Yes | **Yes, with three-state result and disclaimer** |

All 25 schemes are `RESEARCH_ONLY` for **automatic eligibility** today. Several contain `SOURCE_VERIFIED_FACT` entries, but that is not the same as whole-scheme verification. Every automatic eligibility engine must default to `INFORMATION_INCOMPLETE` until `RULES_APPROVED_CURRENT`.

## What needs to exist in a production Scheme

- `sourceDocuments`: {url, issuingBody, documentType, issuanceDate, effectiveFrom, effectiveUntil, clauseReference, retrievedAt, rightsBasis, versionHash}
- `schemeStatus`: {active, paused, closed, unknown} **separate** from application window state.
- `factChecks`: {fieldName, normalizedValue, exactSourceQuoteOrClause, verifiedAt, verificationStatus}
- `ruleVersion`: {versionId, sourceDocumentIds, rules, exceptions, approvedBy, approvedAt, validFrom}
- `sourceAccess`: {method, robotsEvidence, licence, approvalEvidence, lastReviewed}
- `publicationStatus` and `lastHumanReviewAt`.

## Hard data integrity checks

1. Never promote a scholarship deadline from an older year. Fresh NSP 2026–27 listing takes precedence over old specification dates.
2. Do not treat 2025 report information as a current 2026 Karnataka government order.
3. Distinguish scholarship/transfer, pension, insurance, loan, savings product and service registration — not all are direct financial benefits.
4. Keep 2026 old-age programme rename with historic aliases, never create a duplicate pension programme.
5. Source status must never be inferred from HTTP 200, search-result snippets alone, or a successful scraper job.
6. Only keep source snippets/derived records within the documented rights basis. Don't mirror PDFs or ministry logos by default.
7. Do not retain beneficiary IDs, Aadhaar, phone numbers, student application details, private portal responses, or submitted uploads in scheme datasets.
