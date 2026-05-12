// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import seoGraph from "@jdevalk/astro-seo-graph/integration"
import expressiveCode from "astro-expressive-code"
import rehypeExternalLinks from "rehype-external-links"

/** @type {import('rehype-external-links').Options} */
const externalLinksOptions = {
  target: "_blank",
  rel: ["noopener", "noreferrer"],
}

const seoGraphIntegration = /** @type {import("astro").AstroIntegration} */ (
  seoGraph({
    llmsTxt: {
      siteUrl: "https://rxtsel.dev",
      summary:
        "Software Engineer with 3+ years of experience, known for pixel-perfect execution and strong attention to detail.",
      title: "Cristhian Melo",
    },
    validateH1: true,
    validateImageAlt: true,
    validateInternalLinks: true,
    validateMetadataLength: true,
    validateUniqueMetadata: true,
  })
)

// https://astro.build/config
export default defineConfig({
  site: "https://rxtsel.dev",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en-US",
          es: "es-CO",
        },
      },
    }),
    seoGraphIntegration,
    expressiveCode(),
  ],
  markdown: {
    rehypePlugins: [[rehypeExternalLinks, externalLinksOptions]],
  },
})
