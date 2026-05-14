import { createC15t } from "./c15t"
import type { Env } from "./env"

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return createC15t(env).handler(request)
  },
}
