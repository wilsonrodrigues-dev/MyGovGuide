# MyGovGuide design system

The actual Stitch project is `projects/16872371074444001614` (PRIVATE). Its generated shared system is **Calm Civic Editorial**, `assets/f4f532eee653402a9fea5b48978c8032`. Fourteen actual generated screens and their source resources are recorded in [the manifest](design/stitch/manifest.json). The original tool metadata, generation responses, shared theme and downloaded Home reference are preserved under design/stitch/.

## Direction

A calm citizen-service desk: warm paper, forest ink, simple icons, editorial English headlines and generous space. No dashboard metrics, gradients, government seals, stock photography or decorative AI illustrations. The brand is an original book/leaf arrangement using Lucide icons. The app always identifies itself as an independent student project.

## Theme provenance and implementation tokens

Stitch generated a Material-derived palette alongside its written editorial guidelines. The saved raw theme is not overwritten: its primary is #004E3C, primary container #256653 and surface #E6FFF4. The React implementation deliberately uses the warm-paper colors requested in the brief and repeated in Stitch's style guidelines, with explicit accessible text overrides. It is a responsive implementation of the design direction, not a pixel-for-pixel embedded screenshot.

| Token | React value | Use |
|---|---|---|
| Paper | #F8F7F2 | Page canvas |
| Surface | #FFFEFA / #FFFFFF | Cards and forms |
| Ink | #183C32 | Primary text |
| Primary | #256653 | Main actions and featured card |
| Muted text | #63745D | Supporting readable text |
| Sage | #E8EFE6 | Secondary controls / information panels |
| Border | #DDE4DA | Quiet structure |
| Amber | #AE6929 | Visible keyboard focus |
| Error | #A33D31 | Validation |

Core ink/paper, muted/surface, white/primary and warning/surface pairs are checked against WCAG AA 4.5:1 contrast in frontend tests. This is a targeted check, not a full accessibility certification.

## Typography and spacing

- Noto Sans for English; Noto Sans Devanagari for Hindi; Noto Sans Kannada for Kannada. Fonts are packaged locally, not fetched from a remote font service. Original OFL licenses are distributed under public/licenses/.
- English editorial headlines use the local Georgia serif fallback rather than loading Stitch's Newsreader font. Hindi/Kannada headings retain Noto for script coverage and comfortable line height.
- Main text is 14–16px, form inputs 16px, field headings 15px, compact labels 12–13px. Script-dependent line heights reach 1.8–1.9; content can wrap and cards grow vertically.
- Spacing follows an 8px rhythm with compact 4px subdivisions. Cards have 10–14px radii. Full content width is capped at 1120px, with a 1160px wide-screen variant; mobile gutters are 18px.
- Buttons, radio tiles and selects have at least 48px height. Category controls use full clickable labels. Browser-native selects and radios preserve keyboard behavior.

## Components and behavior

| Component | Specification |
|---|---|
| Button | JavaScript shadcn/ui pattern with Radix Slot, CVA variants, clsx/tailwind-merge; primary, outline, ghost, icon |
| Navigation | Desktop header links; fixed mobile Home / Explore / Saved / Preferences bar, with current-route styling |
| Language switch | EN / हिन्दी / ಕನ್ನಡ; visible selected state and aria-pressed; profile language persists without losing state/category |
| Preferences | One screen, three sections: state, category, language; semantic fieldsets, inline translated errors and focused invalid fields |
| Action card | Five routes, one featured forest card, real icon, short description and directional arrow |
| Scheme preview | Genuine backend-published metadata only; official source, review date and source-review label; never an eligibility approval |
| Empty state | Book icon, explanation and honest absence of cleared information; no invented scheme records |
| Loading | Translated status/skeleton; reduced-motion preference respected |
| Error | Specific translated unavailable state with Retry; pending sync is distinct from successful secure sync |
| Voice | Browser speech recognition and read-aloud where available, explicit fallback to typing; no claim of on-device processing |
| Source transparency | Original source links and review boundaries; no government endorsement or promises of eligibility |

## Screen map

Stitch generated Home, Onboarding, Scheme Discovery, Scheme Details, Eligibility Checker, Eligibility Results, Forms Library, Form Guidance, Notice Explainer, Notice Checklist, Scam Alerts, Notifications/Change Radar, Profile/Language Settings, and Optional Login/Bookmarks. Each has an actual resource ID in the manifest.

React implements Onboarding, personalized Home, Preferences/Language and the information-method page. The other feature routes explicitly say they are upcoming. The downloaded Stitch Home reference contains illustrative copy, including an unsupported old-cycle stamp and on-device audio claim; those statements were deliberately excluded from the application. Design artifacts are references, not government-data evidence, and are not imported into the public bundle.

## Verification limits

Automated Edge tests cover desktop and mobile viewports, Hindi/Kannada text and font loading, keyboard controls, navigation, and no horizontal overflow. They do not replace physical-device testing, native-speaker translation review, screen-reader testing or voice-quality testing. See reports/ and the root completion report for actual results.
