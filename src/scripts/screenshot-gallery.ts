const screenshotTransitions = new WeakMap<HTMLDialogElement, ViewTransition>()

function updateScreenshot(dialog: HTMLDialogElement, update: () => void | Promise<void>) {
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
    void update()
  }
}

document.querySelectorAll<HTMLElement>("[data-screenshot-gallery]").forEach((gallery) => {
  gallery.addEventListener("click", (event) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("[data-screenshot-open]")
        : null
    const dialog = link ? document.getElementById(link.dataset.screenshotOpen ?? "") : null

    if (!(dialog instanceof HTMLDialogElement)) {
      return
    }

    event.preventDefault()
    updateScreenshot(dialog, async () => {
      dialog.showModal()
      const image = dialog.querySelector("img")
      if (image) {
        image.loading = "eager"
        // Keep the dialog usable if the full-size image fails to load.
        await image.decode().catch(() => {})
      }
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
