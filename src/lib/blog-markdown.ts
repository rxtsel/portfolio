import { readFile } from "node:fs/promises"
import path from "node:path"
import { renderSafeMarkdown } from "./markdown.ts"

export function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "").trim()
}

export function getReadingMinutes(markdown: string) {
  const text = renderSafeMarkdown(markdown)
    .replace(/<pre\b[^>]*>[\s\S]*?<\/pre>/g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:#\d+|#x[\da-f]+|[a-z][a-z\d]+);/gi, " ")
  const words = [...new Intl.Segmenter(undefined, { granularity: "word" }).segment(text)].filter(
    ({ isWordLike }) => isWordLike,
  ).length

  return Math.max(1, Math.ceil(words / 200))
}

export async function readBlogMarkdownSource(id: string) {
  const candidates = /\.mdx?$/.test(id) ? [id] : [`${id}.md`, `${id}.mdx`]

  for (const candidate of candidates) {
    try {
      return await readFile(path.resolve("src/content/blog", candidate), "utf8")
    } catch (error) {
      if (candidate === candidates.at(-1)) {
        throw error
      }
    }
  }

  return ""
}

export async function readBlogMarkdownContent(id: string) {
  return stripFrontmatter(await readBlogMarkdownSource(id))
}
