# Google Integrations Runbook

## Purpose

This project keeps Google integration settings in content instead of hardcoding account-specific IDs in components. This makes the site easier to fork, disable, or reconfigure through Sveltia CMS.

## Files

- `src/content/integrations.md` stores integration settings.
- `src/content.config.ts` validates the integrations collection.
- `public/cms-rxtsel/config.yml` exposes settings in Sveltia CMS.
- `src/components/GoogleTagManagerHead.astro` injects the GTM loader.
- `src/components/GoogleTagManagerNoScript.astro` injects the GTM noscript fallback.
- `public/scripts/google-tag-manager.js` loads Google Tag Manager from the configured container ID.
- `src/components/GoogleAdsense.astro` injects AdSense only on allowed routes.
- `src/pages/ads.txt.ts` generates `/ads.txt`.

## Settings

Use `src/content/integrations.md`:

```yaml
---
googleTagManager:
  enabled: true
  containerId: <CONTAINER_ID>
googleAdsense:
  enabled: true
  clientId: <ADSENSE_CLIENT_ID>
  allowedPathPattern: ^(/blog(/|$)|/es/blog(/|$))
  sellerLine: "google.com, <ADSENSE_PUBLISHER_ID>, DIRECT, <CERTIFICATION_AUTHORITY_ID>"
---
```

## Google Tag Manager

Set `googleTagManager.enabled` to `true` and replace `<CONTAINER_ID>` with your GTM container ID.

Do not add separate GTM snippets manually in layouts. The project already renders:

- GTM loader in `<head>`.
- GTM `noscript` fallback at the start of `<body>`.

## GA4 / Google Analytics

Google Analytics should be connected through Google Tag Manager.

Do not add a separate `gtag.js` script to the codebase if GA4 is already configured in GTM. Adding both can duplicate page views.

If other Google products are linked through GA4 or GTM, configure them in Google product dashboards or GTM instead of adding extra scripts to this project.

## Google AdSense

AdSense is controlled by:

- `googleAdsense.enabled`
- `googleAdsense.clientId`
- `googleAdsense.allowedPathPattern`

By default, ads load only on blog routes:

```txt
^(/blog(/|$)|/es/blog(/|$))
```

Change this pattern if ads should appear on different routes.

## ads.txt

`/ads.txt` is generated from `googleAdsense.sellerLine`.

Use the line provided by Google AdSense. The expected format is:

```txt
google.com, <ADSENSE_PUBLISHER_ID>, DIRECT, <CERTIFICATION_AUTHORITY_ID>
```

## Google Search Console

This site uses DNS verification for Google Search Console.

Do not add Search Console verification meta tags, HTML files, or scripts unless the verification method changes.

After deployment, submit or verify the sitemap in Search Console:

```txt
https://<DOMAIN>/sitemap-index.xml
```

## Sveltia CMS

The same settings are editable in Sveltia CMS under `Integrations`.

Only IDs and safe config values should be stored there. Do not store arbitrary scripts or custom HTML in CMS fields.

## Deployment Checklist

- GTM container ID is set.
- GA4 is configured inside GTM.
- AdSense client ID is set if ads are enabled.
- `allowedPathPattern` matches only routes where ads should load.
- `/ads.txt` returns the expected seller line.
- Search Console sitemap is submitted after deployment.
- Tag Assistant and GA4 Realtime confirm tracking after production deploy.
