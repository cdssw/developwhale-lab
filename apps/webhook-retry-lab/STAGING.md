# Cloudflare Workers + D1: isolated staging only

## Purpose and state

**This document prepares a deployment; it does NOT represent a deployed Worker.**
Existing ChatGPT Sites Webhook Retry Lab v3, DevelopWhale WordPress, n8n, Content Queue and all existing automations remain unchanged.

Deployment is **manual only** through [GitHub Actions](../../.github/workflows/webhook-retry-lab-staging.yml). The workflow does not deploy when a PR is merged or code is pushed.

The staging resources, when created, will use:
- Worker: `dw-webhook-retry-lab-staging` (default `*.workers.dev` endpoint, **no** custom routes/domains)
- D1: `dw-webhook-retry-lab-staging-20261014`
- D1 binding: `DB`
- Initial schema: imported `drizzle/0000_open_iron_lad.sql`, applied with Wrangler D1 migrations
- Entry point: `staging-worker.mjs`, wrapping the imported Worker to add `X-Robots-Tag: noindex, nofollow, noarchive` on every response
- No migration of existing Sites/D1 usage data. Staging starts empty.

## One-time owner-controlled Cloudflare authentication

1. Verify your Cloudflare account is on a **Workers Free** plan, and the staging experiment can remain within its free D1 and Workers quotas. Do not upgrade or enable billed features.
2. Generate a **scoped Cloudflare API token** for only the target account. It needs Workers Scripts edit and D1 edit; keep permissions as narrow as possible. A token without D1 edit cannot create/migrate a D1 database.
3. In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret** and add:
   - `CLOUDFLARE_ACCOUNT_ID`: the exact Cloudflare account ID
   - `CLOUDFLARE_API_TOKEN`: the scoped API token
   **Never** paste either value into a public Issue, PR, code file or chat.
4. In **Actions → Webhook Retry Lab - manual Cloudflare staging → Run workflow**, enter:
   - `confirmation`: `DEPLOY_STAGING`
   - `billing_confirmation`: `FREE_TIER_CONFIRMED`
5. Review that job's output. The job will run tests and build first, then find/create **only** its staging D1, apply the imported schema, deploy staging Worker, and attempt an HTTP smoke test.

## Safety controls
- `workflow_dispatch` only: no automatic deployment.
- Before authentication: original tests, build, artifact validation and reproducibility checks must pass.
- Separate staging resource names only; no `route`, `zone`, production credentials, original Sites IDs, or original D1 data.
- Staging responds `X-Robots-Tag: noindex, nofollow, noarchive`, even though the original HTML still contains its production canonical and sitemap.
- Credentials injected into only the final deployment step, not the dependency installation/build steps.
- Do not use the staging URL in public marketing or replace WordPress links until live browser QA passes.
- Rollback of *source*: revert this separate PR (original Site not impacted). Remote staging resources are not automatically removed; explicitly decide on deletion later.
- This flow cannot guarantee `0` future fees in a Cloudflare Paid account; do not run unless the Free plan is confirmed.

## Gates after deployment

1. Confirm the actual staging URL and anonymous HTTP GET home with `X-Robots-Tag: noindex`.
2. Test real desktop/mobile browser interaction, retry/duplicate/lost-event presets, comparison and JSON download.
3. Using `?qa=1` and explicit statistics consent, run a test, then verify `/api/metrics` shows **qa** counts. Keep real `external` events separate.
4. Confirm no impact on existing Sites or its database and no new charges.
5. Only after passing QA consider a separate, approved public launch and link migration.

**Not yet validated:** Cloudflare account auth, remote D1 creation, remote migration, deployment, functional browser QA, real visitor acquisition, and revenue.
