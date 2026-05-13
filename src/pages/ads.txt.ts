import type { APIRoute } from "astro"
import { getIntegrations } from "@/lib/integrations"

export const GET: APIRoute = async () => {
  const integrations = await getIntegrations()
  const sellerLine = integrations?.googleAdsense.sellerLine.trim()

  return new Response(sellerLine ? `${sellerLine}\n` : "", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
