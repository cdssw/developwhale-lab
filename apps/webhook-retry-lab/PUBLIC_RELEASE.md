# Cloudflare production Worker — public release v1

Goal: Create a fresh public Worker URL based on the exact imported Sites v3 logic, with independent D1 analytics and a self-canonical URL. This does NOT replace or redirect the existing original Site.

- Public Worker: `dw-webhook-retry-lab-public`
- D1: `dw-webhook-retry-lab-public-20261015`
- Expected URL: `https://dw-webhook-retry-lab-public.cdssw.workers.dev/`
- Source app remains in `apps/webhook-retry-lab`.
- The response-only public wrapper rewrites the original canonical, OpenGraph URL, robots sitemap reference and sitemap location. Source files remain byte-for-byte.
- Staging remains separate and noindexed; its QA D1 rows are not transferred.
- No existing WordPress, Sites, DNS, Cloudflare zone or n8n modification.
- Release workflow only triggers on adding/changing `RELEASE_PUBLIC_20261015.md` in `master`, or manual workflow dispatch with exact confirmation.
- Workers/D1 Free account limits must continue to be monitored; zero additional billing is a project constraint.
- Changes to production after first release require a separately approved release or manual invocation; merging random code is **not** an automatic deploy.

## Acceptance gates
1. Original tests, reproducible build, and public wrapper syntax succeed in GitHub Actions.
2. Fresh public Worker deploys with only the new D1 binding.
3. Anonymous GET / returns HTTP 200; response has self canonical, robots/sitemap reference the new public origin and there is no noindex header.
4. Public /api/metrics returns valid aggregate JSON.
5. Actual Chromium QA checks retry/duplicate/lost/preset, compare, file download, mobile, no JavaScript errors, and QA D1 event, using ?qa=1 only.
6. Only then consider switching the existing WordPress intro/links or third-party directory listings; the current chatgpt.site page may otherwise compete as duplicate content.

## Market evidence
- The new release will not itself produce traffic or revenue.
- External traffic must be independently sourced and measured; opt-in analytics are a lower bound, not unique visitors.
- Revenue is 0 until proven by payment provider/ledger, even if `/api/metrics` reports 0 as a placeholder.
