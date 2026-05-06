import type { CollectionEntry } from "astro:content"
import { getBlogPostSlug, getLocalizedPath, locales, type LanguageLink, type Locale } from "@/lib/i18n"

export type BlogPost = CollectionEntry<"blog">

export function getBlogPostTransitionName(post: BlogPost, part: "description" | "title") {
  const transitionId = post.id.replace(/[^a-zA-Z0-9_-]/g, "-")

  return `blog-${transitionId}-${part}`
}

export function getPublishedBlogPosts(posts: BlogPost[], locale: Locale) {
  return posts.filter((post) => post.data.locale === locale && !post.data.draft)
}

export function getPublishedBlogStaticPaths(posts: BlogPost[], locale: Locale) {
  return getPublishedBlogPosts(posts, locale).map((post) => ({
    params: { slug: getBlogPostSlug(post) },
    props: { post, posts },
  }))
}

export function getBlogPostAlternateHref(post: BlogPost) {
  const slug = getBlogPostSlug(post)

  return getLocalizedPath(post.data.locale, `blog/${slug}`)
}

export function getBlogPostLanguageLinks(posts: BlogPost[], post: BlogPost): LanguageLink[] {
  return locales.map((locale) => {
    const translatedPost = posts.find(
      (candidate) =>
        candidate.data.translationKey === post.data.translationKey && candidate.data.locale === locale,
    )

    return {
      href: translatedPost ? getBlogPostAlternateHref(translatedPost) : getLocalizedPath(locale, "blog"),
      locale,
    }
  })
}

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
