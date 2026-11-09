import type { ImageMetadata } from "astro"
import type { Project } from "./projects.ts"
import type { Locale } from "@/lib/i18n"
import type { ProjectOgData } from "@/lib/og"

type ProjectPage = {
  title: string
  logoPath: string
  locales: Record<Locale, { path: string; description: string }>
}

export const projectPages = {
  xialu: {
    title: "Xialu",
    logoPath: "src/assets/projects/xialu.webp",
    locales: {
      en: {
        path: "/projects/xialu/",
        description: "Personal finances on your phone, with local data and offline access.",
      },
      es: {
        path: "/es/proyectos/xialu/",
        description: "Tus finanzas en tu teléfono, con datos locales y uso sin conexión.",
      },
    },
  },
} satisfies Record<string, ProjectPage>

export function getProjectPage(translationKey: string) {
  return Object.entries(projectPages).find(([key]) => key === translationKey)?.[1]
}

export function getProjectOgStaticPaths(
  locale: Locale,
  projects: Project[],
  logos: Record<string, ImageMetadata>,
) {
  const codedPages = Object.entries(projectPages).map(([slug, project]) => ({
    params: { slug },
    props: {
      title: project.title,
      description: project.locales[locale].description,
      logoPath: project.logoPath,
    } satisfies ProjectOgData,
  }))
  const contentPages = projects
    .filter(
      (project) =>
        project.data.locale === locale &&
        project.data.detailPage &&
        !getProjectPage(project.data.translationKey),
    )
    .map((project) => {
      const logoPath = project.data.logo
        ? Object.entries(logos).find(([, image]) => image.src === project.data.logo?.src)?.[0]
        : undefined
      if (project.data.logo && !logoPath) {
        throw new Error(`Missing OG logo for project: ${project.data.translationKey}`)
      }
      return {
        params: { slug: project.data.translationKey },
        props: {
          title: project.data.title,
          description: project.data.description,
          ...(logoPath ? { logoPath: logoPath.replace(/^\//, "") } : {}),
        } satisfies ProjectOgData,
      }
    })
  return [...codedPages, ...contentPages]
}
