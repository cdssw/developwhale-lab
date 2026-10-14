# DevelopWhale Lab

A separate, **zero-additional-spend** experiment repository for the DevelopWhale Autonomous Business project.

## First experiment — Webhook Retry Lab
- Reported existing tool: https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site/
- Existing introduction: https://www.developwhale.com/webhook-retry-lab-test-duplicate-and-lost-events/
- [Source handoff and validation gates](docs/SOURCE_HANDOFF.md)

**Status:** Original Sites version 3 source is preserved in [apps/webhook-retry-lab](apps/webhook-retry-lab). No GitHub-hosted replacement has been deployed. See [provenance and runtime assessment](docs/SOURCE_PROVENANCE.md) and the [file inventory](docs/SOURCE_INVENTORY.json).

## Read-only monitoring
- [Public HTTP smoke check](scripts/check-public.mjs)
- [Manually triggered GitHub Actions workflow](.github/workflows/public-http-check.yml)

The workflow is intentionally **manual only**. It makes an external HTTP request to the reported original tool without credentials or mutations. HTTP PASS is **not** proof that the interactive tool works for anonymous users. A runner access failure may reflect automation/bot restrictions rather than universal downtime.

## Next step
The original source has been retrieved through the official Sites source helper. Full functionality includes a Worker API and D1 aggregate storage, so static GitHub Pages alone cannot preserve all existing functionality. Future hosting or deployment requires a separate authorized task. Anonymous-browser, analytics, download, acquisition, and billing QA remain separate gates.

## Safety
No new spending, new product launch, credential commits, unsolicited outreach, or changes to existing WordPress, n8n, or scheduled jobs.


## Run the imported original locally

```sh
cd apps/webhook-retry-lab
npm ci
cp .openai/hosting.example.json .openai/hosting.json
npm test
npm run build
node scripts/validate-artifact.mjs
```

The example hosting file contains only logical bindings and **no live project identity**. It is sufficient for the local build and artifact validator; it is not a deployable production configuration. Do not add the old project's identity or deploy without new authorization. Tests/build use Node and Bash; Drizzle is needed only for `npm run db:generate`. The import was validated with Node 24.19.0. No runtime npm dependencies are declared.

The original app README is copied unchanged as provenance and may contain historical operational instructions. Current limits in this repository and Issue #1 take precedence: source preservation only, no deployment or operator activation.
