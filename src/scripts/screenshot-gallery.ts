const screenshotTransitions = new WeakMap<HTMLDialogElement, ViewTransition>()

function updateScreenshot(dialog: HTMLDialogElement, update: () => void) {
  const shot = dialog.parentElement

  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Only the selected image may escape the strip's clipping during a view transition.
    shot?.setAttribute("data-transitioning", "")
    const transition = document.startViewTransition(update)
    screenshotTransitions.set(dialog, transition)
    const cleanup = () => {
      if (screenshotTransitions.get(dialog) === transition) {
        shot?.removeAttribute("data-transitioning")
        screenshotTransitions.delete(dialog)
      }
    }
    void transition.finished.then(cleanup, cleanup)
  } else {
    screenshotTransitions.get(dialog)?.skipTransition()
    screenshotTransitions.delete(dialog)
    shot?.removeAttribute("data-transitioning")
    update()
  }
}

document.querySelectorAll<HTMLElement>("[data-screenshot-gallery]").forEach((gallery) => {
  const status = gallery.querySelector<HTMLElement>("[data-gallery-status]")
  let pending: { link: HTMLAnchorElement; dialog: HTMLDialogElement } | undefined

  function cancelPending() {
    if (pending) {
      pending.link.removeAttribute("aria-busy")
      screenshotTransitions.get(pending.dialog)?.skipTransition()
      pending = undefined
    }
    if (status) status.textContent = ""
  }

  window.addEventListener("pagehide", cancelPending)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cancelPending()
  })
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && !gallery.contains(event.target)) cancelPending()
  })

  gallery.addEventListener("click", async (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      cancelPending()
      return
    }

    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("[data-screenshot-open]")
        : null
    const dialog = link ? document.getElementById(link.dataset.screenshotOpen ?? "") : null

    if (!link || !(dialog instanceof HTMLDialogElement)) {
      cancelPending()
      return
    }

    event.preventDefault()
    if (pending?.link === link) return
    cancelPending()
    const request = { link, dialog }
    pending = request
    link.setAttribute("aria-busy", "true")
    if (status) status.textContent = gallery.dataset.loadingLabel ?? ""

    const image = dialog.querySelector("img")
    if (image) {
      image.loading = "eager"
      // Network and decoding must finish before view transitions pause rendering.
      await image.decode().catch(() => {})
    }
    if (pending !== request) return
    if (!dialog.isConnected || document.hidden) {
      cancelPending()
      return
    }

    link.removeAttribute("aria-busy")
    if (status) status.textContent = ""
    updateScreenshot(dialog, () => {
      if (pending !== request || !dialog.isConnected || document.hidden) return
      pending = undefined
      dialog.showModal()
    })
  })

  gallery.querySelectorAll<HTMLDialogElement>("dialog").forEach((dialog) => {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault()
      updateScreenshot(dialog, () => dialog.close())
    })

    dialog.addEventListener("submit", (event) => {
      event.preventDefault()
      updateScreenshot(dialog, () => dialog.close())
    })
  })
})
