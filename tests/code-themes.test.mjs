import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { URL } from "node:url"
import { runInNewContext } from "node:vm"
import config from "../ec.config.mjs"

class ThemeControl {
  constructor(labels) {
    this.attributes = new Map([
      ["data-light-label", labels.light],
      ["data-dark-label", labels.dark],
    ])
  }
  getAttribute(name) {
    return this.attributes.get(name) ?? null
  }
  closest(selector) {
    return selector === "[data-theme-toggle]" ? this : null
  }
  setAttribute(name, value) {
    this.attributes.set(name, value)
  }
}

test("GitHub syntax follows the site's dark class and surface tokens", () => {
  assert.deepEqual(config.themes, ["github-light-default", "github-dark-default"])
  assert.equal(config.useDarkModeMediaQuery, false)
  assert.equal(config.themeCssSelector({ type: "light" }), ":root:not(.dark)")
  assert.equal(config.themeCssSelector({ type: "dark" }), ".dark")
  assert.equal(config.styleOverrides.codeBackground, "var(--popover)")
  assert.equal(config.styleOverrides.borderColor, "var(--border)")
  assert.equal(config.styleOverrides.borderRadius, "0")
})

test("theme controls follow the system until clicked, then toggle only light/dark with localized action labels", async () => {
  const source = await readFile(new URL("../src/components/ThemeScript.astro", import.meta.url), "utf8")
  const [, script] = source.match(/<script is:inline>([\s\S]*?)<\/script>/)

  for (const initialDark of [false, true]) {
    for (const labels of [
      { light: "Switch to light theme", dark: "Switch to dark theme" },
      { light: "Cambiar a tema claro", dark: "Cambiar a tema oscuro" },
    ]) {
      const listeners = new Map()
      const schemeListeners = new Map()
      const control = new ThemeControl(labels)
      const classes = new Set()
      let stored = null
      const root = {
        classList: {
          toggle: (name, active) => (active ? classes.add(name) : classes.delete(name)),
          contains: (name) => classes.has(name),
        },
        dataset: {},
        style: {},
      }
      const scheme = {
        matches: initialDark,
        addEventListener: (name, handler) => schemeListeners.set(name, handler),
      }
      const window = { matchMedia: () => scheme }
      runInNewContext(script, {
        document: {
          documentElement: root,
          querySelectorAll: () => [control],
          addEventListener: (name, handler) => listeners.set(name, handler),
        },
        localStorage: {
          getItem: () => stored,
          setItem: (_, value) => {
            stored = value
          },
        },
        window,
        Element: ThemeControl,
      })

      const checkLabel = () =>
        assert.equal(control.getAttribute("aria-label"), labels[classes.has("dark") ? "light" : "dark"])
      assert.equal(root.dataset.themeMode, "system")
      assert.equal(classes.has("dark"), initialDark)
      checkLabel()
      scheme.matches = !initialDark
      schemeListeners.get("change")()
      assert.equal(classes.has("dark"), !initialDark)
      assert.equal(stored, null, "following the system does not store a manual preference")
      checkLabel()

      for (let i = 0; i < 4; i++) {
        const wasDark = classes.has("dark")
        listeners.get("click")({ target: control })
        assert.equal(classes.has("dark"), !wasDark, "every click visibly changes the theme")
        assert.equal(stored, wasDark ? "light" : "dark")
        assert.equal(root.dataset.themeMode, stored)
        checkLabel()
      }
      const manualDark = classes.has("dark")
      scheme.matches = !manualDark
      schemeListeners.get("change")()
      assert.equal(classes.has("dark"), manualDark, "system changes do not override an explicit choice")
      checkLabel()
      listeners.get("DOMContentLoaded")()
      checkLabel()

      window.theme.apply("system")
      const renderedDark = classes.has("dark")
      listeners.get("click")({ target: control })
      assert.equal(classes.has("dark"), !renderedDark, "toggle follows the rendered theme, not stale storage")
      checkLabel()
    }
  }
})

for (const component of ["ThemeInitScript", "ThemeScript"]) {
  test(`${component} resolves explicit and system themes consistently`, async () => {
    const source = await readFile(new URL(`../src/components/${component}.astro`, import.meta.url), "utf8")
    const [, script] = source.match(/<script is:inline>([\s\S]*?)<\/script>/)

    for (const stored of [null, "system", "light", "dark", "invalid"]) {
      for (const systemDark of [false, true]) {
        const classes = new Set()
        const root = {
          classList: {
            toggle: (name, active) => (active ? classes.add(name) : classes.delete(name)),
            contains: (name) => classes.has(name),
          },
          dataset: {},
          style: {},
        }
        const scheme = { matches: systemDark, addEventListener() {} }
        const window = { matchMedia: () => scheme }
        runInNewContext(script, {
          document: { documentElement: root, querySelectorAll: () => [], addEventListener() {} },
          localStorage: { getItem: () => stored },
          window,
        })

        const expectedDark = stored === "dark" || (stored !== "light" && systemDark)
        assert.equal(classes.has("dark"), expectedDark, `${stored}/OS dark=${systemDark}`)
        assert.equal(root.style.colorScheme, expectedDark ? "dark" : "light")

        if (window.theme) {
          window.theme.apply("light")
          assert.equal(classes.has("dark"), false)
          window.theme.apply("dark")
          assert.equal(classes.has("dark"), true)
          scheme.matches = !systemDark
          window.theme.apply("system")
          assert.equal(classes.has("dark"), !systemDark)
        }
      }
    }
  })
}
