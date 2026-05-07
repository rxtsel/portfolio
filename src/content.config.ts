import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

const localeSchema = z.enum(["en", "es"])
const optionalDateSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().optional(),
)
const optionalStringSchema = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().optional(),
)
const optionalUrlSchema = z.preprocess((value) => (value === "" ? undefined : value), z.url().optional())
const stackReferenceSchema = z.string().min(1)
const tagReferenceSchema = z.string().min(1)

const stackItemSchema = z.object({
  name: z.string().min(1),
  href: optionalStringSchema,
  slug: z.string().min(1),
})

const tagItemSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

const stack = defineCollection({
  loader: glob({ base: "./src/content", pattern: "stack.{md,mdx}" }),
  schema: () =>
    z.object({
      stack: z.array(stackItemSchema).default([]),
    }),
})

const tags = defineCollection({
  loader: glob({ base: "./src/content", pattern: "tags.{md,mdx}" }),
  schema: () =>
    z.object({
      tags: z.array(tagItemSchema).default([]),
    }),
})

const home = defineCollection({
  loader: glob({ base: "./src/content/home", pattern: "*.{md,mdx}" }),
  schema: () =>
    z.object({
      locale: localeSchema,
      title: z.string().min(1),
      intro: z.string().min(1),
      projects: z.array(projectSchema).default([]),
      experience: z.array(experienceSchema).default([]),
      stack: z.array(stackReferenceSchema).default([]),
      latestPosts: latestPostsSchema,
      seo: seoSchema.optional(),
    }),
})

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  href: optionalUrlSchema,
  sourceUrl: optionalUrlSchema,
  stack: z.array(stackReferenceSchema).default([]),
  tags: z.array(tagReferenceSchema).optional().default([]),
})

const latestPostsSchema = z
  .array(z.string().min(1))
  .max(5)
  .superRefine((posts, context) => {
    const seenPosts = new Set<string>()

    posts.forEach((post, index) => {
      if (seenPosts.has(post)) {
        context.addIssue({
          code: "custom",
          message: "Latest posts cannot contain duplicate posts",
          path: [index],
        })
      }

      seenPosts.add(post)
    })
  })
  .default([])

const experienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  startDate: z.string().min(1),
  endDate: optionalStringSchema,
  highlights: z.array(z.string()).default([]),
})

const seoSchema = z.object({
  description: z.string().min(1).max(200),
  keywords: optionalStringSchema,
  ogImage: optionalStringSchema,
  title: z.string().min(1).max(120),
})

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      coverImage: optionalStringSchema,
      coverImageAlt: optionalStringSchema,
      description: z.string().min(1).max(200),
      locale: localeSchema,
      published: z.boolean().default(false),
      publishDate: z.coerce.date(),
      seo: seoSchema.optional(),
      tags: z.array(tagReferenceSchema).optional().default([]),
      title: z.string().min(1),
      translationKey: z.string().min(1),
      updatedDate: optionalDateSchema,
    }),
})

export const collections = { blog, home, stack, tags }
