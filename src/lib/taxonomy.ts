import type { CollectionEntry } from "astro:content"

type StackEntry = CollectionEntry<"stack">
type StackItem = StackEntry["data"]["stack"][number]
type TagsEntry = CollectionEntry<"tags">
type TagItem = TagsEntry["data"]["tags"][number]

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

export function getTagItemsBySlug(tagsEntry: TagsEntry, slugs: string[]) {
  const tagsBySlug = new Map(tagsEntry.data.tags.map((item) => [item.slug, item]))

  return slugs.map((slug): TagItem => {
    const item = tagsBySlug.get(slug)

    if (!item) {
      throw new Error(`Missing tag relation: ${slug}`)
    }

    return item
  })
}

export function getProjectTaxonomyItems({
  stackEntry,
  stackSlugs,
  tagSlugs = [],
  tagsEntry,
}: {
  stackEntry: StackEntry
  stackSlugs: string[]
  tagSlugs?: string[]
  tagsEntry: TagsEntry
}) {
  return [...getStackItemsBySlug(stackEntry, stackSlugs), ...getTagItemsBySlug(tagsEntry, tagSlugs)]
}
