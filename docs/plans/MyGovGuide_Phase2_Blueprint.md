# MyGovGuide — Phase 2 Data Engineering and Controlled Collection Blueprint

**Prepared:** 16 November 2026  
**Basis:** `/mnt/data/MyGovGuide_Phase1_Pack/` research and closure audit  
**Status:** Phase 2 planning ready; implementation not started

## 0. Non-negotiable baseline from Phase 1

- The initial research package contains **25 scheme records, 18 form/application references, 12 notice examples, 12 scam-awareness topics, and 70 source-reference entries**.
- **None** of the 25 scheme rule sets is certified for definitive automated eligibility decisions.
- **None** of the 70 source entries is cleared for unattended online collection based on the evidence available at Phase 1 closure.
- **myScheme is excluded** from automated scraping without express written authorization.
- Treat `VERIFIED_SCHEMES.json` as a **research registry**, despite its filename: it is not a fully verified eligibility dataset.
- Official public pages, API feeds, content reuse rights, and automated-access permission are **separate checks**.
- No beneficiary records, login-protected content, CAPTCHA/OTP bypass, Aadhaar or private application records may be collected.

## 1. Scope and deliverable

Build a **repeatable, provenance-preserving data pipeline** that imports curated research safely, classifies source rights, accepts approved official feeds when enabled, normalizes information, separates reviewed from unreviewed claims, detects changes, and stores records in MongoDB. It must work **with all network collectors disabled**.

The work is complete when local curated import, validation, idempotency, review gates, source versioning, an audit trail, controlled source-adapter tests, and an operator runbook are working. Online collection is a *separately gated feature*, not a precondition for local pipeline acceptance.

## 2. Subphases in build order

### 2A — Data contracts and foundation
- Freeze JSON Schema or Zod validation contracts for Source, SourceVersion, Scheme, SchemeFact, EligibilityRuleSet, FormTemplate, Notice, ScamAlert, ChangeEvent, and review events.
- Decide stable IDs, provenance fields, release classification, timestamps, content hashing, effective dates, source URLs, and version relationships.
- Build MongoDB models/indexes; enforce unique IDs, `sourceId + contentHash`, and per-source idempotent imports.
- **Accept when:** validation rejects malformed research records; model indexes apply; documents round-trip in tests.

### 2B — Curated import and review queue
- Write an import adapter for Phase 1 JSON files: `VERIFIED_SCHEMES.json`, `FORMS_REGISTRY.json`, `NOTICES_AND_ALERTS.json`, `SOURCE_REGISTRY.json`.
- Mark imported schemes `RESEARCH_ONLY` and eligibility logic `INFORMATION_INCOMPLETE`, never `approved`.
- Preserve historical names, source editions, original URLs, dates and explicit uncertainty notes.
- Separate downloadable PDFs, form landing pages and authenticated applications; separate dated advisories from educational scam-awareness topics.
- Generate import summary: created, updated, unchanged, rejected, pending review.
- **Accept when:** re-running import creates no duplicates; all counts reconcile with source JSON; original source context survives.

### 2C — Collector framework; deny by default
- Introduce an adapter interface: `discover -> fetch -> parse -> normalize -> validate -> stage`, logging source, time, status and errors.
- Create a strict allowlist: no live adapter executes unless approval evidence, allowed paths, robots assessment, rights basis, request limits, and reviewer sign-off exist.
- Build mock/offline fixtures for RSS, JSON API, HTML and PDF (without fetching real sites).
- Never treat HTTP success as access authorization; never parse a press release as automatically operative rules.
- **Accept when:** a forbidden source cannot be fetched, adapters work against fixtures, and failures do not corrupt stored data.

### 2D — Normalization, provenance and review
- Normalize scheme categories, state, programme type, dates and units without overwriting source-original strings.
- Store field-level evidence/section references and source versions.
- Manual review workflow: `RESEARCH_ONLY -> SOURCE_VERIFIED_FACT -> RULES_APPROVED_CURRENT`, subject to reviewer evidence.
- Eligibility rule expressions must be human-curated, versioned and tied to operative clauses; never auto-promote AI output.
- **Accept when:** every published fact has a traceable source/version and incomplete rules cannot produce definitive pass/fail.

### 2E — Changes and scheduled ingestion
- Compute content hashes on stable normalized payloads; distinguish page markup noise from material changes.
- Store versions and meaningful `ChangeEvent` diffs; invalidate stale translations when source content changes.
- Define retry/backoff, request timeouts, safe concurrency, logs and alerting.
- Add a scheduled job **disabled until a source is explicitly approved**; provide manual dry-run mode and a status report.
- **Accept when:** unchanged fixture produces no new event, changed fixture creates one reviewable event, and repeated runs do not duplicate events.

### 2F — End-to-end testing and handoff
- Test malformed URLs, stale records, missing sections, duplicate source URLs, divergent document editions, failed fetches and outdated scholarship deadlines.
- Verify Kannada/Hindi source text storage and Unicode preservation.
- Produce CLI usage, import report, source-approval checklist, operator runbook and a documented handoff for Phase 3.
- **Accept when:** all offline end-to-end tests pass, the DB is reproducible from curated source JSON, and the system starts with no third-party secrets.

## 3. Expected repository organization (JavaScript only)

```text
mygovguide/
  server/
    src/
      config/db.js
      models/{Source,SourceVersion,Scheme,SchemeFact,EligibilityRuleSet,FormTemplate,Notice,ScamAlert,ChangeEvent}.js
      validators/
      services/ingestion/{registry,normalize,hash,reviewGate,ingestPipeline}.js
      adapters/{offline,api,rss,html,pdf}/
      utils/logger.js
    scripts/{importResearchData,dryRunCollector,auditData}.js
    tests/{validators,import,allowlist,changes}.test.js
    seed-data/phase1/  # copied/referenced from the original pack; never modify in place
    .env.example
  docs/{SOURCE_APPROVAL_LOG,DATA_QUALITY_RUNBOOK,PHASE2_TEST_REPORT}.md
```

Folders may be adapted to existing repository structure; do not generate duplicate models if existing code is present.

## 4. Release and security gates

| Gate | Requirement | Initial status |
|---|---|---|
| Local curated import | Source files, validation, provenance | Ready to implement |
| Public scheme discovery | Rights + individual fact review | Blocked pending review |
| Automated eligibility | Fully approved, current rules with operative source clauses | Blocked: 0 of 25 |
| Unattended online collection | Host-specific access approval, rights, robots/API terms, scope, rate limits | Blocked: 0 of 70 |
| myScheme automated adapter | Explicit written authorization | Excluded |
| Protected citizen portals | No access | Excluded |

### Adapter approval record

Every activated online adapter must have: `sourceId`, `host`, `approvedPaths`, `method`, `sourceTermsUrl`, `rightsBasis`, `robotsUrl`, `robotsObservedAt`, `robotsAllowed`, `rateLimit`, `apiAgreement` if relevant, `reviewedBy`, `approvalEvidence`, `approvalExpiry`, and `testPlan`.

If an approved source becomes inaccessible, its adapter must stop safely while cached, date-labelled verified data remains visible only where release policy permits.

## 5. Data mapping from existing Phase 1 files

| Input | Count | Destination | Default trust status |
|---|---:|---|---|
| `SOURCE_REGISTRY.json` → `sources` | 70 | Source + approval evidence | `NOT_AUTHORIZED_FOR_AUTOMATION` |
| `VERIFIED_SCHEMES.json` → `schemes` | 25 | Scheme + linked source refs | `RESEARCH_ONLY` |
| `FORMS_REGISTRY.json` → `forms` | 18 | FormTemplate, form kind and link | `RESEARCH_ONLY` |
| `NOTICES_AND_ALERTS.json` → `notices` | 12 | Notice | `RESEARCH_ONLY` |
| `NOTICES_AND_ALERTS.json` → `scamAwareness` | 12 | ScamAlert with `recordType=awareness_topic` where applicable | `RESEARCH_ONLY` |

Note: do not import empty rule arrays as approved eligibility rules. Do not represent educational topics as recently issued alerts.

## 6. Success metrics

- 100% of input research entries accounted for as accepted or explicitly rejected with reason.
- Two consecutive imports yield identical record counts and no duplicate records.
- 100% of displayed/published facts carry traceable source IDs and review status.
- A denied source makes zero network requests.
- Unreviewed source changes create pending review events, never automatic eligibility rule updates.
- Phase 2 can be demonstrated end-to-end offline.

## 7. Recommended first Codex task

> Read `MyGovGuide_Project_Handoff.md` and the `MyGovGuide_Phase1_Pack` data and audit reports. Implement **Phase 2A only**: JavaScript/Node.js backend foundation, Mongoose models and indexes for the v2 ingestion schema, Zod validators, and automated tests. Preserve the existing handoff's citizen-facing API plan, but do not build UI, AI calls or live scrapers yet. All source statuses must default to deny for automation; all imported eligibility is unapproved. Run tests and provide the result before proceeding to Phase 2B.

## 8. Decision to revisit before frontend phase

The handoff originally has eight application collections; Phase 1 recommends additional provenance and review collections. During 2A, treat `Source`, `SourceVersion`, `SchemeFact`, `EligibilityRuleSet`, and `ChangeEvent` as internal data-layer entities, while retaining the user-facing Scheme/Form/Notice/Alert/Notification API semantics. Avoid breaking the eventual frontend contracts.
