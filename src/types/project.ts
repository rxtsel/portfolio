import type { Tecnologies } from '@/types'

export interface iProject {
  title: string
  description: string
  url?: string
  gh?: string
  tags?: Tecnologies[]
}
