import type { TPostt, Tecnologies } from '@/types'

export interface iProject extends Partial<TPostt> {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  url?: string
  gh?: string
  tags?: Tecnologies[]
  team?: string[]
}
