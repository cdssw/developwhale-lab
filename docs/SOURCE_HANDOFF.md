# Webhook Retry Lab — Source handoff and validation gate

Status: **ORIGINAL SOURCE IMPORTED ON THE PR BRANCH. NOT DEPLOYED FROM GITHUB.**

## Known references
- Source-of-truth GitHub repository: https://github.com/cdssw/developwhale-lab
- Reported existing tool: https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site/
- Existing introduction: https://www.developwhale.com/webhook-retry-lab-test-duplicate-and-lost-events/

## Verified versus unverified
- GitHub repository and README are readable.
- Original Sites version 3 source has been imported into `apps/webhook-retry-lab` on the PR branch using official Sites source access.
- The source commit is `6d3bce323589353c84ac3dea53f92d5142cb79cd`; 24 files are copied byte-for-byte. Two live hosting manifests are intentionally omitted. See [provenance](SOURCE_PROVENANCE.md) and [inventory](SOURCE_INVENTORY.json).
- Original simulation/API tests and local build/artifact validation pass. D1 schema migration is validated against local in-memory SQLite. No deployed database was read or copied for this import.
- An external user-facing browser QA pass is **not** established here.
- No customer visits or revenue have been verified in this repository.

## Next steps for an authorized AI agent
1. Source retrieval is complete. Preserve the documented original snapshot; do not reverse-engineer private APIs or fabricate equivalent source.
2. Review the actual project structure, runtime, licensing, secrets, third-party services, persistence, and telemetry. Never commit credentials or private analytics data.
3. Determine whether GitHub Pages can actually host the tool. Pages supports static assets; any server-side API/database requirements need an appropriate separate runtime.
4. The actual source is isolated in `apps/webhook-retry-lab`. Re-run its tests before proposing any future change.
5. Verify public anonymous browser access, retry/duplicate/lost-event simulation, export/download, responsive design, and event tracking. Distinguish synthetic QA data from genuine usage.
6. Deploy only after verifying the replacement URL, and preserve the existing site unless explicitly approved otherwise.
7. Make distribution and monetization decisions using real visitor behavior and revenue evidence, not repository creation or smoke tests.

## Safety
- New spending: 0 KRW.
- Do not modify existing DevelopWhale WordPress, n8n, scheduled operations, or analytics without explicit authorization.
- Do not bypass platform security, user authentication, CAPTCHAs, or unpublished interfaces.
- No spam or unsolicited contact.

