import { getCollection } from "astro:content"

export async function getIntegrations() {
  const [integrations] = await getCollection("integrations")

  return integrations?.data
}

export function matchesAllowedPath(pathname: string, allowedPathPattern: string) {
  try {
    return new RegExp(allowedPathPattern).test(pathname)
  } catch {
    return false
  }
}
