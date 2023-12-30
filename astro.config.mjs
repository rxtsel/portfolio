import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  base: '/',
  site: 'https://rxtsel.dev',
  integrations: [sitemap(), tailwind()],
  trailingSlash: 'never'
})

