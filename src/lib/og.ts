import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "@vercel/og"
import type { BlogPost } from "@/lib/blog"

const geistSemibold = readFile(path.resolve("public/fonts/geist/ttf/geist-latin-600-normal.ttf"))

const backgroundImage = readFile(path.resolve("public/og_template.jpg")).then((buffer) =>
  buffer.toString("base64"),
)

function getTitleFontSize(title: string) {
  const length = title.length

  if (length > 110) return 42
  if (length > 85) return 48
  if (length > 65) return 54
  return 60
}

export async function generateBlogOgImage(post: BlogPost) {
  const [fontDataSemibold, backgroundBase64] = await Promise.all([geistSemibold, backgroundImage])

  return new ImageResponse(
    {
      type: "div",
      props: {
        tw: "w-full h-full flex items-center justify-start relative px-22 py-16",
        style: {
          backgroundImage: `url('data:image/jpeg;base64,${backgroundBase64}')`,
          fontFamily: "Geist",
        },
        children: [
          {
            type: "h1",
            props: {
              style: {
                color: "#FAFAFA",
                fontFamily: "Geist",
                fontSize: `${getTitleFontSize(post.data.title)}px`,
                fontWeight: 600,
                textWrap: "balance",
                whiteSpace: "normal",
              },
              children: post.data.title,
            },
          },
        ],
      },
    },
    {
      fonts: [
        {
          data: fontDataSemibold,
          name: "Geist",
          style: "normal",
          weight: 600,
        },
      ],
      height: 630,
      width: 1200,
    },
  )
}
