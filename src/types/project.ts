import type { Tecnologies } from '@/types'

export interface iProject {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  url?: string
  gh?: string
  tags?: Tecnologies[]
  team?: string[]
}
