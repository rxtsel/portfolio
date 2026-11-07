import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "@vercel/og"
import type { BlogPost } from "@/lib/blog"

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
  const backgroundBase64 = await backgroundImage

  return new ImageResponse(
    {
      type: "div",
      props: {
        tw: "w-full h-full flex items-center justify-start relative px-22 py-16",
        style: {
          backgroundImage: `url('data:image/jpeg;base64,${backgroundBase64}')`,
        },
        children: [
          {
            type: "h1",
            props: {
              style: {
                color: "#FAFAFA",
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
      height: 630,
      width: 1200,
    },
  )
}
