import assert from "node:assert/strict"
import { test } from "node:test"
import { getReadingMinutes, stripFrontmatter } from "./blog-markdown.ts"

const words = (count) => Array(count).fill("palabra").join(" ")

test("estimates at 200 words/minute, rounded up with a one-minute minimum", () => {
  assert.equal(getReadingMinutes(""), 1)
  assert.equal(getReadingMinutes(words(200)), 1)
  assert.equal(getReadingMinutes(words(201)), 2)
  assert.equal(getReadingMinutes(words(401)), 3)
  assert.equal(getReadingMinutes(Array(201).fill("configuración").join(" ")), 2)
})

test("counts readable text and inline code, not code blocks, URLs or markup", () => {
  assert.equal(getReadingMinutes(`${words(200)}\n\n\`\`\`js\n${words(1000)}\n\`\`\``), 1)
  assert.equal(getReadingMinutes(`${words(200)}\n\n~~~sh\n${words(1000)}\n~~~`), 1)
  assert.equal(getReadingMinutes(`${words(200)}\n\n    ${words(1000)}`), 1)
  assert.equal(getReadingMinutes(`${words(200)} \`comando\``), 2)
  assert.equal(
    getReadingMinutes(`[${words(200)}](https://example.com/${words(400).replaceAll(" ", "/")})`),
    1,
  )
  assert.equal(getReadingMinutes(`${words(200)}\n\n![${words(400)}](/example.webp)`), 1)
  assert.equal(getReadingMinutes(`${words(200)} &amp; &#38; ❌`), 1)
})

test("frontmatter is excluded before estimating a post", () => {
  const markdown = `---\ntitle: ${words(400)}\n---\n\n${words(200)}`
  assert.equal(getReadingMinutes(stripFrontmatter(markdown)), 1)
})
