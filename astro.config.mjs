// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import sitemap from "@astrojs/sitemap"
import seoGraph from "@jdevalk/astro-seo-graph/integration"

const seoGraphIntegration = /** @type {import("astro").AstroIntegration} */ (
  seoGraph({
    llmsTxt: {
      siteUrl: "https://rxtsel.dev",
      summary:
        "Software Engineer with 4+ years of experience, known for pixel-perfect execution and strong attention to detail.",
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
  ],
})
