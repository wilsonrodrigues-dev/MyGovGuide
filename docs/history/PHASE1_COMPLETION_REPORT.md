# MyGovGuide — Phase 1 research delivery and status

**Research date:** 2026-11-16  
**Stage:** source discovery, dataset research, requirement validation and asset planning. No application code or scrapers have been executed.

## Output counts

| Deliverable | Assembled | Interpretation |
|---|---:|---|
| Scheme research records | 25 | 20 central + 5 Karnataka pilot candidates, all require operative eligibility review |
| Form/application references | 18 | 5 visually checked official PDF forms; 13 links to entry points or information |
| Government notice samples | 12 | Date-specific historical announcements, some superseded or duplicative |
| Official scam-awareness topics | 12 | Educational topics; **zero are confirmed live incident alerts** |
| Initial and supplemental sources | 70 | URLs, purposes and current restriction statuses; includes repeated portal references |
| Fully reviewed deterministic eligibility rule sets | 0 | Intentionally NOT encoded from ambiguous sources |
| Approved automated scraping targets | 0 | Host and dataset permissions must be checked |

All scheme categories (including Karnataka pilot candidates): Student 6, Farmer 5, Woman 6, Worker 3, Senior Citizen 3, General 2.

## Deliverables in this pack

- `VERIFIED_SCHEMES.json` — source-backed scheme registry (research only; never directly import as production eligibility).
- `FORMS_REGISTRY.json` — forms and official citizen application entry points.
- `NOTICES_AND_ALERTS.json` — dated notices + undated educational scam topics.
- `SOURCE_REGISTRY.md` + `.json` — official resources, current permissions and research pointers.
- `SCRAPING_FEASIBILITY.md` — source policies, onboarding checklist and blocked crawling methods.
- `DATA_REQUIREMENTS.md` — schema, provenance, three-valued eligibility and AI safety contract.
- `ASSET_REGISTRY.md` — technology, typography, icons, voice and infrastructure needs.
- `OPEN_DATA_CATALOGS.md` — specific government data catalogues found for supporting analytics.
- `SOURCE_TO_FEATURE_MATRIX.md` — map each project feature to its authoritative data sources.
- `QUALITY_AUDIT.md` — integrity review, explicit blockers and sign-off protocol.
- `SOURCE_PERMISSION_CHECKLIST.csv` — template for per-source legal review.
- `SCHEME_REVIEW_CHECKLIST.csv` — template for human rule-document sign-off.
- `AUDIT_RESULTS.json` — mechanically checked artifact counts and integrity results.

## Phase 1 gate determination

**Completed:** research inventory and documented technical specifications for Phase 2.  
**Not complete:** written data access permission, per-host robots/licensing review, up-to-date operative rules for all 25 schemes, confirmation of 15 genuinely downloadable public forms, live incident feed access and required API key provisioning. These cannot be honestly certified by one research pass.

**Safe next action:** human/department policy and rule verification in Phase 1 closure, in parallel with planning a permission-first, curated seed-data pilot. Do **not** launch uncontrolled scraping or promote incomplete rules to official eligibility advice.

## Notable findings

1. myScheme explicitly prohibits automated scraping without written authorization.
2. National pension names changed in October 2026 and require alias/version support.
3. The scholarship listing for 2026–27 may link to outdated PDF specifications.
4. The NMMSS student application deadline of 15 November 2026 is past, even though other 2026–27 scholarship windows remain open.
5. Scam educational categories and CERT-In technical advisories should not be treated as equivalent live citizen fraud alerts.

## Clear instructions for future Codex work

1. Read `DATA_REQUIREMENTS.md` and `SCRAPING_FEASIBILITY.md` before writing ingestion code.
2. Seed as `research_only`/unapproved until rule verification, preserving aliases and source editions.
3. Enforce an allowlist of URLs with documented rights; default deny.
4. Create a separate human review queue for new/changed criteria and a source availability monitor.
5. Build the public app to show verified source links and accurate verification status, not authoritative promises.
