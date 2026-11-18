# Data requirements and rules-validation contract

**Project:** MyGovGuide — Karnataka-first; English `en`, Hindi `hi`, Kannada `kn`; anonymous citizen access.

## Non-negotiable trust model

1. Separate `sourceDiscovery` (site listing / press release) from `governingAuthority` (current ministry rule / order / notification).
2. Store source date, retrieval date, edition and exact evidence URL. Never infer scheme currentness from crawl date.
3. Eligibility criteria are *reviewed human-authored logic*, **not** unreviewed LLM extraction.
4. Rule evaluation uses three-valued outcomes: `met`, `not_met`, `unknown`; missing/invalid user inputs produce `unknown`, not `false`.
5. Overall results: `potentially_eligible`, `potentially_ineligible`, `insufficient_information`, `manual_review_required`. Do not guarantee award or official eligibility.
6. Source passages and PDF section identifiers are linked to every benefit, threshold, document requirement and rule, with `validFrom` / `validTo` where known.
7. On changed official rules, **invalidate language-specific AI summary caches and eligibility question sets**; require rule review before reactivation.

## Proposed normalized collections

| Collection | Purpose | Critical fields |
|---|---|---|
| Source | Website/document/feed/API identity & access rights | `sourceId`, `owner`, `url`, `accessType`, `rightsStatus`, `robotsCheckedAt`, `lastCheckedAt`, `attribution` |
| SourceVersion | Dated official document or source snapshot metadata | `sourceId`, `url`, `contentHash`, `publishedAt`, `effectiveAt`, `retrievedAt`, `edition`, `licensedExcerpt`, `status` |
| Scheme | Citizen-viewable scheme/profile classification | `slug`, `canonicalName`, `aliases[]`, `department`, `state`, `categories[]`, `programmeType`, `applicationUrl`, `isActive`, `verificationStatus`, `sourceVersions[]` |
| SchemeFact | Claims sourced to exact text | `schemeId`, `factType`, `value`, `units`, `sourceVersionId`, `sourceSection`, `verifiedBy`, `verifiedAt` |
| EligibilityRuleSet | Reviewed logic tree, per edition | `schemeId`, `version`, `expression`, `sourceVersionId`, `validFrom`, `validTo`, `reviewer`, `approved`, `manualConditions[]` |
| FormTemplate | Public form metadata and approved field guidance | `schemeId`, `sourceUrl`, `formType`, `documentVersion`, `fields[]`, `applicationGate`, `updatedAt` |
| Notice | Dated authoritative government announcement | `noticeId`, `sourceUrl`, `type`, `publishedAt`, `effectiveAt`, `dueDates[]`, `supersedes[]`, `sourceVersionId` |
| ScamAlert | A dated public incident OR an undated awareness topic | `recordType`, `title`, `sourceUrl`, `publishedAt`, `category[]`, `languageContent`, `reviewedAt` |
| ChangeEvent | Verified meaningful diffs | `schemeId`, `previousVersionId`, `newVersionId`, `changeKind`, `fieldsChanged[]`, `reviewStatus`, `detectedAt` |
| AnonymousSession | Secure state/category/language preferences | `sessionIdHash`, `state`, `category`, `language`, `createdAt`, `expiresAt` |

This is the **recommended v2 design** based on Phase 1 evidence; the handoff's original eight collections can remain runtime-facing facades or be evolved later during architecture review. Do not create collections until Phase 2 begins.

## Eligibility rule specification

Represent rule logic as nested `AND`, `OR`, `NOT`, and leaf predicates with type-safe operands. Supported leaf operations should include `eq`, `in`, `lt`, `lte`, `gt`, `gte`, `betweenInclusive`, dates, residential scope, annual/monthly income (different units), and document-required/manual verification. All numeric values require a unit and currency where applicable.

Example **STRUCTURAL ONLY — illustrative, not a verified scheme rule**:

```json
{
  "all": [
    {"field": "ageYears", "op": "gte", "value": 18, "evidenceId": "example-source-clause-1"},
    {"any": [
      {"field": "occupation", "op": "eq", "value": "worker", "evidenceId": "example-clause-2"},
      {"field": "otherQualifyingCondition", "op": "eq", "value": true, "evidenceId": "example-clause-3"}
    ]}
  ]
}
```

If the expression is incomplete or rule-source review is absent, block the eligibility screen from making a pass/fail determination and show the official source instead.

## API outputs for future phases

- `GET /schemes/search` returns verified and unverified records separately; only `verificationStatus=APPROVED` receives eligibility CTA.
- `GET /schemes/:id` includes `canonicalName`, `aliases`, `sourceUrl`, `originalExcerpt`, `sourceEdition`, `lastVerifiedAt`, `sourceScope`, `AItranslationStatus`.
- `POST /eligibility/check` requires rule set ID/version and validated answer types; responds per-criterion with source evidence IDs, nulls for unknown, and a non-guarantee disclaimer.
- `GET /alerts` distinguishes `awareness_topic` vs `dated_advisory`; never show “new scam” for an undated topic.
- Personal notices and notifications must have anonymous-session **ownership checks**, not only an attacker-supplied device UUID.

## Multilingual safeguards

- Static UI strings via `react-i18next`; AI only for dynamic sourced material.
- The source language and translation language are separate, with per-clause cache key `(sourceVersionHash, locale, promptVersion, modelId)`.
- Never translate scheme names, dates, money amounts or legal category labels in a way that changes meaning; retain source snippet alongside explanation.
- Check Kannada numerals, Devanagari, abbreviations, text-to-speech voice coverage, and truncation on 360px mobile UI.

## Privacy and retention

- Exclude all beneficiary and application records from Phase 2 collection.
- Notice original text should not persist by default; process in memory and retain only explicit saved checklists with user control.
- Authenticate ownership for anonymous saved checklists and notification changes.
- Do not accept official-benefit submissions, Aadhaar input or identity document storage inside MyGovGuide MVP.

## Reference files

`VERIFIED_SCHEMES.json` is a source-backed **research registry**. Its `eligibilityRules` and `requiredDocuments` arrays are intentionally empty, and `currentEligibilityFullyVerified=false` for all records. This prevents accidental promotion of partial research notes into a public eligibility engine.
