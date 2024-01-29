const readline = require('readline')
const exec = require('child_process').execSync
const fs = require('fs')

const textToSlug = (text) => {
  return encodeURI(
    text
      .replace(/Á/gi, 'a')
      .replace(/É/gi, 'e')
      .replace(/Í/gi, 'i')
      .replace(/Ó/gi, 'o')
      .replace(/Ú/gi, 'u')
      .replace(/À/gi, 'a')
      .replace(/È/gi, 'e')
      .replace(/Ì/gi, 'i')
      .replace(/Ò/gi, 'o')
      .replace(/Ù/gi, 'u')
      .replace(/ñ/gi, 'n')
      .replace(/\?/gi, '')
      .replace(/¿/gi, '')
      .replace(/!/gi, '')
      .replace(/¡/gi, '')
      .replace(/[^a-zA-Z0-9ñ]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase()
  )
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.info('Welcome to the command line interface for creating a new post!\n')

const postData = {}
let currentQuestion = 1
let fileName
let fullPath

// Function to ask a question based on the current question number
const askQuestion = () => {
  switch (currentQuestion) {
    case 1:
      rl.question('Post title: ', (answer1) => {
        postData['title'] = answer1
        currentQuestion++
        askQuestion()
      })
      break
    case 2:
      // Logic to check if the file already exists
      const slug = textToSlug(postData.title)
      const now = new Date()
      const regexDigitsInDate = /([0-9]{2})/g
      const digitsInDate = now.toISOString().match(regexDigitsInDate)

      fileName = `${digitsInDate[1]}${digitsInDate[2]}${digitsInDate[3]}-${slug}.md`

      fullPath = `src/content/blog/${fileName}`

      postData['date'] = now.toISOString()

      // Get the author name from git config
      try {
        postData['author'] = exec('git config --get user.name')
          .toString()
          .slice(0, -1)
      } catch (err) {
        postData['author'] = ''
      }

      try {
        fs.statSync(fullPath)
        // Display an error message if the post has already been created
        console.error(
          '\n\x1b[31mERROR: The post has already been created.\x1b[0m'
        )
        rl.close()
      } catch (err) {
        rl.question('Is Draft (N/y): ', (answer2) => {
          postData['draft'] = answer2.trim().toLowerCase() === 'y'
          currentQuestion++
          askQuestion()
        })
      }
      break
    case 3:
      rl.question('Enter a description: ', (answer3) => {
        postData['description'] = answer3
        currentQuestion++
        askQuestion()
      })
      break
    default:
      // Continue with the rest of the code for creating the post
      rl.close()
      createPost()
      break
  }
}

// Function to create the post
const createPost = () => {
  try {
    // Create the 'blog' directory if it doesn't exist
    fs.statSync(`src/content/blog`, { recursive: true })
  } catch (err) {
    rl.close()
    return
  }

  // Write the post content to the file
  fs.writeFileSync(
    fullPath,
    `---
title: '${postData.title}'
draft: ${postData.draft}
description: '${postData.description}'
pubDate: '${postData.date}'
cover: ''
categories: ["all"]
tags: ["all"]
author: ["${postData.author}"],
keywords: ["rxtsel", "Cristhian Melo", "Blog"]
---\n\nEnter your content here...`
  )

  console.info(`\n\x1b[32m\nSUCCESS!!: ${fileName} was created\x1b[0m`)
}

askQuestion()
