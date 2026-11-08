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

export function getProjectOgStaticPaths(locale: Locale) {
  return Object.entries(projectPages).map(([slug, project]) => ({
    params: { slug },
    props: {
      title: project.title,
      description: project.locales[locale].description,
      logoPath: project.logoPath,
    } satisfies ProjectOgData,
  }))
}
