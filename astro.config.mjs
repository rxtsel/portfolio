import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import expressiveCode from 'astro-expressive-code'
import mdx from '@astrojs/mdx'
import robotsTxt from 'astro-robots-txt'

// Mdx plugins
import rehypeExternalLinks from 'rehype-external-links'
import starlight from '@astrojs/starlight'

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
    expressiveCode({
      themes: ['github-dark', 'solarized-dark'],
      styleOverrides: {
        frames: {
          shadowColor: 'transparent',
          editorBackground: 'transparent',
          editorTabBarBackground: '#262626',
          editorTabBarBorderColor: 'transparent',
          editorActiveTabBackground: '#1d1d1d',
          editorActiveTabIndicatorTopColor: '#4895EF',
          tooltipSuccessBackground: '#4895EF',
          terminalBackground: '#1d1d1d',
          terminalBorder: 'transparent',
          terminalTabActiveBorder: '#4895EF',
          terminalTabActiveBackground: '#1d1d1d',
          terminalTitlebarBackground: '#1d1d1d'
        },
        borderColor: '#262626',
        borderRadius: '0.375rem'
      }
    }),
    mdx({
      rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]]
    })
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]]
  },
  redirects: {
    '/blog/240129-comandos-basicos-de-neovim/': {
      status: 301,
      destination: '/es/blog/basic-commands-for-neovim/'
    }
  }
})
