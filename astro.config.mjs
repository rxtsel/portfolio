import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import astroI18next from "astro-i18next";

// https://astro.build/config
export default defineConfig({
  base: "/",
  site: "https://rxtsel.dev",
  integrations: [react(), sitemap(), astroI18next()]
});
