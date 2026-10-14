# Public release authorization — Webhook Retry Lab

This file is the explicit, one-time GitHub Actions release marker. The workflow watches for **this file path being introduced or changed on master**. Other application commits do not automatically redeploy production.

Approved release scope:
- Deploy existing Webhook Retry Lab v3 source to a **new**, independent Cloudflare Worker: `dw-webhook-retry-lab-public`.
- Create a **new**, independent D1 database named `dw-webhook-retry-lab-public-20261015`.
- Use existing Cloudflare credentials already stored in repository Actions secrets; do not expose them in code.
- Self-canonical, sitemap and robots on the new workers.dev URL.
- Perform HTTP and Chromium functional tests with `?qa=1` telemetry.
- Existing Sites v3, WordPress, n8n, analytics queues, schedules, and staging remain unchanged.
- No additional spending or Cloudflare plan upgrade. Abort on a billing or permission demand.
- Do not automatically submit directories, post to communities, or send email.
- Report new independent URL and release evidence before any migration of existing inbound links.

This release does **not** validate customer acquisition or create a revenue integration.
