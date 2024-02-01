import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    draft: z.boolean().default(false),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    categories: z.array(z.string()).default(['all']),
    tags: z.array(z.string()).default(['all']),
    authors: z.array(z.string()).default(['rxtsel']),
    keywords: z.string().default('rxtsel, Cristhian Melo, Blog'),
    lang: z.string().default('es')
  })
})

export const collections = { blog }
