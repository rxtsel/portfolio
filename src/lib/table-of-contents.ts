import type { MarkdownHeading } from "astro"

type TocItem = { heading: MarkdownHeading; index: number }
type TocBranch = TocItem & { children: TocItem[] }

export function groupTocHeadings(headings: MarkdownHeading[]) {
  const entries: TocBranch[] = []

  for (const [index, heading] of headings.entries()) {
    const parent = entries.at(-1)
    if (heading.depth === 3 && parent?.heading.depth === 2) {
      parent.children.push({ heading, index })
    } else {
      entries.push({ heading, index, children: [] })
    }
  }

  return entries
}
