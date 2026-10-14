// Staging-only wrapper. The original imported Worker stays unmodified.
// Add a response-level noindex directive to ALL routes, including its legacy sitemap.
import original from './dist/server/index.js';

export default {
  async fetch(request, env, ctx) {
    const response = await original.fetch(request, env, ctx);
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    headers.set('Cache-Control', 'no-store');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};
