# DevelopWhale Webhook Retry Lab

Phase 1 isolated experiment. Static HTML/CSS/JavaScript, no dependencies, no backend, no API keys, no forms for personal information, no paid calls, no production WordPress changes.

Run `node test.cjs` for model tests. The scenario uses sequential deliveries and assumes a recoverable expired lease; it does not prove exactly-once delivery or validate production systems.

Revenue hypothesis: useful interactive reliability explanations can send relevant readers to DevelopWhale's existing monetized guides. This is unvalidated. The tool contains no new ads, payment integration or affiliate claims.

Distribution: publicly accessible search-oriented page, sitemap, crawlable explanation and links to existing guides. Search indexing and audience are not guaranteed. No forum automation, outreach or external sales account.

Measurement limitation: this release collects no usage events or personal data. Hosting publication and automated QA can be verified; external simulator runs cannot yet be counted. Existing DevelopWhale GA4/AdSense collections may measure downstream guide activity but cannot attribute incremental revenue without additional measurement configuration.

Decision rule: after approved distribution and aggregate measurement exist, observe for 14 days. No relevant visits means revisit distribution before building another product. At least 30 relevant visits with no simulator use means improve the interaction and promise. Revenue must be measured separately from visits. Existing operations and schedules are not modified.

## Phase 1B operation
Existing experiment migrated to a dependency-free Worker runtime with a Sites-managed D1 binding (`DB`). Drizzle is build-time only. No webhook payloads or scenario settings leave the browser. Opt-in telemetry saves UTC day, QA/external flag, coarse source, event, aggregate count only. SessionStorage stores a tab-session preference and a once-per-tab visit flag; it is not a unique-person metric. Browser DNT/GPC disables statistics. No ad/payment/revenue integration.

QA always uses `?qa=1`; external discovery links never use that parameter. `/api/metrics` exposes only anonymous 14-day aggregates; native Sites database tools provide read-only operator access. Counts are unverified client reports, consent-biased, capped at 100 events per page load; download records a request, not confirmed file receipt. A telemetry failure does not disable the simulator. Hosting infrastructure may process network metadata outside the application statistics database.

14-day hypothesis: contextual links from the DevelopWhale homepage and two relevant guides bring readers who run and complete a scenario. Keep changes to one major hypothesis at a time. At day 14: fewer than 20 consented external sessions means insufficient discovery, not disproven demand; change only discovery copy/placement within remaining authorization or propose the next channel. At least 20 sessions with fewer than 4 runs suggests explanation/useability work. At least 4 runs but no downloads/guide clicks means weak next-step value; test one explanation change. No actual revenue is reported as success. No new accounts, paid APIs, outreach, payment integration or production SEO/automation modifications.
