import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { URL } from "node:url"
import { runInNewContext } from "node:vm"
import config from "../ec.config.mjs"

class ThemeControl {
  attributes = new Map()
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

test("theme controls cycle labels and persisted modes while tracking system changes", async () => {
  const source = await readFile(new URL("../src/components/ThemeScript.astro", import.meta.url), "utf8")
  const [, script] = source.match(/<script is:inline>([\s\S]*?)<\/script>/)
  const listeners = new Map()
  const schemeListeners = new Map()
  const control = new ThemeControl()
  const classes = new Set()
  let stored = null
  const root = {
    classList: { toggle: (name, active) => (active ? classes.add(name) : classes.delete(name)) },
    dataset: {},
    style: {},
  }
  const scheme = {
    matches: false,
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

  assert.equal(root.dataset.themeMode, "system")
  assert.equal(control.attributes.get("aria-label"), "System theme. Switch to light theme")
  for (const [mode, label] of [
    ["light", "Light theme. Switch to dark theme"],
    ["dark", "Dark theme. Switch to system theme"],
    ["system", "System theme. Switch to light theme"],
  ]) {
    listeners.get("click")({ target: control })
    assert.equal(stored, mode)
    assert.equal(root.dataset.themeMode, mode)
    assert.equal(control.attributes.get("aria-label"), label)
    assert.equal(classes.has("dark"), mode === "dark")
  }
  scheme.matches = true
  schemeListeners.get("change")()
  assert.equal(classes.has("dark"), true)
  assert.equal(root.dataset.themeMode, "system")
  assert.equal(control.attributes.get("aria-label"), "System theme. Switch to light theme")
  window.theme.set("light")
  schemeListeners.get("change")()
  assert.equal(classes.has("dark"), false)
  assert.equal(stored, "light")
})

for (const component of ["ThemeInitScript", "ThemeScript"]) {
  test(`${component} resolves explicit and system themes consistently`, async () => {
    const source = await readFile(new URL(`../src/components/${component}.astro`, import.meta.url), "utf8")
    const [, script] = source.match(/<script is:inline>([\s\S]*?)<\/script>/)

    for (const stored of [null, "system", "light", "dark", "invalid"]) {
      for (const systemDark of [false, true]) {
        const classes = new Set()
        const root = {
          classList: { toggle: (name, active) => (active ? classes.add(name) : classes.delete(name)) },
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
