// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig, envField } from "astro/config"
import sitemap from "@astrojs/sitemap"
import seoGraph from "@jdevalk/astro-seo-graph/integration"
import expressiveCode from "astro-expressive-code"
import rehypeExternalLinks from "rehype-external-links"
import { redirects } from "./src/lib/redirects.ts"

/** @type {import('rehype-external-links').Options} */
const externalLinksOptions = {
  target: "_blank",
  rel: ["noopener", "noreferrer"],
}

const seoGraphIntegration = /** @type {import("astro").AstroIntegration} */ (
  seoGraph({
    validateH1: true,
    validateImageAlt: true,
    validateInternalLinks: true,
    validateMetadataLength: {
      title: { min: 30, max: 100 },
      description: { min: 70, max: 200 },
    },
    validateUniqueMetadata: true,
  })
)

// https://astro.build/config
export default defineConfig({
  site: "https://rxtsel.dev",
  build: {
    inlineStylesheets: "always",
  },
  env: {
    schema: {
      PUBLIC_C15T_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
    },
  },
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
  redirects,
})
