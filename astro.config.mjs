import mdx from '@astrojs/mdx'
import preact from '@astrojs/preact'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import robotsTxt from 'astro-robots-txt'
import { defineConfig } from 'astro/config'

import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Mdx plugins
import rehypeExternalLinks from 'rehype-external-links'

/** @type {import('rehype-external-links').Options} */
const externalLinksOptions = {
  target: '_blank',
  rel: ['noopener', 'noreferrer']
}

// https://astro.build/config
export default defineConfig({
  base: '/',
  site: 'https://rxtsel.dev',
  integrations: [
    sitemap(),
    tailwind(),
    robotsTxt(),
    expressiveCode(),
    mdx({
      rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]]
    }),
    preact()
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]]
  },
  redirects: {
    '/blog/240129-comandos-basicos-de-neovim/': {
      status: 301,
      destination: '/es/blog/basic-commands-for-neovim/'
    },
    '/en/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide':
      {
        status: 301,
        destination:
          '/en/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/'
      },
    'es/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide':
      {
        status: 301,
        destination:
          '/es/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/'
      }
  },
  vite: {
    resolve: {
      alias: {
        '@': join(__dirname, 'src')
      }
    }
  }
})
