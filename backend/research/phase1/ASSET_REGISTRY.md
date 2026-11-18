# Asset, access and design resource registry

**Purpose:** Identify what must be acquired or verified before phases 2–3. This is an **inventory**, not evidence that API keys, fonts or logos have been downloaded or accounts created.

| Asset / service | Official source | Use | Access / licence | Collection status |
|---|---|---|---|---|
| Google Gemini | https://ai.google.dev/gemini-api/docs | Dynamic government-text simplification | Server API key; model/version and free-tier quota must be checked | Docs identified; credentials not provisioned |
| Google GenAI SDK for JavaScript | https://googleapis.github.io/js-genai/ | AI client library | `@google/genai`; pin supported Node LTS (prefer Node 22+ after actual version check) | Documentation identified |
| Bhashini speech and translation | https://bhashini.gitbook.io/bhashini-apis | ASR / TTS fallback for Kannada/Hindi | Onboarding + API keys; docs mention PoC versus production licensing | Docs identified; account/access not obtained |
| Web Speech API | https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API | SpeechRecognition and browser TTS | Browser-dependent; real Android/Chrome tests needed | Capability documented, not tested |
| Google Stitch | https://stitch.withgoogle.com/ | UI concepts and screen prototypes | Google access, MCP environment setup if used | URL identified; no screens generated |
| React | https://react.dev/ | Frontend library | Open source | Selected |
| Vite | https://vite.dev/ | JavaScript build/dev tool | Open source | Selected |
| Tailwind CSS | https://tailwindcss.com/ | Responsive styling | Open source | Selected |
| shadcn/ui | https://ui.shadcn.com/ | Accessible UI primitives | Inspect component/dependency licences | Selected |
| react-i18next | https://react.i18next.com/ | English/Hindi/Kannada static translations | Open source | Selected |
| Noto Sans Kannada | https://fonts.google.com/noto/specimen/Noto+Sans+Kannada | Kannada text legibility | SIL OFL: https://github.com/google/fonts/blob/main/ofl/notosanskannada/OFL.txt | Candidate; font not copied |
| Noto Sans Devanagari | https://fonts.google.com/noto/specimen/Noto+Sans+Devanagari | Hindi UI legibility | SIL OFL: https://github.com/google/fonts/blob/main/ofl/notosansdevanagari/OFL.txt | Candidate; font not copied |
| Noto Sans | https://fonts.google.com/noto/specimen/Noto+Sans | English UI legibility | Verify exact license copy/version | Candidate; font not copied |
| Material Symbols | https://developers.google.com/fonts/docs/material_symbols | Navigation and feature icons | Apache License 2.0 | License verified; icons not copied |
| MongoDB Atlas | https://www.mongodb.com/atlas | Document database | Account + database credentials | Provider selected; account not provisioned |
| GitHub Actions | https://docs.github.com/en/actions | Scheduled, authenticated ingestion runs | Repo secrets and scheduled-run caveats | Provider selected |
| GitHub | https://github.com/ | Source control and project board | Account/repository | To configure in build phase |
| Render | https://render.com/ | API deployment | Account, region, limits, environment secrets | Selected provisionally |
| Vercel | https://vercel.com/ | React frontend hosting | Account, domain, env | Selected provisionally |
| Open-data licence & metadata | https://data.gov.in/Godl | Legal dataset attribution requirements | Dataset-level licence mandatory | General licence researched; exact datasets pending |

## Brand/visual design decision

- Create an **original** MyGovGuide mark and illustrated placeholders; do not copy or use Indian government seals, official insignia, Ashoka emblem, PM photo, or portal brand logos without the proper rights and official endorsement context.
- Direction: accessible, trustworthy, simple, low-literacy. Ensure 44×44 CSS px touch targets, contrast, explicit button text, and 360px mobile screen layouts.
- Draft palette (not approved branding): dark ink `#17324D`, teal accent `#087F8C`, off-white `#F7F9FB`, amber alert `#A35D00`; validate accessibility before designing.
- Collect icons by *semantic need*: search, form, eligibility, mic, playback, notification, original document, source link, warning. No decorative heavy asset downloads necessary.

## Credentials/decisions that only the project owner can complete

1. Provision Gemini access and a limited development API key; never commit it.
2. Apply for Bhashini API access if primary browser ASR/TTS is inadequate; confirm production terms.
3. Choose Stitch workflow, design style and approve actual designs in Phase 3.
4. Create Atlas/hosting/GitHub accounts, domain and secret management when coding begins.
5. Obtain express authorization where automation is restricted (especially myScheme) or exclude that source.
6. Obtain any needed content-publication approval and ensure dataset attribution.

**No secret keys, paid assets, or proprietary fonts are included in this deliverable.**
