import { readFile } from "node:fs/promises"
import path from "node:path"

export function stripFrontmatter(markdown: string) {
  return markdown.replace(/^---\s*[\s\S]*?\s*---\s*/, "").trim()
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
