import type { Script } from "c15t"
import { createGoogleAdsenseScript } from "@/integrations/google/adsense"
import { createGoogleAnalyticsScript } from "@/integrations/google/analytics"

export interface ConsentScriptConfig {
  googleAdsenseClientId: string | undefined
  googleAnalyticsMeasurementId: string | undefined
}

export function createConsentScripts(config: ConsentScriptConfig): Script[] {
  return [
    createGoogleAnalyticsScript(config.googleAnalyticsMeasurementId ?? ""),
    createGoogleAdsenseScript(config.googleAdsenseClientId ?? ""),
  ].filter((script): script is Script => Boolean(script))
}
