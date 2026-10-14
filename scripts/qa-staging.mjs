// Browser-level QA against the isolated Cloudflare staging Worker only.
// This does not launch the production site, change settings, or create a customer event.
// Every telemetry-producing request uses ?qa=1 and records audience=qa.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const base = process.env.LAB_QA_BASE_URL || 'https://dw-webhook-retry-lab-staging.cdssw.workers.dev';
const browser = await chromium.launch({ headless: true });
let checks = 0;
const mark = (s) => { checks++; console.log('PASS:', s); };

const qaCount = (rows, event) => rows
  .filter(row => row.audience === 'qa' && row.event === event)
  .reduce((sum, row) => sum + Number(row.count || 0), 0);

try {
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();
  const jsErrors = [];
  page.on('pageerror', error => jsErrors.push(error.message));
  const response = await page.goto(base + '/?qa=1', { waitUntil: 'networkidle', timeout: 60000 });
  assert.equal(response?.status(), 200, 'staging homepage should be HTTP 200');
  if (process.env.LAB_EXPECT_NOINDEX === '0') {
    assert.doesNotMatch(response.headers()['x-robots-tag'] || '', /noindex/i);
  } else {
    assert.match(response.headers()['x-robots-tag'] || '', /noindex/i);
  }
  assert.match((await page.title()), /Webhook Retry/i);
  mark('anonymous browser homepage, title and expected indexing mode');

  const baselineResp = await context.request.get(base + '/api/metrics');
  assert.equal(baselineResp.status(), 200);
  const baseline = await baselineResp.json();
  assert.ok(Array.isArray(baseline.rows));
  const beforeDownload = qaCount(baseline.rows, 'download');
  mark('D1 metrics endpoint returns structured counts');

  await page.getByRole('button', { name: 'Allow anonymous statistics' }).click();
  assert.match(await page.locator('#statsStatus').innerText(), /enabled/i);
  await page.getByRole('button', { name: /Run the replay/ }).click();
  assert.equal(await page.locator('#runStatus').innerText(), 'SIMULATION COMPLETE');
  assert.match(await page.locator('#result').innerText(), /Business actions/);
  mark('simulation runs and presents result');

  for (const [preset, message] of [
    ['duplicate', /The action happened more than once/],
    ['lost', /The event was lost/],
    ['recovered', /One action in this scenario/],
  ]) {
    await page.locator('button[data-preset="' + preset + '"]').click();
    assert.match(await page.locator('#result h2').innerText(), message);
    mark(preset + ' scenario renders expected outcome');
  }

  await page.getByRole('button', { name: 'Compare all three patterns' }).click();
  assert.equal(await page.locator('#comparison table tr').count(), 4);
  mark('comparison table displays all three strategies');

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download the scenario report' }).click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), 'webhook-retry-scenario.json');
  const diskPath = await download.path();
  assert.ok(diskPath, 'downloaded file must exist');
  const body = JSON.parse(await readFile(diskPath, 'utf8'));
  assert.ok(body.event && body.scenario && Array.isArray(body.timeline));
  assert.ok(['lost', 'duplicate', 'one-action'].includes(body.outcome));
  mark('real JSON download is received and parses');

  let afterDownload = beforeDownload;
  for (let attempt = 0; attempt < 12 && afterDownload < beforeDownload + 1; attempt++) {
    await page.waitForTimeout(400);
    const latest = await context.request.get(base + '/api/metrics');
    assert.equal(latest.status(), 200);
    afterDownload = qaCount((await latest.json()).rows, 'download');
  }
  assert.ok(afterDownload >= beforeDownload + 1, 'D1 qa download count did not increase');
  mark('D1 download telemetry increments under qa audience');

  assert.deepEqual(jsErrors, [], 'page JavaScript errors');
  mark('no browser JavaScript exceptions');

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    isMobile: true,
    hasTouch: true,
  });
  const mpage = await mobile.newPage();
  const mobileResponse = await mpage.goto(base + '/?qa=1', { waitUntil: 'networkidle' });
  assert.equal(mobileResponse?.status(), 200);
  const width = await mpage.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  assert.ok(width.scroll <= width.client + 3, 'horizontal overflow on mobile: ' + JSON.stringify(width));
  assert.ok(await mpage.getByRole('button', { name: /Run the replay/ }).isVisible());
  mark('mobile viewport has no horizontal overflow and simulator action visible');
  await mobile.close();
  await context.close();
  console.log(JSON.stringify({ result: 'PASS', browserChecks: checks, telemetry: { qa_download_before: beforeDownload, qa_download_after: afterDownload } }, null, 2));
} finally {
  await browser.close();
}
