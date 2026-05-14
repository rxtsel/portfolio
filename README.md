# rxtsel.dev

Personal portfolio and blog, built with Astro.

## Features

- Bilingual content with English and Spanish routes
- Blog with localized posts
- Projects and experience powered by Astro Content Collections
- Content editing through Sveltia CMS
- Dynamic Open Graph images for blog posts
- RSS feeds per locale
- Sitemap and robots.txt
- SEO metadata validation with `astro-seo-graph`
- Light and dark theme support
- Responsive, content-first design
- Consent management with c15t and a self-hosted Cloudflare Worker backend

## Stack

- [Astro](https://astro.build/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
- [@astrojs/rss](https://docs.astro.build/en/guides/rss/)
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [astro-expressive-code](https://expressive-code.com/)
- [@vercel/og](https://vercel.com/docs/og-image-generation)

## Commands

| Command        | Action                                     |
| :------------- | :----------------------------------------- |
| `pnpm install` | Install dependencies                       |
| `pnpm dev`     | Start local dev server at `localhost:4321` |
| `pnpm check`   | Run Astro checks                           |
| `pnpm build`   | Check and build production site to `dist/` |
| `pnpm preview` | Preview production build locally           |
| `pnpm lint`    | Run ESLint with fixes                      |
| `pnpm format`  | Format files with Prettier                 |

## Content

Main content lives in `src/content`:

- `home/` - localized homepage copy
- `projects/` - localized projects
- `experience/` - localized experience
- `blog/` - localized blog posts
- `integrations.md` - Google Tag Manager and AdSense settings
- `stack.md` - stack items
- `tags.md` - taxonomy tags

CMS config lives in `public/cms-rxtsel/config.yml`.

## Runbooks

- [Google integrations](docs/runbooks/0001-google-integrations.md) - GTM, GA4, AdSense, ads.txt, and Search Console notes.
- [Cloudflare Access for Sveltia CMS](docs/runbooks/0002-cloudflare-access-sveltia-cms.md) - Protect the static CMS admin route with Cloudflare Zero Trust.
- [c15t consent](docs/runbooks/0003-c15t-consent.md) - Consent runtime, Cloudflare Worker backend, policy packs, and Google consent integrations.

## License

[Apache-2.0](LICENSE)
