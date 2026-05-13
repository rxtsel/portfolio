import type { APIRoute } from "astro"
import { getCollection, getEntry } from "astro:content"
import { getBlogPostPath, getLocalizedPath, type Locale } from "@/lib/i18n"
import { getPublishedBlogPosts, type BlogPost } from "@/lib/blog"
import { compareDatesDescending } from "@/lib/date-time"

const siteUrl = "https://rxtsel.dev"
const siteSummary =
  "Software Engineer with 3+ years of experience, known for pixel-perfect execution and strong attention to detail."
const blogDescriptions = {
  en: "Articles by Cristhian Melo about software engineering, web performance, accessibility, and maintainable frontend systems.",
  es: "Artículos de Cristhian Melo sobre ingeniería de software, rendimiento web, accesibilidad y sistemas frontend mantenibles.",
} satisfies Record<Locale, string>
const projectsDescriptions = {
  en: "Selected software projects by Cristhian Melo, including web experiences, CMS work, and custom frontend implementations.",
  es: "Proyectos seleccionados de Cristhian Melo, incluyendo experiencias web, CMS e implementaciones frontend a medida.",
} satisfies Record<Locale, string>

function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString()
}

function formatEntry(title: string, path: string, description: string) {
  return `- [${title}](${absoluteUrl(path)}): ${description}`
}

async function getPageEntries(locale: Locale) {
  const home = await getEntry("home", locale)

  if (!home) {
    throw new Error(`Missing ${locale} home content`)
  }

  const homeTitle = home.data.seo?.title ?? home.data.title
  const homeDescription = home.data.seo?.description ?? home.data.intro
  const projectsPath = getLocalizedPath(locale, locale === "es" ? "proyectos" : "projects")

  return [
    formatEntry(homeTitle, getLocalizedPath(locale), homeDescription),
    formatEntry(
      locale === "es" ? "Proyectos - Cristhian Melo" : "Projects - Cristhian Melo",
      projectsPath,
      projectsDescriptions[locale],
    ),
    formatEntry("Blog - Cristhian Melo", getLocalizedPath(locale, "blog"), blogDescriptions[locale]),
  ]
}

function getPostEntries(posts: BlogPost[], locale: Locale) {
  return getPublishedBlogPosts(posts, locale)
    .sort((a, b) => compareDatesDescending(a.data.publishDate, b.data.publishDate))
    .map((post) => formatEntry(`${post.data.title} - Blog`, getBlogPostPath(post), post.data.description))
}

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog")
  const sections = [
    "# Cristhian Melo",
    "",
    `> ${siteSummary}`,
    "",
    "## English Pages",
    "",
    ...(await getPageEntries("en")),
    ...getPostEntries(posts, "en"),
    "",
    "## Páginas en Español",
    "",
    ...(await getPageEntries("es")),
    ...getPostEntries(posts, "es"),
    "",
  ]

  return new Response(sections.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}
