import { googleTagManager } from "@c15t/scripts/google-tag-manager"
import type { Script } from "c15t"

export function createGoogleTagManagerScript(containerId: string): Script | undefined {
  const id = containerId.trim()

  if (!id) {
    return undefined
  }

  return googleTagManager({ id })
}
