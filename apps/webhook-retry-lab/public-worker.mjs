// Public Cloudflare Worker: reuses exact original Sites v3 application logic.
// Only public URL metadata is adjusted at response time; imported source is unchanged.
// This Worker intentionally DOES NOT use the original Sites project or staging D1 binding.
import original from './dist/server/index.js';

const sourceOrigin = 'https://developwhale-webhook-retry-lab.regal-pony-1762.chatgpt.site';
const publicOrigin = 'https://dw-webhook-retry-lab-public.cdssw.workers.dev';
const seoDocuments = new Set(['/', '/robots.txt', '/sitemap.xml']);

export default {
  async fetch(request, env, ctx) {
    const response = await original.fetch(request, env, ctx);
    const { pathname } = new URL(request.url);
    if (request.method !== 'GET' || !seoDocuments.has(pathname) || !response.ok) {
      return response;
    }
    const originalContent = await response.text();
    const publicContent = originalContent.replaceAll(sourceOrigin, publicOrigin);
    const headers = new Headers(response.headers);
    headers.delete('Content-Length');
    headers.delete('X-Robots-Tag');
    return new Response(publicContent, {
      status: response.status,
      statusText: response.statusText,
      headers
    });
  }
};
