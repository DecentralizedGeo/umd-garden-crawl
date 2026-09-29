// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = 'https://gardencrawl.easierdata.org';

// https://astro.build/config
export default defineConfig({
  site,
  integrations: [sitemap()],
});
