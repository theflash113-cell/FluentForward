import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Netlify sets URL to the live address during builds.
const site = process.env.URL || 'https://fluentforward.netlify.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/(booking-confirmed|subscribed|students|404)\/?$/.test(page) })],
});
