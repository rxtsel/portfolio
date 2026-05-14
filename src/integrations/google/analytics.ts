import { gtag } from "@c15t/scripts/google-tag"
import type { Script } from "c15t"

export function createGoogleAnalyticsScript(measurementId: string): Script | undefined {
  const id = measurementId.trim()

  if (!id) {
    return undefined
  }

  return gtag({
    id,
    category: "measurement",
  })
}
