import { c15tInstance, policyPackPresets } from "@c15t/backend"
import { drizzleAdapter } from "@c15t/backend/db/adapters/drizzle"
import { createDb } from "./db"
import type { Env } from "./env"
import { getTrustedOrigins } from "./env"

export function createC15t(env: Env) {
  const policySnapshot = env.C15T_POLICY_SIGNING_KEY
    ? {
        signingKey: env.C15T_POLICY_SIGNING_KEY,
      }
    : undefined

  return c15tInstance({
    adapter: drizzleAdapter({
      db: createDb(env),
      provider: "sqlite",
    }),
    appName: "rxtsel.dev",
    basePath: "/api/c15t",
    branding: "none",
    policyPacks: [
      policyPackPresets.europeOptIn(),
      policyPackPresets.californiaOptOut(),
      policyPackPresets.worldNoBanner(),
    ],
    ...(policySnapshot ? { policySnapshot } : {}),
    trustedOrigins: getTrustedOrigins(env),
  })
}
