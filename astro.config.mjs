// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const canonicalSite = 'https://gardencrawl.netlify.app';
const site =
  process.env.CONTEXT === 'production' && process.env.URL
    ? process.env.URL
    : canonicalSite;

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
});
