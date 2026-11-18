# MyGovGuide — Product Master Plan (Canonical Specification)

Implementation evidence for the authorized section 17 scope is recorded separately in [PHASE3_6_COMPLETION_REPORT.md](docs/history/PHASE3_6_COMPLETION_REPORT.md) and [PHASE3_6_TRACEABILITY.md](docs/history/PHASE3_6_TRACEABILITY.md). Those reports do not change this product specification or claim completion of future citizen phases.

**Version:** 2.3 — Theme and Phase 3.6 data-to-content implementation locked  
**Date:** 17 November 2026  
**Project:** MyGovGuide  
**Tagline:** *Government Information, In Your Language*  
**Technology:** JavaScript-only MERN web application (React/Vite frontend, Express/Node backend, MongoDB/Mongoose); Google Gemini for supported AI tasks; browser speech services with evaluated Indian-language fallback  
**Initial geography:** Karnataka, with discoverable central-government schemes and extensibility to other states  
**Status:** **Product specification locked; limited Phase 3.6 implementation authorized for admin data operations + evidence-gated AI content processing + design-theme refresh.** The full citizen-feature roadmap remains unchanged. Government data approval, production release, and some external-provider connectivity remain unresolved. This is not proof of implementations.

> **Purpose of this file**: One authoritative product-and-behavior specification for all future design, implementation and testing. Read this BEFORE legacy phase handoffs, completion reports, Stitch screens, or prior Codex prompts. Earlier documents remain evidence of history and implementation, not authority to change the product. Technical approaches proposed here can be adjusted if needed, provided the user journey and requirements are preserved.
>
> **Important evidence distinction**: The “currently built” statuses below are taken from the user's Phase 2, Phase 3 and Phase 3.5 Codex completion reports, **not from an independent audit of the local VS Code repository**. Confirm the code and runtime before treating any report as verified.

---

## 1. Product vision and fixed principles

### 1.1 What MyGovGuide is
A trustworthy, **fully functional manual website with an optional user-activated voice assistant**, built mobile-first. It helps people find Indian government schemes, understand who may qualify, read and fill official application forms, understand notices, recognize official scam warnings, find nearby government service centers, and follow relevant updates. Users can navigate, search, select, read, upload, and complete every core task by touching or typing in **English, Hindi or Kannada**. Users who opt into voice can instead speak commands in the selected language and have the assistant navigate and read information aloud. Neither interaction mode is a second-class experience.

### 1.2 Primary audience
- Citizens including students, farmers, workers, women, senior citizens and people with disabilities; users with limited literacy or web familiarity.
- Family members, NGO volunteers and service-center staff helping other people.
- Administrators who manage verified information, data collection, publishing and notification operations in a **separately protected admin area**.

### 1.3 Non-negotiable product rules
1. **Manual/touch/typing mode is fully functional and available by default. Voice is optional, explicitly activated, and can be turned off at any point without losing progress. All primary citizen features work without login.** Only personalized saved updates/notifications and bookmarks require an optional registered account under the revised product requirement.
2. **When enabled, voice is a cross-site assistant, not just a search microphone.** It supports spoken onboarding, page navigation, searching, selecting results, form guidance, explanations and readback, with explicit permissions and confirmations.
3. **English, Hindi and Kannada are first-class** for static UI, content explanations and voice experiences where supported; no language is permanently hard-coded as English-only for citizen use.
4. **Government facts are source-based.** Show the relevant original clause/document excerpt, the official URL, verification state and last checked date. MyGovGuide is *not* an official government portal; never imply official endorsement.
5. **Deterministic eligibility only:** approved human-reviewed rules produce eligibility/gap conclusions. Gemini explains approved results; it does not decide eligibility or approve rules.
6. **Original content is never replaced with an AI summary.** Preserve raw source evidence, its version, and the distinction between extracted information, reviewed information, and AI explanations.
7. **Automatic government data collection is controlled and permission-gated.** Do not confuse public web access with authorization to scrape. Preserve the existing myScheme restriction until written permission exists.
8. **Anonymous preferences are minimal and private.** An HttpOnly server session owns server resources. localStorage holds non-sensitive settings and onboarding state, not authentication secrets.
9. **Admin features cannot be operated by ordinary citizens** and cannot override scraper authorizations by a toggle alone.
10. **Useful before AI or network works:** always provide typed/manual alternatives and clear fallback/error states. Never show synthetic fixture data as genuine government content.

### 1.4 Changes from the earlier handoff that this file deliberately supersedes
- The earlier handoff positioned voice as separate mic/read-aloud buttons. **Voice is an opt-in differentiator: a context-aware assistant that can perform allowlisted site actions** across pages, while the same tasks remain fully usable without voice.
- The earlier handoff used optional registration mainly for bookmarking and suggested anonymous Change Radar notifications. **Latest instruction: login is optional for browsing, but required for persistent personalized notifications/updates and bookmarks.** The public scam-alert feed stays accessible to guests.
- **Nearby government service-center finder with maps** is now an explicit core feature.
- Home must include **navigation, an official-content slider, personalized schemes, voice/text search, five main service actions, and optional login invitation**, in that general order.
- Users may **upload an unfamiliar form** for identification and guidance, and **upload a notice** for explanation; these are not limited to pre-indexed catalog items.
- The data pipeline must include **AI content preparation and multilingual caching** as a separate trustworthy publication workflow; scraper results alone are not ready for citizen presentation.
- Retain the previously completed admin panel and collection pipeline, but **their existence does not mean the citizen product is complete**.

---

## 2. Complete citizen journey (canonical)

### 2.1 First visit and profile detection
1. User opens the website. Read localStorage for **non-sensitive** saved profile preferences (`state`, `category`, `language`, `voiceEnabled`, onboarding version), validate them, and check whether the anonymous secure server session/profile can be restored.
2. If a valid existing profile is available, load the Home page using those preferences. If local and server preferences disagree, resolve safely and transparently; avoid replacing new offline choices with stale remote values.
3. If no valid profile exists, show **onboarding** immediately. No account registration is needed.
4. Show a **visible trilingual language selector and two clear choices: “Continue manually” and “Start voice guidance.”** No speech or microphone access starts without a user action. If the user selects voice guidance, offer spoken language prompts in English, Hindi and Kannada; if not, onboarding proceeds visually without speech. The same steps are available in both modes.
5. Once the user chooses/says English, Hindi, or Kannada, the remainder of onboarding uses that language.

### 2.2 Voice or manual onboarding choice
1. Display in the selected language: **“Would you like voice guidance, or would you prefer to fill the details yourself?”** Speak the question only after the user activates voice; always show clickable choices.
2. **Optional voice path:** ask for state and user category one question at a time. Listen to the answer, map it to supported values, repeat/confirm ambiguous responses, populate visible fields, and read a confirmation summary before saving. Preserve the ability to touch/edit a field at any moment.
3. **Manual path (fully supported/default):** leave the microphone off, stop any active narration if switched from voice, and show a short form for state, category and language. All later screens remain operable by taps/typing. Voice can be enabled later.
4. Ask for separate permission/choice to keep the voice assistant enabled while browsing. Do not force the voice assistant on someone who selected manual onboarding.
5. Save validated preferences locally and sync them to the anonymous profile/session securely. Redirect to Home.

**Onboarding fields (MVP):** state/UT, primary category (Farmer, Student, Senior Citizen, Woman, Entrepreneur/Small Business, Worker/Labourer, Person with Disability, General), language, voice-assistance preference. More sensitive criteria (income, disability, household, etc.) must be requested only in the eligibility flow, not required at first launch.

### 2.3 Returning visit
- Restore preferences, authenticated session if any, and voice consent; do not force onboarding again unless preferences are missing/incompatible or the user chooses reset.
- Never start microphone capture invisibly. Voice can reactivate via the user's consented interface and browser-supported mechanism.
- Language, category, state and voice preference are editable from Profile/Settings.

### 2.4 Home page: required section order
1. **Navbar:** MyGovGuide brand; Home, Schemes, Forms, Notices, Scam Alerts, Find a Center, language picker, voice-assistant control, optional Login/Account, accessible mobile menu.
2. **Hero/slider:** newest **verified and publication-approved** scheme posters, real official announcements, relevant notices or recent official scam warnings. Each item has type, date, source and a clear destination link. Show a static accessible hero if no approved slides. Never invent a government poster/logo; follow image rights and add alt text. No uncontrolled auto-slide for users sensitive to motion.
3. **Schemes for you:** ranked by state and selected category, including national schemes. Show transparent “matches your interests” messaging, not “you are eligible” unless approved rules have been evaluated. If no approved content exists, use an honest empty state.
4. **Universal search:** text box, mic button and Search button. Search for schemes, services and, when supported, forms/notices; show category/source filters and clearly labeled results.
5. **Main feature cards:** Find Schemes, Eligibility Gap Checker, Forms Help, Notice Explainer, Scam Alerts; Find a Government Center is also directly accessible (sixth card or equally visible location shortcut).
6. **Optional login/register section:** provide a clearly labeled login form or accessible expandable login/register panel on Home, alongside a “Continue without logging in” message. Explain that browsing is free without login, while signed-in users may save items and receive personalized updates. Never block service discovery behind login.
7. **Footer:** official-source transparency, privacy, disclaimer, accessibility, languages and support/contact information.

---

## 3. Citizen features and expected behavior

### F1 — Optional cross-site voice assistant (enhancement; manual mode equally complete)
- A persistent, accessible “Voice Assistant” button/panel exists across major citizen pages, but is **off by default**. Users may enable, pause, resume or stop it at will. Every voice-invokable task must have a keyboard/touch equivalent.
- The assistant understands commands **in the selected language** and uses the **current page context** and available result list. Example sequence:
  1. “Find scholarships for students in Karnataka.”
  2. Assistant fills the search, submits it and shows numbered/titled results.
  3. “Open the second one.”
  4. Assistant opens the matching scheme and describes it.
  5. “Read the eligibility and documents.”
  6. Assistant reads the corresponding **verified** content, offering pause/repeat/next.
  7. “Open the application form.”
  8. Assistant opens the linked form explanation, or clearly says no verified form is available.
- Other supported intents: go Home, switch language, open sections, filter search, scroll/navigate result lists, begin eligibility check, answer guided questions, explain the currently viewed form field, summarize notice, find centers (with location permission), open Settings, and stop reading.
- **Voice does not gain independent authority.** Use a constrained intent/action registry and page context; speech/LLM interpretation proposes actions, but only allowlisted commands execute. Confirm ambiguous choices and sensitive actions (upload, location, login, submitting forms, saving personal settings, external links).
- Recognition can use browser speech services where available, plus an evaluated Bhashini or other authorized fallback for Kannada/Hindi. SpeechSynthesis/TTS must detect supported voices; keep typed and touch alternatives. Do not claim all browsers support Kannada perfectly.
- Respect consent, microphone permissions, privacy, silence/timeouts and manual correction. Show live transcript and what action the assistant is about to take. On external website links, provide a safe handoff; do not claim to control the external government portal. A spoken “upload a form” request may open the local file picker, but the user must select the actual local file through the device/browser interface.
- Do not require a permanently listening microphone or hidden wake word for MVP; an explicit activation control is safer and more reliable.

### F2 — Scheme discovery and details
- Default listing presents profile-relevant **reviewed/published** schemes plus an “All Schemes” option and filters for state, category, programme type and text search.
- Scheme detail includes title, issuing authority, category, applicability, official benefits, simplified explanation in current language, **original text/source clause**, verified eligibility criteria, documents required, application steps, official Apply link, associated form link(s), last verified/version date, disclaimer and Read Aloud.
- When a scheme lacks published/verified rules, label them **unverified or unavailable**. Do not display automatic “eligible” status.
- Gemini content is cached by language and bound to the exact source version. Switching language retrieves the cached version or produces a pending localized explanation through a gated service.
- The official Apply action must link to the real government destination and disclose that the user is leaving MyGovGuide.

### F3 — Eligibility Gap Analyzer
- User selects a scheme, either directly or from its detail page; the system asks only questions needed by **approved** rules, by text or voice.
- Deterministic rules evaluate facts and exceptions, using three useful outcomes: *potentially eligible based on answered criteria*, *does not meet a verified criterion*, or *insufficient information/rules not approved*. Approval by government is never guaranteed.
- Show each condition, the supplied answer, the corresponding verified requirement, what is missing, and a source link. Gemini may explain the already-determined result in simple language; it cannot overwrite it.
- Disclose if some rules are not yet verified. Do not produce a definitive result from partial sources.

### F4 — Forms library, upload, identification and explanation
- Forms page top: **Upload a form** (PDF/image within validated size/type limits) and optionally paste an official form URL if safe. Then show **frequently used forms** and category/search filters from the approved catalog.
- For a catalog form, open: purpose, related scheme, official form PDF/page, fields in order, per-field explanation, example, documents needed, and optional read-aloud / guided voice navigation.
- For uploaded unfamiliar forms: extract text (PDF text or supported OCR/multimodal extraction), identify likely title/issuing authority, compare with known forms, and report confidence. If uncertain, call it an **unidentified user-uploaded form** and explain visible fields without claiming official identity.
- Never autofill or submit official external application forms without a separately approved integration and clear user confirmation. Examples must be fictional and labeled, not fabricated personal data.
- Uploaded files may contain PII; default to processing without permanent raw-file storage, provide a deletion/retention policy, restrict size and types, and secure processing against malicious documents and prompt injection.

### F5 — Notice Explainer / Notice-to-Action
- Page top: upload an image/PDF or paste notice text. Provide simple explanation in selected language, who it affects, what action to take, and checklist with **dates extracted only when actually stated**. Show the original text or highlighted passages and source if known.
- Clearly distinguish a user-uploaded document from an official notice verified by MyGovGuide. Avoid inventing deadlines or legal conclusions.
- Interactive checklists can be used by guests during the session; persistent saved notices/checklists should follow a transparent retention and account policy. Do not retain raw sensitive documents unnecessarily.
- Available by text/manual and voice guidance.

### F6 — Scam alerts and cyber awareness
- Public page shows verified current advisories (with publish dates, official source and affected groups) separately from **evergreen scam-awareness lessons** (which may have no incident publication date).
- Examples include fake scheme offers, UPI fraud and impersonation attempts only when sourced from recognized public authorities. Do not label undated awareness material as a “scam happening today.”
- Profile can filter/reorder public alerts without login. **Personalized recurring change/scam notifications require an optional logged-in account and appropriate consent.**
- A scam card has a plain-language summary, what to avoid, what to do, official reporting resource, language switch and readback.

### F7 — Nearby government service-center finder (new explicit core feature)
- Accessible via navbar and home card. Let the user choose a city, locality, PIN code or grant optional geolocation permission.
- Show map and list of **verified government service centers** such as Grama One / Karnataka One and other supported citizen-service offices, based on reliable official center directories or suitable authorized geodata.
- Display center name, category, address, official source, available phone/hours **only if verified**, directions link and last confirmed date. Include map and list accessibility and a no-location fallback.
- Do not invent nearby locations or claim a center offers a service unless the official directory confirms it. Location permission is opt-in; don't store precise coordinates by default.
- Voice commands include “Find the nearest government center,” “Show the list,” “Get directions,” and “Read the address.”

### F8 — Optional account, saved items and notifications
- Guest can use all citizen features and view the public scheme/scam/notice feeds without account.
- Registration/login is **optional**, primarily for bookmarks, persistent followed schemes, change notifications, unread indicators and saved preferences across devices.
- An authenticated account links to the existing guest profile with an explicit migration flow. Preserve prior anonymous settings and do not expose other users' data.
- Notifications include relevant *reviewed* scheme updates, updated documents/deadlines and relevant official scam alerts. Show exact change, date and source. Do not claim newly eligible without an approved eligibility reassessment.
- MVP delivery: authenticated **in-app notification center**. Push/email/SMS are possible later only with consent and verified delivery infrastructure.
- Admin may manage notification rules and audit delivery without viewing unnecessary citizen-sensitive content.

### F9 — Source-linked Change Radar
- The backend detects changes to permitted government sources and stores immutable versions. Admin review determines when a change is approved for citizen display.
- Published changes can update scheme details, invalidate localized AI caches and create notifications for signed-in users who follow or match related content.
- Admin can inspect diffs, source evidence, review state and publish/unpublish history.

### F10 — Admin dashboard and scraping operations
- Protected `/admin` workspace, separate from guest/citizen authorization.
- View actual source counts, imported record types, latest runs, success/failure, rejections, versions, review queue, source approvals, publication readiness, AI-processing status, language-cache coverage, notifications and user metrics (aggregate; privacy-conscious).
- Source manager with permission evidence and **separate** activation status. Live collector can only run with genuine access authorization and a tested adapter; fixture test mode remains clearly labeled.
- Manual “Run Collection” per approved source; durable worker jobs, progress, logs, retry/cancel, no duplicate concurrent source runs.
- Cron scheduler: on/off, interval or cron expression, timezone, selected sources, next/last execution and audit history; never bypass authorization. Hosted scheduling may differ from local scheduler.
- **Missing integration to add later:** AI preparation queue, content review/publish queue, per-language cache and preview, public slider/poster manager, notification campaigns/logs and verified center-directory management.

---

## 4. Correct data-to-citizen pipeline (critical architecture correction)

**Do NOT use:** `scrape → ask AI to simplify → save simplified text only → publish`.

**Use this instead:**

```
Authorized official source / licensed dataset / manually verified document
    ↓
Collect with legal access checks, metadata and source identity
    ↓
Store ORIGINAL evidence unchanged (text/PDF reference, URL, captured date, version/hash)
    ↓
Extract structured facts (benefits, eligibility clauses, documents, deadlines, application links)
    ↓
Normalize, deduplicate, compare versions and validate against source
    ↓
Stage for human/content review (especially eligibility and change claims)
    ↓
Approve facts/publication separately from source access authorization
    ↓
Generate source-grounded simple ENGLISH explanation for approved content via Gemini
    ↓
Check critical values, dates, amounts, names, document requirements against approved facts
    ↓
Store English explanation and its source-version/prompt/model metadata in MongoDB
    ↓
On user request: retrieve approved Hindi/Kannada cached variant or generate and validate it
    ↓
Serve approved source evidence + selected-language explanation + official link + readback
    ↓
On an official update: preserve old version, review changes, invalidate affected AI caches,
regenerate approved explanations, update public home/banner and notify consenting accounts
```

**Why:** Some original government content is not English; keep the actual original in its original language and preserve the document. The English explanation is a *derived* artifact, not the canonical truth. Separating review and AI generation protects against fluent but incorrect summaries. Avoid expensive AI calls on every scrape or every page load. Pre-generate English on publication or in a background queue, then lazily generate Hindi/Kannada with caching; optionally prewarm popular translations when budget permits.

**Design requirements:**
- Each `ContentVersion` / scheme has source IDs, rights status, original language, original evidence, governing/effective dates, `verificationStatus`, `publicationStatus`, content hash and review audit.
- AI explanation records are keyed by `contentId + sourceVersion + language + explanationType + promptVersion + modelVersion`, including `generationStatus`, validation status, created time, reviewed flags, error details and expiration/invalidation state.
- A publisher/editor reviews high-impact summaries where numbers, eligibility, legal obligations or deadlines are involved; deterministic comparisons check exact numeric/date preservation. AI never invents absent facts. If translation fails, fall back transparently to original/approved English with an explanation, not hidden errors.
- Frequent scraping is not equivalent to reliable new data. Publishing requires freshness and source evidence.
- Separate **research-only**, **source-verified**, **approved-for-publication**, **rules-approved** and **superseded** statuses. These are not one boolean.
- Imported historical notices and synthetic fixtures must remain visibly distinguished from real current alerts.

### Recommended pipeline services (implementation targets, not necessarily existing)
- `CollectionService`: permissions, fetch, crawl and source versions (**reported built**).
- `NormalizationService`: facts, metadata and de-duplication (**reported built**).
- `ReviewPublicationService`: review, approval, publishing, rollback (**partially built; audit actual functionality**).
- `AIContentService`: simplify, source-check, translate, cache, invalidate (**not yet built**).
- `VoiceOrchestrator`: speech recognition, page context, allowed actions, TTS (**not yet built end to end**).
- `RecommendationService`: profile-based matching without claiming eligibility (**basic preview exists; full ranking pending**).
- `NotificationService`: authenticated personalized updates (**pending**).
- `CenterDirectoryService`: verified nearby centers, geospatial search (**pending**).
- `PosterBannerService`: reviewed slider entries and image rights metadata (**pending**).

---

## 5. Data model additions required by the final product

**Preserve the existing backend models and migration history. Add missing entities/fields instead of recreating or deleting stored data.** Actual current MongoDB collections must be inventoried in the VS Code repository before migration.

| Domain | Required persisted information |
|---|---|
| Guest preferences / session | State, category, selected language, consented voice preference; secure anonymous session ownership, no secret in localStorage |
| Registered citizen | Secure account, linked guest profile, opted-in notification preferences, bookmarked/followed entities |
| Scheme and FormTemplate | Official link, issuing authority, related scheme(s), raw source clause, reviewed fact references, document requirements, edition and publication status |
| OfficialSource / SourceVersion | Host, approved collection paths, evidence of access rights, source URL, original text/document reference, capture timestamp, hash, review trail |
| AIContent | Source-version-bound simple English + cached Hindi/Kannada variants, validation state, prompt/model versions, invalidation timestamp |
| EligibilityRuleSet | Verified governing clause, effective period, AND/OR groups, exceptions, human approval and incomplete-rule flag |
| PublicBanner | Asset URL/storage reference, origin/rights, link target, related content, publication/review status, start/end dates |
| UploadedForm / UploadedNotice (if persistence is necessary) | Safe extraction result, user ownership, retention/deletion controls, optional checklist; avoid saving raw sensitive files by default |
| ScamAlert | Distinct `incident` versus `evergreen_awareness`, official publication date when known, source, affected audience, cached explanations |
| CenterDirectoryEntry | Official center identity, location/address, geo coordinates if verified, contact/hours evidence, last updated/source |
| VoiceSession (prefer ephemeral) | Current page context, last results and dialogue state; short-lived transcript with consent and data minimization |
| Notification / Bookmark | Authenticated recipient, content/version, verified trigger, unread state, delivery history, follow preferences |
| AdminRun / Schedule / Audit | Actual source/job mode, counters, approval evidence, schedule, operator actions and errors |

**Do not let uploads, voice transcripts, geo coordinates or income answers silently become permanent profile fields.**

---

## 6. Navigation and screens (planned finished product)

### Citizen-facing routes / screens
- `/` — check preferences/session; route to onboarding or Home.
- `/onboarding` — trilingual language invitation, assisted/manual choice, state/category entry and confirmation.
- `/home` — navigation, approved content slider, recommended schemes, search, action cards, optional account invitation.
- `/schemes` and `/schemes/:id` — discovery and source-grounded details.
- `/eligibility/:schemeId` — question flow and eligibility-gap results.
- `/forms` and `/forms/:id` — catalog and field guidance; a distinct user-upload explanation flow.
- `/notices` — upload/paste notice, simple explanation and checklist.
- `/alerts` — official recent advisories and awareness content.
- `/centers` — verified service-center map/list and directions.
- `/updates` — authenticated personalized notifications and follows; guest can read public content separately.
- `/profile`, `/login`, `/bookmarks` — preferences and optional account services.

### Cross-cutting UI
- Persistent global voice assistant controls, transcript/context panel, language toggle, source link, read-aloud, accessible skip link, on-screen fallback and confirmation prompts.
- Stitch's 14 existing screens are **references**, not product requirements. They must be adjusted for the new dual-mode onboarding, slider, uploads, map/centers and notification changes.
- Clean, responsive mobile design with readable Kannada/Devanagari, large controls, keyboard accessibility, clear focus, reduced motion and screen-reader support.

### Admin (separate authorization)
- `/admin` home, sources/permissions, manual jobs, scheduler, data explorer, reviews, versions/diffs, publication, AI explanations/languages, banners, centers, notifications and system audit. Some are already reported built; others are additions, **not reasons to discard existing admin code**.

---

## 7. Source-of-truth and scope boundaries

1. **This file governs product behavior.** `MyGovGuide_Project_Handoff.md` is a historical starting point where it conflicts with this v2 plan.
2. **Real repository code + tests govern implementation truth.** Completion reports provide claims to audit, not proof by themselves.
3. **Official source documents govern government facts**; an LLM, scraper output, old PDF or copied poster does not supersede them.
4. **Source-access authorization is separate from content accuracy, reuse rights and publication approval.** Nothing about this plan turns an unapproved website into an approved scraper.
5. Change requirements only by editing this file's version/change log and evaluating affected screens, APIs, models, tests and docs. Do not silently change scope in future Codex prompts.
6. Keep the **two-folder app structure** `backend/` and `frontend/`; JavaScript, MERN, no Docker requirement. Root documentation/configuration is allowed.
7. Do not build WhatsApp chatbot, a full vector/RAG platform, unofficial form auto-submission, hidden persistent microphone surveillance, or third-party login integrations as part of MVP unless explicitly re-scoped later.

---

## 8. Current implementation status vs desired product (as of reports dated 17 Nov 2026)

**Status labels:** `REPORTED BUILT` = Codex completion report says implemented/tested; `PARTIAL` = only groundwork or fixture behavior; `MISSING` = no reported working implementation; `BLOCKED` = external access or approval required. These labels are not a fresh code audit.

| Capability | Reported current position | Gap to canonical vision |
|---|---|---|
| Repo structure and local DB | **REPORTED BUILT** (`backend/`, `frontend/`, native MongoDB, no Docker) | Preserve, avoid another rewrite |
| Secure guest profile/onboarding | **REPORTED BUILT** basic manual preferences and secure anonymous cookie | Add trilingual spoken invitation and fully voice-guided onboarding; user-choice behavior |
| Home page | **PARTIAL** nav, primary cards and basic context | Add approved poster/notice/scam slider, actual recommended content, global voice search, optional account invitation and center shortcut |
| Language support | **PARTIAL** static UI in English/Hindi/Kannada | Add trustworthy localized scheme/forms/notice/alert content and localized speech flows |
| Voice | **PARTIAL** browser recognition/readback controls | Context-aware hands-free navigation and page action orchestration across the website |
| Scheme database | **PARTIAL** 25 research-only schemes | Review/approve facts and publish appropriate real records; details, explanations, documents and links |
| Forms data | **PARTIAL** 18 references | Real form catalog/detail field guidance + unfamiliar form upload/classification |
| Notices | **PARTIAL** 12 research examples plus 4 synthetic fixtures | Live verified notices, upload explanation, due-date checklist, privacy controls |
| Scam content | **PARTIAL** 12 undated awareness topics | Distinct verified recent alert feed with current source/date + optional notification matching |
| Eligibility checker | **MISSING** approved rule sets / citizen workflow | Curate/approve real rules, deterministic evaluation and gap explanation |
| Nearby center finder | **MISSING** | Official center directory + map/list/geolocation + voice actions |
| Registered citizen account | **MISSING** (admin auth exists) | Optional citizen login/bookmarks/follows/personal notifications |
| Scraper adapters and versions | **REPORTED BUILT** fixture-tested safe pipeline | Connect to actually authorized, tested real sources; source-specific parsers |
| Admin dashboard | **REPORTED BUILT** metrics, jobs, scheduler, source gate, review and diffs | Add AI preparation/publish queue, banner/content controls, center data and notification management |
| Scheduler | **REPORTED BUILT** local worker persistence/on/off | Real schedule only when selected sources have genuine authorization and a hosted-worker plan |
| AI simplification/translation/cache | **MISSING** | Central content pipeline required for user-facing scheme/form/notice explanations |
| Citizen Change Radar notifications | **MISSING** | Signed-in user follows, approved source changes, feed/unread tracking |
| Atlas | **BLOCKED** DNS/network, credential rotation required | Resolve later; local database currently sufficient for development |
| Stitch MCP new generation | **BLOCKED** native authentication | Existing saved design references usable; reconnect only when needed |
| Live government collection | **BLOCKED** zero approved sources / zero genuine live runs | Verify allowed feeds/API rights and perform lawful first real end-to-end pilot |
| End-to-end citizen product | **MISSING** beyond onboarding/home foundation | Implement the actual linked user journeys, not static placeholder routes |

**Latest Phase 3.5 local database figures reported:** 25 research schemes, 18 form references, 12 research notices + 4 synthetic fixture notices, 12 awareness topics, 112 source identities, 87 review items, 16 change events, 12 historical rejection records, **0 approved live collection sources and 0 approved eligibility rule sets**. These numbers are a historical checkpoint, not live statistics. Do not conflate fixture notices with verified government notices.

---

## 9. What went wrong and what is NOT actually a mistake

### Correctable planning mistakes
1. **Features were implemented as disconnected phases rather than one end-to-end visitor journey.** Basic onboarding/home and an admin suite exist, but the core citizen experience is still absent.
2. **The voice assistant was underspecified.** “Mic buttons and read aloud” are not the same as a multilingual conversational assistant that manipulates the UI.
3. **There was no canonical, updated product spec after scope changes.** The old handoff lacked the center finder, voice-first onboarding, slider, and new login/notification policy.
4. **Ingestion and publication were treated as the same problem.** The crucial review → AI explanation → translation/cache → publish chain is missing.
5. **“Phase complete” labels created false confidence.** A fixture-tested collector is not a live website collector; “research-only” records cannot drive published scheme recommendations or definitive eligibility.
6. **Infrastructure work grew faster than public-facing usefulness.** The admin panel is valuable, but it should now support—not distract from—the citizen product.

### What should be retained
- Safe source-authorization gate; native MongoDB; Mongoose schemas; audit trails; versions; change detection; import idempotency.
- Cookie-owned anonymous sessions and origin checks; local profile persistence; React multilingual foundation; accessible navigation.
- Stitch design references, existing browser/test harness, protected admin dashboard, background workers, scheduler and job history.
- Research datasets and honest review/unapproved labels.

### Important conceptual correction
**Not simplifying during Phase 2 was not, by itself, a coding defect.** Phase 2 intentionally focused on truthful collection and evidence. The mistake was that our **overall product roadmap did not explicitly connect the collection pipeline to a reviewed AI-content publication pipeline before promising actual scheme discovery and explanations**.

---

## 10. Corrective action plan — before another citizen-feature phase

### Gate A — Freeze this product vision and audit the repository
- Save this Markdown in project root as `PRODUCT_MASTER_PLAN.md` (or `docs/PRODUCT_MASTER_PLAN.md`), give Codex explicit precedence, and keep prior reports for reference.
- Map every currently implemented route, UI component, model, worker and test to the features in Section 8. Identify duplicates, stubs, missing services and fake/synthetic data visibility.
- Re-run current tests and manually verify guest onboarding → Home, admin login → fixture job → history. **No unnecessary restructuring or new Docker setup.**
- Create an architecture/traceability matrix and a prioritized issue list from real code, not only reports.

**Gate A complete when:** one updated implementation inventory exists, everyone agrees on expected user journeys, and the existing baseline remains stable.

### Gate B — Prove the two highest-risk vertical slices
**Slice 1: Dual-mode guest journey**: verify both independent journeys. **Manual:** language selection → manual onboarding → Home → typed search → click scheme → read source-backed summary. **Voice (only after activation):** spoken language choice → guided onboarding → Home → spoken search → speak result selection → read source-backed summary aloud. Switching voice off must preserve progress. Use clearly labeled review/test content until legitimate publication-ready schemes exist. Test on a real phone where possible.

**Slice 2: Source-to-language journey**: one permitted/curated official scheme document → original evidence and reviewed clauses → correct English simplification → cached Kannada/Hindi explanation → source-linked display → simulated source update invalidates cache. Prove no hallucinated amounts/dates and no auto approval of rule sets.

**Gate B complete when:** both slices work end-to-end with recorded tests, including negative/fallback behavior.

### Gate C — Complete and integrate the citizen home and scheme flow
- Navbar, reviewed slider, personalized recommendations, search text/mic, feature cards, optional login invitation, center entry, voice settings.
- Scheme discovery/all schemes/details, documents, official apply/form link, original source and localized explanations.
- Show honest empty states for content that has not passed publication review.

### Gate D — Complete remaining linked features (in dependency order)
1. Forms catalog/detail/upload + multilingual field explanation and voice assistance.
2. Notice upload/explanation/checklist + file privacy.
3. Deterministic eligibility gap checker with manually reviewed actual rule sets.
4. Official citizen-facing scam feed, awareness classifications and signed-in notification infrastructure.
5. Nearby government centers directory/map/list with official evidence and location fallback.
6. Registered citizen accounts, bookmarks, following and authenticated update notifications.
7. Voice assistant intents for every finished flow, including context, confirmation, failures and accessibility.

### Gate E — Operationalize verified live ingestion and publishing
- Identify at least one genuinely authorized public source; demonstrate live collection, parser fidelity, normalization, review, AI explanation, caching, publication and change audit.
- Add AI review/publish and translation coverage to the existing admin dashboard.
- Only enable scheduled live collection for independently authorized sources, with safe frequency, logging and review.
- Resolve Atlas and deployment only when needed; do not let an Atlas connection failure halt local citizen-feature development.

### Gate F — End-to-end acceptance
- Guest voice/manual onboarding; returning local profile; language switching; source-grounded scheme search/detail; linked form guidance; notice explanation; verified scam alert; center map/list; approved eligibility-gap result; optional account notifications; admin-controlled collection and publication.
- Automated integration, browser, mobile, accessibility, security, privacy, speech quality, multilingual factual checks and production configuration tests.

**Build principle:** small verified vertical slices, not another enormous “build all remaining features” prompt. Complete a working path from a user action to the correct data/result before enlarging the scope.

---

## 11. Acceptance scenarios (must be tested before claiming product complete)

| ID | User action | Expected system behavior |
|---|---|---|
| A01 | First visit with no saved profile | Onboarding opens; no login wall |
| A02 | User taps “Start voice guidance” | Permission-respecting trilingual invitation; visible text fallback |
| A03 | User says “Kannada” | Confirm language; subsequent prompts and controls in Kannada |
| A04 | User chooses assisted onboarding | Assistant asks for state and category, fills fields and confirms |
| A05 | User chooses manual onboarding | Listening/narration stop; normal form works |
| A06 | Returning visitor | Restored preferences, Home loads, no unnecessary onboarding |
| A07 | Home opens | Navbar, reviewed slider, personalized content/empty state, search, features, optional login visible |
| A08 | Guest asks “Find Karnataka student schemes” | Query appears, search runs, relevant results display |
| A09 | Guest says “Open second result” | Correct result opened, ambiguity resolved safely |
| A10 | Guest says “Read eligibility and documents” | Reads only approved and correctly sourced content |
| A11 | Guest changes language | UI + available explanation/readback switch without losing state |
| A12 | Guest opens linked form | Field guidance and official form link; no external auto-submission |
| A13 | Guest uploads unknown form | Extracts and explains with confidence/uncertainty; no false official identification |
| A14 | Guest uploads notice | Clear explanation, source/unknown label, no invented deadlines |
| A15 | Guest checks eligibility without approved rules | “Cannot determine reliably” instead of a definitive yes/no |
| A16 | Guest sees scam page | Official dated alerts separated from undated safety lessons |
| A17 | Guest searches centers without geolocation | Manual city/PIN input works; map/list only grounded locations |
| A18 | Guest tries updates/bookmarks | Prompt for optional login without blocking public features |
| A19 | Signed-in user follows scheme | Approved changes create traceable in-app notifications |
| A20 | Admin launches fixture collection | Logs and counters visible; clearly labeled synthetic |
| A21 | Admin launches unapproved live source | Authorization gate denies request, including scheduler path |
| A22 | Approved source content changes | Version/diff/review workflow; stale AI cache invalidated only on approved version change |
| A23 | Voice recognition fails | Accessible typed/tap fallback, not a dead end |
| A24 | Uploaded sensitive file processed | Input limited and private; no unexpected permanent raw upload retention |
| A25 | Speech action ambiguous or consequential | Assistant asks for confirmation; cannot bypass ownership/security |

---

## 12. Constraints, risks and decisions still needing validation

- **Browser voice behavior:** autoplay, microphone permission, language-specific speech recognition and Kannada TTS vary. The intended voice-first experience is feasible as an opt-in guided flow, but an unsolicited talking assistant on page load cannot be guaranteed. Native speaker/device testing is required.
- **Speech and AI costs:** Bhashini/Gemini access, rate limits and user-consent requirements need actual configuration. Constrain context/token use, cache responses and have graceful fallback.
- **Form identification:** uploaded untrusted images/PDFs require safe processing, confidence thresholds, PII minimization and clear non-official designation.
- **Center data:** verify government service center directory provenance, accurate geo coordinates, operating hours and appropriate map provider terms before enabling live map pins.
- **Government content:** no auto publication, no illegal scraping, no unverified “current scheme” or false application deadlines.
- **Optional login:** choose a robust citizen-account recovery method before implementation; do not use insecure phone-only identity or assume SMS delivery.
- **Home slider content:** obtain official posters or create neutral, clearly branded MyGovGuide editorial cards from verified content, without copying protected government imagery or implying government sponsorship.
- **Admin auth/credentials:** preserve existing admin security; rotate any previously exposed Stitch or Atlas credentials before reconnecting.
- **Real-world performance:** voice-assistance users need short prompts, interruption controls, retry and accessible manual navigation; do not create an endless conversational loop.

---

## 13. Scope-control checklist for every future Codex task

Every future implementation prompt must begin with these rules:

1. Read `PRODUCT_MASTER_PLAN.md` first; no silent changes to user flow or feature scope.
2. Inspect existing code and tests. Keep `backend/` and `frontend/`, native MongoDB and existing safety gates; avoid unnecessary rebuilds.
3. State the one user-visible vertical slice being completed and its acceptance tests.
4. Show what is **already built**, what is **new**, and what remains **blocked**; do not claim fixture success equals live government scraping.
5. Use Stitch design references when possible, but implement real React interactions and respect accessibility.
6. Produce accurate source-grounded data; no fabricated schemes, centers, notices or eligibility conclusions.
7. Update `PROGRESS.md`, traceability, and this spec's change log only for explicitly approved scope changes.
8. Provide reproducible real test results. Failed external integrations are blockers, not fabricated successes.

---

## 14. Technology evaluation status and current implementation scope
- **Earlier planning pause superseded by Section 17:** a narrowly scoped Phase 3.6 is authorized for a Civic Blue theme refresh and existing admin/source-review/AI preparation pipeline. Full voice, form and notice uploads, maps, and account flows remain future phases, pending targeted feasibility checks.
- Before invoking paid or externally shared AI, check current account models, entitlement, quotas, data-use requirements and approved spend limits. Browser speech and regional-language behavior still require real-device feasibility tests before claims of support.
- **Do not require a cloud language service to use basic manual navigation.** If speech or AI is unavailable, core browsing and verified original content must remain available.

---

## 15. Architecture decision lock — ten loopholes resolved in design (v2.2)

**Status semantics:** "Resolved in architecture" means there is an explicit solution and acceptance criterion. It does **not** mean the solution has been coded, tested, given legal permission, or validated for real citizens. Features remain manual-first and voice-optional.

### 15.1 Decision register (mandatory)

| # | Problem | Locked design solution | Completion / verification gate |
|---|---|---|---|
| 1 | Zero publication-approved schemes | Keep research, source-fact approval, publication approval and eligibility rule approval as distinct gates. Begin with a small editor-reviewed seed of schemes supported by current official documents, with publication date/source version and validity state. | At least 10 source-reviewed schemes display complete correct references; **no definitive eligibility** until separately approved rule set. |
| 2 | Scraper not connected to AI | Source → authorized collection → original immutable version → normalization + human review → fact/publication approval → English simplification → multilingual translations + indexed keywords → quality checks → reviewed/published content, cached by source version. | A changed approved source invalidates only related derived artifacts; AI failure leaves source-backed content intact. |
| 3 | Voice assistant could issue wrong actions | Voice is opt-in. Recognition produces a transcript; a deterministic intent resolver or constrained AI parser proposes one action from a page-specific allowlist. UI verifies target, asks confirmation for ambiguity or risky actions, and executes via normal app APIs. | Multi-language tests for navigate/search/open/read; zero unauthorized command execution. Manual equivalents always work. |
| 4 | Sensitive document uploads | Distinguish blank official templates vs filled/personal documents. Validate type, size and MIME; malware-check where feasible; parse text locally or on trusted server first; redact PII; encrypt ephemeral processing; no retention of raw documents/transcripts by default. Do not send private documents to free-tier AI without explicit lawful privacy assessment and consent. | Raw file removed on completion/TTL; audit shows no secrets in logs, prompts or analytics. |
| 5 | Hindi/Kannada search not working | Store `title/aliases/searchKeywords` in **en, hi, kn**, canonical English/category tags, optional romanized user terms and normalized indexed tokens. Keywords can be proposed by AI from **approved** scheme facts, must pass safe-term review, and cannot invent eligibility conditions. Do not rely on English-only full-text stemming. | Test at least 10 popular queries per language incl. misspellings and transliteration. Search only approved/public content. |
| 6 | Recommendations confused with eligibility | Recommendations use state, category, saved preferences, freshness and publishing status, never infer eligibility. Label "May be relevant" and distinguish it from "Eligibility check" (only supported by reviewed rules and requested answers). | No "You qualify" assertion on Home/search cards. |
| 7 | Inaccurate map points | Curated `CenterDirectoryEntry` with official name/address, geo coordinates only if geocoded and verified, contact/source/checkedAt and status. List view for entries without coordinates. Consent before using user GPS; verify map/tile/geocoder terms. | Test first 10 real center entries, reject invented positions and stale closures. |
| 8 | Unreliable free-tier cron | Persist schedules + due state in MongoDB. Local dedicated worker uses lease/slot dedup. Hosted execution uses separately configured allowed external scheduler/worker; never assume a sleeping free web process runs jobs. Source gates applied at start and before commit. | Restart, duplicate-worker, disabled schedule, overdue job, source-denied cases pass. |
| 9 | Outdated Home slider | Use only `publicationStatus=APPROVED` cards with trusted source, type, date, `validFrom`, optional `validUntil`, rights for posters and `lastVerifiedAt`. Expire/pause automatically and fall back to a neutral in-house card. | No old scheme deadline or undated awareness item described as "latest". |
| 10 | Account & notification ambiguity | Guests access every core feature; signed-in users may bookmark, follow schemes and receive persistent personalized in-app notifications. Provide secure registration/login, verified account recovery, consent, unsubscribing, read/unread, privacy retention and no false claims of eligibility. Public alerts remain visible to guests. | Ownership, opt-in/out, anonymous-to-account linking, duplicates and recovery tests pass. |

### 15.2 Canonical multilingual scheme record

Schemes are served **from MongoDB**, never directly from an LLM response or scraped unreviewed page. A proposed representation, split into collections as appropriate:

```js
{
  schemeId: "central-example-001",
  source: { url: "official URL", originalLanguage: "en", versionHash: "sha256", lastVerifiedAt: null },
  verificationStatus: "RESEARCH_ONLY",        // different from publication and rule approval
  publicationStatus: "DRAFT",                  // APPROVED before citizen listing
  eligibilityRuleStatus: "UNAPPROVED",
  canonicalFacts: [/* approved individual source-anchored facts */],
  discoverability: {
    title: { en: "...", hi: "...", kn: "..." },
    aliases: { en: [], hi: [], kn: [] },
    searchKeywords: { en: [], hi: [], kn: [] },
    normalizedSearchTokens: [],
    categoryTags: [],
    locationTags: []
  },
  explanations: {
    en: { text: "...", sourceVersion: "sha256", status: "REVIEW_PENDING" },
    hi: { text: "...", sourceVersion: "sha256", status: "REVIEW_PENDING" },
    kn: { text: "...", sourceVersion: "sha256", status: "REVIEW_PENDING" }
  },
  applicationLinks: [],
  formIds: []
}
```

This is a **shape specification**; avoid copying the sample's placeholder values as real government data. Prefer separate indexed `SchemeSearchDocument` and `AIArtifact` collections if the existing Mongoose schema benefits from it. Keep the original record/version immutable; do not overwrite government facts when generating translations.

**Search approach:** (1) normalize Unicode/case/punctuation without destroying Kannada/Hindi script; (2) match translated title, official aliases, category, approved keyword tokens and optional transliterations; (3) use MongoDB indexed term lookup with bounded prefixes and relevance ranking; (4) return only published schemes, source/date and explainable ranking, never eligibility certainty. Test Hindi/Kannada morphological variants. MongoDB's basic `$text` language analyzers do not include Hindi or Kannada; MongoDB Search with suitable analyzers may be evaluated later, but isn't required for MVP. Avoid an unbounded regex over the whole database or calling an LLM for every keystroke.

**Keyword generation:** AI receives verified title, approved benefit description, categories and relevant wording, then returns a validated JSON object with en/hi/kn titles, safe aliases and search keywords; a review/quality gate filters hallucinated terms and duplicates. Every keyword set is tagged with content version, prompt version, model and generation timestamp. Regenerate on substantive source change, not on every page view.

### 15.3 AI task separation and source-version workflow

| Task | When invoked | AI? | Evidence/control |
|---|---|---|---|
| Fetch/parse official source | Authorized scheduled/manual collector | No AI decision | Verify access/rights; preserve raw reference/version |
| Extract candidate fields | Data ingestion | Rules first; optional AI assistance | All candidate claims pending human review |
| Approve scheme facts | Editor workflow | **Never automatic** | Exact official passage and governing edition |
| Simplify English | After verified facts are approved | Yes | Structured response; numeric/date/document checks; editorial review for high-impact content |
| Translate Hindi/Kannada | From approved source-grounded content, preferably batched/cached | Yes | Bilingual factual QA; names/amounts preserved; source version matched |
| Generate multilingual keywords | At approved publication or substantive change | Yes | Filter terms; avoid unsupported benefit/eligibility claims |
| Eligibility verdict | Only with an approved complete ruleset and user answers | **No, deterministic** | Incomplete returns "Unable to determine" |
| Explain eligibility verdict | After deterministic result | Optional AI | LLM cannot change rule outcome |
| Voice action selection | After user opts in | Mostly deterministic; constrained AI when needed | Allowlist, displayed confirmation and user controls |
| Form/notice explanation | On uploaded/catelog content | Optional AI if privacy/consent permits | Prefer verified catalog; no made-up deadline or submission |

**Failure state:** If AI is unavailable, show official, reviewed content in its original/available language with a clearly labeled translation-unavailable message. Never substitute a stale AI explanation for the newer approved source version. Track generation errors and retry via bounded worker queue.

### 15.4 Gemini credentials — reliability, not hidden unlimited quota

Proposed configuration (server-only; `.env.example` placeholders):

```dotenv
GEMINI_API_KEY_PRIMARY=
GEMINI_API_KEY_SECONDARY=
GEMINI_MODEL=
AI_MAX_COST_PER_DAY=0
AI_MAX_RETRIES=2
```

The **two Gemini keys can be useful for credential replacement or isolation if they have genuinely distinct, authorized configurations**; they do not double quota when issued from the same project. Gemini applies rate limits per **project**, not per key. Do not create key/project rotations to evade rate limits or provider restrictions.

**Active provider decision (18 November 2026): Google Gemini only.** No independent AI fallback is planned or authorized. The owner subsequently authorized removal of the retired provider implementation/configuration and bounded free-only Gemini validation. Primary and secondary Gemini credentials remain private; metadata availability alone does not establish free project entitlement.

**Router behavior:**
1. Before request: use cache; check approved source/content, task data classification, per-provider capability, circuit state and daily cost budget.
2. Select primary Gemini model/key. Use a short timeout, concurrency cap, request-size limits and 1–2 bounded retries for transient 5xx/503/network errors.
3. On 429: respect `Retry-After`/quota backoff; **do not retry another key in the same Google project as a quota workaround**. Queue the task for later.
4. On 401/403: stop use of the broken key and alert admin; secondary key only if genuinely valid/authorized for that operation; never bypass permission denial.
5. On 400/invalid prompt/schema: repair request or fail; do not blindly fail over.
6. If Gemini remains unavailable, defer the job and show current reviewed cached content or the original-text fallback. Do not activate a different provider.
7. **Every provider returns to the same Zod/JSON validation and fact checking.** Check dates, money, thresholds, document names, official URLs; compare against approved source facts; high-risk output requires human review.
8. Store by `contentId + sourceVersionHash + lang + taskType + promptVersion + provider + modelVersion`. Keep idempotent records. Mark the chosen provider for audit.
9. If all providers fail, return cached **current-version approved** content or a useful original-text fallback, never fabricated text.

**Privacy policy:** Sending sensitive filled applications, ID images, financial details, speech recordings or transcripts to a free/public model is **not enabled by default**. Separate opt-in/privacy/legal review is needed, with data minimization and retention controls. Gemini free-tier data-use terms differ from paid tiers; verify before turning on user uploads.

**Provider acceptance:** Test Gemini's response contract, including Hindi/Kannada, amounts, dates, source quotes and malformed-output cases. Only validated factual contracts can pass. Preserve quota/auth/budget/publication regression coverage when removing the retired provider.

### 15.5 Remaining safety and functionality clarifications

- **Optional voice:** All buttons, forms and routes work without a mic. No always-on listening or unauthorized click. Spoken navigation uses the same search/results/actions as manual. Confirmation required for form submission, personal settings change, opening external pages and ambiguous "second item" references.
- **Account separation:** Existing anonymous cookie sessions and admin login are distinct from the future citizen account. Guest users can read public updates; account needed for *persistent personalized* updates and bookmarks. Alert freshness is a publisher property, not a login requirement.
- **Forms:** Uploaded *blank* official form identification may be processed with local parsing/OCR; uploaded *filled* sensitive forms require private handling. Check recognized form identity/confidence and offer manual identification. Never submit completed applications to official portals automatically.
- **Notices:** Only extract due dates explicitly present. Differentiate a general circular from a personal demand notice; don't store the latter without a specific safe retention design.
- **Map:** List view must work even with unavailable GPS or map tiles. Only verified lat/lon shows as a pin; user location is opt-in and not a default permanent profile field.
- **Operational dashboard:** Show "fixtures", "imported research", "authorized live", "AI prepared", "published" and "eligibility rules approved" as **different metrics**; never merge them into one "total schemes live" number.

### 15.6 Release gates before further development or launch

1. **Phase 3.6 is now authorized with a narrow scope:** preserve the existing project, audit the implementation first, refresh the UI theme, repair/extend admin ingestion and AI preparation, and prove a vetted end-to-end data flow. Do not start unrelated citizen feature phases.
2. Confirm Gemini account free-tier model availability, quota and privacy; do not assume the two API keys have separate quotas. No independent fallback is authorized by this plan.
3. Prove one end-to-end **approved scheme → stored source → reviewed facts → English summary → Hindi/Kannada → multilingual keyword search → citizen card/detail page** using a legally sourced and reviewed record.
4. Prove manual onboarding and manual search without any microphone or AI availability.
5. Test optional voice command routing and trilingual browser recognition/readback on real Android hardware; retain explicit fallback.
6. Prove a safe redacted form/notice upload and failure handling; verify no private raw content reaches free-tier AI by default.
7. Confirm real center directory source, 10 sample records, rights/coordinates and a map/list fallback.
8. Prove signed-in personalized notifications, opt-in/out and guest-only public content without mixing identity or eligibility states.
9. Validate admin jobs/cron under worker restarts and denied-source conditions; avoid double processing.
10. Run an acceptance matrix for all ten loopholes before marking them **implemented** rather than merely **specified**.

### 15.7 Official references checked 17 November 2026

- Gemini rate limits, project-scoped: https://ai.google.dev/gemini-api/docs/rate-limits
- Gemini API pricing/data-use terms: https://ai.google.dev/gemini-api/docs/pricing
- Gemini structured JSON output: https://ai.google.dev/gemini-api/docs/structured-output
- MongoDB basic `$text` supported languages: https://www.mongodb.com/docs/manual/reference/text-search-languages/
- Browser SpeechRecognition compatibility: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- OpenStreetMap tile use: https://operations.osmfoundation.org/policies/tiles/

---

## 16. Change control

### Version 2.2 — 17 November 2026
- Resolved all ten identified project loopholes at the **design** level with implementation gates.
- Added explicit MongoDB-stored trilingual titles/aliases/keywords and search limitations.
- Added Gemini-primary and optional second-key credential redundancy, constrained by quotas, privacy and actual billing. The earlier independent-provider proposal was retired by the 18 November documentation decision.
- Added evidence-anchored AI translation/simplification and cache invalidation design without changing the manual-first, optional-voice product.
- Kept existing code untouched and development paused pending verification.

### Version 2.1 — 17 November 2026
- Clarified **complete manual operation as the default** and voice as a fully opt-in alternative.
- Added an explicit technology research gate before implementation, including free-tier and privacy evaluation.
- Referenced a proposed technology-selection record; that file was not supplied. This canonical specification now contains the active technology decisions.

### Version 2.0 — 17 November 2026
- Consolidated the user's latest complete site vision into one authoritative document.
- Elevated voice from mic/readback helper to cross-page assistant with voice-guided onboarding and actionable navigation.
- Defined full Home section order and reviewed-content slider.
- Added upload-and-identify form flow and explicit Nearby Government Center Finder.
- Clarified guest browsing versus logged-in follow/notification/bookmark features.
- Defined review-first collection → English simplification → cached Hindi/Kannada → publication chain while preserving originals.
- Recorded existing Phase 2/3/3.5 capabilities and external blockers separately from desired scope.
- Added cross-feature acceptance scenarios and an alignment-first corrective plan.

**Implementation scope update (17 November 2026):** The project owner has authorized continuing development of the existing admin/content pipeline and refreshing the frontend theme. This does not grant legal permission to scrape restricted sources, authorize paid API use, or authorize production deployment.


---

## 17. Phase 3.6 authorization — visual redesign and working data-to-content pipeline (v2.3)

**Decision date:** 17 November 2026. **Owner instruction:** begin implementing again, prioritizing a complete operational admin scraping dashboard and source-backed scheme data prepared for all three languages. This supersedes earlier *implementation-pause* wording but not earlier user journey or safety rules.

### 17.1 Visual theme is locked: blue/indigo, not green/orange

The existing dark-green/orange aesthetic is rejected. The chosen **Civic Blue** design direction is professional, warm-neutral, spacious, modern and legible, without mimicking a government seal.

| Token | Hex | Purpose |
|---|---|---|
| `--color-primary` | `#1E3A8A` | Navy-blue primary actions, brand, headings |
| `--color-accent` | `#4F46E5` | Indigo interactive focus, links, selected tabs |
| `--color-background` | `#F7F9FC` | Light page background |
| `--color-surface` | `#FFFFFF` | Cards/panels |
| `--color-text` | `#17243A` | Main reading text |
| `--color-muted` | `#536276` | Supporting text |
| `--color-border` | `#DCE3EF` | Rules and field edges |
| `--color-danger` | `#B42318` | Error/destructive-action emphasis |

- **Do not use green or orange** for brand accents, hero sections, buttons or cards. Semantic statuses may use clearly labeled, accessible text and neutral/blue/red emphasis; avoid depending on color alone.
- A complete, consistent design must cover citizen Home/onboarding, all existing admin screens, charts, navigation, table states, dialogs and mobile layouts. Keep all existing actions, routing, translation support and accessibility behavior intact.
- Keep bundled Latin, Devanagari and Kannada fonts; meet WCAG AA contrast targets and test 320/360/390px mobile layouts. Update design tokens rather than scattered per-page hard-coded colors. Existing Stitch assets are reference material, not immutable requirements. A Stitch connection failure must not block CSS/theme changes.
- Optional dark mode is future scope; **the default remains light**.

### 17.2 Confirmed stack for current build

| Concern | Selected implementation | Decision / constraint |
|---|---|---|
| Frontend | Existing React + Vite + JavaScript + Tailwind + react-i18next + Lucide | Keep; no TypeScript or redesign from scratch |
| Backend | Existing Node/Express/JavaScript + Mongoose + Zod | Keep all source-gate, import and admin-auth behavior |
| Database | MongoDB native local for development; optional separately configured Atlas | Never hard-code URI; inspect existing DB before any writes; separate test DB |
| Admin control | Existing `/admin` screens + admin APIs, queues, worker and persistent scheduler | Environment username/password login with in-memory sessions; admin authentication has no MongoDB lookup or CSRF token. Citizen preferences use the owning cookie and origin checks without a separate verification token. |
| Official sources | Existing deny-by-default adapters for API/RSS/HTML/PDF | Live activation is **per-source** and requires documented access, reuse and path approval |
| AI | Google Gemini official `@google/genai` SDK; model via env and capability test | Two credentials are **not** an automatic quota increase; per-Google-project limits apply |
| AI unavailability | Defer Gemini jobs; retain current approved cache and original-text fallback | No independent provider implementation or automatic provider switching |
| AI validation | JSON schema + Zod, clause-grounded source comparison, explicit review states | No AI approval of scheme rules or invented requirements |
| Multilingual data | MongoDB searchable `en`, `hi`, `kn` titles, aliases, keywords, indexed tokens | Generate in background and cache per approved source version; no per-keystroke model calls |
| Voice | Existing browser Web Speech API | Optional; end-to-end voice orchestration in a later dedicated phase |
| Maps | Future Leaflet + licensed OSM dataset; list fallback | Not part of Phase 3.6 |
| Hosting/scheduling | Existing local native worker and DB-persisted schedules | Hosted scheduling remains a separate deployment decision; no Docker required |

**Verify current provider documentation at implementation time.** Do not hard-code a model just because it appears in an older handoff. Model and cost/quota support are account-specific and can change.

### 17.3 Secrets: private backend environment only

Recommended `.env.example` entries (no actual secret values):

```dotenv
MONGODB_URI=
MONGODB_TEST_URI=
GEMINI_API_KEY_PRIMARY=
GEMINI_API_KEY_SECONDARY=
GEMINI_MODEL=
AI_MAX_RETRIES=2
AI_MAX_COST_PER_DAY=0
AI_MAX_CONCURRENT_JOBS=2
```

- The owner will add credentials **only to ignored local backend `.env`**. Never paste credentials in chat, frontend variables, test output or committed files. Rotate previously exposed keys before configuring them.
- If `GEMINI_API_KEY_PRIMARY` and `...SECONDARY` belong to the same Google Cloud project, they share the project's rate-limit budget. The second key is for valid credential redundancy, not 429 circumvention. Do not rotate across keys or projects to circumvent limits.
- On temporary network/5xx failures: bounded retry/backoff. On 429: honor backoff and defer; on invalid key/auth failure disable the credential, notify admin. Do not add or activate another provider or incur charges without separate authorization.
- Do not send identity documents, filled forms or other personal content to a model by default. Admin-approved public scheme text is a different data class from user uploads.

### 17.4 Canonical operational pipeline, approval gates and persistence

**Never simplify first and discard the original.** The durable sequence is:

1. **Source authorization gate:** determine which official endpoint and exact method/path may be queried; reject unapproved sources before a network request.
2. **Collect and version:** fetch official page/feed/document, preserve source URL, publication date, fetched time, raw excerpt/content hash, extraction errors and immutable SourceVersion record.
3. **Normalize and stage:** parse schemes, facts, conditions, links and document requirements into *candidate* records; preserve evidence and a review queue; separate synthetic fixtures from official records.
4. **Human source review:** an authorized editor validates authoritative official clauses, effective date, factual fields and publishing rights. Research-only items may remain browsable **in admin**, but not advertised as eligible/current citizen benefits.
5. **Generate verified-content derivative:** enqueue AI job for short plain-language English explanation grounded **only** in approved facts and source passages. Capture prompt version, model, provider, source version, and output status. Validate amounts, dates, age limits, document names and source references. Require editorial signoff for claims with impact.
6. **Multilingual generation:** generate Hindi and Kannada explanations, title variants, aliases, search keywords and (optional) romanized terms from the *same approved version*. Store with language and model metadata; run normalization/deduplication/unsafe-claim checks. Do not equate an AI translation with an authoritative official translation.
7. **Publish readiness:** a scheme can be visible as current official-source-linked information only when rights, evidence, reviewed claims and current-version explanations have passed appropriate gates. Rule-set approval is a separate additional gate for eligibility verdicts. A failure in AI must not destroy the approved source record.
8. **Serve from MongoDB:** homepage/search/detail endpoints return only publishable records; tag recommendations as potentially relevant, not 'eligible'. Show source and last-verified date and fall back transparently when a language version is unavailable.
9. **Change/recovery:** on significant source change, retain previous approved version, mark impacted derivatives stale, create review work, prevent using a stale summary as new facts, and regenerate after renewed approval. Use durable, idempotent processing and audit logs.

**Recommended additive models:** existing `Scheme`, `SchemeFact`, `Source`, `SourceVersion`, `ReviewItem`, `IngestionRun`, `ChangeEvent`, etc. retained; add `AIArtifact` (task, lang, evidence version, schema/prompt/model, text/JSON, cost/token estimate, generated/review status), `AIJob` (dedupe key, state/attempts/nextRetry), and `SchemeSearchDocument` (per-language approved tokens and aliases) if not already present. Keep source facts and derived text separate. Add migrations and indexes without dropping the database.

**Search rule:** no full scan/unbounded regex/no AI request on each typed search. Use indexed normalized search tokens for Kannada/Hindi/English, optional romanized aliases, category/state filters and clear relevance scoring. Results must be grounded in approved/public records.

### 17.5 Existing admin dashboard enhancements (not a new admin app)

Extend `/admin` with:

- **Pipeline overview:** exact counts separately for sources (approved/denied), imported research, staged candidates, reviewed facts, AI jobs pending/failed, summaries prepared by language, keywords prepared by language, published schemes, and approved eligibility rule sets. Never combine synthetic and genuine data silently.
- **Sources:** authorization evidence, enabled status, last fetch, fetch/parse errors, URL allowlist and compliance history; no checkbox can override denied source access.
- **Run Collection:** launch fixture-only and permitted-live jobs; show worker progress, bounded errors, success/failure and SourceVersion link.
- **AI Processing:** select reviewed scheme(s), start English simplify/translate/keywords, view provider used, model, token estimates and validation warnings, retry blocked/failed jobs; no automatic publication or approval.
- **Review & Publish:** compare official excerpt with proposed fields, AI summary, translation and keywords; reject/revise/approve with audit reason and editor identity; published version rollback only with audit.
- **Schedules:** existing persistent timezone-aware cron editor, ON/OFF and run history; optionally schedule AI preparation separately from raw collection. All source authorization and cost gates apply to scheduled jobs.
- **Data Explorer and Changes:** preview source record and resulting published language versions, date/version freshness, and field-level change/AI stale state.
- **Operations:** provider health (redacted), failed-job queue, schema validation and source approval gaps; no display of secret values, free-tier assumptions, or unearned 'live' labels.

### 17.6 Narrow build scope and explicit exclusions

**Now:** audit current code; refresh theme; verify database environment; preserve import/fixtures/scheduling/admin security; implement AI job router, evidence-based summary/translation/keyword pipeline; admin queue/review/analytics; test a fixture and (if independently authorized) one real source; prove one approved-version scheme can be queried by its English/Hindi/Kannada terms in a developer/test context. Fix issues found without rebuilding the codebase.

**Not now:** full voice assistant, form/notice uploads, eligibility UI, maps, citizen accounts, notifications, complete hero carousel, production deployment, paid API enablement, or unrelated Phase 4 work. Keep these canonical features in the longer-term plan.

**Acceptance:** prior tests still pass; no Docker; zero unsafe live requests; zero unapproved public scheme/eligibility claims; AI failover follows project quotas/budget; English/Hindi/Kannada outputs traced to one approved source version; review approval/rejection audited; changes invalidate derived data; admin controls and status truly work; regression + E2E results recorded. If no government source is approved for collection, the system must explicitly report **live collection blocked**, but the compliant adapter and fixture path must be tested.

### 17.7 Change record

**v2.3:** Freezes Civic Blue palette (no green/orange), keeps manual site + optional voice principle, locks JavaScript/MERN technology, authorizes narrowly scoped Phase 3.6 implementation, and defines Gemini derived-content processing integrated into the existing admin and collection stack. All previous citizen features remain required for later phases.

**Documentation revision — 18 November 2026:** The owner retired the independent AI fallback from the active technology plan. Gemini remains the selected provider, with approved-cache/original-text fallback and deferred jobs when unavailable. Existing AI code and regression tests were left unchanged. Reports, guides and legacy prompts/plans are indexed in [docs/README.md](docs/README.md); this root file remains the sole authoritative product specification. This cleanup authorizes no new implementation phase or citizen features.

**Gemini validation update — 18 November 2026:** Subsequent owner authorization removed the retired provider from active code/configuration, preserving Gemini credentials and safety behavior. After owner confirmation of the primary project's Free tier/no paid billing plus official model/pricing checks, bounded real EN/HI/KN validation used `gemini-3.5-flash-lite`. Results are in [Gemini integration validation](docs/history/GEMINI_INTEGRATION_VALIDATION.md). This establishes a small test result, not live source permission, publication approval, translation certification or paid-use authorization. No additional implementation phase or citizen feature was begun.

**Admin login update — 18 November 2026:** The owner requested environment username/password comparison without database authentication or admin CSRF tokens. The existing admin now uses private backend ADMIN_USERNAME/ADMIN_PASSWORD and in-memory login sessions. Citizen authentication and source/publication/spending gates remain unchanged. Dashboard data operations still require MongoDB. [Change and verification](docs/history/ENV_ADMIN_LOGIN_CHANGE.md).

**Citizen session update — 18 November 2026:** The owner requested removal of all remaining CSRF-token authentication. Citizen APIs no longer generate/return/require a separate request token and frontend requests no longer store or attach one. Owning HttpOnly cookies, hashed citizen-session storage, expiry, preference validation and origin checks remain. Current implementation/results are consolidated in [whole-project status](docs/PROJECT_STATUS_REPORT.md); this is a report, not another master plan or implementation phase.


**Real-data execution evidence — 18 November 2026:** The owner authorized real-source collection and explicitly approved five limited public fact packets for AI preparation only. Scoped NDMA RSS ingestion stored 100 notices; repeat ETag HTTP304 added no duplicates. Five schemes produced 15 validated review-pending multilingual artifacts, with no publication, eligibility approval or paid requests. Source restrictions remain effective; no new implementation phase or citizen scope was added. [Exact execution report](docs/history/REAL_DATA_COLLECTION_REPORT.md), [owner-reviewed fact packets](docs/FIVE_SCHEME_FACT_REVIEW.md).


**Atlas environment correction — 18 November 2026:** The owner requested use of private backend environment credentials and explicitly approved a content/review-only copy to their Atlas database. Existing content and 15 review-pending artifacts are now hash-verified in Atlas; local data remains preserved. Process-only DNS correction retains authentication/TLS and paid/source/publication gates. [Diagnosis and evidence](docs/history/ATLAS_ENVIRONMENT_AND_AI_DIAGNOSIS.md). No new implementation phase or citizen feature was authorized.


**Owner-authorized data-to-citizen slice — 18 November 2026:** The owner requested Atlas lineage audit, first actual editorial publication, existing React scheme discovery/detail integration and permitted API investigation. After reviewing the concrete PM-KISAN packet, the owner explicitly approved all three revisions and publication. One real trilingual scheme now serves from Atlas through existing publication gates; NDMA execution was separately restored after evidence checks. No new AI calls, eligibility approvals, dashboard or unrelated feature phase. [Completion report and scope limits](docs/history/ATLAS_DATA_TO_CITIZEN_COMPLETION_REPORT.md). This targeted F2 implementation supersedes earlier blanket deferral only for the requested scheme discovery/detail slice.
