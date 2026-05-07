import type { CollectionEntry } from "astro:content"

type StackEntry = CollectionEntry<"stack">
type StackItem = StackEntry["data"]["stack"][number]

export function getStackItemsBySlug(stackEntry: StackEntry, slugs: string[]) {
  const stackBySlug = new Map(stackEntry.data.stack.map((item) => [item.slug, item]))

  return slugs.map((slug): StackItem => {
    const item = stackBySlug.get(slug)

    if (!item) {
      throw new Error(`Missing stack item relation: ${slug}`)
    }

    return item
  })
}
