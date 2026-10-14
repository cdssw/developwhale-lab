# DevelopWhale Lab

Independent, low-cost developer tools and practical reliability experiments from [DevelopWhale](https://www.developwhale.com/).

## Webhook Retry Lab — free interactive simulator

**[Open Webhook Retry Lab](https://dw-webhook-retry-lab-public.cdssw.workers.dev/)**

What happens if a webhook is delivered more than once, or if your worker crashes at the worst possible time? Use this free browser-based simulator to:

- Replay the same logical webhook event with multiple deliveries.
- Compare no deduplication, an early *seen* flag, and a state ledger with a recoverable lease.
- Move a simulated crash before or after the destination action.
- Toggle destination-side idempotency to understand why exactly-once effects are difficult.
- Compare all three strategies and download a local JSON scenario report.

**No signup, API key, real webhook calls, or payload submission required.** The simulator is educational, not a proof of production exactly-once delivery or a security audit. Anonymous aggregate statistics are opt-in.

### Published status

- **Public application:** https://dw-webhook-retry-lab-public.cdssw.workers.dev/
- **Source:** [apps/webhook-retry-lab](apps/webhook-retry-lab/) — originally preserved from the official ChatGPT Sites v3 project.
- **Build/tests:** [original source CI](.github/workflows/webhook-retry-lab-ci.yml) and [Chromium end-to-end QA](.github/workflows/staging-browser-qa.yml)
- **Hosting:** independent Cloudflare Worker and D1 database, separate from the original ChatGPT Site and from staging
- **Public release workflow:** [isolated deploy](.github/workflows/webhook-retry-lab-public.yml)
- **Release process, limitations and provenance:** [PUBLIC_RELEASE.md](apps/webhook-retry-lab/PUBLIC_RELEASE.md) · [SOURCE_PROVENANCE.md](docs/SOURCE_PROVENANCE.md)
- **Existing DevelopWhale introduction:** https://www.developwhale.com/webhook-retry-lab-test-duplicate-and-lost-events/

### Trust and measurement

The original Sites deployment is preserved and unchanged. The new public Worker has its own self-canonical URL, robots and sitemap. The isolated staging Worker remains noindexed. Real browser tests verify the simulation, JSON download, mobile responsiveness and QA-only D1 events. Tests are not evidence of real user acquisition or revenue. No payment integration is active.

### Local development

```sh
cd apps/webhook-retry-lab
npm ci
cp .openai/hosting.example.json .openai/hosting.json
npm test
npm run build
node scripts/validate-artifact.mjs
```

The example local hosting file contains no live credentials or Cloudflare project IDs.

### Operating boundaries

This project aims for zero incremental spending. No existing DevelopWhale WordPress publication, n8n, scheduled work or original Sites deployment is modified by the GitHub release workflow. Do not commit secrets or production analytics.
