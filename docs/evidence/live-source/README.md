# Preserved live-source evidence

This directory contains bounded captures and policy probes collected while checking whether specific official sources could be used. They are retained as evidence, not as an authorization to collect, reuse, republish or automate any source.

- `income-tax-rss.xml`, `sachet-rss.xml` and the `feed-links-*` files are feed captures used to inspect official item links.
- `policy-*`, `tax-policy-*`, `additional-*` and `extra-*` files are bounded text probes of official pages, robots/terms material or endpoint responses.
- File names and contents describe their capture context; they are not current policy statements.

Two shareable captures that previously contained embedded API-key-like strings were redacted before this cleanup. The original bytes remain in private local recovery storage, not in this repository. Do not restore raw captures containing credentials into a commit.

Successful HTTP access, a public page, an RSS item or a search result does not establish source permission, currentness, completeness or editorial approval. Source-specific approvals and expiry remain in `backend/config/source-approvals.json` and `backend/docs/phase2/SOURCE_APPROVAL_LOG.md`.
