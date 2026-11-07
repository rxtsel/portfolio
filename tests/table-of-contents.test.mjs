import assert from "node:assert/strict"
import test from "node:test"
import { groupTocHeadings } from "../src/lib/table-of-contents.ts"

const heading = (depth, slug) => ({ depth, slug, text: slug })

test("TOC groups subsections and preserves timeline indices without changing the headings", () => {
  const headings = [
    heading(2, "product"),
    heading(3, "accounts"),
    heading(3, "transfers"),
    heading(2, "workflow"),
  ]
  const original = headings.map((item) => ({ ...item }))
  const entries = groupTocHeadings(headings)

  assert.deepEqual(
    entries.map(({ index }) => index),
    [0, 3],
  )
  assert.deepEqual(
    entries[0].children.map(({ index }) => index),
    [1, 2],
  )
  assert.equal(entries[0].children[1].heading.slug, "transfers")
  assert.deepEqual(entries[1].children, [])
  assert.deepEqual(headings, original)
})

test("TOC preserves a leading H3 and allows pages without headings", () => {
  assert.deepEqual(groupTocHeadings([]), [])
  const entries = groupTocHeadings([heading(3, "intro"), heading(2, "engineering"), heading(3, "storage")])
  assert.equal(entries[0].heading.slug, "intro")
  assert.deepEqual(entries[0].children, [])
  assert.equal(entries[1].children[0].heading.slug, "storage")
})
