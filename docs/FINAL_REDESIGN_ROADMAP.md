# MyGovGuide final redesign roadmap

Status: owner-approved direction for the next implementation phase. This document is a roadmap only; it does not authorize implementation during repository cleanup.

## Owner decisions

- Continue the existing JavaScript MERN application. Do not rebuild it from scratch.
- Create a fresh database named `mygovguide_final` during Phase 1.
- Do not migrate government content from `mygovguide_dev` or `mygovguide_demo_v2`. Leave both existing databases untouched.
- Redesign the administrator panel.
- Add a source-selection collection window.
- Initially support Jan Suraksha/DFS, PIB and NDMA SACHET, subject to permitted access.
- Support CyberDost/I4C awareness collection where permitted.
- Collect a maximum of 10 new or updated records per run across the selected sources.
- Display genuine Socket.IO progress; never simulate live progress.
- Generate individual content-specific completeness checklists.
- Use Tavily for targeted missing-information research.
- Prepare complete deterministic eligibility rules.
- Distinguish online and offline applications.
- Generate online application guidance.
- Download and host permitted official blank PDFs through ImageKit.
- Prepare field-by-field form explanations.
- Process AI simplification sequentially.
- Use Gemini primary, Gemini secondary and Groq according to actual provider availability and permitted quotas.
- Generate English, Hindi and Kannada explanations.
- Replace routine mandatory human approval with automatic evidence-based validation.
- Publish only sufficiently complete and supported content.
- Preserve incomplete work in processing storage.
- Do not use paid APIs or proxy-based rate-limit bypasses.
- Redesign citizen-facing pages later.

## Implementation phases

1. Fresh database and application foundation.
2. Admin redesign and live collection studio.
3. Intelligent enrichment, eligibility and form processing.
4. AI simplification and automatic publication.
5. Real collection and complete system testing.

## Non-negotiable safeguards carried forward

- External source rights, approved paths and expiry remain controlling. Public visibility or a successful HTTP response is not permission.
- Source versions stay immutable. New evidence creates a new version.
- Automated decisions must use a distinct validator identity and version-bound audit metadata. Never describe an automated decision as human approval or government certification.
- Missing clauses, exclusions, unsupported boundaries or incomplete reviews must not produce a complete eligibility verdict.
- Application documents stay distinct from eligibility conditions.
- Privacy controls, zero-paid configuration, provider quota rules and local OCR limits remain in force.
- `mygovguide_dev` remains read-only. Never seed, migrate or run workers against it. Never delete either existing database.
- Credentials and private database backups remain outside the committed repository.
