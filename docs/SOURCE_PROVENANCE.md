# Original Webhook Retry Lab source provenance

## Origin and exact version

- Original public Site: https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site/
- Existing introduction: https://www.developwhale.com/webhook-retry-lab-test-duplicate-and-lost-events/
- Retrieval date: 2026-10-14 (Asia/Seoul).
- Official path: Sites `get_site`, `get_site_version`, ordinary source-repository credential, and the supported `site-workflow.mjs` opening operation, with no archive/build/push/publication request. The helper fetched a clean independent checkout from the associated official source repository. No Cloud Browser, HTML reconstruction, or unpublished endpoint was used.
- Saved and deployed version: **3**, confirmed by Sites version provenance.
- Exact source commit: `6d3bce323589353c84ac3dea53f92d5142cb79cd`, confirmed by both the native saved-version response and fetched Git HEAD.
- Coverage: **26 tracked files** at that commit; **24 copied byte-for-byte** to `apps/webhook-retry-lab/`; **2 deliberately omitted live hosting manifests**. All SHA-256 hashes and original Git modes are in `SOURCE_INVENTORY.json`.
- Source Git history, internal repository addresses, credentials, local caches, and live analytics/database rows are not exported. Public Site URLs and canonical/sitemap values in the original assets are retained unchanged.

## Deliberate configuration exclusion

The root and generated `.openai/hosting.json` contained the live Sites project identity, logical `d1: DB`, and `r2: null`. They contained no secret value, but carrying the live project identity into a public migration could target the existing Site in a later publish. Both exact live manifests are excluded. Their hashes are recorded without their content.

`apps/webhook-retry-lab/.openai/hosting.example.json` preserves only the logical DB binding and unused R2 setting, with no project ID, database ID, token, URL credential or connection string. A temporary ignored `.openai/hosting.json` copied from that example is needed by the unchanged original build. The example is not valid production deployment authorization.

No application behavior was rewritten. Existing target README, handoff docs, manual HTTP workflow, and monitoring script are retained; only import/status instructions are updated. No replacement UI, feature or dependency was created. No license is granted or changed by the import; the source tree did not include a license file.

## Actual architecture and dependencies

| Component | Original files / requirements |
| --- | --- |
| Browser UI and simulation | `web/index.html`, `style.css`, `core.js`, `app.js`: buildless HTML/CSS/JavaScript, sequential retry model, comparison table, browser Blob JSON download. No real webhook calls. |
| Optional telemetry | `web/telemetry.js`: opt-in anonymous event reporting; DNT/GPC off switch; sessionStorage preference; QA split via `?qa=1`; broad source enums. No payload, user ID or email collected by application telemetry. |
| Server | `worker/runtime.js`: Cloudflare Worker ESM `fetch`; same-origin POST `/api/events`, GET `/api/metrics`; fixed input schema and bounded body; D1 prepared SQL. `worker/index.js` embeds the original assets. |
| Persistent storage | D1 `DB` binding; `metrics_daily(day,audience,source,event,count)` with composite primary key. Schema and migration metadata are copied from `db/`, `drizzle/`, and `drizzle.config.ts`. No data copied. R2 unused. |
| Build | `scripts/embed.mjs` then `scripts/build.sh`; output `dist/server/index.js`; `scripts/validate-artifact.mjs` parses the emitted Worker ESM. |
| Test | `npm test`: `test.cjs` and `test-worker.mjs`. Worker tests use a mock DB, not the live service. |
| Declared dependencies | No runtime npm dependencies. Exact dev dependencies: `drizzle-kit@0.31.10`, `drizzle-orm@0.45.2`; full transitive pins/integrities retained in `package-lock.json`. |
| Revenue and external integrations | No ads, payment processor, external application API or billing integration in this source. Links to DevelopWhale guides are retained. Hosting processes network metadata outside the app counters. |

## GitHub Pages assessment

Static Pages can host an adapted browser-only simulator, but **cannot host the unchanged full app**: `/api/events`, `/api/metrics`, and persistent D1 counters require a Worker-compatible server and database. The unchanged assets also assume root-relative routes and retain the original canonical/sitemap URLs. A Pages subdirectory deployment would need deliberate routing/SEO changes. None were made here. A future backend/deployment decision needs separate authorization; this PR enables inspection only.

## Validation and limits

- Imported files verified byte-for-byte against the original fetched commit with SHA-256 (24 files).
- Original test suite: 72 simulation combinations, 5 regression cases, 5 rejected invalid inputs; Worker route/origin/body/schema/storage-failure/asset checks pass.
- Local `npm run build` and emitted ESM validator pass with an ignored sanitized local manifest. Built Worker is byte-identical to the imported deployment entrypoint.
- Original D1 migration applied to in-memory SQLite and aggregate upsert checked with synthetic values. This verifies SQL, not live Cloudflare provisioning or analytics ingestion.
- Browser QA, real JSON file receipt/download event, responsive/mobile QA, live analytics ingestion and current public HTTP accessibility: **NOT VERIFIED in this import task**. Prior Work browser credential-state failure is not evidence of universal Site downtime.
- External customers, acquisition, retention, revenue, and billing: **NOT VERIFIED**. Repository import is not a business outcome.
- No CI workflow or scheduling was added; the existing HTTP workflow remains manual-only and was not triggered.
- No original source push, Site save/deploy, WordPress/n8n/Sheets update, live DB access/change, or schedule change was performed. New spending: 0 KRW.
