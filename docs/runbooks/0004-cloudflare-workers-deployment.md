# Cloudflare Workers Deployment Runbook

## Purpose

This site deploys as a static Astro build to Cloudflare Workers Static Assets through Cloudflare Workers Builds.

Astro stays in static mode. Do not add `@astrojs/cloudflare` unless the site starts using on-demand rendering, server islands, actions, sessions, or Cloudflare runtime bindings.

## Files

- `wrangler.jsonc` configures the Worker named `portfolio`, static asset directory, and custom 404 behavior.
- `public/_headers` configures Cloudflare static asset headers.

## Cloudflare Workers Builds

In Cloudflare Dashboard:

- Go to `Compute` > `Workers & Pages`.
- Create or open the Worker application named `portfolio`.
- Import this Git repository.
- Configure the production branch as `main`.
- Set the build command to `pnpm build`.
- Set the deploy command to `pnpm exec wrangler deploy`.

Cloudflare runs the build and deploy on every push to the configured production branch. If Sveltia CMS commits directly to `main`, that commit also triggers a redeploy.

## Build Variables

Set production build variables in Cloudflare Workers Builds, not in this repository and not in GitHub Actions.

Required variable:

- `PUBLIC_C15T_URL`: Public c15t consent service URL.

Use a normal variable for `PUBLIC_C15T_URL`; it is intentionally public and is inlined into client code by Astro.

## Domain

In Cloudflare:

- Keep DNS for `rxtsel.dev` proxied.
- Attach the custom domain or route `rxtsel.dev/*` to the Worker named `portfolio`.
- Keep Cloudflare Access rules for `/cms-rxtsel`, `/cms-rxtsel/`, and `/cms-rxtsel/*` if the CMS route must stay private.

## Cache Policy

The `_headers` file applies:

- Long immutable cache for Astro hashed assets under `/_astro/*`.
- One-day cache for public root assets such as favicons, images, and manifest files.
- One-hour cache for RSS, sitemap, robots.txt, and ads.txt.
- `no-store` for `/cms-rxtsel/*`.

If a public asset must be cached for one year, give it a content-hashed filename first.

## 404 Behavior

`wrangler.jsonc` uses `not_found_handling: "404-page"` so Cloudflare serves the generated `dist/404.html` for missing static asset routes.

## Local Preview

Build the site, then preview it through Wrangler:

```sh
pnpm build && pnpm exec wrangler dev
```

## Manual Deploy

Manual deploy is optional. Cloudflare Workers Builds is the production deploy path.

```sh
pnpm build && pnpm exec wrangler deploy
```

## Migration Notes

- `public/CNAME` is not needed. GitHub Pages used it, but Cloudflare uses DNS plus Worker custom domains or routes.
- GitHub Actions deploy is not used for production. Cloudflare Workers Builds owns CI/CD.
- The Astro Cloudflare adapter is intentionally not installed because this project builds static output.
