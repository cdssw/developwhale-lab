#!/usr/bin/env bash
# Idempotent isolated public Worker + D1 release; original Sites/WordPress unaffected.
# Execute ONLY from the owner-approved release workflow, with account-scoped secrets.
set -euo pipefail
[[ "${PUBLIC_RELEASE_CONFIRMED:-}" == "PUBLIC_RELEASE_20261015" ]] || {
  echo "::error::Explicit public release confirmation missing"
  exit 1
}
[[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || {
  echo "::error::Cloudflare credentials must be configured as GitHub Secrets"
  exit 1
}
command -v wrangler >/dev/null || { echo "::error::Wrangler CLI missing"; exit 1; }
cd "$(dirname "$0")/.."

# Public resources are distinct from both original Sites v3 and staging.
DB_NAME='dw-webhook-retry-lab-public-20261015'
WORKER_NAME='dw-webhook-retry-lab-public'
export DB_NAME WORKER_NAME

wrangler d1 list --json > /tmp/dw-public-d1-list.json
resolve_db_id() {
 node --input-type=module -e '
 import fs from "node:fs";
 const data = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
 if (!Array.isArray(data)) throw new Error("Unexpected D1 list format");
 const matches = data.filter(row => row.name === process.env.DB_NAME);
 if (matches.length > 1) throw new Error("Multiple matching public D1 names");
 const id = matches.length ? matches[0].uuid ?? matches[0].id : "";
 if (id && !/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Invalid D1 UUID");
 console.log(id);
 ' "$1"
}
DB_ID="$(resolve_db_id /tmp/dw-public-d1-list.json)"
if [[ -z "$DB_ID" ]]; then
 echo "Creating NEW isolated public D1 (original Sites/staging untouched)"
 wrangler d1 create "$DB_NAME"
 wrangler d1 list --json > /tmp/dw-public-d1-list.json
 DB_ID="$(resolve_db_id /tmp/dw-public-d1-list.json)"
fi
[[ -n "$DB_ID" ]] || { echo "::error::Could not resolve public D1"; exit 1; }

# Git-ignored transient config; never use an old Sites or staging D1 ID.
DB_ID="$DB_ID" node --input-type=module -e '
 import fs from "node:fs";
 fs.writeFileSync("wrangler.public.generated.json", JSON.stringify({
  name: process.env.WORKER_NAME,
  main: "./public-worker.mjs",
  compatibility_date: "2026-10-14",
  workers_dev: true,
  d1_databases: [{
   binding: "DB",
   database_name: process.env.DB_NAME,
   database_id: process.env.DB_ID,
   migrations_dir: "drizzle"
  }]
 }, null, 2));
'
wrangler d1 migrations apply "$DB_NAME" --remote --config ./wrangler.public.generated.json
wrangler deploy --config ./wrangler.public.generated.json | tee /tmp/dw-public-deploy.log

URL="$(grep -Eo 'https://[A-Za-z0-9.-]+\.workers\.dev/?' /tmp/dw-public-deploy.log | head -n 1 || true)"
[[ -n "$URL" ]] || { echo "::error::Unable to find public Worker URL"; exit 1; }
URL="${URL%/}"
[[ "$URL" == https://dw-webhook-retry-lab-public.*.workers.dev ]] || { echo "::error::Unexpected Worker URL"; exit 1; }
echo "PUBLIC_URL=$URL" >> "$GITHUB_ENV"
echo "Public (new URL only; no WordPress redirect): $URL" >> "$GITHUB_STEP_SUMMARY"

# Workers routes can briefly return 404 immediately after first deployment.
code=''
for attempt in {1..12}; do
  code="$(curl --silent --max-time 12 --dump-header /tmp/dw-public-headers -o /tmp/dw-public-home --write-out '%{http_code}' "$URL/" || true)"
  if [[ "$code" == "200" ]]; then break; fi
  echo "Waiting for new Workers URL to propagate (attempt $attempt, HTTP $code)"
  sleep 5
done
[[ "$code" == '200' ]] || { echo "::error::Public Worker did not become reachable (HTTP $code)"; exit 1; }
grep -q 'Webhook Retry' /tmp/dw-public-home
grep -Fq '<link rel="canonical" href="'$URL'/"' /tmp/dw-public-home || { echo "::error::Canonical URL mismatch"; exit 1; }
if grep -qi '^x-robots-tag: noindex' /tmp/dw-public-headers; then echo "::error::Unexpected noindex"; exit 1; fi
curl --fail --silent --show-error --max-time 20 "$URL/sitemap.xml" | grep -Fq "$URL/" || { echo "::error::Sitemap not updated"; exit 1; }
curl --fail --silent --show-error --max-time 20 "$URL/robots.txt" | grep -Fq "$URL/sitemap.xml" || { echo "::error::Robots sitemap mismatch"; exit 1; }
curl --fail --silent --show-error --max-time 20 "$URL/api/metrics" > /tmp/dw-public-metrics.json
node --input-type=module -e '
 import fs from "node:fs";
 const data = JSON.parse(fs.readFileSync("/tmp/dw-public-metrics.json","utf8"));
 if (!Array.isArray(data.rows)) throw new Error("Metrics did not return rows");
'
echo "PASS: public HTTP, self canonical, sitemap, robots and D1 endpoint"
