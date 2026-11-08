import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { URL } from "node:url"
import { createContext, runInContext } from "node:vm"
import ts from "typescript"

const component = await readFile(new URL("../src/components/PageActions.astro", import.meta.url), "utf8")
const [, actionsScript] = component.match(/<script>([\s\S]*?)<\/script>/)
const copyScript = await readFile(new URL("../src/scripts/copy-to-clipboard.ts", import.meta.url), "utf8")

function setup(copyFirst = true) {
  const nodes = []
  const listeners = new Map()
  const timers = new Map()
  const writes = []
  const opened = []
  let timerId = 0
  const document = {
    activeElement: null,
    addEventListener(name, handler) {
      const handlers = listeners.get(name) ?? []
      handlers.push(handler)
      listeners.set(name, handlers)
    },
    getElementById: (id) => nodes.find((node) => node.getAttribute("id") === id) ?? null,
    querySelectorAll: (selector) => nodes.filter((node) => node.matches(selector)),
  }
  class Element {
    attributes = new Map()
    children = []
    textContent = ""
    inert = false
    tabIndex = 0
    classes = new Set()
    classList = {
      contains: (name) => this.classes.has(name),
      add: (name) => this.classes.add(name),
      remove: (name) => this.classes.delete(name),
    }
    constructor(attributes = {}, parent) {
      this.attributes = new Map(Object.entries(attributes))
      this.parentElement = parent ?? null
      parent?.children.push(this)
      nodes.push(this)
    }
    get dataset() {
      return Object.fromEntries(
        [...this.attributes]
          .filter(([key]) => key.startsWith("data-"))
          .map(([key, value]) => [
            key.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
            value,
          ]),
      )
    }
    getAttribute(name) {
      return this.attributes.get(name) ?? null
    }
    setAttribute(name, value) {
      this.attributes.set(name, value)
    }
    matches(selector) {
      const [, name, value] = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/) ?? []
      return this.attributes.has(name) && (value === undefined || this.getAttribute(name) === value)
    }
    closest(selector) {
      return this.matches(selector) ? this : (this.parentElement?.closest(selector) ?? null)
    }
    contains(node) {
      return node === this || (node?.parentElement ? this.contains(node.parentElement) : false)
    }
    querySelectorAll(selector) {
      return nodes.filter((node) => node !== this && this.contains(node) && node.matches(selector))
    }
    querySelector(selector) {
      return this.querySelectorAll(selector)[0] ?? null
    }
    focus() {
      document.activeElement = this
    }
    dispatchEvent(event) {
      dispatch(event.type, this)
    }
  }
  class HTMLTemplateElement extends Element {}
  class HTMLScriptElement extends Element {}
  class CustomEvent {
    constructor(type) {
      this.type = type
    }
  }
  const body = new Element()
  const root = new Element(
    { "data-page-actions": "", "data-title": "Title", "data-url": "https://example.com/post" },
    body,
  )
  function menu(name) {
    const trigger = new Element({ "data-dropdown-toggle": name, "aria-expanded": "false" }, root)
    const panel = new Element({ id: name, role: "menu", "aria-hidden": "true" }, root)
    panel.classList.add("hidden")
    panel.inert = true
    return { trigger, panel }
  }
  const ai = menu("page-ai-menu")
  const chatgpt = new Element({ role: "menuitem", "data-page-action": "chatgpt" }, ai.panel)
  const claude = new Element({ role: "menuitem", "data-page-action": "claude" }, ai.panel)
  const share = menu("page-share-menu")
  const copyButton = new Element(
    { role: "menuitem", "data-copy-button": "", "data-copy-text": "https://example.com/post" },
    share.panel,
  )
  const label = new Element({ "data-copy-label": "Copiar enlace" }, copyButton)
  label.textContent = "Copiar enlace"
  const status = new Element(
    { "data-copy-status": "", "data-copied-label": "Copiado", "data-error-label": "No se pudo copiar" },
    copyButton,
  )
  const shareX = new Element({ role: "menuitem", "data-page-action": "share-x" }, share.panel)
  const clipboard = {
    async writeText(text) {
      writes.push(text)
    },
  }
  const window = {
    setTimeout: (fn, delay) => {
      timers.set(++timerId, { fn, delay })
      return timerId
    },
    clearTimeout: (id) => timers.delete(id),
    open: (...args) => opened.push(args),
  }
  function dispatch(type, target, extra = {}) {
    const event = {
      target,
      prevented: false,
      preventDefault() {
        this.prevented = true
      },
      stopPropagation() {},
      ...extra,
    }
    for (const handler of listeners.get(type) ?? []) {
      handler(event)
    }
    return event
  }
  const context = createContext({
    document,
    window,
    navigator: { clipboard },
    Element,
    HTMLElement: Element,
    HTMLTemplateElement,
    HTMLScriptElement,
    CustomEvent,
  })
  for (const script of copyFirst ? [copyScript, actionsScript] : [actionsScript, copyScript]) {
    const { outputText } = ts.transpileModule(script, { compilerOptions: { target: ts.ScriptTarget.ES2022 } })
    runInContext(outputText, context)
  }
  return {
    Element,
    body,
    root,
    ai,
    chatgpt,
    claude,
    share,
    copyButton,
    shareX,
    label,
    status,
    clipboard,
    writes,
    opened,
    timers,
    document,
    click: (target) => {
      target.focus()
      return dispatch("click", target)
    },
    key: (target, key) => dispatch("keydown", target, { key }),
    reset() {
      for (const [id, timer] of [...timers]) {
        timers.delete(id)
        assert.equal(timer.delay, 1500)
        timer.fn()
      }
    },
  }
}
const flush = async () => {
  for (let i = 0; i < 6; i++) {
    await Promise.resolve()
  }
}

for (const copyFirst of [true, false]) {
  test(`copy feedback stays visible regardless of listener order (copy first: ${copyFirst})`, async () => {
    const ui = setup(copyFirst)
    ui.click(ui.share.trigger)
    ui.click(ui.copyButton)
    await flush()
    assert.deepEqual(ui.writes, ["https://example.com/post"])
    assert.equal(ui.copyButton.getAttribute("data-copy-state"), "done")
    assert.equal(ui.label.textContent, "Copiado")
    assert.equal(ui.status.textContent, "Copiado")
    assert.equal(ui.share.trigger.getAttribute("aria-expanded"), "true")
    assert.equal(ui.share.panel.inert, false)
    assert.equal(ui.document.activeElement, ui.copyButton)
    ui.reset()
    assert.equal(ui.label.textContent, "Copiar enlace")
    assert.equal(ui.status.textContent, "")
    assert.equal(ui.share.trigger.getAttribute("aria-expanded"), "true")
  })
}

test("copy failure remains visible and preserves the fallback action", async () => {
  const ui = setup()
  ui.clipboard.writeText = async () => {
    throw new Error("Permission denied")
  }
  ui.copyButton.setAttribute("data-copy-fallback-href", "/post.md")
  ui.click(ui.share.trigger)
  ui.click(ui.copyButton)
  await flush()
  assert.equal(ui.copyButton.getAttribute("data-copy-state"), "error")
  assert.equal(ui.label.textContent, "No se pudo copiar")
  assert.equal(ui.status.textContent, "No se pudo copiar")
  assert.equal(ui.share.panel.inert, false)
  assert.deepEqual(ui.opened, [["/post.md", "_blank", "noopener,noreferrer"]])
  ui.reset()
  assert.equal(ui.label.textContent, "Copiar enlace")
})

test("a pending copy cannot close or steal focus from another menu", async () => {
  const ui = setup()
  let finish
  ui.clipboard.writeText = () =>
    new Promise((resolve) => {
      finish = resolve
    })
  ui.click(ui.share.trigger)
  ui.click(ui.copyButton)
  ui.click(ui.ai.trigger)
  assert.equal(ui.share.panel.inert, true)
  finish()
  await flush()
  assert.equal(ui.ai.trigger.getAttribute("aria-expanded"), "true")
  assert.equal(ui.ai.panel.inert, false)
  assert.equal(ui.document.activeElement, ui.chatgpt)
})

test("repeated copies restart only the feedback reset, not the menu", async () => {
  const ui = setup()
  ui.click(ui.share.trigger)
  ui.click(ui.copyButton)
  await flush()
  const firstTimer = [...ui.timers.keys()][0]
  ui.click(ui.copyButton)
  await flush()
  assert.equal(ui.timers.size, 1)
  assert.equal(ui.timers.has(firstTimer), false)
  assert.equal(ui.share.panel.inert, false)
  ui.reset()
  assert.equal(ui.label.textContent, "Copiar enlace")
})

test("menus support arrow keys, Home/End, Escape and native Tab dismissal", () => {
  const ui = setup()
  ui.key(ui.share.trigger, "ArrowDown")
  assert.equal(ui.document.activeElement, ui.copyButton)
  assert.equal(ui.copyButton.tabIndex, -1)
  ui.key(ui.copyButton, "ArrowUp")
  assert.equal(ui.document.activeElement, ui.shareX)
  ui.key(ui.shareX, "ArrowDown")
  assert.equal(ui.document.activeElement, ui.copyButton)
  ui.key(ui.copyButton, "End")
  assert.equal(ui.document.activeElement, ui.shareX)
  ui.key(ui.shareX, "Home")
  assert.equal(ui.document.activeElement, ui.copyButton)
  assert.equal(ui.key(ui.copyButton, "Escape").prevented, true)
  assert.equal(ui.document.activeElement, ui.share.trigger)
  assert.equal(ui.share.panel.inert, true)
  assert.equal(ui.share.panel.getAttribute("aria-hidden"), "true")
  assert.equal(ui.share.panel.classList.contains("hidden"), true)
  ui.key(ui.ai.trigger, "ArrowUp")
  assert.equal(ui.document.activeElement, ui.claude)
  assert.equal(ui.key(ui.claude, "Tab").prevented, false)
  assert.equal(ui.ai.panel.inert, true)
  assert.equal(ui.document.activeElement, ui.ai.trigger)
})

test("switching, outside clicks, trigger toggles and external actions dismiss correctly", () => {
  const ui = setup()
  ui.click(ui.share.trigger)
  ui.click(ui.ai.trigger)
  assert.equal(ui.share.trigger.getAttribute("aria-expanded"), "false")
  assert.equal(ui.ai.panel.getAttribute("aria-hidden"), "false")
  ui.click(ui.ai.trigger)
  assert.equal(ui.ai.panel.inert, true)
  ui.click(ui.share.trigger)
  ui.click(ui.body)
  assert.equal(ui.share.panel.inert, true)
  ui.click(ui.share.trigger)
  ui.click(ui.shareX)
  assert.equal(ui.share.panel.inert, true)
  assert.equal(ui.document.activeElement, ui.share.trigger)
  assert.deepEqual(ui.opened, [
    [
      "https://x.com/intent/tweet?text=Title&url=https%3A%2F%2Fexample.com%2Fpost",
      "_blank",
      "noopener,noreferrer",
    ],
  ])
})
