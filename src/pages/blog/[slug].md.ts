import { getCollection } from "astro:content"
import { getPublishedBlogStaticPaths } from "@/lib/blog"
import { readBlogMarkdownContent } from "@/lib/blog-markdown"

export async function getStaticPaths() {
  return getPublishedBlogStaticPaths(await getCollection("blog"), "en")
}

export async function GET({ props }: { props: Awaited<ReturnType<typeof getStaticPaths>>[number]["props"] }) {
  return new Response(await readBlogMarkdownContent(props.post.id), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  })
}
