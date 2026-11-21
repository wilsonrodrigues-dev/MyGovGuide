# Incremental scheme collection audit and implementation

Execution date: 18 November 2026. Specification: [PRODUCT_MASTER_PLAN.md](../../PRODUCT_MASTER_PLAN.md), particularly the source, fact-review, AI and publication gates in §17.4. This extends the existing pipeline; no new phase, crawler or dashboard was created.

## Capabilities audited and retained

| Capability | Existing behavior | Addition or correction |
|---|---|---|
| Deduplication | Stable entity IDs and normalized content hashes prevent repeated same-ID inserts. | Canonical scheme identity registry resolves source-local IDs, normalized official URLs and documented official-ID namespaces across collectors. |
| Identity uncertainty | No separate cross-source identity decision queue. | `NEEDS_IDENTITY_REVIEW` candidates retain original evidence and possible matches. Similar names, shared portals, conflicting IDs and jurisdiction conflicts never silently merge. |
| Source versions | Immutable `SourceVersion`, revision chain and A→B→A history already existed. | Kept unchanged; collected observations separately retain each record's original evidence, source URL, run and check timestamp. |
| Change detection | Content hashing, changed-field names, review items and conflicts already existed. | Four explicit result classifications; exact before/after fact values; material comparison ignores transport metadata and source identity alone. Document references, editions and publication dates are included. |
| Unchanged checks | No duplicate versions, but last-check metadata was not refreshed consistently. | Metadata-only updates avoid artifact invalidation, publication changes and Gemini work. HTTP304 checks reference only schemes represented by that exact cached response. |
| Changed facts | New versions trigger renewed review and invalidate stale artifacts/search entries. | Retained and tested. Prior evidence and artifacts remain stored; changed facts are never automatically approved or published. |
| New records | Research candidates, fact records and review items were already transactional. | Identity checks now run before scheme insertion; unambiguous new records retain original evidence and enter the existing review pipeline. |
| HTTP access | ETag/Last-Modified, request budgets, retries, DNS/SSRF, redirect and authorization checks already existed. | Reviewed cursor/offset/updated-since contracts permit only named parameters within approved host/path scope. Pagination cannot use a page-level304 as whole-collection confirmation. |
| Transactions | Complete-source staging and atomic commits already existed. | All pages must parse and validate before records or the incremental watermark commit. Traversal has loop, page and record bounds. Failed traversal retains the old checkpoint. |
| Jobs/scheduler | Manual jobs, persisted schedules, unique slots, leases, cancellation and expiry recovery already existed. | Abandoned ingestion runs are marked failed during recovery. Retry remains idempotent; existing schedule/manual controls invoke the extended collector. |
| Administration | Sources, collection jobs, schedules, data explorer and editorial controls already existed. | Added scheme collection table, filters, paginated observation history, exact changes and explicit identity-mapping review inside `/admin/collection`. |
| Approval boundaries | Source access, facts, AI preparation, editorial publication and eligibility decisions are separate. | Preserved. Identity mapping approves only identity; it clears cached checkpoints so the authorized source can be checked again. |

## Identity and persistence behavior

The existing scheme ID remains its canonical ID. Scheme metadata is indexed for normalized names and URLs. The `schemeidentities` collection uses deterministic unique keys for source-record identity, normalized URL and, where documented, an official namespace plus official ID. Component encoding avoids delimiter collisions. Raw adapter IDs are not assumed to be government scheme IDs. HTTP/HTTPS and different hosts are not silently equated.

An official-ID contract must name the namespace and raw field and include public documentation, reviewer, dated verification and evidence. An exact normalized URL must also have a compatible name and jurisdiction when no stronger mapping exists. Conflicting or name-only matches go to `identityreviewcandidates`. Synthetic identities remain separate from real scheme identities. Existing legacy records receive metadata, not fabricated government IDs or human cross-source decisions.

Every successfully classified record has an immutable `collectionobservations` entry. `NEW` creates original source evidence and research review; `UNCHANGED` touches check metadata without creating versions or AI jobs; `UPDATED` preserves the prior version, records differences and requires renewed fact review; `NEEDS_IDENTITY_REVIEW` stores the candidate without inserting a duplicate scheme. Identity decisions retain the administrator, evidence and observed candidate revision. They do not approve facts, eligibility or publication.

For cross-source unchanged evidence, the observation retains that source's raw record even though no duplicate source version or canonical scheme is created. Updated material is kept in its source version; reviewed public fields are not silently overwritten. The existing invalidation behavior can withdraw a changed publication until review, rather than continuing to serve stale approved explanations.

## Incremental operation

The existing source approval JSON accepts documented `adapterOptions.incremental` and `adapterOptions.identityPolicy`; see the [operations guide](../guides/SCRAPING_OPERATIONS_GUIDE.md). Saving a contract is not evidence that a government source actually permits it. Existing source validation, activation, expiry and execution checks remain mandatory.

Cursor and offset traversal use only the configured response paths and parameter names. A completed traversal saves its watermark and contract hash. Updated-since requests overlap the previous watermark by the configured interval, with deduplication handling repeats. Any malformed page, repeated cursor, interrupted request or exceeded bound rolls back the source batch and retains the previous checkpoint. Retry starts from the last committed watermark; partial page traversal is intentionally not committed. APIs lacking a documented incremental contract retain the existing exact-endpoint fetch behavior.

## Actual Atlas preservation and runtime verification

The ignored private `backend/.env` remains the configuration source; `.env.example` is not used for credentials. `npm run db:migrate:identities` first ran in dry-run mode, then `-- --apply` added metadata to35 existing schemes and created the additive indexes/collections. It did not rename, merge, delete or republish records. A second metadata migration is idempotent.

Hash comparisons across19 protected content, version, review and configuration collections passed, excluding only the intended scheme identity metadata and its update timestamp. Existing source permissions, adapter configuration, NDMA evidence and original versions were preserved. Counts remain:

| Atlas state | Verified count |
|---|---:|
| Existing schemes/candidates | 35 |
| Published schemes | 15 |
| Stored AI artifacts | 117 |
| Current validated EN/HI/KN revisions | 75 |
| Consolidated pending schemes/candidates | 20 |
| Pending ready for editorial review | 9 |
| Pending fact review | 9 |
| Blocked pending current official evidence | 2 |
| Newly approved identity mappings | 0 |
| New live scheme observations from this task | 0 |
| Generation calls / paid API requests / publication actions | 0 / 0 / 0 |

The existing API and worker were reloaded after migration; there were no queued collection/AI jobs or enabled schedules. Read-only Atlas browser checks verified the15 published schemes across both citizen pages, PM-KISAN in all three languages, the20 unchanged consolidated review records and the new35-row collection view. Legacy schemes explicitly show `NO_COLLECTED_OBSERVATION`; imported evidence is not relabeled as live collection. Citizen session creation was intercepted during this check to avoid Atlas session writes.

## Tests and actual collection results

- `npm test`:96 backend tests and5 frontend tests passed.
- `npm run test:integration`:43 native MongoDB test nodes passed using an explicitly isolated local test database.
- `npm run test:e2e`:22 existing desktop/mobile journeys plus4 synthetic content/editorial journeys passed.
- `npm run build`: production frontend build passed.
- Added coverage includes initial/repeated/new/changed records, normalized cross-source URLs, official-ID mappings, ambiguous identity, changed official IDs, jurisdiction conflicts, exact benefit changes, edition/document changes, cursor/offset traversal, page budgets/loops, malformed second pages, checkpoint rollback, HTTP304, concurrent sources and interrupted-job recovery. The native MongoDB tests verify unchanged artifacts/publication, immutable previous versions and stale-artifact invalidation on updates.

Collection tests use injected HTTP responses and synthetic source contracts. Mock generation/publication occurs only in the isolated test database to verify invalidation. They are not government network fetches, genuine Gemini output or real editorial decisions.

**Government scheme endpoints fetched in this task: none. Successful live government scheme HTTP requests:0. Parsed live scheme records:0. New/updated live Atlas schemes:0.** The existing authorized NDMA feed remains a notice source; this task did not run it or reclassify its alerts as schemes.

## Remaining blockers and limits

No documented, approved live scheme-description source is currently activated. Additional sources still require actual access/reuse evidence, endpoint-specific review and any required privately configured credentials. Statistical datasets and press notices do not become scheme eligibility evidence. myScheme restrictions remain enforced. This implementation does not assert successful live scheme collection until an authorized endpoint is genuinely fetched.

Official IDs and cross-source mappings cannot be inferred for the35 legacy records. Ambiguous collected candidates require a real identity decision. Conflicting existing bindings cannot be overwritten by the normal mapping control; they require evidence-led correction. Source withdrawal/deletion is not inferred from an omitted API result. Pagination exceeding the configured bound fails safely and requires an appropriately reviewed source configuration.

All20 pending records remain pending under the owner's latest decision. Gruha Jyothi and PMEGP still require current evidence; nine other candidate packets require fact review. Gemini preparation and publication remain gated independently. No eligibility rules were approved.

Machine receipts, console logs and the read-only Atlas screenshot are retained privately under ignored `.local/incremental-validation/`; no credentials are included in this report.
