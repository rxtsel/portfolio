import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "@vercel/og"
import type { BlogPost } from "@/lib/blog"

const geistSemibold = readFile(path.resolve("public/fonts/geist/ttf/geist-latin-600-normal.ttf"))

const backgroundImage = readFile(path.resolve("public/og_template.jpg")).then((buffer) =>
  buffer.toString("base64"),
)

export async function generateBlogOgImage(post: BlogPost) {
  const [fontDataSemibold, backgroundBase64] = await Promise.all([geistSemibold, backgroundImage])

  return new ImageResponse(
    {
      type: "div",
      props: {
        tw: "w-full h-full flex items-center justify-center relative px-22 py-15",
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
                fontSize: "54px",
                fontWeight: 600,
                textWrap: "pretty",
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
