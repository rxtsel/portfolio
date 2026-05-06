import type { CollectionEntry } from "astro:content"
import type { Locale } from "@/lib/i18n"

export type BlogPost = CollectionEntry<"blog">

export function getSelectedPublishedPosts(posts: BlogPost[], postIds: string[], locale: Locale) {
  const postsById = new Map(posts.map((post) => [post.id, post]))

  return postIds.map((postId) => {
    const post = postsById.get(postId)

    if (!post) {
      throw new Error(`Missing latest post relation: ${postId}`)
    }

    if (post.data.draft) {
      throw new Error(`Latest post relation points to draft post: ${postId}`)
    }

    if (post.data.locale !== locale) {
      throw new Error(`Latest post relation has wrong locale: ${postId}`)
    }

    return post
  })
}
