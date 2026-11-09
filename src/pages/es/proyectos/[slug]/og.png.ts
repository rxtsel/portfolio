import type { ImageMetadata } from "astro"
import { getCollection } from "astro:content"
import { generateProjectOgImage, type ProjectOgData } from "@/lib/og"
import { getProjectOgStaticPaths } from "@/lib/project-pages"

interface Props {
  props: ProjectOgData
}

export async function GET({ props }: Props) {
  return generateProjectOgImage(props)
}

export async function getStaticPaths() {
  const projects = await getCollection("projects")
  const logos = import.meta.glob<ImageMetadata>("/src/assets/projects/*.{webp,png,jpg,jpeg,avif,svg}", {
    eager: true,
    import: "default",
  })
  return getProjectOgStaticPaths("es", projects, logos)
}
