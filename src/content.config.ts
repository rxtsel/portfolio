import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { toIsoDate } from "@/lib/date-time"

const emptyStringToUndefined = (value: unknown) => (value === "" ? undefined : value)

export const stackItemSchema = z.object({
  name: z.string().min(1),
  href: z.string().optional(),
  slug: z.string().min(1),
})

const tagItemSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

const blogCategoryItemSchema = z.object({
  name: z.string().min(1),
  translationKey: z.string().min(1),
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
  keywords: z.string().min(1),
  ogImage: z.string().optional(),
  title: z.string().min(1).max(120),
})

const blogSeoSchema = z.object({
  description: z.string().min(70).max(200),
  keywords: z.string().min(1),
})

const stackSchema = z.object({
  stack: z.array(stackItemSchema).default([]),
})

const integrationsSchema = z.object({
  googleAdsense: z
    .object({
      allowedPathPattern: z.string().min(1).default("^(/blog(/|$)|/es/blog(/|$))"),
      clientId: z.string().default(""),
      enabled: z.boolean().default(false),
      sellerLine: z.string().default(""),
    })
    .default({
      allowedPathPattern: "^(/blog(/|$)|/es/blog(/|$))",
      clientId: "",
      enabled: false,
      sellerLine: "",
    }),
  googleTagManager: z
    .object({
      containerId: z.string().default(""),
      enabled: z.boolean().default(false),
    })
    .default({
      containerId: "",
      enabled: false,
    }),
})

const tagsSchema = z.object({
  tags: z.array(tagItemSchema).default([]),
})

const blogCategoriesSchema = z.object({
  categories: z.array(blogCategoryItemSchema).default([]),
  locale: z.enum(["en", "es"]),
})

const homeSchema = z.object({
  locale: z.enum(["en", "es"]),
  title: z.string().min(1),
  intro: z.string().min(1),
  featuredProjects: z.array(z.string().min(1)).max(4, "Home cannot feature more than 4 projects").default([]),
  stack: z.array(z.string().min(1)).default([]),
  latestPosts: latestPostsSchema,
  seo: seoSchema.optional(),
})

const projectSchema = z.object({
  locale: z.enum(["en", "es"]),
  title: z.string().min(1),
  description: z.string().min(1).max(140),
  href: z.preprocess(emptyStringToUndefined, z.url().optional()),
  order: z.number().int().optional(),
  publishDate: z.coerce.date(),
  sourceUrl: z.preprocess(emptyStringToUndefined, z.url().optional()),
  stack: z.array(z.string().min(1)).default([]),
  tags: z.array(z.string().min(1)).optional().default([]),
  translationKey: z.string().min(1),
})

const experienceJobSchema = z.object({
  current: z.boolean().default(false),
  description: z.string().optional(),
  endDate: z
    .preprocess(
      (value) => (value instanceof Date ? toIsoDate(value) : value),
      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format"),
    )
    .optional()
    .or(z.literal(""))
    .default(""),
  role: z.string().min(1),
  stack: z.array(z.string().min(1)).optional().default([]),
  startDate: z.preprocess(
    (value) => (value instanceof Date ? toIsoDate(value) : value),
    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format"),
  ),
  tags: z.array(z.string().min(1)).optional().default([]),
})

const experienceItemSchema = z.object({
  company: z.string().min(1),
  companyUrl: z.preprocess(emptyStringToUndefined, z.url().optional()),
  jobs: z.array(experienceJobSchema).min(1),
  location: z.string().optional(),
  remote: z.boolean().default(false),
})

const experienceSchema = z.object({
  items: z.array(experienceItemSchema).default([]),
  locale: z.enum(["en", "es"]),
})

const blogSchema = z.object({
  description: z.string().min(1).max(250),
  categories: z.array(z.string().min(1)).optional().default([]),
  locale: z.enum(["en", "es"]),
  published: z.boolean().default(false),
  publishDate: z.coerce.date(),
  seo: blogSeoSchema,
  title: z.string().min(1),
  translationKey: z.string().min(1),
  updatedDate: z.preprocess(emptyStringToUndefined, z.coerce.date().optional()),
})

const stack = defineCollection({
  loader: glob({ base: "./src/content", pattern: "stack.{md,mdx}" }),
  schema: () => stackSchema,
})

const integrations = defineCollection({
  loader: glob({ base: "./src/content", pattern: "integrations.{md,mdx}" }),
  schema: () => integrationsSchema,
})

const tags = defineCollection({
  loader: glob({ base: "./src/content", pattern: "tags.{md,mdx}" }),
  schema: () => tagsSchema,
})

const blogCategories = defineCollection({
  loader: glob({ base: "./src/content/blog-categories", pattern: "*.{md,mdx}" }),
  schema: () => blogCategoriesSchema,
})

const home = defineCollection({
  loader: glob({ base: "./src/content/home", pattern: "*.{md,mdx}" }),
  schema: () => homeSchema,
})

const projects = defineCollection({
  loader: glob({ base: "./src/content/projects", pattern: "**/*.{md,mdx}" }),
  schema: () => projectSchema,
})

const experience = defineCollection({
  loader: glob({ base: "./src/content/experience", pattern: "*.{md,mdx}" }),
  schema: () => experienceSchema,
})

const blog = defineCollection({
  loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
  schema: () => blogSchema,
})

export const collections = { blog, blogCategories, experience, home, integrations, projects, stack, tags }
