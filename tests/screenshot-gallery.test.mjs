import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { URL } from "node:url"

test("gallery markup uses one native scroll-snap dialog without a counter", () => {
  const source = readFileSync(new URL("../src/components/ScreenshotGallery.astro", import.meta.url), "utf8")
  assert.equal((source.match(/<dialog\b/g) ?? []).length, 1)
  assert.match(source, /scroll-snap-type: x mandatory/)
  assert.match(source, /screenshots.length > 1 &&/)
  assert.doesNotMatch(source, /<output\b|data-gallery-position|scroll-marker/)
})

const deferred = () => {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test("the shared gallery preserves loading, zoom and native carousel navigation", async (t) => {
  const documentEvents = new Map()
  const windowEvents = new Map()
  const motion = { matches: false }
  const status = { textContent: "" }
  let transitions = 0
  let manualTransitions = false
  let observer
  const updates = []

  class Element {
    attributes = new Map()
    dataset = {}
    events = new Map()
    style = { setProperty: (key, value) => this.attributes.set(key, value) }
    scrollLeft = 0
    clientWidth = 100
    setAttribute(name, value) {
      this.attributes.set(name, value)
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null
    }
    removeAttribute(name) {
      this.attributes.delete(name)
    }
    toggleAttribute(name, force) {
      if (force) {
        this.setAttribute(name, "")
      } else {
        this.removeAttribute(name)
      }
    }
    addEventListener(name, handler) {
      this.events.set(name, handler)
    }
    focus() {
      document.activeElement = this
    }
    getBoundingClientRect() {
      return { left: 0 }
    }
    scrollTo({ left }) {
      this.scrollLeft = left
    }
  }
  class HTMLDialogElement extends Element {
    isConnected = true
    open = false
    showModal() {
      this.open = true
    }
    close() {
      this.open = false
      this.events.get("close")?.()
    }
    contains(element) {
      return [this, viewport, previousButton, nextButton, closeButton, ...slides, ...images].includes(element)
    }
  }
  const dialog = new HTMLDialogElement()
  const viewport = new Element()
  const strip = new Element()
  const previousButton = new Element()
  const nextButton = new Element()
  const closeButton = new Element()
  const shots = Array.from({ length: 3 }, () => new Element())
  const slides = shots.map((_, index) => {
    const slide = new Element()
    slide.dataset = { screenshotTitle: `Screenshot ${index + 1}` }
    return slide
  })
  const links = shots.map((shot, index) => {
    const link = new Element()
    link.dataset = { screenshotOpen: `example-${index}` }
    link.href = `https://example.com/${index}.webp`
    link.parentElement = shot
    link.closest = () => link
    return link
  })
  const images = shots.map((_, index) => {
    const image = new Element()
    image.dataset = { src: links[index].href }
    image.loading = "lazy"
    image.decode = async () => {}
    Object.defineProperty(image, "src", {
      set(src) {
        image.setAttribute("src", src)
      },
    })
    return image
  })
  const gallery = new Element()
  gallery.dataset = { loadingLabel: "Loading screenshot…" }
  gallery.contains = (element) => links.includes(element) || dialog.contains(element)
  gallery.querySelector = (selector) =>
    ({
      "[data-gallery-dialog]": dialog,
      "[data-gallery-slides]": viewport,
      ".gallery-strip": strip,
      "[data-gallery-status]": status,
      "[data-gallery-previous]": previousButton,
      "[data-gallery-next]": nextButton,
      "[data-gallery-close]": closeButton,
    })[selector]
  gallery.querySelectorAll = (selector) =>
    ({ "[data-screenshot-open]": links, ".gallery-slide": slides, ".gallery-full-image": images })[selector]
  const document = {
    hidden: false,
    activeElement: null,
    querySelectorAll: () => [gallery],
    addEventListener: (name, handler) => documentEvents.set(name, handler),
    startViewTransition: (update) => {
      transitions++
      const done = deferred()
      const run = () => {
        assert.equal(update(), undefined, "snapshots must not wait on asynchronous work")
        done.resolve()
      }
      if (manualTransitions) {
        updates.push(run)
      } else {
        run()
      }
      return { finished: done.promise, skipTransition() {} }
    },
  }
  const globals = {
    document,
    Element,
    HTMLDialogElement,
    IntersectionObserver: class {
      constructor(callback, options) {
        assert.equal(options.root, viewport)
        this.callback = callback
        observer = this
      }
      observe() {}
    },
    window: {
      matchMedia: () => motion,
      addEventListener: (name, handler) => windowEvents.set(name, handler),
    },
  }
  const saved = Object.fromEntries(Object.keys(globals).map((key) => [key, globalThis[key]]))
  Object.assign(globalThis, globals)
  const event = (extra = {}) => ({
    target: links[0],
    button: 0,
    prevented: false,
    preventDefault() {
      this.prevented = true
    },
    ...extra,
  })
  const click = (index = 0) => gallery.events.get("click")(event({ target: links[index] }))
  const close = (type = "cancel") => dialog.events.get(type)(event())
  const key = (key, extra = {}) => documentEvents.get("keydown")(event({ key, ...extra }))
  const swipe = (index) => {
    viewport.scrollLeft = index * viewport.clientWidth
    observer.callback([{ target: slides[index], isIntersecting: true, intersectionRatio: 0.75 }])
  }
  const resetDecodes = () => images.forEach((image) => (image.decode = async () => {}))

  try {
    await import("../src/scripts/screenshot-gallery.ts")

    await t.test("decodes before freezing the page and loads only the selected image initially", async () => {
      const ready = deferred()
      images[0].decode = () => ready.promise
      const opening = click()
      assert.equal(dialog.open, false)
      assert.equal(transitions, 0)
      assert.equal(links[0].getAttribute("aria-busy"), "true")
      assert.equal(images[1].getAttribute("src"), null)
      assert.equal(status.textContent, "Loading screenshot…")
      ready.resolve()
      await opening
      assert.equal(dialog.open, true)
      assert.equal(transitions, 1)
      assert.equal(links[0].getAttribute("aria-busy"), null)
      assert.equal(images[1].getAttribute("src"), links[1].href)
      assert.equal(images[2].getAttribute("src"), null)
      close()
      assert.equal(dialog.open, false)
    })

    for (const [name, cancel] of [
      ["Escape", () => key("Escape")],
      ["outside click", () => documentEvents.get("click")({ target: new Element() })],
      ["page navigation", () => windowEvents.get("pagehide")()],
      ["hidden page", () => (document.hidden = true)],
      ["removed dialog", () => (dialog.isConnected = false)],
    ]) {
      await t.test(`${name} discards a pending opening`, async () => {
        const ready = deferred()
        images[0].decode = () => ready.promise
        const count = transitions
        const opening = click()
        cancel()
        ready.resolve()
        await opening
        assert.equal(dialog.open, false)
        assert.equal(transitions, count)
        assert.equal(links[0].getAttribute("aria-busy"), null)
        assert.equal(status.textContent, "")
        document.hidden = false
        dialog.isConnected = true
      })
    }

    await t.test("only the latest selection opens", async () => {
      const first = deferred(),
        second = deferred()
      images[0].decode = () => first.promise
      images[1].decode = () => second.promise
      const count = transitions
      const older = click(0),
        latest = click(1)
      first.resolve()
      await older
      assert.equal(transitions, count)
      second.resolve()
      await latest
      assert.equal(dialog.open, true)
      assert.equal(slides[1].getAttribute("data-active"), "")
      assert.equal(viewport.scrollLeft, 100)
      close("submit")
    })

    await t.test("repeated clicks do not queue multiple openings", async () => {
      const ready = deferred()
      let decodes = 0
      images[0].decode = () => {
        decodes++
        return ready.promise
      }
      const opening = click()
      await click()
      assert.equal(decodes, 1)
      ready.resolve()
      await opening
      close()
    })

    await t.test("retrying after cancellation does not revive the older request", async () => {
      const ready = deferred()
      images[0].decode = () => ready.promise
      const count = transitions
      const older = click()
      key("Escape")
      const latest = click()
      ready.resolve()
      await Promise.all([older, latest])
      assert.equal(dialog.open, true)
      assert.equal(transitions, count + 1)
      close()
    })

    await t.test("Escape also cancels an opening queued for the next snapshot", async () => {
      resetDecodes()
      manualTransitions = true
      await click()
      assert.equal(dialog.open, false)
      assert.equal(shots[0].getAttribute("data-transitioning"), "")
      key("Escape")
      updates.shift()()
      await Promise.resolve()
      assert.equal(dialog.open, false)
      assert.equal(shots[0].getAttribute("data-transitioning"), null)
      assert.equal(dialog.getAttribute("data-transitioning"), null)
      manualTransitions = false
    })

    await t.test("arrow keys and buttons navigate without restarting the zoom or wrapping", async () => {
      resetDecodes()
      await click()
      const count = transitions
      assert.equal(previousButton.disabled, true)
      await key("ArrowLeft")
      assert.equal(viewport.scrollLeft, 0)
      await key("ArrowRight")
      assert.equal(viewport.scrollLeft, 100)
      assert.equal(previousButton.disabled, false)
      await nextButton.events.get("click")()
      assert.equal(viewport.scrollLeft, 200)
      assert.equal(nextButton.disabled, true)
      await key("ArrowRight")
      assert.equal(viewport.scrollLeft, 200)
      assert.equal(transitions, count)
      await previousButton.events.get("click")()
      assert.equal(dialog.getAttribute("aria-label"), "Screenshot 2")
      assert.equal(slides[0].getAttribute("aria-hidden"), "true")
      assert.equal(slides[1].getAttribute("aria-hidden"), "false")
      close()
      assert.equal(document.activeElement, links[1])
      assert.equal(dialog.getAttribute("--shot-name"), "shot-example-1")
    })

    await t.test("rapid keys discard superseded loads and Escape cancels navigation", async () => {
      resetDecodes()
      await click()
      const first = deferred(),
        second = deferred()
      images[1].decode = () => first.promise
      images[2].decode = () => second.promise
      const older = key("ArrowRight"),
        latest = key("ArrowRight")
      first.resolve()
      await older
      assert.equal(viewport.scrollLeft, 0)
      second.resolve()
      await latest
      assert.equal(viewport.scrollLeft, 200)
      const late = deferred()
      images[1].decode = () => late.promise
      const changing = key("ArrowLeft")
      close()
      late.resolve()
      await changing
      assert.equal(dialog.open, false)
      assert.equal(links[1].getAttribute("aria-busy"), null)
    })

    await t.test("native swipes synchronize controls, title and the selected closing thumbnail", async () => {
      resetDecodes()
      await click(1)
      nextButton.focus()
      const count = transitions
      swipe(2)
      assert.equal(nextButton.disabled, true)
      assert.equal(document.activeElement, closeButton)
      assert.equal(dialog.getAttribute("aria-label"), "Screenshot 3")
      assert.equal(transitions, count)
      close()
      assert.equal(document.activeElement, links[2])
      assert.equal(dialog.getAttribute("--shot-name"), "shot-example-2")
    })

    await t.test("tapping empty viewer space closes while tapping the image does not", async () => {
      resetDecodes()
      await click()
      viewport.events.get("click")(event({ target: images[0] }))
      assert.equal(dialog.open, true)
      viewport.events.get("click")(event({ target: slides[0] }))
      assert.equal(dialog.open, false)
    })

    await t.test("failed images remain closable and modifiers keep their native behavior", async () => {
      images[0].decode = async () => {
        throw new Error("Image unavailable")
      }
      await click()
      assert.equal(dialog.open, true)
      const modifiedKey = event({ key: "ArrowRight", altKey: true })
      documentEvents.get("keydown")(modifiedKey)
      assert.equal(modifiedKey.prevented, false)
      close()
      const modified = event({ ctrlKey: true })
      await gallery.events.get("click")(modified)
      assert.equal(modified.prevented, false)
      const closedArrow = event({ key: "ArrowRight" })
      documentEvents.get("keydown")(closedArrow)
      assert.equal(closedArrow.prevented, false)
    })

    await t.test("reduced motion and missing API retain navigation and native closing", async () => {
      resetDecodes()
      const count = transitions
      motion.matches = true
      await click()
      await key("ArrowRight")
      assert.equal(viewport.scrollLeft, 100)
      close("submit")
      assert.equal(transitions, count)
      motion.matches = false
      const native = document.startViewTransition
      delete document.startViewTransition
      await click()
      close()
      assert.equal(dialog.open, false)
      document.startViewTransition = native
    })
  } finally {
    for (const [key, value] of Object.entries(saved)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
