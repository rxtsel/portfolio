import { feedback } from "@/lib/feedback"

type CopyState = "done" | "error" | "idle"

const resetDelay = 1500
const copyWindow = window as Window & { copyToClipboardMounted?: boolean }
const resetTimers = new WeakMap<HTMLElement, number>()

function copySelectedText() {
  const legacyDocument = document as Document & { execCommand(command: "copy"): boolean }

  legacyDocument.execCommand("copy")
}

function setCopyState(button: HTMLElement, state: CopyState) {
  const existingTimer = resetTimers.get(button)

  if (existingTimer) {
    window.clearTimeout(existingTimer)
  }

  button.setAttribute("data-copy-state", state)

  const status = button.querySelector<HTMLElement>("[data-copy-status]")

  if (status) {
    const label =
      state === "done" ? status.getAttribute("data-copied-label") : status.getAttribute("data-error-label")

    status.textContent = state === "idle" ? "" : (label ?? "")
  }

  if (state !== "idle") {
    resetTimers.set(
      button,
      window.setTimeout(() => {
        setCopyState(button, "idle")
        resetTimers.delete(button)
      }, resetDelay),
    )
  }
}

function getCopyText(button: HTMLElement) {
  const sourceId = button.getAttribute("data-copy-source")

  if (sourceId) {
    const source = document.getElementById(sourceId)
    const text =
      source instanceof HTMLTemplateElement ? (source.content.textContent ?? "") : (source?.textContent ?? "")

    return source instanceof HTMLScriptElement && source.type === "application/json"
      ? (JSON.parse(text) as string)
      : text
  }

  return button.getAttribute("data-copy-text") ?? ""
}

async function writeClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement("textarea")

  textarea.value = text
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.append(textarea)
  textarea.select()
  copySelectedText()
  textarea.remove()
}

async function copy(button: HTMLElement) {
  try {
    await writeClipboard(getCopyText(button))
    setCopyState(button, "done")
    feedback.success()
  } catch {
    setCopyState(button, "error")
    feedback.error()
  }
}

if (!copyWindow.copyToClipboardMounted) {
  copyWindow.copyToClipboardMounted = true
  document.addEventListener("click", (event) => {
    const button =
      event.target instanceof HTMLElement ? event.target.closest<HTMLElement>("[data-copy-button]") : null

    if (!button) {
      return
    }

    void copy(button)
  })
}
