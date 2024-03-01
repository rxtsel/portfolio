import type { TPost, Tecnologies } from '@/types'

export interface iProject extends Partial<TPost> {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  url?: string
  gh?: string
  tags?: Tecnologies[]
  team?: string[]
}
