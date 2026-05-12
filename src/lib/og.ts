import { readFile } from "node:fs/promises"
import { ImageResponse } from "@vercel/og"
import type { BlogPost } from "@/lib/blog"

const geistSemibold = readFile(
  new URL("../../public/fonts/geist/ttf/geist-latin-600-normal.ttf", import.meta.url),
)

const geistRegular = readFile(
  new URL("../../public/fonts/geist/ttf/geist-latin-400-normal.ttf", import.meta.url),
)

const backgroundImage = readFile(new URL("../../public/og_template.jpg", import.meta.url)).then((buffer) =>
  buffer.toString("base64"),
)

export async function generateBlogOgImage(post: BlogPost) {
  const [fontDataSemibold, fontDataRegular, backgroundBase64] = await Promise.all([
    geistSemibold,
    geistRegular,
    backgroundImage,
  ])

  return new ImageResponse(
    {
      type: "div",
      props: {
        children: [
          {
            type: "div",
            props: {
              tw: "shrink justify-center items-center flex",
              children: [
                {
                  type: "p",
                  props: {
                    style: {
                      color: "#FAFAFA",
                      fontFamily: "Geist",
                      fontSize: "48px",
                      fontWeight: 600,
                    },
                    children: post.data.title,
                  },
                },
              ],
            },
          },
          {
            type: "div",
            props: {
              tw: "absolute right-[40px] bottom-[60px] flex items-center",
              children: [
                {
                  type: "div",
                  props: {
                    tw: "text-3xl",
                    style: {
                      color: "#4895EF",
                      fontFamily: "Geist",
                    },
                    children: "Cristhian Melo",
                  },
                },
                {
                  type: "div",
                  props: {
                    tw: "px-2 text-3xl",
                    style: {
                      color: "#FAFAFA",
                      fontSize: "30px",
                    },
                    children: "|",
                  },
                },
                {
                  type: "div",
                  props: {
                    tw: "text-3xl",
                    style: {
                      color: "#FAFAFA",
                      fontFamily: "Geist",
                    },
                    children: "Blog",
                  },
                },
              ],
            },
          },
        ],
        tw: "w-full h-full flex items-center justify-center relative px-22",
        style: {
          backgroundImage: `url('data:image/jpeg;base64,${backgroundBase64}')`,
          fontFamily: "Geist",
        },
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
        {
          data: fontDataRegular,
          name: "Geist",
          style: "normal",
          weight: 400,
        },
      ],
      height: 630,
      width: 1200,
    },
  )
}
