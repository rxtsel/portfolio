import rss from "@astrojs/rss"
import { getCollection } from "astro:content"
import { getBlogPostPath } from "@/lib/i18n"
import { getPublishedBlogPosts } from "@/lib/blog"
import { compareDatesDescending } from "@/lib/date-time"

export async function GET(context: { site: URL }) {
  const posts = getPublishedBlogPosts(await getCollection("blog"), "es")

  return rss({
    title: "Blog de Cristhian Melo",
    description: "Artículos de ingeniería de software por Cristhian Melo.",
    site: context.site,
    items: posts
      .sort((a, b) => compareDatesDescending(a.data.publishDate, b.data.publishDate))
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.publishDate,
        link: getBlogPostPath(post),
      })),
    customData: "<language>es-CO</language>",
  })
}
