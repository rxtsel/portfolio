import { generateProjectOgImage, type ProjectOgData } from "@/lib/og"
import { getProjectOgStaticPaths } from "@/lib/project-pages"

interface Props {
  props: ProjectOgData
}

export async function GET({ props }: Props) {
  return generateProjectOgImage(props)
}

export function getStaticPaths() {
  return getProjectOgStaticPaths("es")
}
