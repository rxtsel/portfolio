import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export async function GET(context: any) {
  const posts = await getCollection('blog')
  return rss({
    title: 'rxtsel.dev',
    description:
      'Articles about web development, technology, and productivity.',
    site: context.site,
    items: posts.map((post) => ({
      ...post.data,
      link: `/blog/${post.slug}/`
    }))
  })
}
