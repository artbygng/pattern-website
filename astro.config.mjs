import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://artbygng.com',
  // Static output — Vercel serves this as a static site, no adapter needed.
  // If you ever need server-side rendering, add @astrojs/vercel and uncomment:
  // output: 'server',
  // adapter: vercel(),
});
