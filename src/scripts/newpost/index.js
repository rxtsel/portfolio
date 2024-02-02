import { fileExists, getAuthorName } from './fileUtils.js'
import { askTitle, askIsDraft, askDescription } from './inputUtils.js'
import { slugify } from './slug.js'
import fs from 'fs'

const createPost = (postData, languages) => {
  const folderName = slugify(postData.title)
  const fileNames = []

  // Create the directory if it doesn't exist
  fs.mkdirSync(`./src/content/blog/${folderName}`, { recursive: true })

  for (const lang of languages) {
    const fullPath = `./src/content/blog/${folderName}/${lang}.md`
    const content = `---
title: '${postData.title}'
draft: ${postData.draft}
description: '${postData.description}'
pubDate: '${postData.date}'
cover: ''
categories: ["all"]
tags: ["all"]
author: ["${postData.author}"]
keywords: ["rxtsel", "Cristhian Melo", "Blog"]
lang: ${lang}
---\n\nEnter your content here...`

    // Write the post content to the file
    fs.writeFileSync(fullPath, content)

    fileNames.push(fullPath)
  }

  console.info(
    `\n\x1b[32m\nSUCCESS!! Post was created:\n${fileNames.join('\n')}\x1b[0m`
  )
}

const askQuestion = async () => {
  const title = await askTitle()

  // check if the post already exist
  const postExist = fileExists(`./src/content/blog/${slugify(title)}`)
  if (postExist) {
    console.error('\n\x1b[31mERROR: The post already exist.\x1b[0m')
    return
  }

  const isDraft = await askIsDraft()
  const description = await askDescription()

  const postData = {
    title,
    draft: isDraft,
    description,
    date: new Date().toISOString(),
    author: getAuthorName()
  }

  // Create posts for both languages
  createPost(postData, ['en', 'es'])
}

const main = async () => {
  console.info(
    'Welcome to the command line interface for creating a new post!\n'
  )

  await askQuestion()
}

main()
