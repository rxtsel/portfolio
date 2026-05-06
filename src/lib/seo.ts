import type { SeoProps } from "@jdevalk/astro-seo-graph"
import type { GraphEntity } from "@jdevalk/seo-graph-core"
import { assembleGraph, buildPiece, buildWebPage, buildWebSite, makeIds } from "@jdevalk/seo-graph-core"

const SITE_URL = "https://rxtsel.dev"
const SITE_NAME = "Cristhian Melo"
const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`
const DEFAULT_DESCRIPTION =
  "Software Engineer with 4+ years of experience, known for pixel-perfect execution and strong attention to detail. Passionate about seamless user experiences and clean, maintainable code."

export const siteMetadata = {
  description: DEFAULT_DESCRIPTION,
  locale: "en_US",
  name: SITE_NAME,
  ogImage: DEFAULT_OG_IMAGE,
  titleTemplate: `%s - ${SITE_NAME}`,
  url: SITE_URL,
} as const

export type LayoutSeoProps = Omit<SeoProps, "title"> & {
  title: string
}

type GraphInput = {
  description: string
  title: string
  url: string
}

const defaultExtraLinks = [
  { href: "/favicon.svg", rel: "icon", type: "image/svg+xml" },
  { href: "/favicon.ico", rel: "icon" },
  { href: "/favicon-16x16.png", rel: "icon", sizes: "16x16", type: "image/png" },
  { href: "/favicon-32x32.png", rel: "icon", sizes: "32x32", type: "image/png" },
  { color: "#1a1a1a", href: "/safari-pinned-tab.svg", rel: "mask-icon" },
  { href: "/apple-touch-icon.png", rel: "apple-touch-icon", sizes: "180x180" },
  { href: "/site.webmanifest", rel: "manifest" },
  { href: "/sitemap-index.xml", rel: "sitemap" },
] satisfies NonNullable<SeoProps["extraLinks"]>

const defaultExtraMeta = [
  { content: "#1a1a1a", name: "theme-color" },
  { content: "#1a1a1a", name: "msapplication-TileColor" },
  { content: "/browserconfig.xml", name: "msapplication-config" },
] satisfies NonNullable<SeoProps["extraMeta"]>

function buildDefaultGraph({ description, title, url }: GraphInput) {
  const ids = makeIds({ siteUrl: SITE_URL })

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
        inLanguage: "en-US",
        name: SITE_NAME,
        publisher: { "@id": ids.person },
        url: SITE_URL,
      },
      ids,
    ) as GraphEntity,
    buildWebPage(
      {
        description,
        inLanguage: "en-US",
        isPartOf: { "@id": ids.website },
        name: title,
        url,
      },
      ids,
    ) as GraphEntity,
  ]

  return assembleGraph(pieces)
}

export function buildLayoutSeoProps(props: LayoutSeoProps, pageUrl: URL): SeoProps {
  const description = props.description ?? DEFAULT_DESCRIPTION
  const canonical = props.canonical?.toString() ?? new URL(pageUrl.pathname, SITE_URL).toString()
  const graph =
    props.graph === undefined
      ? buildDefaultGraph({
          description,
          title: props.title,
          url: canonical,
        })
      : props.graph

  return {
    ...props,
    canonical,
    description,
    extraLinks: [...defaultExtraLinks, ...(props.extraLinks ?? [])],
    extraMeta: [...defaultExtraMeta, ...(props.extraMeta ?? [])],
    graph,
    locale: props.locale ?? siteMetadata.locale,
    ogImage: props.ogImage ?? siteMetadata.ogImage,
    ogImageAlt: props.ogImageAlt ?? `${siteMetadata.name} portfolio preview`,
    ogImageHeight: props.ogImageHeight ?? 630,
    ogImageWidth: props.ogImageWidth ?? 1200,
    siteName: props.siteName ?? siteMetadata.name,
    titleTemplate: props.titleTemplate ?? siteMetadata.titleTemplate,
    twitter: {
      card: "summary_large_image",
      site: "@rxtsel",
      ...props.twitter,
    },
  }
}
