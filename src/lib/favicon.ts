import { z } from "astro/zod"

export const faviconBackgroundSchema = z.enum(["none", "light"]).default("none")
export type FaviconBackground = z.infer<typeof faviconBackgroundSchema>

export function getFaviconHostname(href: string | undefined) {
  const url = href ? URL.parse(href) : null
  return url && (url.protocol === "https:" || url.protocol === "http:") ? url.hostname : undefined
}

export const faviconUrlPattern = /^https:\/\/(?![^?#]*\.[iI][cC][oO](?:[?#]|$))\S+$/
