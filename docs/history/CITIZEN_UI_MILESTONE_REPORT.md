# Citizen UI milestone completion

19 November2026 · Existing React/Vite app · Civic Editorial · No Stitch

Implemented the supplied milestone using the actual local `UI_DESIGN_BLUEPRINT (1).md` and `UI_CONCEPT_PREVIEW (1).html`. The HTML remains a visual reference. Existing backend contracts, admin, source permissions, Atlas content, Gemini workflow and publication decisions are preserved.

| Feature | Working behavior |
|---|---|
| Onboarding | Language-first English/हिन्दी/ಕನ್ನಡ choices, explicit Hear choices, manual default and optional guidance using the same editable state/category form. Switching modes preserves choices. Finish reviews/saves minimal preferences through the existing anonymous-session API. |
| Restore | Existing validated local preferences, cookie-owned server profile, offline synchronization/retry and later language changes retained. Optional voice preference is a separate browser boolean; no token or transcript is stored locally. |
| Home | Navbar → clearly branded educational banner → published preference-based recommendations → typed search/optional voice → six service links → honest optional-account invitation → footer. Responsive menu and privacy/help/source links work. |
| Scheme browsing | Existing published search, filters, pagination and details retained; added Explore all/Recommended controls and assistant context. Reviewed explanation comes first, with benefits, audience caveats, known/unknown documents, application guidance, official links, expandable original wording and source dates. No verified form reference is invented where the API supplies none. |
| Voice | Shared user-activated widget, visible microphone/readback state and transcript, typed command alternative, stop/off controls. Allowlisted language/onboarding/navigation/search/current-result opening/section reading actions. Result opening and field interpretation require confirmation; stale result/page context cannot authorize a different selection. No arbitrary clicking, submission or automatic microphone capture. |
| Design/assets | Ink/cobalt/warm-paper/lavender citizen tokens scoped away from admin; locally served Manrope plus existing Noto script fonts. One licensed documentary photograph, credited and expressly illustrative. No fake government poster, seal or sponsorship. [Asset provenance/licenses](../../frontend/ASSET_LICENSES.md). |

The single educational banner has a working indicator, pause-state announcement and keyboard handling. Previous/next arrows are disabled because there is only one approved educational panel. There is no autoplay or invented government banner inventory.

**Validation:**96 backend +9 frontend unit tests,43 isolated native MongoDB integration test nodes,30 regression/citizen desktop/mobile journeys plus4 isolated editorial journeys, and production build passed. Focused citizen/keyboard checks were rerun after final readback/skip-link fixes. Tests cover320/360/390px and desktop layouts, keyboard operation, session restore/offline retry, real API errors/empty states, multilingual rendering and voice unavailable/manual mode. Existing admin login, fixture job, scheduler, data explorer, collection history and publication tests pass.

**Real Atlas verification:**15 published schemes and45 English/Hindi/Kannada detail responses passed. Actual approved search results populate the captured Home recommendations; profile transport was held in memory during screenshot verification to avoid citizen database writes. Original content/config/review hashes across19 protected collections remain unchanged:35 scheme/candidate records,117 artifacts,75 current validated language revisions,15 publications and20 still-pending records. No AI request, paid request, new approval/publication or government collection was performed for the UI. Existing NDMA remains notice-only.

**Speech evidence:** desktop/mobile Edge automation injected SpeechRecognition events and speech-synthesis test doubles to verify choose language → guide fields → confirm → search → confirm result → open → read benefits → stop, and switching to manual. EN/HI/KN command parsing and script rendering pass. Actual microphone recognition, accent accuracy, spoken translation quality, native phone testing and installed Hindi/Kannada TTS voices are **not certified**. Unsupported browsers and missing native voices show an explicit manual/text fallback. No continuous wake-word service is claimed. Human design/native-reader review remains outstanding.

**Remaining features:** form/notice uploads and explanation, deterministic eligibility questions, a verified center directory/maps, a published scam feed, citizen accounts, saved schemes and notifications remain limited-state entry pages. This milestone does not claim those services work. No source permission or pending editorial decision has been inferred.

Changed citizen files: `App.jsx`, `main.jsx`, `citizen.css`; Layout, PreferenceForm and ReadAloud; Onboarding, Home, Schemes, SchemeDetail, Upcoming and Information; VoiceContext, VoiceAssistant and voiceCommands; citizen translations; unit/browser tests; local fonts/photo and asset licenses. No backend/admin application changes were needed for this UI slice. The earlier authorized [collection audit and additions](INCREMENTAL_SCHEME_COLLECTION_REPORT.md) are preserved separately.

Safe public-workspace Git checkpoint: ignored `.local/citizen-ui-recovery/snapshot.git`, branch `before-citizen-ui`, commit `69f35bdc2367da738b5491d60809645e2494439b`. It includes494 public project files, excludes private ignored files and leaves the main repository's HEAD/index unchanged. Recovery can inspect `git --git-dir=.local/citizen-ui-recovery/snapshot.git show before-citizen-ui:PATH`; do not overwrite later work without comparing it.

## Screenshots from real published content

| Screen | Desktop | Mobile |
|---|---|---|
| Onboarding | [English](../../frontend/reports/citizen-ui/onboarding-en-desktop.png), [Hindi](../../frontend/reports/citizen-ui/onboarding-hi-desktop.png), [Kannada](../../frontend/reports/citizen-ui/onboarding-kn-desktop.png) | [English](../../frontend/reports/citizen-ui/onboarding-en-mobile.png), [Hindi](../../frontend/reports/citizen-ui/onboarding-hi-mobile.png), [Kannada](../../frontend/reports/citizen-ui/onboarding-kn-mobile.png) |
| Home | [English](../../frontend/reports/citizen-ui/home-en-desktop.png), [Hindi](../../frontend/reports/citizen-ui/home-hi-desktop.png), [Kannada](../../frontend/reports/citizen-ui/home-kn-desktop.png) | [English](../../frontend/reports/citizen-ui/home-en-mobile.png), [Hindi](../../frontend/reports/citizen-ui/home-hi-mobile.png), [Kannada](../../frontend/reports/citizen-ui/home-kn-mobile.png) |
| PM-KISAN | [English](../../frontend/reports/citizen-ui/scheme-en-desktop.png), [Hindi](../../frontend/reports/citizen-ui/scheme-hi-desktop.png), [Kannada](../../frontend/reports/citizen-ui/scheme-kn-desktop.png) | [English](../../frontend/reports/citizen-ui/scheme-en-mobile.png), [Hindi](../../frontend/reports/citizen-ui/scheme-hi-mobile.png), [Kannada](../../frontend/reports/citizen-ui/scheme-kn-mobile.png) |

[Preserved admin collection view](../../frontend/reports/citizen-ui/admin-preserved-desktop.png). Synthetic contract-test screenshots are separately labeled in `frontend/reports/citizen-ui-fixtures/`. Private machine receipts/logs remain in ignored `.local/incremental-validation/`.
