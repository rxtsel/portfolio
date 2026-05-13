# Cloudflare Access for Sveltia CMS Runbook

## Purpose

Sveltia CMS is served from a static route at `public/cms-rxtsel/index.html`. The page includes `noindex`, but `noindex` is not an access-control mechanism.

Use Cloudflare Zero Trust Access to add an authentication layer before anyone can load the CMS admin files.

## Scope

Protect the full CMS route, not only `index.html`.

The protected paths should include:

- `/cms-rxtsel`
- `/cms-rxtsel/`
- `/cms-rxtsel/*`

This matters because the CMS also serves `config.yml` from the same folder.

## Prerequisites

- The production domain is managed by Cloudflare.
- The DNS record for the site is proxied through Cloudflare.
- Cloudflare Zero Trust is enabled for the account.
- At least one identity provider is configured in Cloudflare Zero Trust.

## Create the Access Application

In Cloudflare Zero Trust:

- Go to `Access` > `Applications`.
- Create a new application.
- Choose `Self-hosted`.
- Name it `Sveltia CMS Admin`.
- Set the application domain to `<DOMAIN>`.
- Add protected paths for `/cms-rxtsel` and `/cms-rxtsel/*`.

If Cloudflare path matching does not cover both the route without a trailing slash and nested files with one application path, create separate application rules or include both path variants.

## Access Policy

Create an allow policy for trusted admins only.

Common options:

- Allow specific emails, such as `<ADMIN_EMAIL>`.
- Allow an email domain, such as `<YOUR_DOMAIN>`.
- Allow a configured identity provider group.

Avoid public allow rules. The CMS route should not be reachable by anonymous visitors.

## Session Settings

Choose a session duration that balances convenience and risk.

Examples:

- `24h` for stricter access.
- `7d` for a personal site with a low admin count.

## Validation

After deployment and Cloudflare Access setup:

- Open `https://<DOMAIN>/cms-rxtsel/` in an incognito window.
- Confirm Cloudflare Access asks for authentication before loading the CMS.
- Open `https://<DOMAIN>/cms-rxtsel/config.yml` directly.
- Confirm `config.yml` is also protected.
- Authenticate with an allowed account.
- Confirm Sveltia CMS loads after authentication.
- Confirm a non-allowed account is blocked.

## Security Notes

- Cloudflare Access protects the admin route before the browser loads Sveltia CMS.
- Cloudflare Access does not replace GitHub permissions. Sveltia still needs the correct GitHub authorization to write content.
- Do not store arbitrary scripts, secrets, credentials, or private tokens in CMS-managed content.
- `noindex` prevents search indexing but does not protect the route.
- Preview deployments or alternate domains are only protected if they also pass through Cloudflare Access.

## Maintenance

Update the Access policy when admins change.

Review the policy after changing CMS paths. If the CMS route changes from `/cms-rxtsel/`, update Cloudflare Access paths and this runbook.
