export interface Post {
  id: string
  slug: string
  body: string
  collection: string
  data: Data
}

export interface Data {
  title: string
  draft: boolean
  description: string
  pubDate: Date
  heroImage: string
  categories: string[]
  tags: string[]
  authors: string[]
  keywords: string
}
