import fs from 'fs'
import path from 'path'
import { ImageResponse } from '@vercel/og'
import { getBlogPosts } from '@/content/config'
import type { TPostList } from '@/types'

interface Props {
  params: { slug: string }
  props: TPostList
}

export async function GET({ props }: Props) {
  const post = props

  // using custom font files
  const Satoshi = fs.readFileSync(path.resolve('./public/fonts/Satoshi.woff'))

  // post cover with Image is pretty tricky for dev and build phase
  const postCoverBuffer = await fs.promises.readFile('./public/og.png')
  const postCover = postCoverBuffer.toString('base64')

  // Astro doesn't support tsx endpoints so usign React-element objects
  const html = {
    type: 'div',
    props: {
      children: [
        {
          type: 'div',
          props: {
            tw: 'w-[200px] h-[200px] flex rounded-3xl overflow-hidden',
            children: [
              {
                props: {
                  style: {}
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            tw: 'pl-10 shrink flex',
            children: [
              {
                type: 'p',
                props: {
                  style: {
                    fontSize: '58px',
                    fontFamily: 'Satoshi',
                    color: '#f5f5f5'
                  },
                  children: post.data.title
                }
              }
            ]
          }
        },
        {
          type: 'div',
          props: {
            tw: 'absolute right-[40px] bottom-[50px] flex items-center',
            children: [
              {
                type: 'div',
                props: {
                  tw: 'text-3xl',
                  style: {
                    fontFamily: 'Satoshi',
                    color: '#4895EF'
                  },
                  children: 'Cristhian Melo'
                }
              },
              {
                type: 'div',
                props: {
                  tw: 'px-2 text-3xl',
                  style: {
                    fontSize: '30px',
                    color: '#F5F5F5'
                  },
                  children: '|'
                }
              },
              {
                type: 'div',
                props: {
                  tw: 'text-3xl',
                  children: 'Blog',
                  style: {
                    color: '#F5F5F5'
                  }
                }
              }
            ]
          }
        }
      ],
      tw: 'w-full h-full flex items-center justify-center relative px-22',
      style: {
        fontFamily: 'Satoshi',
        backgroundImage: `url('data:image/png;base64,${postCover}')`
      }
    }
  }

  return new ImageResponse(html, {
    width: 1200,
    height: 600,
    fonts: [
      {
        name: 'Satoshi',
        data: Satoshi,
        style: 'normal'
      },
      {
        name: 'Satoshi',
        data: Satoshi,
        style: 'normal'
      }
    ]
  })
}

// to generate an image for each blog posts in a collection
export async function getStaticPaths() {
  const blogPosts = await getBlogPosts()

  const posts = blogPosts.map((post) => {
    return {
      params: { lang: post?.data.lang || 'en', slug: post.slug },
      props: post
    }
  })

  return posts
}
