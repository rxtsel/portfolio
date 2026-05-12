import type { SeoProps } from "@jdevalk/astro-seo-graph"
import type { GraphEntity } from "@jdevalk/seo-graph-core"
import { assembleGraph, buildPiece, buildWebPage, buildWebSite, makeIds } from "@jdevalk/seo-graph-core"
import { getLocaleLanguageTag, getLocaleOpenGraphTag, getLocalizedPath, type Locale } from "@/lib/i18n"

const SITE_URL = "https://rxtsel.dev"
const SITE_NAME = "Cristhian Melo"
const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`
const DEFAULT_DESCRIPTION =
  "Software Engineer with 3+ years of experience, known for pixel-perfect execution and strong attention to detail. Passionate about seamless user experiences and clean, maintainable code."

export const siteMetadata = {
  description: DEFAULT_DESCRIPTION,
  locale: "en_US",
  name: SITE_NAME,
  ogImage: DEFAULT_OG_IMAGE,
  titleTemplate: `%s - ${SITE_NAME}`,
  url: SITE_URL,
} as const

export type LayoutSeoProps = Omit<SeoProps, "title"> & {
  alternatesPath?: string
  keywords?: string
  lang?: Locale
  title: string
}

type GraphInput = {
  description: string
  lang: Locale
  title: string
  url: string
}

type BlogPostGraphInput = GraphInput & {
  image: string
  publishedDate: Date
  updatedDate?: Date
}

const defaultExtraLinks = [
  { href: "/favicon-light.svg", rel: "icon", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
  { href: "/favicon-dark.svg", rel: "icon", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
  { href: "/favicon.ico", rel: "icon" },
  { href: "/favicon-96x96.png", rel: "icon", sizes: "96x96", type: "image/png" },
  { href: "/apple-touch-icon.png", rel: "apple-touch-icon", sizes: "180x180" },
  { href: "/site.webmanifest", rel: "manifest" },
  { href: "/sitemap-index.xml", rel: "sitemap" },
] satisfies NonNullable<SeoProps["extraLinks"]>

const defaultExtraMeta = [
  { content: "#0a0a0a", name: "theme-color" },
  { content: "#0a0a0a", name: "msapplication-TileColor" },
  { content: "/browserconfig.xml", name: "msapplication-config" },
] satisfies NonNullable<SeoProps["extraMeta"]>

function buildGraphBase({ description, lang, title, url }: GraphInput) {
  const ids = makeIds({ siteUrl: SITE_URL })
  const inLanguage = getLocaleLanguageTag(lang)

  const pieces = [
    buildPiece({
      "@id": ids.person,
      "@type": "Person",
      name: SITE_NAME,
      url: SITE_URL,
    }) as GraphEntity,
    buildWebSite(
      {
        description: DEFAULT_DESCRIPTION,
        inLanguage: getLocaleLanguageTag("en"),
        name: SITE_NAME,
        publisher: { "@id": ids.person },
        url: SITE_URL,
      },
      ids,
    ) as GraphEntity,
    buildWebPage(
      {
        description,
        inLanguage,
        isPartOf: { "@id": ids.website },
        name: title,
        url,
      },
      ids,
    ) as GraphEntity,
  ]

  return { ids, inLanguage, pieces }
}

function buildDefaultGraph(input: GraphInput) {
  return assembleGraph(buildGraphBase(input).pieces)
}

export function buildBlogPostGraph(input: BlogPostGraphInput) {
  const { ids, inLanguage, pieces } = buildGraphBase(input)
  const articleId = `${input.url}#article`

  return assembleGraph([
    ...pieces,
    buildPiece({
      "@id": articleId,
      "@type": "BlogPosting",
      author: { "@id": ids.person },
      dateModified: (input.updatedDate ?? input.publishedDate).toISOString(),
      datePublished: input.publishedDate.toISOString(),
      description: input.description,
      headline: input.title,
      image: input.image,
      inLanguage,
      isPartOf: { "@id": ids.website },
      mainEntityOfPage: { "@id": input.url },
      publisher: { "@id": ids.person },
      url: input.url,
    }) as GraphEntity,
  ])
}

export function buildLayoutSeoProps(props: LayoutSeoProps, pageUrl: URL): SeoProps {
  const { alternatesPath, keywords, lang = "en", ...seoProps } = props
  const description = seoProps.description ?? DEFAULT_DESCRIPTION
  const keywordMeta = keywords?.trim() ? [{ content: keywords, name: "keywords" }] : []
  const canonical = seoProps.canonical?.toString() ?? new URL(pageUrl.pathname, SITE_URL).toString()
  const alternates =
    seoProps.alternates ??
    (alternatesPath !== undefined
      ? {
          defaultLocale: "en",
          entries: [
            {
              href: new URL(getLocalizedPath("en", alternatesPath), SITE_URL).toString(),
              hreflang: getLocaleLanguageTag("en"),
            },
            {
              href: new URL(getLocalizedPath("es", alternatesPath), SITE_URL).toString(),
              hreflang: getLocaleLanguageTag("es"),
            },
            {
              href: new URL(getLocalizedPath("en", alternatesPath), SITE_URL).toString(),
              hreflang: "x-default",
            },
          ],
        }
      : undefined)
  const graph =
    seoProps.graph === undefined
      ? buildDefaultGraph({
          description,
          lang,
          title: seoProps.title,
          url: canonical,
        })
      : seoProps.graph

  const builtProps = {
    ...seoProps,
    canonical,
    description,
    extraLinks: [
      ...defaultExtraLinks,
      {
        href: getLocalizedPath(lang, "rss.xml"),
        rel: "alternate",
        title: lang === "es" ? "Feed RSS de Cristhian Melo" : "Cristhian Melo RSS Feed",
        type: "application/rss+xml",
      },
      ...(seoProps.extraLinks ?? []),
    ],
    extraMeta: [...defaultExtraMeta, ...keywordMeta, ...(seoProps.extraMeta ?? [])],
    graph,
    locale: seoProps.locale ?? getLocaleOpenGraphTag(lang),
    ogImage: seoProps.ogImage ?? siteMetadata.ogImage,
    ogImageAlt: seoProps.ogImageAlt ?? `${siteMetadata.name} portfolio preview`,
    ogImageHeight: seoProps.ogImageHeight ?? 630,
    ogImageWidth: seoProps.ogImageWidth ?? 1200,
    siteName: seoProps.siteName ?? siteMetadata.name,
    titleTemplate: seoProps.titleTemplate ?? siteMetadata.titleTemplate,
    twitter: {
      card: "summary_large_image" as const,
      site: "@rxtsel",
      ...seoProps.twitter,
    },
  }

  return alternates ? { ...builtProps, alternates } : builtProps
}
