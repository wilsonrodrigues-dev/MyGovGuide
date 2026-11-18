# Recorded official feed responses

These files were genuinely fetched on 18 November 2026 and are retained for deterministic **offline parser regression tests**. Replaying them is not live scraping. They are not bundled collection descriptors, citizen assets or current public alerts.

`ndma-2026-11-18.xml`: public SACHET RSS offered at https://sachet.ndma.gov.in/CapFeed, corroborated by its agency integration guide and WMO registration. Preserve NDMA/original authority attribution. Feed entries observed in this capture are dated 16 November; current validity is not asserted. Linked CAP documents/images were not fetched.

`cbdt-2026-11-18.xml`: Income Tax Department RSS explicitly offered for automatic subscription; copyright policy permits accurate attributed reproduction excluding third-party material. The preflight fetch succeeded, but the guarded worker transport returned HTTP403, so that source was disabled. Replay does not claim successful production collection. Its entries are historical 2025 releases.

Exact source URLs, hashes and provenance are in provenance.json. Genuine worker runs and network outcomes are separately reported under backend/reports.
