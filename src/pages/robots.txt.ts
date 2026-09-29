import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const preview = process.env.CONTEXT === 'deploy-preview';
  const sitemapUrl = new URL('sitemap-index.xml', site ?? 'https://gardencrawl.netlify.app');
  const body = preview
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl.href}\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
