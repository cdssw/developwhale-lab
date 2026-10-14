#!/usr/bin/env bash
# Manually invoked GitHub Actions staging deployment only.
# Never use production Sites identity, production D1, routes, or zones.
set -euo pipefail

[[ "${DEPLOY_CONFIRMATION:-}" == "DEPLOY_STAGING" ]] || { echo "::error::Explicit DEPLOY_STAGING confirmation required"; exit 1; }
[[ "${FREE_TIER_CONFIRMATION:-}" == "FREE_TIER_CONFIRMED" ]] || { echo "::error::Confirm that the selected Cloudflare account is on the free tier"; exit 1; }
[[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]] || { echo "::error::Set both Cloudflare GitHub Actions secrets"; exit 1; }
command -v wrangler >/dev/null || { echo "::error::Wrangler CLI was not installed"; exit 1; }

cd "$(dirname "$0")/.."
DB_NAME="dw-webhook-retry-lab-staging-20261014"
WORKER_NAME="dw-webhook-retry-lab-staging"
export DB_NAME WORKER_NAME

# Wrangler --json should return a JSON array. Fail closed for unexpected shapes.
find_db_id() {
  node --input-type=module -e '
    import fs from "node:fs";
    const parsed = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    if (!Array.isArray(parsed)) throw new Error("Unexpected wrangler D1 list response; refusing to deploy");
    const matched = parsed.filter(row => row && row.name === process.env.DB_NAME);
    if (matched.length > 1) throw new Error("Duplicate staging database names; refusing to deploy");
    const id = matched.length ? matched[0].uuid ?? matched[0].id : "";
    if (id && !/^[0-9a-fA-F-]{36}$/.test(id)) throw new Error("Malformed staging D1 ID");
    console.log(id);
  ' "$1"
}

wrangler d1 list --json > /tmp/dw-staging-d1-list.json
DB_ID="$(find_db_id /tmp/dw-staging-d1-list.json)"
if [[ -z "$DB_ID" ]]; then
  echo "Creating isolated staging-only D1: $DB_NAME"
  wrangler d1 create "$DB_NAME"
  wrangler d1 list --json > /tmp/dw-staging-d1-list.json
  DB_ID="$(find_db_id /tmp/dw-staging-d1-list.json)"
fi
[[ -n "$DB_ID" ]] || { echo "::error::Staging database could not be resolved"; exit 1; }

# Generate a local, git-ignored configuration with only the isolated staging D1.
# Does not include the original Sites deployment manifest or a domain route.
DB_ID="$DB_ID" node --input-type=module -e '
  import fs from "node:fs";
  const config = {
    name: process.env.WORKER_NAME,
    main: "./staging-worker.mjs",
    compatibility_date: "2026-10-14",
    workers_dev: true,
    d1_databases: [{
      binding: "DB",
      database_name: process.env.DB_NAME,
      database_id: process.env.DB_ID,
      migrations_dir: "drizzle"
    }]
  };
  fs.writeFileSync("wrangler.staging.generated.json", JSON.stringify(config, null, 2));
'

# The local original SQL migration is applied ONLY to the staging database.
wrangler d1 migrations apply "$DB_NAME" --remote --config ./wrangler.staging.generated.json
wrangler deploy --config ./wrangler.staging.generated.json | tee /tmp/dw-staging-deploy.log

# Resolve the reported worker.dev URL from the deployment output.
URL="$(grep -Eo 'https://[A-Za-z0-9.-]+\\.workers\\.dev/?' /tmp/dw-staging-deploy.log | head -n 1 || true)"
if [[ -z "$URL" ]]; then
  echo "::warning::Deployed, but URL not detected in output. Verify the staging URL in Cloudflare dashboard."
  exit 1
fi
URL="${URL%/}"
echo "Staging URL: $URL"
[[ -n "${GITHUB_STEP_SUMMARY:-}" ]] && echo "Staging Worker: $URL" >> "$GITHUB_STEP_SUMMARY"

# HTTP-level smoke tests are NOT interactive browser QA.
curl --fail --silent --show-error --max-time 20 --retry 2 --dump-header /tmp/dw-staging-headers -o /tmp/dw-staging-home "$URL/"
grep -qi '^x-robots-tag: noindex' /tmp/dw-staging-headers || { echo "::error::Staging noindex header missing"; exit 1; }
grep -q 'Webhook Retry' /tmp/dw-staging-home || { echo "::error::Expected simulator HTML not found"; exit 1; }

curl --fail --silent --show-error --max-time 20 "$URL/api/metrics" > /tmp/dw-staging-metrics.json
node --input-type=module -e '
  import fs from "node:fs";
  const response = JSON.parse(fs.readFileSync("/tmp/dw-staging-metrics.json","utf8"));
  if (!Array.isArray(response.rows)) throw new Error("Metrics API did not return rows");
  if (response.rows.length !== 0) throw new Error("Staging database is not empty; manual audit required");
'
echo "PASS: isolated staging Worker, noindex HTTP response and empty D1 metrics API."
echo "Still required: human/independent anonymous browser QA, interactive simulator and JSON download."
