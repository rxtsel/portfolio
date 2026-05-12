import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { getBlogPostPath } from "@/lib/i18n"
import { getPublishedBlogPosts } from "@/lib/blog"

export async function GET(context: { site: URL }) {
  const posts = getPublishedBlogPosts(await getCollection("blog"), "en")

  return rss({
    title: "Cristhian Melo Blog",
    description: "Software engineering articles by Cristhian Melo.",
    site: context.site,
    items: posts
      .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: getBlogPostPath(post),
      })),
    customData: "<language>en-US</language>",
  })
}
