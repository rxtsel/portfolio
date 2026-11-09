import { readFile } from "node:fs/promises"
import path from "node:path"
import { ImageResponse } from "@vercel/og"
import sharp from "sharp"
import type { BlogPost } from "@/lib/blog"

const backgroundImage = readFile(path.resolve("public/og_template.jpg")).then((buffer) =>
  buffer.toString("base64"),
)

const projectIsotype = readFile(path.resolve("src/assets/logo.svg"), "utf8").then((svg) =>
  sharp(Buffer.from(svg.replaceAll("currentColor", "#FAFAFA")))
    .resize(44, 44, { fit: "inside" })
    .png()
    .toBuffer(),
)

export interface ProjectOgData {
  title: string
  description: string
  logoPath?: string
}

function getTitleFontSize(title: string) {
  const length = title.length

  if (length > 110) return 42
  if (length > 85) return 48
  if (length > 65) return 54
  return 60
}

export async function generateProjectOgImage({ title, description, logoPath }: ProjectOgData) {
  const [isotype, logo] = await Promise.all([
    projectIsotype,
    logoPath ? sharp(path.resolve(logoPath)).resize(180, 180, { fit: "inside" }).png().toBuffer() : undefined,
  ])

  return new ImageResponse(
    {
      type: "div",
      props: {
        style: {
          display: "flex",
          alignItems: "center",
          width: "100%",
          height: "100%",
          position: "relative",
          padding: 88,
          backgroundColor: "#000000",
        },
        children: [
          {
            type: "img",
            props: {
              src: `data:image/png;base64,${isotype.toString("base64")}`,
              width: 44,
              height: 44,
              style: { position: "absolute", left: 88, top: 60 },
            },
          },
          {
            type: "div",
            props: {
              style: { display: "flex", alignItems: "center", gap: 48, width: "100%" },
              children: [
                ...(logo
                  ? [
                      {
                        type: "img",
                        props: {
                          src: `data:image/png;base64,${logo.toString("base64")}`,
                          width: 180,
                          height: 180,
                          style: { objectFit: "contain", flexShrink: 0 },
                        },
                      },
                    ]
                  : []),
                {
                  type: "div",
                  props: {
                    style: { display: "flex", flexDirection: "column", flex: 1, gap: 20 },
                    children: [
                      {
                        type: "h1",
                        props: {
                          style: {
                            margin: 0,
                            color: "#FAFAFA",
                            fontSize: getTitleFontSize(title),
                            fontWeight: 600,
                            lineHeight: 1.15,
                          },
                          children: title,
                        },
                      },
                      {
                        type: "p",
                        props: {
                          style: { margin: 0, color: "#B4B4B4", fontSize: 30, lineHeight: 1.4 },
                          children: description,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    { width: 1200, height: 630 },
  )
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
