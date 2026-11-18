# Gemini integration validation — 18 November 2026

[PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md) remains authoritative. This is a bounded validation of the existing integration, not another phase or citizen-feature expansion. Earlier completion/cleanup reports retain their historical results.

## Actual result

**Model requested and recorded: `gemini-3.5-flash-lite`. Three real primary-key requests succeeded.** English, Hindi and Kannada structured explanations and search keywords passed the existing Zod/factual validator and were stored by the existing leased AI worker as three `REVIEW_PENDING` AIArtifacts. Scheme publication stayed `INTERNAL`; there were **zero published indexes and zero publication events**. Original source evidence was unchanged.

| Language | Input tokens | Output tokens | Total | Validation / stored state |
| --- | ---: | ---: | ---: | --- |
| English | 735 | 946 | 1,681 | Passed / REVIEW_PENDING |
| Hindi | 735 | 944 | 1,679 | Passed / REVIEW_PENDING |
| Kannada | 735 | 643 | 1,378 | Passed / REVIEW_PENDING |
| Total | 2,205 | 2,533 | 4,738 | Three internal artifacts |

Free-tier estimated generation cost: **$0**. Paid generation requests: **0**. The owner confirmed **“Free tier — no paid billing linked”** for the primary key's project before model configuration or real generation. Official standard free-tier pricing was checked separately. Account/invoice balances were not independently inspected; metadata is not a billing-tier attestation. Paid approval stayed false and paid budget zero. No tools, grounding, cache-creation requests, retries or secondary-key switching were used in this diagnostic.

Machine receipts: [generation and summaries/keywords](../../backend/reports/gemini-generation-validation.json), [model metadata](../../backend/reports/gemini-provider-check.json), [free-tier evidence](../../backend/reports/gemini-free-tier-evidence.json). Timestamped generation receipts are also retained in `backend/reports/`.

## Model selection and pricing checks

The official SDK metadata listing returned 28 models without truncation. It includes embedding, image and specialized models; listing membership alone does not make a model suitable for structured text or free use. The selected model's individual metadata was also reachable and listed `generateContent`. No obsolete model ID from an earlier handoff was silently selected.

| Model | Documentation / availability assessment | Decision |
| --- | --- | --- |
| `gemini-3.5-flash-lite` | Listed for the key; stable text model with [structured-output support](https://aistudio.google.com/docs/models/gemini-3.5-flash-lite). Standard Free-tier input/output are free; paid rates are $0.30 input / $2.50 output per million tokens. | Selected after account confirmation; all three real language tests passed |
| `gemini-3.1-flash-lite` | Listed; [structured output and translation documented](https://aistudio.google.com/docs/models/gemini-3.1-flash-lite). A Free-tier offering exists; paid pricing is separate. | Suitable documented alternative; not configured or generation-tested |
| `gemini-4-hydrogen` | Listed; [structured output documented](https://aistudio.google.com/docs/models/gemini-4-hydrogen). Standard Free-tier input/output are free; paid rates are $1.50 / $7.50 per million tokens. | Capable alternative; not generation-tested or selected |
| `gemini-2.5-flash-lite` | Listed, but [official availability note](https://aistudio.google.com/docs/models/gemini-2.5-flash-lite) limits access to prior active users and recommends newer models for new projects. | Avoided for new validation |
| `gemini-2.5-flash` | Listed, but deprecated; the [pricing notice](https://aistudio.google.com/docs/pricing#gemini-2.5-flash) warns of routing/rate changes on December 1, 2026. | Avoided |
| `gemini-4-argon`, `gemini-4-carbon` | Listed but [no Free-tier offering](https://aistudio.google.com/docs/pricing). | No requests made |

Pricing references checked: [standard model pricing](https://aistudio.google.com/docs/pricing#gemini-3.5-flash-lite), [billing tiers](https://aistudio.google.com/docs/billing), [structured JSON validation guidance](https://aistudio.google.com/docs/structured-output). Free-tier quotas, account restrictions and data-use terms still apply. Do not infer that a model's free offering makes a paid project's requests free.

## Input, preservation and publication checks

The input was a **clearly labeled synthetic validation copy of historical public PM-KISAN research** already present in `backend/research/phase1/VERIFIED_SCHEMES.json` (IN-FA-01). Its recorded annual amount was INR 6000. The sample explicitly labeled 2026-11-18 as a **test reference date, not an application deadline**, and stated that documents/deadline were unknown in this sample. It contains no personal details, uploaded forms, credentials or sensitive citizen data.

The fixture was parsed/staged/versioned through the existing offline collector in `mygovguide_phase2_test_gemini_1794987414743`. Source fact/rights review was simulated **only in that isolated test database**; it was not an approval of production research or a current government scheme. The source URL was preserved as a research reference; no government request was made and no source permission changed.

The actual router and Google SDK made one bounded request per language (English first). The existing worker stored output, usage, provider/model, source version/hash, validation results and audit evidence. Checks covered exact preserved facts, the amount, date, document list, allowed links, exact cited excerpts and Hindi/Kannada scripts. Deliberately mutating the amount to INR 7000 or adding a new 2027-01-01 date failed validation for every language. Missing values were not promoted into application requirements. The test checked the raw-original hash before/after and zero publication side effects.

Example generated keywords: English `farmer`, `agriculture`; Hindi `किसान`, `कृषि`; Kannada `ರೈತ`, `ಪಿಎಂ ಕಿಸಾನ್`. All generated prose remains unapproved test content. Numeric/schema/script checks do not certify translation quality or semantic completeness; native-speaker/editor review remains mandatory.

## Implementation changes

- Removed the retired provider HTTP adapter/router branch, active config schema, `.env.example` entries and private retired entries. Active backend/frontend source no longer references it. Historical reports and existing database history were preserved.
- No separate vendor SDK dependency existed; the adapter used native HTTP. Package/lockfile dependency entries were checked, and no unrelated dependency update was needed. Official `@google/genai` remains installed.
- Preserved primary and secondary Gemini credential values only in ignored backend `.env`; no keys were printed. Primary-project free entitlement was confirmed by the owner. Secondary live generation was not exercised or used as quota failover.
- Preserved existing 429 project cooldown, bounded transient retries, 401-only expressly authorized credential replacement, 403 stop, spending reservations, reviewed-source gate, leases, factual validation and publication controls.
- Updated the existing admin readiness section for the Gemini-only health response so removing the old response field cannot crash the page. No dashboard replacement or redesign.
- Corrected an existing editor timing race exposed by the mobile regression: a completed review now closes its editor before refreshing the artifact list, so an older completion cannot close the next editor opened by the user. Failed decisions still leave the editor available for correction.
- Extended metadata diagnostics to bounded pagination (up to 200 models, with explicit truncation reporting), model/action metadata and a clear account-tier caveat. Metadata performs no generation.
- Added manual `npm run ai:validate`, excluded from automated tests/startup. It enforces free-only flags and an explicit isolated URI, makes at most three requests with no retries/key switching, retains invalid responses for review, and never approves/publishes artifacts.

## Errors and verification

An initial metadata check inside the restricted sandbox returned `PROVIDER_TEMPORARY`, status 0. The approved network-enabled metadata check succeeded. An initial generation diagnostic found the existing local database stopped, failed before any model call, and was resolved by starting the existing native database with its unchanged files. The successful validation then completed without provider/schema/fact errors; no quota bypass or paid retry occurred.

The first browser run passed all 16 regression/theme journeys and the desktop content journey, but timed out in the mobile content editor because a delayed prior review closed the next editor. The close-before-refresh correction above addresses that ordering bug. The initial failure is preserved in [browser failure output](../../frontend/reports/gemini-browser-initial-failure.txt); the final rerun is recorded below. No assertions or timeouts were weakened.

| Existing check | Final result | Evidence |
| --- | --- | --- |
| Backend + frontend unit/contract | 82 + 4 passed, no failures/skips | [Output](../../backend/reports/gemini-unit-tests.txt) |
| Database integration | 31 test nodes passed (4 parents / 27 child scenarios), no failures/skips | [Output](../../backend/reports/gemini-integration-tests.txt) |
| Browser regression/theme + synthetic editor flow | 16 + 2 passed, desktop/mobile | [Output](../../frontend/reports/gemini-browser-tests.txt) |
| Production bundle | Passed | [Build output](../../frontend/reports/gemini-build.txt) |
| Real Gemini generation/storage | EN/HI/KN all passed; three artifacts pending review; zero publication | Generation receipt linked above |
| Secret exclusions / source-gate preservation / research hashes / local links | Passed | [Final audit](../../backend/reports/gemini-final-audit.json) |

The retired-provider test was replaced with a Gemini spending/rate/reservation/unsupported-provider test; existing malformed-output, auth, quota, Unicode and factual checks remain. Integration coverage now explicitly asserts that generation/storage creates no published index and leaves the scheme internal. Browser fixtures continue to use mocks; they are distinct from the three real requests in this report.

Reproduce metadata without generation: `npm run ai:check`. Repeat the real diagnostic only after rechecking account Free tier/current pricing, starting the existing native database, and setting the explicit isolated local `MONGODB_TEST_URI`; then run `npm run ai:validate`. See [AI runbook](../guides/AI_PROCESSING_RUNBOOK.md).

## Remaining blockers and limits

Real generation is no longer blocked for this small confirmed-free test. Production content still needs lawful source access, current fact/rights review, multilingual editorial approval and independent eligibility-rule review. Government live-source permissions remain unresolved; no government collection occurred. Atlas connectivity was not retested; the prior DNS/connection blocker remains. Free quota is finite and future billing/model changes require rechecking. Broader language accuracy, actual low-literacy usability, secondary credential behavior in a real authorization failure, physical-device QA and production acceptance remain unverified. Previously documented credential rotation and upstream development-dependency advisory follow-up also remain. No unrelated citizen features or public deployment were started.
