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

const seoSchema = z.object({
  description: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(120).optional(),
})

const projectSchema = z.object({
  description: z.string().min(1),
  href: z.url().min(1).optional(),
  name: z.string().min(1),
  tags: z.array(z.string()).default([]),
})

const experienceSchema = z.object({
  company: z.string().min(1),
  endDate: optionalStringSchema,
  highlights: z.array(z.string()).default([]),
  role: z.string().min(1),
  startDate: z.string().min(1),
})

const stackItemSchema = z.object({
  href: optionalStringSchema,
  tech: z.string().min(1),
})

const home = defineCollection({
  loader: glob({ base: "./src/content/home", pattern: "*.{md,mdx}" }),
  schema: () =>
    z.object({
      description: z.string().min(1).max(200),
      experience: z.array(experienceSchema).default([]),
      heroTitle: z.string().min(1),
      intro: z.string().min(1),
      latestPosts: latestPostsSchema,
      locale: localeSchema,
      projects: z.array(projectSchema).default([]),
      seo: seoSchema.optional(),
      stack: z.array(stackItemSchema).default([]),
      title: z.string().min(1),
    }),
})

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: () =>
    z.object({
      coverImage: optionalStringSchema,
      coverImageAlt: optionalStringSchema,
      description: z.string().min(1).max(200),
      draft: z.boolean().default(false),
      locale: localeSchema,
      publishDate: z.coerce.date(),
      seo: seoSchema.optional(),
      tags: z.array(z.string()).default([]),
      title: z.string().min(1),
      translationKey: z.string().min(1),
      updatedDate: optionalDateSchema,
    }),
})

export const collections = { blog, home }
