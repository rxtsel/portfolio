# c15t Consent Runbook

## Architecture

- `src/components/ConsentManager.astro` mounts the browser consent runtime.
- `src/integrations/c15t` owns c15t client setup, scripts, and DOM UI.
- `src/integrations/google` owns Google vendor script definitions.
- The backend lives in [consent](https://github.com/rxtsel/consent) repo as a reusable Cloudflare Worker service.

## Runtime Behavior

- Frontend uses c15t hosted mode through `PUBLIC_C15T_URL`.
- Google Tag Manager uses c15t's built-in GTM integration with `alwaysLoad` and Consent Mode v2.
- Google AdSense is gated behind the `marketing` category.
- GTM `noscript` is not rendered because it cannot respect JavaScript-managed consent.

## Environment

Set frontend env:

```txt
PUBLIC_C15T_URL=https://your-consent-worker.example.com/api/c15t
```

For production builds, set `PUBLIC_C15T_URL` in Cloudflare Workers Builds variables so Astro can inline it during the build.

## Consent Testing

- Use c15t location overrides or a VPN to test EU and California policy behavior.
- EU visitors should see banner and require opt-in for AdSense.
- California visitors should resolve opt-out behavior.
- Other regions should not see a banner.
- GTM should load immediately and receive consent updates through Google Consent Mode.
- AdSense should only load after `marketing` consent.
