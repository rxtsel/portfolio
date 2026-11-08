import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import test from "node:test"
import { URL } from "node:url"
import { getProjectPage } from "../src/lib/project-pages.ts"
import {
  getLocalizedProjects,
  getProjectsHeadingTransitionName,
  getProjectTransitionName,
  getSelectedProjects,
} from "../src/lib/projects.ts"

test("coded project pages resolve by translation key in both languages", () => {
  const page = getProjectPage("xialu")
  assert.equal(page.locales.en.path, "/projects/xialu/")
  assert.equal(page.locales.es.path, "/es/proyectos/xialu/")
  assert.equal(page.logoPath, "src/assets/projects/xialu.webp")
  for (const key of ["xavel", "missing", "__proto__", "constructor"]) {
    assert.equal(getProjectPage(key), undefined)
  }
})

test("shared navigation pages wait for their snapshot marker without blocking Home", () => {
  const read = (file) => readFileSync(new URL(`../src/${file}`, import.meta.url), "utf8")
  assert.match(read("layouts/MainLayout.astro"), /<slot name="head"\s*\/>/)
  assert.match(read("layouts/MainLayout.astro"), /<slot\s*\/>[\s\S]*<Footer/)
  assert.match(read("components/Footer.astro"), /<footer\b[^>]*id="site-footer"/)
  for (const [file, marker] of [
    ["ProjectsIndexPage", "site-footer"],
    ["XialuProjectPage", "site-footer"],
    ["BlogIndexPage", "site-footer"],
    ["BlogPostPage", "blog-post-content"],
  ]) {
    const link = read(`components/${file}.astro`).match(/<link\b[^>]*rel="expect"[^>]*>/)?.[0]
    assert.ok(link)
    for (const attribute of ['blocking="render"', `href="#${marker}"`, 'slot="head"']) {
      assert.ok(link.includes(attribute))
    }
  }
  assert.match(read("components/BlogPostPage.astro"), /<section\b[^>]*id="blog-post-content"/)
  assert.doesNotMatch(read("components/HomePage.astro"), /rel="expect"/)
})

test("Xialu's critical logo is inlined and decoded synchronously", () => {
  const source = readFileSync(new URL("../src/components/XialuProjectPage.astro", import.meta.url), "utf8")
  assert.match(source, /import xialuIcon from "@\/assets\/projects\/xialu\.webp\?inline"/)
  const logo = source.match(/<img\b[^>]*src=\{xialuIcon\}[^>]*>/)?.[0]
  assert.ok(logo)
  assert.ok(logo.includes('decoding="sync"'))
  assert.ok(logo.includes('loading="eager"'))
})

test("project navigation headings share a locale-specific identity", () => {
  assert.equal(getProjectsHeadingTransitionName("en"), "projects-en-heading")
  assert.equal(getProjectsHeadingTransitionName("es"), "projects-es-heading")
})

for (const locale of ["en", "es"]) {
  test(`title and logo transition identities survive CMS filename changes in ${locale}`, () => {
    const data = { locale, translationKey: "xialu" }
    const entry = { id: `${locale}/renamed-by-cms`, data }
    const page = { data }
    for (const part of ["title", "logo"]) {
      assert.equal(getProjectTransitionName(entry, part), `project-${locale}-xialu-${part}`)
      assert.equal(getProjectTransitionName(entry, part), getProjectTransitionName(page, part))
    }
    assert.notEqual(getProjectTransitionName(page, "title"), getProjectTransitionName(page, "logo"))
  })

  test(`project order is independent of dates and featured selection in ${locale}`, () => {
    const projects = [
      {
        id: `${locale}/xavel`,
        data: {
          locale,
          title: "Xavel",
          translationKey: "xavel",
          order: 17,
          publishDate: new Date("2026-08-06"),
        },
      },
      {
        id: `${locale}/xialu`,
        data: {
          locale,
          title: "Xialu",
          translationKey: "xialu",
          order: 18,
          publishDate: new Date("2025-01-01"),
        },
      },
    ]
    assert.deepEqual(
      getLocalizedProjects(projects, locale).map((project) => project.data.translationKey),
      ["xialu", "xavel"],
    )
    assert.deepEqual(
      getSelectedProjects(projects, ["xavel"], locale).map((project) => project.data.translationKey),
      ["xavel"],
    )
    assert.equal(projects[0].data.translationKey, "xavel")
  })
}
