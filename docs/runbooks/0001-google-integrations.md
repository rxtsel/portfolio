# Google Integrations Runbook

## Purpose

This project keeps Google integration settings in content instead of hardcoding account-specific IDs in components. This makes the site easier to fork, disable, or reconfigure through Sveltia CMS.

## Files

- `src/content/integrations.md` stores integration settings.
- `src/content.config.ts` validates the integrations collection.
- `public/cms-rxtsel/config.yml` exposes settings in Sveltia CMS.
- `src/integrations/google/analytics.ts` configures GA4 through c15t's Google Tag helper.
- `src/integrations/google/adsense.ts` configures AdSense behind marketing consent.
- `src/pages/ads.txt.ts` generates `/ads.txt`.

## Settings

Use `src/content/integrations.md`:

```yaml
---
googleAnalytics:
  enabled: true
  measurementId: <GA4_MEASUREMENT_ID>
googleAdsense:
  enabled: true
  clientId: <ADSENSE_CLIENT_ID>
  allowedPathPattern: ^(/blog(/|$)|/es/blog(/|$))
  sellerLine: "google.com, <ADSENSE_PUBLISHER_ID>, DIRECT, <CERTIFICATION_AUTHORITY_ID>"
---
```

## GA4 / Google Analytics

Google Analytics is loaded directly through the c15t Google Tag integration, not through Google Tag Manager.

Set `googleAnalytics.enabled` to `true` and replace `<GA4_MEASUREMENT_ID>` with your GA4 measurement ID, such as `G-XXXXXXXXXX`.

Do not add Google Tag Manager snippets or a separate `gtag.js` snippet manually. Running multiple loaders for the same GA4 destination can duplicate page views.

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

- GA4 measurement ID is set if analytics are enabled.
- AdSense client ID is set if ads are enabled.
- `allowedPathPattern` matches only routes where ads should load.
- `/ads.txt` returns the expected seller line.
- Search Console sitemap is submitted after deployment.
- Tag Assistant and GA4 Realtime confirm tracking after production deploy.
