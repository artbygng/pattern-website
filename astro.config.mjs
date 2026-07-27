import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://artbygng.com',
  integrations: [mdx(), sitemap()],
  // Static output — Vercel serves this as a static site, no adapter needed.
  // If you ever need server-side rendering, add @astrojs/vercel and uncomment:
  // output: 'server',
  // adapter: vercel(),
});
