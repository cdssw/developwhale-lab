// Read-only HTTP check for the original Webhook Retry Lab URL.
// HTTP success does NOT prove the interactive product is usable.
const url = process.env.SITE_URL ||
  "https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site/";

const controller = new AbortController();
const deadline = setTimeout(() => controller.abort(), 12000);

try {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    signal: controller.signal,
    headers: { Accept: "text/html" }
  });
  const contentType = response.headers.get("content-type") || "";
  const body = (await response.text()).slice(0, 200000);
  const challenge = /<title>\s*Just a moment|Checking your browser|Error 1010|Access denied|Attention Required!\s*\|\s*Cloudflare/i.test(body);
  const pass = response.ok && /text\/html|application\/xhtml\+xml/i.test(contentType) && !challenge;

  console.log(JSON.stringify({
    checkedUrl: url,
    resolvedUrl: response.url,
    httpStatus: response.status,
    contentType,
    challengeDetected: challenge,
    httpSmokeCheck: pass ? "PASS" : "BLOCKED"
  }, null, 2));

  if (!pass) {
    console.error("Not a verified public HTML response from this runner. Do not infer that all human browsers are blocked.");
    process.exitCode = 1;
  } else {
    console.log("HTTP only; separately verify anonymous browser interaction and downloads.");
  }
} catch (error) {
  console.error("BLOCKED: " + (error?.message || String(error)));
  process.exitCode = 1;
} finally {
  clearTimeout(deadline);
}
