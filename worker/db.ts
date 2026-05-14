import { drizzle } from "drizzle-orm/libsql"
import type { Env } from "./env"
import * as schema from "./schema/c15t"

export function createDb(env: Env) {
  if (!env.C15T_DATABASE_URL) {
    throw new Error(
      "Missing C15T_DATABASE_URL. Set it in .dev.vars for wrangler dev or as a Worker secret in Cloudflare.",
    )
  }

  if (env.C15T_DATABASE_URL.startsWith("file:")) {
    throw new Error(
      'Cloudflare Workers cannot use file: SQLite URLs. Use Turso/libSQL URL for worker dev, for example "libsql://..." or "http://localhost:8080".',
    )
  }

  return drizzle({
    connection: {
      authToken: env.C15T_DATABASE_AUTH_TOKEN,
      url: env.C15T_DATABASE_URL,
    },
    schema,
  })
}
