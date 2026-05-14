export interface Env {
  C15T_DATABASE_AUTH_TOKEN: string
  C15T_DATABASE_URL: string
  C15T_POLICY_SIGNING_KEY?: string
  C15T_TRUSTED_ORIGINS: string
}

export function getTrustedOrigins(env: Env): string[] {
  return env.C15T_TRUSTED_ORIGINS.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
}
