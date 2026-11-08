import assert from "node:assert/strict"
import test from "node:test"

const deferred = () => {
  let resolve
  const promise = new Promise((done) => {
    resolve = done
  })
  return { promise, resolve }
}

test("gallery loads before capturing and discards cancelled or superseded openings", async (t) => {
  const galleryEvents = new Map()
  const documentEvents = new Map()
  const windowEvents = new Map()
  const motion = { matches: false }
  const status = { textContent: "" }
  let transitions = 0
  let manualTransitions = false
  const updates = []

  class Element {
    attributes = new Map()
    setAttribute(name, value) {
      this.attributes.set(name, value)
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null
    }
    removeAttribute(name) {
      this.attributes.delete(name)
    }
  }
  class HTMLDialogElement extends Element {
    parentElement = new Element()
    isConnected = true
    open = false
    image = { loading: "lazy", decode: async () => {} }
    events = new Map()
    showModal() {
      this.open = true
    }
    close() {
      this.open = false
    }
    querySelector() {
      return this.image
    }
    addEventListener(name, handler) {
      this.events.set(name, handler)
    }
  }
  const dialogs = [new HTMLDialogElement(), new HTMLDialogElement()]
  const links = dialogs.map((_, index) => {
    const link = new Element()
    link.dataset = { screenshotOpen: `example-${index}` }
    link.closest = () => link
    return link
  })
  const gallery = {
    dataset: { loadingLabel: "Loading screenshot…" },
    contains: (element) => links.includes(element),
    querySelector: () => status,
    querySelectorAll: () => dialogs,
    addEventListener: (name, handler) => galleryEvents.set(name, handler),
  }
  const document = {
    hidden: false,
    querySelectorAll: () => [gallery],
    getElementById: (id) => dialogs.find((_, index) => id === `example-${index}`),
    addEventListener: (name, handler) => documentEvents.set(name, handler),
    startViewTransition: (update) => {
      transitions++
      const done = deferred()
      const run = () => {
        assert.equal(update(), undefined, "snapshot updates must not wait on asynchronous work")
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
    window: {
      matchMedia: () => motion,
      addEventListener: (name, handler) => windowEvents.set(name, handler),
    },
  }
  const previous = Object.fromEntries(Object.keys(globals).map((key) => [key, globalThis[key]]))
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
  const click = (index = 0, extra = {}) =>
    galleryEvents.get("click")(event({ target: links[index], ...extra }))
  const close = (index = 0, type = "cancel") => dialogs[index].events.get(type)(event())

  try {
    await import("../src/scripts/screenshot-gallery.ts")

    await t.test("slow decoding leaves the page interactive until the image is ready", async () => {
      const ready = deferred()
      dialogs[0].image.decode = () => ready.promise
      const opening = click()
      assert.equal(dialogs[0].open, false)
      assert.equal(transitions, 0)
      assert.equal(dialogs[0].image.loading, "eager")
      assert.equal(links[0].getAttribute("aria-busy"), "true")
      assert.equal(status.textContent, "Loading screenshot…")
      ready.resolve()
      await opening
      assert.equal(dialogs[0].open, true)
      assert.equal(transitions, 1)
      assert.equal(links[0].getAttribute("aria-busy"), null)
      assert.equal(status.textContent, "")
      close()
      assert.equal(dialogs[0].open, false)
    })

    for (const [name, cancel] of [
      ["Escape", () => documentEvents.get("keydown")({ key: "Escape" })],
      ["outside click", () => documentEvents.get("click")({ target: new Element() })],
      ["page navigation", () => windowEvents.get("pagehide")()],
      [
        "hidden page",
        () => {
          document.hidden = true
        },
      ],
      [
        "removed dialog",
        () => {
          dialogs[0].isConnected = false
        },
      ],
    ]) {
      await t.test(`${name} prevents a late image from opening a discarded dialog`, async () => {
        const ready = deferred()
        dialogs[0].image.decode = () => ready.promise
        const count = transitions
        const opening = click()
        cancel()
        ready.resolve()
        await opening
        assert.equal(dialogs[0].open, false)
        assert.equal(transitions, count)
        assert.equal(links[0].getAttribute("aria-busy"), null)
        assert.equal(status.textContent, "")
        document.hidden = false
        dialogs[0].isConnected = true
      })
    }

    await t.test("only the latest selection opens, even when older images finish first", async () => {
      const first = deferred(),
        second = deferred()
      dialogs[0].image.decode = () => first.promise
      dialogs[1].image.decode = () => second.promise
      const count = transitions
      const older = click(0),
        latest = click(1)
      assert.equal(links[0].getAttribute("aria-busy"), null)
      assert.equal(links[1].getAttribute("aria-busy"), "true")
      first.resolve()
      await older
      assert.equal(transitions, count)
      second.resolve()
      await latest
      assert.equal(dialogs[0].open, false)
      assert.equal(dialogs[1].open, true)
      close(1, "submit")
    })

    await t.test("repeated clicks do not queue multiple openings", async () => {
      const ready = deferred()
      let decodes = 0
      dialogs[0].image.decode = () => {
        decodes++
        return ready.promise
      }
      const opening = click()
      await click()
      assert.equal(decodes, 1)
      ready.resolve()
      await opening
      assert.equal(dialogs[0].open, true)
      close()
    })

    await t.test("retrying the same link after cancellation does not revive its older request", async () => {
      const ready = deferred()
      dialogs[0].image.decode = () => ready.promise
      const count = transitions
      const older = click()
      documentEvents.get("keydown")({ key: "Escape" })
      const latest = click()
      ready.resolve()
      await Promise.all([older, latest])
      assert.equal(dialogs[0].open, true)
      assert.equal(transitions, count + 1)
      close()
    })

    await t.test("Escape also cancels an opening queued for the next snapshot", async () => {
      dialogs[0].image.decode = async () => {}
      manualTransitions = true
      await click()
      assert.equal(dialogs[0].open, false)
      assert.equal(dialogs[0].parentElement.getAttribute("data-transitioning"), "")
      documentEvents.get("keydown")({ key: "Escape" })
      updates.shift()()
      await Promise.resolve()
      assert.equal(dialogs[0].open, false)
      assert.equal(dialogs[0].parentElement.getAttribute("data-transitioning"), null)
      manualTransitions = false
    })

    await t.test("a failed image still leaves a closable native dialog", async () => {
      dialogs[0].image.decode = async () => {
        throw new Error("Image unavailable")
      }
      await click()
      assert.equal(dialogs[0].open, true)
      close()
      assert.equal(dialogs[0].open, false)
    })

    await t.test("reduced motion and missing API preserve native open and close", async () => {
      dialogs[0].image.decode = async () => {}
      const count = transitions
      motion.matches = true
      await click()
      assert.equal(dialogs[0].open, true)
      close(0, "submit")
      assert.equal(dialogs[0].open, false)
      assert.equal(transitions, count)
      motion.matches = false
      const native = document.startViewTransition
      delete document.startViewTransition
      await click()
      assert.equal(dialogs[0].open, true)
      close()
      assert.equal(dialogs[0].open, false)
      document.startViewTransition = native
    })

    await t.test("modified clicks and missing targets keep their native link behavior", async () => {
      const modified = event({ ctrlKey: true })
      await galleryEvents.get("click")(modified)
      assert.equal(modified.prevented, false)
      links[0].dataset.screenshotOpen = "missing"
      const missing = event()
      await galleryEvents.get("click")(missing)
      assert.equal(missing.prevented, false)
    })
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
