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
const projectReferenceSchema = z.string().min(1)
const plainDateSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format"),
)

export const stackItemSchema = z.object({
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
      featuredProjects: z
        .array(projectReferenceSchema)
        .max(4, "Home cannot feature more than 4 projects")
        .default([]),
      stack: z.array(stackReferenceSchema).default([]),
      latestPosts: latestPostsSchema,
      seo: seoSchema.optional(),
    }),
})

const projectSchema = z.object({
  locale: localeSchema,
  title: z.string().min(1),
  description: z.string().min(1),
  href: optionalUrlSchema,
  order: z.number().int().optional(),
  publishDate: z.coerce.date(),
  sourceUrl: optionalUrlSchema,
  stack: z.array(stackReferenceSchema).default([]),
  tags: z.array(tagReferenceSchema).optional().default([]),
  translationKey: z.string().min(1),
})

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: () => projectSchema,
})

const experienceJobSchema = z.object({
  current: z.boolean().default(false),
  description: optionalStringSchema,
  endDate: plainDateSchema.optional().or(z.literal("")).default(""),
  role: z.string().min(1),
  stack: z.array(stackReferenceSchema).optional().default([]),
  startDate: plainDateSchema,
  tags: z.array(tagReferenceSchema).optional().default([]),
})

const experienceItemSchema = z.object({
  company: z.string().min(1),
  companyUrl: optionalUrlSchema,
  jobs: z.array(experienceJobSchema).min(1),
  location: optionalStringSchema,
  remote: z.boolean().default(false),
})

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "*.{md,mdx}" }),
  schema: () =>
    z.object({
      items: z.array(experienceItemSchema).default([]),
      locale: localeSchema,
    }),
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

export const collections = { blog, experience, home, projects, stack, tags }
