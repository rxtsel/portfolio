import assert from "node:assert/strict"
import test from "node:test"

test("gallery opens and closes natively, adds transitions only when allowed, and preserves link fallbacks", async () => {
  const galleryEvents = new Map()
  const dialogEvents = new Map()
  const motion = { matches: false }
  const attributes = new Set()
  const image = { loading: "lazy", decode: async () => {} }
  let transitions = 0

  class Element {}
  class HTMLDialogElement extends Element {
    parentElement = {
      setAttribute: (name) => attributes.add(name),
      removeAttribute: (name) => attributes.delete(name),
    }
    open = false
    showModal() {
      this.open = true
    }
    close() {
      this.open = false
    }
    querySelector() {
      return image
    }
    addEventListener(name, handler) {
      dialogEvents.set(name, handler)
    }
  }

  const dialog = new HTMLDialogElement()
  const link = new Element()
  link.dataset = { screenshotOpen: "example-0" }
  link.closest = () => link
  const gallery = {
    addEventListener: (name, handler) => galleryEvents.set(name, handler),
    querySelectorAll: () => [dialog],
  }
  const document = {
    querySelectorAll: () => [gallery],
    getElementById: (id) => (id === "example-0" ? dialog : null),
    startViewTransition: (update) => {
      transitions++
      return { finished: Promise.resolve(update()), skipTransition() {} }
    },
  }
  const globals = { document, Element, HTMLDialogElement, window: { matchMedia: () => motion } }
  const previous = Object.fromEntries(Object.keys(globals).map((key) => [key, globalThis[key]]))
  Object.assign(globalThis, globals)

  const event = (extra = {}) => ({
    target: link,
    button: 0,
    prevented: false,
    preventDefault() {
      this.prevented = true
    },
    ...extra,
  })

  try {
    await import("../src/scripts/screenshot-gallery.ts")
    const click = event()
    galleryEvents.get("click")(click)
    assert.equal(click.prevented, true)
    assert.equal(dialog.open, true)
    assert.equal(image.loading, "eager")
    assert.equal(transitions, 1)
    assert.equal(attributes.has("data-transitioning"), true)

    const escape = event()
    dialogEvents.get("cancel")(escape)
    assert.equal(escape.prevented, true)
    assert.equal(dialog.open, false)
    assert.equal(transitions, 2)
    assert.equal(attributes.has("data-transitioning"), true)
    await Promise.resolve()
    await Promise.resolve()
    assert.equal(attributes.has("data-transitioning"), false)

    motion.matches = true
    galleryEvents.get("click")(event())
    assert.equal(dialog.open, true)
    dialogEvents.get("submit")(event())
    assert.equal(dialog.open, false)
    assert.equal(transitions, 2)
    assert.equal(attributes.has("data-transitioning"), false)

    delete document.startViewTransition
    motion.matches = false
    galleryEvents.get("click")(event())
    assert.equal(dialog.open, true)
    dialogEvents.get("cancel")(event())
    assert.equal(dialog.open, false)

    const modified = event({ ctrlKey: true })
    galleryEvents.get("click")(modified)
    assert.equal(modified.prevented, false)
    assert.equal(dialog.open, false)

    image.decode = async () => {
      throw new Error("Image unavailable")
    }
    galleryEvents.get("click")(event())
    await Promise.resolve()
    assert.equal(dialog.open, true)
    dialogEvents.get("cancel")(event())
    assert.equal(dialog.open, false)

    link.dataset.screenshotOpen = "missing"
    const missing = event()
    galleryEvents.get("click")(missing)
    assert.equal(missing.prevented, false)
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) {
        delete globalThis[key]
      } else {
        globalThis[key] = value
      }
    }
  }
})
