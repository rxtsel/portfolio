import { micromark } from "micromark"

export function renderSafeMarkdown(markdown: string) {
  return micromark(markdown, {
    allowDangerousHtml: false,
    allowDangerousProtocol: false,
  })
}
