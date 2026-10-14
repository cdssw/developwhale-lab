# DevelopWhale Lab

A separate, **zero-additional-spend** experiment repository for the DevelopWhale Autonomous Business project.

## First experiment — Webhook Retry Lab
- Reported existing tool: https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site/
- Existing introduction: https://www.developwhale.com/webhook-retry-lab-test-duplicate-and-lost-events/
- [Source handoff and validation gates](docs/SOURCE_HANDOFF.md)

**Status:** GitHub integration read/write verified. The original tool's source code **has not yet been imported**. No GitHub-hosted replacement has been deployed.

## Read-only monitoring
- [Public HTTP smoke check](scripts/check-public.mjs)
- [Manually triggered GitHub Actions workflow](.github/workflows/public-http-check.yml)

The workflow is intentionally **manual only**. It makes an external HTTP request to the reported original tool without credentials or mutations. HTTP PASS is **not** proof that the interactive tool works for anonymous users. A runner access failure may reflect automation/bot restrictions rather than universal downtime.

## Next step
Retrieve the original source via an officially supported Work/Sites export or authorized source connection. Assess actual runtime requirements before choosing static GitHub Pages or another approved deployment method. Then run functional, anonymous-browser, analytics, and download QA separately.

## Safety
No new spending, new product launch, credential commits, unsolicited outreach, or changes to existing WordPress, n8n, or scheduled jobs.
