const screenshotTransitions = new WeakMap<
  HTMLDialogElement,
  { transition: ViewTransition; shot: HTMLElement }
>()

function stopScreenshotTransition(dialog: HTMLDialogElement) {
  const previous = screenshotTransitions.get(dialog)
  screenshotTransitions.delete(dialog)
  previous?.transition.skipTransition()
  previous?.shot.removeAttribute("data-transitioning")
  dialog.removeAttribute("data-transitioning")
}

function updateScreenshot(dialog: HTMLDialogElement, shot: HTMLElement, update: () => void) {
  stopScreenshotTransition(dialog)
  if (document.startViewTransition && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    shot.setAttribute("data-transitioning", "")
    dialog.setAttribute("data-transitioning", "")
    const transition = document.startViewTransition(update)
    screenshotTransitions.set(dialog, { transition, shot })
    const cleanup = () => {
      if (screenshotTransitions.get(dialog)?.transition === transition) {
        shot.removeAttribute("data-transitioning")
        dialog.removeAttribute("data-transitioning")
        screenshotTransitions.delete(dialog)
      }
    }
    void transition.finished.then(cleanup, cleanup)
  } else {
    update()
  }
}

document.querySelectorAll<HTMLElement>("[data-screenshot-gallery]").forEach((gallery) => {
  const dialog = gallery.querySelector<HTMLDialogElement>("[data-gallery-dialog]")
  const viewport = gallery.querySelector<HTMLElement>("[data-gallery-slides]")
  const links = Array.from(gallery.querySelectorAll<HTMLAnchorElement>("[data-screenshot-open]"))
  const slides = Array.from(gallery.querySelectorAll<HTMLElement>(".gallery-slide"))
  const images = Array.from(gallery.querySelectorAll<HTMLImageElement>(".gallery-full-image"))
  const strip = gallery.querySelector<HTMLElement>(".gallery-strip")
  const status = gallery.querySelector<HTMLElement>("[data-gallery-status]")
  const previous = gallery.querySelector<HTMLButtonElement>("[data-gallery-previous]")
  const next = gallery.querySelector<HTMLButtonElement>("[data-gallery-next]")
  const closeButton = gallery.querySelector<HTMLButtonElement>("[data-gallery-close]")
  if (
    !dialog ||
    !viewport ||
    !strip ||
    !links.length ||
    links.length !== images.length ||
    links.length !== slides.length
  )
    return

  const shots = links.map((link) => link.parentElement!)
  let activeIndex = 0
  let pending: { index: number; link: HTMLAnchorElement } | undefined

  function cancelPending() {
    if (pending) {
      pending.link.removeAttribute("aria-busy")
      stopScreenshotTransition(dialog!)
      pending = undefined
    }
    dialog!.removeAttribute("aria-busy")
    if (status) status.textContent = ""
  }

  function loadImage(index: number) {
    const image = images[index]
    const link = links[index]
    if (!image || !link) return
    image.loading = "eager"
    if (!image.getAttribute("src")) image.src = image.dataset.src ?? link.href
    return image
  }

  function loadNeighbors() {
    for (const index of [activeIndex - 1, activeIndex + 1]) {
      if (images[index]) loadImage(index)
    }
  }

  function select(index: number) {
    const link = links[index]
    const slide = slides[index]
    const image = images[index]
    if (!link || !slide || !image) return
    activeIndex = index
    slides.forEach((slide, i) => {
      slide.toggleAttribute("data-active", i === index)
      slide.setAttribute("aria-hidden", String(i !== index))
    })
    dialog!.style.setProperty("--shot-name", `shot-${link.dataset.screenshotOpen}`)
    dialog!.setAttribute("aria-label", slide.dataset.screenshotTitle ?? image.alt)
    if (status) status.textContent = slide.dataset.screenshotTitle ?? ""
    const focused = document.activeElement
    if (previous) previous.disabled = index === 0
    if (next) next.disabled = index === links.length - 1
    if ((previous?.disabled && focused === previous) || (next?.disabled && focused === next)) {
      closeButton?.focus({ preventScroll: true })
    }
  }

  async function show(index: number) {
    const link = links[index]
    const shot = shots[index]
    if (!link || !shot || pending?.index === index) return
    const image = loadImage(index)
    if (!image) return
    cancelPending()
    const opening = !dialog!.open
    const request = { index, link }
    pending = request
    request.link.setAttribute("aria-busy", "true")
    if (!opening) dialog!.setAttribute("aria-busy", "true")
    if (status) status.textContent = gallery.dataset.loadingLabel ?? ""

    // Decode before capturing or replacing the visible image, never during a frozen frame.
    await image.decode().catch(() => {})
    if (pending !== request) return
    if (!dialog!.isConnected || document.hidden || (!opening && !dialog!.open)) {
      cancelPending()
      return
    }

    const reveal = () => {
      if (pending !== request || !dialog!.isConnected || document.hidden) return
      request.link.removeAttribute("aria-busy")
      dialog!.removeAttribute("aria-busy")
      pending = undefined
      select(index)
      if (opening) {
        dialog!.showModal()
        closeButton?.focus({ preventScroll: true })
      }
      viewport!.scrollTo({ left: index * viewport!.clientWidth, behavior: "instant" })
      loadNeighbors()
    }
    if (opening) {
      updateScreenshot(dialog!, shot, reveal)
    } else {
      stopScreenshotTransition(dialog!)
      reveal()
    }
  }

  function close() {
    cancelPending()
    const shot = shots[activeIndex]
    if (!dialog!.open || !shot) return
    viewport!.scrollTo({ left: activeIndex * viewport!.clientWidth, behavior: "instant" })
    strip!.scrollTo({
      left: strip!.scrollLeft + shot.getBoundingClientRect().left - strip!.getBoundingClientRect().left,
      behavior: "instant",
    })
    updateScreenshot(dialog!, shot, () => dialog!.close())
  }

  window.addEventListener("pagehide", cancelPending)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") cancelPending()
    if (!dialog.open || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault()
      return show((pending?.index ?? activeIndex) + (event.key === "ArrowRight" ? 1 : -1))
    }
    return
  })
  document.addEventListener("click", (event) => {
    if (event.target instanceof Element && !gallery.contains(event.target)) cancelPending()
  })

  gallery.addEventListener("click", (event) => {
    if (event.target instanceof Element && dialog.contains(event.target)) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      cancelPending()
      return
    }
    const link =
      event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>("[data-screenshot-open]")
        : null
    const index = link ? links.indexOf(link) : -1
    if (index < 0) {
      cancelPending()
      return
    }
    event.preventDefault()
    return show(index)
  })

  previous?.addEventListener("click", () => show((pending?.index ?? activeIndex) - 1))
  next?.addEventListener("click", () => show((pending?.index ?? activeIndex) + 1))
  viewport.addEventListener("pointerdown", cancelPending)
  viewport.addEventListener("click", (event) => {
    if (event.target === viewport || slides.some((slide) => slide === event.target)) close()
  })
  for (const type of ["cancel", "submit"]) {
    dialog.addEventListener(type, (event) => {
      event.preventDefault()
      close()
    })
  }
  dialog.addEventListener("close", () => {
    cancelPending()
    links[activeIndex]?.focus({ preventScroll: true })
  })

  const observer = new IntersectionObserver(
    () => {
      if (!dialog.open || !viewport.clientWidth) return
      const index = Math.round(viewport.scrollLeft / viewport.clientWidth)
      if (!slides[index] || index === activeIndex) return
      cancelPending()
      select(index)
      loadImage(index)
      loadNeighbors()
    },
    { root: viewport, threshold: 0.6 },
  )
  slides.forEach((slide) => observer.observe(slide))
})
