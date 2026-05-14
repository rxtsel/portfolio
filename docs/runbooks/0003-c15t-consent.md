# c15t Consent Runbook

## Architecture

- `src/components/ConsentManager.astro` mounts the browser consent runtime.
- `src/integrations/c15t` owns c15t client setup, scripts, and DOM UI.
- `src/integrations/google` owns Google vendor script definitions.
- `worker` owns the self-hosted c15t backend for Cloudflare Workers.
- `worker/schema/c15t.ts` is the generated Drizzle schema for c15t `2.1.0`.

## Runtime Behavior

- Frontend uses c15t hosted mode through `PUBLIC_C15T_URL`.
- Backend uses Cloudflare Workers and Turso through Drizzle/libSQL.
- Regional behavior is resolved by backend policy packs:
  - Europe opt-in.
  - California opt-out.
  - No banner elsewhere.
- Google Tag Manager uses c15t's built-in GTM integration with `alwaysLoad` and Consent Mode v2.
- Google AdSense is gated behind the `marketing` category.
- GTM `noscript` is not rendered because it cannot respect JavaScript-managed consent.

## Environment

Set frontend env:

```txt
PUBLIC_C15T_URL=https://your-consent-worker.example.com/api/c15t
```

Set Cloudflare Worker secrets:

```sh
wrangler secret put C15T_DATABASE_URL
wrangler secret put C15T_DATABASE_AUTH_TOKEN
wrangler secret put C15T_TRUSTED_ORIGINS
wrangler secret put C15T_POLICY_SIGNING_KEY
```

Use comma-separated origins for `C15T_TRUSTED_ORIGINS`:

```txt
https://rxtsel.dev,http://localhost:4321
```

For local Drizzle migrations, omit `C15T_DATABASE_URL` or set:

```txt
C15T_DATABASE_URL=file:c15t.local.sqlite
C15T_DATABASE_AUTH_TOKEN=
```

The local database is created at the repository root and ignored by `*.sqlite` in `.gitignore`.

Cloudflare Workers cannot read `file:` SQLite URLs. For `pnpm worker:dev`, create `.dev.vars` from `.dev.vars.example` and use a Turso/libSQL URL:

```txt
C15T_DATABASE_URL=libsql://your-database.turso.io
C15T_DATABASE_AUTH_TOKEN=your-turso-token
C15T_TRUSTED_ORIGINS=http://localhost:4321
C15T_POLICY_SIGNING_KEY=replace-with-at-least-32-random-characters
```

If you want a fully local Worker database, run a local libSQL server and set `C15T_DATABASE_URL` to its `http://` or `ws://` endpoint. Do not use `file:` for Worker runtime.

## Database

The Worker expects Turso/libSQL with the c15t schema from `worker/schema/c15t.ts`.

Generate SQL migrations from the c15t Drizzle schema:

```sh
pnpm db:generate
```

Apply migrations to Turso after `C15T_DATABASE_URL` and `C15T_DATABASE_AUTH_TOKEN` are set:

```sh
pnpm db:migrate
```

For first setup only, `pnpm db:push` can push the generated schema directly. Prefer migrations after production data exists.

## Deploy

Run Worker locally:

```sh
pnpm worker:dev
```

When the Worker connects to remote Turso from local `workerd`, TLS can fail on systems with non-standard CA paths, especially NixOS. In that case, run the Worker on Cloudflare's remote dev runtime:

```sh
pnpm worker:dev:remote
```

Remote dev still uses `.dev.vars` locally for variables, but the request executes on Cloudflare's network, avoiding local CA trust issues. Remote dev requires a registered `workers.dev` subdomain in the Cloudflare account. If the account is not onboarded yet, register the subdomain from the Cloudflare Workers dashboard, then rerun the command.

If you do not want to register `workers.dev`, deploy the Worker to a custom route, or use local `pnpm worker:dev` with a local libSQL server over `http://` instead of remote Turso over TLS.

Deploy Worker:

```sh
pnpm worker:deploy
```

Verify backend status:

```txt
https://your-consent-worker.example.com/api/c15t/status
```

## Consent Testing

- Use c15t location overrides or a VPN to test EU and California policy behavior.
- EU visitors should see banner and require opt-in for AdSense.
- California visitors should resolve opt-out behavior.
- Other regions should not see a banner.
- GTM should load immediately and receive consent updates through Google Consent Mode.
- AdSense should only load after `marketing` consent.
