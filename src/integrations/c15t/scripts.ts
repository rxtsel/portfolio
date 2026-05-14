import type { Script } from "c15t"
import { createGoogleAdsenseScript } from "@/integrations/google/adsense"
import { createGoogleTagManagerScript } from "@/integrations/google/tag-manager"

export interface ConsentScriptConfig {
  googleAdsenseClientId: string | undefined
  googleTagManagerContainerId: string | undefined
}

export function createConsentScripts(config: ConsentScriptConfig): Script[] {
  return [
    createGoogleTagManagerScript(config.googleTagManagerContainerId ?? ""),
    createGoogleAdsenseScript(config.googleAdsenseClientId ?? ""),
  ].filter((script): script is Script => Boolean(script))
}
