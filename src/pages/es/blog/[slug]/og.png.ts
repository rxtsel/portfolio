import { getCollection } from "astro:content"
import { getPublishedBlogStaticPaths, type BlogPost } from "@/lib/blog"
import { generateBlogOgImage } from "@/lib/og"

interface Props {
  props: { post: BlogPost }
}

export async function GET({ props }: Props) {
  return generateBlogOgImage(props.post)
}

export async function getStaticPaths() {
  return getPublishedBlogStaticPaths(await getCollection("blog"), "es")
}
