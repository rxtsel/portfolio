import { getOrCreateConsentRuntime } from "c15t"
import { createConsentScripts } from "@/integrations/c15t/scripts"
import { mountConsentUI } from "@/integrations/c15t/ui"

export interface ConsentManagerConfig {
  backendURL: string
  googleAdsenseClientId: string | undefined
  googleAnalyticsMeasurementId: string | undefined
  locale: string
}

let started = false

export function startConsentManager(config: ConsentManagerConfig): void {
  if (started || !config.backendURL) {
    return
  }

  started = true

  const { consentStore } = getOrCreateConsentRuntime({
    mode: "hosted",
    backendURL: config.backendURL,
    consentCategories: ["necessary", "measurement", "marketing"],
    i18n: {
      locale: config.locale,
    },
    scripts: createConsentScripts(config),
    reloadOnConsentRevoked: true,
  })

  mountConsentUI(consentStore)
}
