import type { CollectionEntry } from "astro:content"
import type { Locale } from "@/lib/i18n"

export type Project = CollectionEntry<"projects">

export function getProjectTransitionName(
  project: Project,
  part: "description" | "source" | "tags" | "title",
) {
  const transitionId = project.id.replace(/[^a-zA-Z0-9_-]/g, "-")

  return `project-${transitionId}-${part}`
}

function compareProjectsByOrder(current: Project, next: Project) {
  const currentOrder = current.data.order ?? Number.MIN_SAFE_INTEGER
  const nextOrder = next.data.order ?? Number.MIN_SAFE_INTEGER

  if (currentOrder !== nextOrder) {
    return nextOrder - currentOrder
  }

  return current.data.title.localeCompare(next.data.title)
}

export function getLocalizedProjects(projects: Project[], locale: Locale) {
  return [...projects]
    .filter((project) => project.data.locale === locale)
    .sort((current, next) => {
      const orderDiff = compareProjectsByOrder(current, next)

      return orderDiff
    })
}

export function getSelectedProjects(projects: Project[], projectIds: string[], locale: Locale) {
  const selectedProjects = projectIds.map((projectId) => {
    const project = projects.find(
      (candidate) => candidate.data.translationKey === projectId && candidate.data.locale === locale,
    )

    if (!project) {
      throw new Error(`Missing featured project relation: ${projectId}`)
    }

    return project
  })

  return selectedProjects.sort(compareProjectsByOrder)
}
