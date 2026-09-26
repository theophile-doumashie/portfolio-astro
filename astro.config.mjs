// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://theophile.stagebroad.com',
  integrations: [mdx(), sitemap()],

  fonts: [
      {
          provider: fontProviders.local(),
          name: 'Atkinson',
          cssVariable: '--font-atkinson',
          fallbacks: ['sans-serif'],
          options: {
              variants: [
                  {
                      src: ['./src/assets/fonts/atkinson-regular.woff'],
                      weight: 400,
                      style: 'normal',
                      display: 'swap',
                  },
                  {
                      src: ['./src/assets/fonts/atkinson-bold.woff'],
                      weight: 700,
                      style: 'normal',
                      display: 'swap',
                  },
              ],
          },
      },
	],

  adapter: cloudflare({
    // Le site est entièrement statique et n'a que quelques petites images
    // locales (badges, avatar) : les transformer au build évite de dépendre
    // du binding runtime "IMAGES" (Cloudflare Images), qui n'est pas
    // provisionné dans wrangler.jsonc et renvoyait 404 sur /_image en
    // production alors que le service local du dev server le masquait.
    imageService: 'compile',
  }),
  output: 'static',
});