// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import site from './src/content/site.json' with { type: 'json' };

// The live domain comes from src/content/site.json → "url".
export default defineConfig({
  site: site.url,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
  build: { inlineStylesheets: 'auto' },
});
