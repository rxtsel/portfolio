import assert from "node:assert/strict"
import { readFileSync, readdirSync } from "node:fs"
import test from "node:test"
import { URL } from "node:url"
import { getLocalizedProjects, getProjectDetailPath } from "../src/lib/projects.ts"
import { getScreenshotPlaceholderCount } from "../src/lib/screenshots.ts"
import rehypeBlogSections from "../src/lib/rehype-blog-sections.mjs"
import { getStackItemsBySlug, getTagItemsBySlug } from "../src/lib/taxonomy.ts"

test("project detail links preserve Xialu and opt in per project and language", () => {
  for (const locale of ["en", "es"]) {
    const entry = (translationKey, detailPage = false) => ({ data: { locale, translationKey, detailPage } })
    const base = locale === "es" ? "/es/proyectos" : "/projects"
    assert.equal(getProjectDetailPath(entry("dotfiles", true)), `${base}/dotfiles/`)
    assert.equal(getProjectDetailPath(entry("xialu")), `${base}/xialu/`)
    assert.equal(getProjectDetailPath(entry("onlysend", true)), `${base}/onlysend/`)
  }
})

test("detail stacks reuse the shared taxonomy without adding undeclared technologies", () => {
  const rust = { slug: "rust", name: "Rust", href: "https://www.rust-lang.org/" }
  const linux = { slug: "linux", name: "Linux" }
  const stack = { data: { stack: [linux, rust] } }
  assert.deepEqual(getStackItemsBySlug(stack, ["rust", "linux"]), [rust, linux])
  assert.deepEqual(getStackItemsBySlug(stack, []), [])
  assert.throws(() => getStackItemsBySlug(stack, ["missing"]), /Missing stack item relation/)
  const page = readFileSync(new URL("../src/components/ProjectDetailPage.astro", import.meta.url), "utf8")
  assert.ok(page.includes("getStackItemsBySlug(stack, project.data.stack)"))
  const architecture = { slug: "clean-architecture", name: "Clean Architecture" }
  const tags = { data: { tags: [architecture] } }
  assert.deepEqual(getTagItemsBySlug(tags, ["clean-architecture"]), [architecture])
  assert.deepEqual(getTagItemsBySlug(tags, []), [])
  assert.ok(page.includes("getTagItemsBySlug(tags, project.data.tags)"))
  assert.ok(page.includes('class="not-prose mt-3" tags={tagItems}'))
  assert.ok(page.includes("stackItems.length > 0 &&"))
  assert.ok(page.includes("aiTools.length > 0 &&"))
  assert.ok(page.includes("tocHeadings.indexOf(aiHeading)"))
})

test("galleries fill only the empty visible slots in either orientation", () => {
  for (const [orientation, slots] of [
    ["vertical", 4],
    ["horizontal", 2],
  ]) {
    for (const count of [0, 1, slots, slots + 3]) {
      const expected = orientation === "horizontal" && count === 1 ? 0 : Math.max(0, slots - count)
      assert.equal(getScreenshotPlaceholderCount(count, orientation), expected)
    }
  }
  const source = readFileSync(new URL("../src/components/ScreenshotGallery.astro", import.meta.url), "utf8")
  const placeholder = source.slice(source.indexOf("Array.from"), source.indexOf("</ul>"))
  assert.match(placeholder, /aria-label=\{labels.placeholder\}/)
  assert.doesNotMatch(placeholder, /<a\b|<dialog\b|data-screenshot-open/)
})

test("the oldest personal projects finish the list in both languages", () => {
  for (const locale of ["en", "es"]) {
    const directory = new URL(`../src/content/projects/${locale}/`, import.meta.url)
    const entries = readdirSync(directory).map((file) => {
      const source = readFileSync(new URL(file, directory), "utf8")
      return {
        data: {
          locale,
          title: file,
          translationKey: source.match(/^translationKey: (.+)$/m)[1],
          order: Number(source.match(/^order: (-?\d+)$/m)[1]),
        },
      }
    })
    assert.deepEqual(
      getLocalizedProjects(entries, locale)
        .slice(-3)
        .map((entry) => entry.data.translationKey),
      ["appimage-install", "nvim", "dotfiles"],
    )
  }
})

test("project Markdown links keep existing classes and use the site's underline style", () => {
  const link = {
    type: "element",
    tagName: "a",
    properties: { href: "/blog/", className: ["existing"] },
    children: [{ type: "text", value: "Guide" }],
  }
  const tree = { type: "root", children: [{ type: "element", tagName: "p", children: [link] }] }
  rehypeBlogSections()(tree, {
    path: "/src/content/projects/en/dotfiles.md",
    data: { astro: { frontmatter: { detailPage: true } } },
  })
  assert.deepEqual(link.properties.className, ["existing", "link-underline"])
})

test("project Markdown timelines reserve a gallery slot only when screenshots exist", () => {
  for (const screenshots of [undefined, [], [{ src: "example.webp" }]]) {
    const tree = {
      type: "root",
      children: [
        {
          type: "element",
          tagName: "h2",
          properties: { id: "why" },
          children: [{ type: "text", value: "Why" }],
        },
      ],
    }
    rehypeBlogSections()(tree, {
      path: "/src/content/projects/en/rpass-cli.md",
      data: { astro: { frontmatter: { detailPage: true, screenshots } } },
    })
    const index = screenshots?.length ? 1 : 0
    assert.equal(tree.children[0].properties.style, `view-timeline-name: --toc-section-${index}`)
  }
  const page = readFileSync(new URL("../src/components/ProjectDetailPage.astro", import.meta.url), "utf8")
  assert.match(page, /hasScreenshots &&/)
  assert.match(page, /hasScreenshots \? \[mediaHeading\] : \[\]/)
})
