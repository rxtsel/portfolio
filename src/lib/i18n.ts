import type { CollectionEntry } from "astro:content"

export const defaultLocale = "en"
export const locales = ["en", "es"] as const

export type Locale = (typeof locales)[number]
export type LocalizedBlogPost = CollectionEntry<"blog">
export type LanguageLink = {
  href: string
  locale: Locale
}

const localeLabels = {
  en: "English",
  es: "Español",
} satisfies Record<Locale, string>

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleLabel(locale: Locale) {
  return localeLabels[locale]
}

export function getContentLocale(id: string): Locale {
  const [locale] = id.split("/")

  if (!isLocale(locale)) {
    throw new Error(`Unsupported content locale: ${locale}`)
  }

  return locale
}

export function getLocalizedPath(locale: Locale, path = "") {
  const cleanPath = path.replace(/^\/|\/$/g, "")

  if (locale === defaultLocale) {
    return cleanPath ? `/${cleanPath}` : "/"
  }

  return cleanPath ? `/${locale}/${cleanPath}` : `/${locale}`
}

export function getBlogPostSlug(post: LocalizedBlogPost) {
  return post.id
    .split("/")
    .slice(1)
    .join("/")
    .replace(/\.(md|mdx)$/, "")
}

export function getBlogPostPath(post: LocalizedBlogPost) {
  return getLocalizedPath(post.data.locale, `blog/${getBlogPostSlug(post)}`)
}

export function getAlternateBlogPosts(posts: LocalizedBlogPost[], post: LocalizedBlogPost) {
  return posts.filter((candidate) => candidate.data.translationKey === post.data.translationKey)
}

export function getDefaultLanguageLinks(path = "") {
  return locales.map((locale) => ({
    href: getLocalizedPath(locale, path),
    locale,
  }))
}
