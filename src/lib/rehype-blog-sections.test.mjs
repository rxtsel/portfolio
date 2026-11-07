import assert from "node:assert/strict"
import { test } from "node:test"
import rehypeBlogSections from "./rehype-blog-sections.mjs"

const element = (tagName, children = [], properties = {}) => ({
  type: "element",
  tagName,
  properties,
  children,
})
const blogFile = { path: "/project/src/content/blog/es/post.md" }

function collect(node, predicate) {
  return [
    ...(predicate(node) ? [node] : []),
    ...(node.children ?? []).flatMap((child) => collect(child, predicate)),
  ]
}

test("groups H2/H3 content in document order, preserving IDs, intro and nested headings", () => {
  const intro = element("p")
  const first = element("h2", [], { id: "first" })
  const paragraph = element("p")
  const quote = element("blockquote", [element("h3", [], { id: "nested" }), element("p")])
  const second = element("h2", [], { id: "second" })
  const tree = { type: "root", children: [intro, first, paragraph, quote, second, element("h4")] }
  rehypeBlogSections()(tree, blogFile)

  assert.equal(tree.children[0], intro)
  assert.equal(tree.children[1].children[0], first)
  assert.equal(tree.children[1].children[1], paragraph)
  assert.equal(first.properties.id, "first")
  assert.equal(tree.children[1].properties.id, "toc-section-0")
  const sections = collect(tree, (node) => node.properties?.className?.includes("blog-section"))
  assert.deepEqual(
    sections.map((node) => node.properties.style),
    [
      "view-timeline-name: --toc-section-0",
      "view-timeline-name: --toc-section-1",
      "view-timeline-name: --toc-section-2",
    ],
  )
  assert.equal(sections[2].children[1].tagName, "h4")
  assert.equal(quote.children[0].children[0].tagName, "h3")
  assert.equal(quote.children[0].children[0].properties.id, "nested")
  assert.equal(sections[0].children[2], quote)
})

test("assigns usable heading anchors to emoji-only titles without changing normal or explicit IDs", () => {
  const cross = element("h2", [{ type: "text", value: "❌" }])
  const check = element("h3", [element("strong", [{ type: "text", value: "✅" }])])
  const normal = element("h2", [{ type: "text", value: "Introducción" }])
  const explicit = element("h2", [{ type: "text", value: "❌" }], { id: "existing" })
  rehypeBlogSections()({ type: "root", children: [cross, check, normal, explicit] }, blogFile)
  assert.equal(cross.properties.id, "toc-heading-0")
  assert.equal(check.properties.id, "toc-heading-1")
  assert.equal(normal.properties.id, undefined)
  assert.equal(explicit.properties.id, "existing")
})

test("leaves non-blog content and posts without headings untouched", () => {
  for (const [tree, file] of [
    [{ type: "root", children: [element("h2")] }, { path: "/project/src/content/home/en.md" }],
    [{ type: "root", children: [element("p")] }, blogFile],
  ]) {
    const before = JSON.stringify(tree)
    rehypeBlogSections()(tree, file)
    assert.equal(JSON.stringify(tree), before)
  }
})
