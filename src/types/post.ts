import type { CollectionEntry } from 'astro:content'

export type TPost = CollectionEntry<'blog'>['data']
export type TPostList = CollectionEntry<'blog'>
