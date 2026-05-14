import dotenv from "dotenv"
import { defineConfig } from "drizzle-kit"

dotenv.config({ path: [".env.local", ".env"] })

const databaseUrl = process.env.C15T_DATABASE_URL ?? "file:c15t.local.sqlite"
const databaseAuthToken = process.env.C15T_DATABASE_AUTH_TOKEN ?? ""

export default defineConfig({
  dbCredentials: {
    authToken: databaseAuthToken,
    url: databaseUrl,
  },
  dialect: "turso",
  out: "./worker/migrations",
  schema: "./worker/schema/c15t.ts",
})
