import type { TPost, Technologies, TTeam } from '@/types'

export interface iProject extends Partial<TPost> {
  title: string
  titleEn?: string
  description: string
  descriptionEn?: string
  url?: string
  gh?: string
  technologies?: Technologies[]
  team?: TTeam[]
}
