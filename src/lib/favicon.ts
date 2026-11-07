import { z } from "astro/zod"

export const faviconBackgroundSchema = z.enum(["none", "light"]).default("none")
export type FaviconBackground = z.infer<typeof faviconBackgroundSchema>

export const faviconUrlPattern = /^https:\/\/(?![^?#]*\.[iI][cC][oO](?:[?#]|$))\S+$/
