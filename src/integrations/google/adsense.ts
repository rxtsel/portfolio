import type { Script } from "c15t"

export function createGoogleAdsenseScript(clientId: string): Script | undefined {
  const id = clientId.trim()

  if (!id) {
    return undefined
  }

  return {
    id: "google-adsense",
    src: `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(id)}`,
    category: "marketing",
    async: true,
    attributes: {
      crossorigin: "anonymous",
    },
  }
}
