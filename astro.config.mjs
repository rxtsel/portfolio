import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
  base: "/",
  site: "https://rxtsel.dev",
  integrations: [sitemap(), astroI18next()],
  trailingSlash: "never",
});
