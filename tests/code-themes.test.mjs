import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"
import { URL } from "node:url"
import { runInNewContext } from "node:vm"
import config from "../ec.config.mjs"

test("GitHub syntax follows the site's dark class and surface tokens", () => {
  assert.deepEqual(config.themes, ["github-light-default", "github-dark-default"])
  assert.equal(config.useDarkModeMediaQuery, false)
  assert.equal(config.themeCssSelector({ type: "light" }), ":root:not(.dark)")
  assert.equal(config.themeCssSelector({ type: "dark" }), ".dark")
  assert.equal(config.styleOverrides.codeBackground, "var(--popover)")
  assert.equal(config.styleOverrides.borderColor, "var(--border)")
  assert.equal(config.styleOverrides.borderRadius, "0")
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
