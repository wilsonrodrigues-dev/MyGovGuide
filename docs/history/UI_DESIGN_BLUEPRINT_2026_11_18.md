# MyGovGuide — Citizen UI/UX Design Blueprint

**Edition:** 2026-11-18 • **Status:** proposed redesign for approval and implementation.  
**Authority:** User's explicit current experience description and `PRODUCT_MASTER_PLAN.md` (existing functional requirements).  
**Design direction:** **Civic Editorial** — calm, warm, human, readable; not an AI-generated SaaS dashboard. **No Stitch.** Manual website is complete; voice assistant is optional.

## 1. Non-negotiable experience contract

1. A person must be able to use every public feature with **touch/mouse/keyboard and typed input**, with **zero microphone permission** and **no account**.
2. A voice assistant is offered but **never silently records, talks or takes control**. Browsers often require a user interaction before audio playback and/or microphone access. On the first visit, visibly show English / हिंदी / ಕನ್ನಡ and a **Hear choices** or **Start voice guidance** action. After activation, it may ask for language and whether the user wants assisted or manual onboarding. A voice-guided user can always edit fields manually.
3. Check non-sensitive `localStorage` preferences on boot and restore the owning anonymous HttpOnly session server-side. If no valid preference exists, show onboarding. Do **not** keep auth tokens in localStorage. Session recovery cannot discard more recent unsynced settings.
4. The user's selected language controls site UI, available reviewed scheme content, form/notice explanations and optional speech. English, Hindi, Kannada all have equal navigation support; fallback language is explicitly labeled.
5. Only current, reviewed/published source-backed content appears as official-scheme facts. Category matching means **'may be relevant'**, never **'you qualify'**. Restricted/fixture/research-only/unreviewed data never leaks into citizen cards or sliders.
6. Existing `backend/`, `frontend/`, MongoDB Atlas/local data, /admin, auth and ingestion/AI/review pipelines are retained. Redesign citizen frontend; integrate existing public endpoints. **Gemini only**, no Mistral and no Stitch.

## 2. Visual identity: Civic Editorial

**Goal:** like a thoughtfully designed Indian public-service publication: welcoming, dignified, trustworthy, approachable to seniors, not a dashboard or a flashy AI launch page.

| Token | Value | Use |
|---|---|---|
| `--ink` | `#1B2940` | headings, primary text |
| `--blue` | `#2753B6` | primary CTAs, links, focus |
| `--blue-deep` | `#1D397B` | navigation emphasis, on-light headings |
| `--lavender` | `#E9ECFA` | optional soft emphasis and feature sections |
| `--paper` | `#FAFAF8` | main warm-white canvas |
| `--surface` | `#FFFFFF` | card backgrounds |
| `--muted` | `#5F6E81` | metadata |
| `--line` | `#E3E8F0` | dividers and boundaries |
| `--danger` | `#B42337` | errors only |

- **No green/orange branding**, glass effects, neon gradients, stock 3D robots, emoji feature icons, random blob backgrounds, fake government seals or fake 'official' badges.
- Typography: a measured English heading font such as **Manrope / Plus Jakarta Sans** (licensing verified), native readable **Noto Sans Devanagari** and **Noto Sans Kannada** for language scripts; body 16–18 px, sufficient line height, headings 34–46 px desktop, 28–34 px mobile.
- Container max-width 1160–1220 px. Section rhythm 60–88 px desktop, 36–52 px mobile. Subtle separators, purposeful asymmetry, varied card widths. Border radii mostly 10–16 px (not every shape a giant pill). Button/field hit area >=44 px.
- Use concise, natural citizen-centric labels; avoid technical words like 'pipeline', 'artifacts', 'LLM', 'RAG' on citizen pages.
- Real photography is supporting context, not proof of eligibility, sponsorship or a government benefit. Use photographic crop, quiet composition and concise captions. Do not embed unrelated photo portraits as real scheme posters.

## 3. Asset policy — what Codex may download

- **Suitable sources:** selected images from [Pexels](https://www.pexels.com/license/) or [Unsplash](https://unsplash.com/license), official poster images only where the rights and attribution/reuse are verified, Lucide icons, fonts from correctly licensed font distributors.
- Prefer **manually selected individual licensed downloads or provider-authorized APIs**; do not scrape/bulk-crawl stock-image sites (Unsplash web terms restrict automated crawling).
- Create `frontend/src/assets/` and `frontend/public/images/`. Prefer optimized local WebP/AVIF images with responsive source sets; provide text-alternative captions.
- Keep `frontend/ASSET_LICENSES.md` with original image URL, creator, provider, date downloaded, license link, intended placement, any attribution required. Never copy watermarked Getty, newspaper, Google Images, or protected government graphics without permission.
- Photography subjects: actual study/document review, agriculture, service-centre assistance, paperwork, older citizens using devices, real India-based scenes where properly sourced. A small curated set is better than a random image in every card.
- **Important:** approved slider content comes from a reviewed banner CMS/content database; if empty, show one clearly labeled in-house 'How MyGovGuide helps' educational banner, not a fictitious current government scheme.

## 4. First-visit journey — exact information architecture

### Entry and onboarding

1. Load website → validate persisted non-sensitive profile. Existing user → Home. No profile → Onboarding.
2. First screen is **trilingual**: friendly title, visible English / हिंदी / ಕನ್ನಡ buttons. A quiet optional **Hear language choices** control is prominent; speech never autoplays on a browser that disallows it.
3. After language selected, ask **'How would you like to continue?'** with equally visible choices **Fill details myself** (default) / **Use voice guidance**. Selecting manual stops active audio and prevents microphone use.
4. Voice path requests speech permission only after explicit opt-in. It asks one question at a time (state and beneficiary category), transcribes, shows editable values, repeats ambiguous answers for confirmation, and lets users disable it at any time. The manual path shows the same state/category fields directly.
5. Show a quick summary, **Finish** → Home. Do not request Aadhaar, bank, income, name, phone or GPS during onboarding. Save preferences locally; secure session sync on server.
6. Voice persistence is a *preference*, not permission for invisible background listening. A separate user gesture may be required per browser session.

### Returning visitor

Load Home immediately using validated preferences. Language remains changeable; voice toggle remains visible but non-intrusive. If voice is disabled, nothing speaks.

## 5. Home page — preserve user's exact section order

1. **Navbar:** restrained wordmark at left; Home, Schemes, Forms, Notices, Scam Alerts, Find a Center; language selector; one discrete voice icon/button; account entry. Mobile: compact accessible menu, language and voice remain discoverable.
2. **Editorial slider:** an official/reviewed scheme poster, notice, scam-awareness announcement, or other government update; each panel includes *content type*, title, authority/source, date/expiry, CTA. Manual arrow/dot controls; pause control; avoid rapid autoplay. If no approved content, use a distinctly labeled in-house educational banner with a licensed real photo.
3. **'Picked for your interests' schemes:** based on saved state/category; display 3–6 published scheme cards with title, department, relevant audience, 1–2 line reviewed summary, last review date, See details. Above list show 'Based on Karnataka · Student', edit preferences and 'These may be relevant—not an eligibility decision'. If nothing approved, a genuinely useful empty state, never fake cards.
4. **Search:** prominent text input, visible Search button, separate optional microphone icon; supports EN/HI/KN tokens, aliases and romanized terms; clear/empty/loading states. Searching by text must work regardless of voice choice.
5. **All features:** intentional 2-column/3-column responsive editorial grid: Find schemes, Eligibility gap, Understand a form, Understand a notice, Scam alerts, Find a center. Each has clear one-sentence value statement and a real route.
6. **Optional account invitation:** quiet but visible expandable sign-in/create-account area near bottom: 'Get updates on schemes you follow'; explicit 'Explore without an account' text. Core flows do not require registration.
7. **Footer:** transparent service disclaimer, official source policy, languages, accessibility/privacy/contact/help, NOT an 'official government portal' claim.

## 6. Other citizen screens

| Screen | Required layout and interaction |
|---|---|
| **Schemes directory** | clear heading + filters, searchable list/grid, **Recommended for you** and **Explore all** tabs. Show scheme source/category and approval date. Manual filter first; speech optional. |
| **Scheme details** | editorial title/authority header; **Simple explanation** immediately visible in selected language; benefits, audience/eligibility conditions, required documents, how to apply, **Official apply** link, **Explain the form** link, expandable original wording, source URL, review date; 'Check my eligibility' only when rules approved. |
| **Form explainer** | opening upload/select PDF/image block (privacy notice), identify the form or show 'unknown'; explanation of purpose and field-by-field interactive guidance, matched scheme, official form URL; then **frequently used forms** from verified catalog. Redact sensitive fields before any external AI call; no automatic uploading of filled forms to free provider. |
| **Notice explainer** | upload/paste top section; simple language explanation, extracted action checklist and verified dates, expandable original and source; no fabricated deadline. |
| **Scam alerts** | dated official alerts separated from undated awareness guides; clear last-verified metadata, what happened / what to do / how to report; signed-in users can follow updates. Disaster-alert NDMA records stay in their own section if used, not mixed with cyber scams. |
| **Eligibility gap** | selected scheme → short dynamic form using **approved deterministic rules** → Potentially eligible / Not eligible by confirmed rule / Need more information; show each reason and next steps; no guarantee of approval. |
| **Nearby centers** | address/PIN/town search and optional geolocation; real approved center directory, map + accessible list with address, service types and directions. Never invent pins. |
| **Notifications/account** | optional registration/login, bookmarks/followed schemes and consented personalized updates. Guest browsing stays available. |
| **Site-wide assistant** | floating/persistent **Ask MyGovGuide** control after opt-in, transcript and read-aloud controls, voice state shown explicitly. Uses page context/result IDs and allowlisted app actions. Confirmation for ambiguous/risky actions; user can stop immediately. |

## 7. Voice action model: optional and controlled

- All capabilities have manual equivalents. Voice is never the only way to use a form or navigate.
- Stages: user gesture → recognizer → transcript displayed → deterministic intent (or constrained Gemini intent if needed) → page action allowlist → app UI/state change → optional TTS.
- Supported intents on finished pages: `navigate`, `search`, `filter`, `select_result`, `open_scheme`, `read_section`, `next_step`, `set_onboarding_field`, `toggle_assistant`, `stop_readback`, `change_language`, `open_form_guidance`, `open_notice`, `find_centers`.
- No unrestricted browser clicks, hidden external redirects, uploads, geolocation or writes. Ask confirmation for sensitive settings and ambiguous references such as 'open the second one' after results changed.
- Language `en-IN`, `hi-IN`, `kn-IN`, with error/manual fallback where browser support is limited; assistant describes exactly what happened on screen.

## 8. Data wiring and source rules

- Schemes **come from MongoDB** published searchable records, not static arrays. AI explanations and EN/HI/KN aliases/keywords reside in versioned artifacts, indexed only after editorial approval. Never regenerate per keystroke.
- Home slider requires separate approved banners or curated site education; don't repurpose raw NDMA alerts as recent scam news.
- GET content search/details should use existing `/api/content/search` and `/api/content/schemes/:id` (audit their actual contracts); do not build fake data paths.
- Recommended schemes must filter by profile and publication status. Manually curated content can appear after proper rights, freshness and editorial checks; 'research-only' never appears as validated fact.
- Voice assistant has no authority over source approvals or eligibility verdicts.
- Admin dashboard should not be rebuilt; keep operations, cron, data explorer, Gemini review and publication as currently implemented. A small visual consistency pass is acceptable but must not disrupt it.

## 9. Implementation handoff and acceptance

1. Protect current code: Git checkpoint, inspect routes and existing test evidence, preserve `backend/`/`frontend/` and Atlas/local data.
2. Build/verify responsive citizen design system components (header, footer, banner, scheme preview, search, feature links, upload drop zones, form/notice shells, voice toggle).
3. Deliver genuine **clickable** manual onboarding and Home, with correct persisted preferences and real API states.
4. Wire scheme directory and details to reviewed public content, without altering approvals or publishing anything automatically.
5. Add voice guided onboarding and cross-site command controls progressively; if a browser lacks speech support, manual mode still works.
6. Implement forms, notices, eligibility, scam, centers and accounts with safe backed functionality in distinct tested milestones; don't replace unimplemented flows with fabricated 'success' states.
7. Tests: 320/360/390/mobile and desktop; Kannada/Hindi text; keyboard, touch, voice disabled; no fake government records; published/unpublished data gating; load/empty/error; source attribution; role-isolated admin.
8. Human design review: compare screenshots on mobile and desktop, check reading order, white-space, real photo placement, distinct section identity, and test with at least one non-technical reader.

## 10. Do not confuse the prototype with a built feature

An optional HTML preview is provided as **visual design exploration only**, not connected to MongoDB, Gemini, real centers, voice recognition, uploads or published schemes. This spec is the design source for the production React rebuild; `PRODUCT_MASTER_PLAN.md` still governs product functionality.
