import type { APIRoute } from "astro"

const getRobotsTxt = (sitemapURL: URL) => `\
User-agent: *
Allow: /
Allow: /llms.txt
Allow: /rss.xml
Allow: /es/rss.xml
Allow: /blog/*/og.png
Allow: /es/blog/*/og.png
Disallow: /cms-rxtsel/

Sitemap: ${sitemapURL.href}
`

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site)
  return new Response(getRobotsTxt(sitemapURL))
}
