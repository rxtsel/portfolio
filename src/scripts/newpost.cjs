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
      .replace(/ /g, '-')
      .replace(/\./g, '-')
      .toLowerCase()
  )
}

const rl = readline.Interface({
  input: process.stdin,
  output: process.stdout
})

console.info('Welcome to command line interface to creating new post!\n')

const postData = {}
let finish = false

rl.question('Post title: ', (answer1) => {
  postData['title'] = answer1
  finish = true
  rl.close()
})

rl.on('close', () => {
  const now = new Date()
  const regexDigitsInDate = /([0-9]{2})/g
  const digitsInDate = now.toISOString().match(regexDigitsInDate)
  const slug = textToSlug(postData.title)

  if (digitsInDate) {
    postData['fileName'] =
      `${digitsInDate[1]}${digitsInDate[2]}${digitsInDate[3]}-${slug}.md`
  } else {
    console.error(
      '\n\x1b[31mError getting digits from date. Using default values.\x1b[0m'
    )
    postData['fileName'] =
      `draft-${Math.floor(Math.random() * 10000000)}-default.md`
  }

  postData['date'] = now.toISOString()

  try {
    postData['author'] = exec('git config --get user.name')
      .toString()
      .slice(0, -1)
  } catch (err) {
    postData['author'] = ''
  }

  try {
    fs.statSync(`src/content/blog`)
  } catch (err) {
    fs.mkdirSync(`src/content/blog`)
  }

  try {
    fs.statSync(`src/content/blog/${postData.fileName}`)
    console.error('\n\x1b[31mERROR: The post has already been created.\x1b[0m')
  } catch (err) {
    fs.writeFileSync(
      `src/content/blog/${postData.fileName}`,
      `---
title: '${postData.title}'
draft: true
description: ''
pubDate: '${postData.date}'
heroImage: ''
categories: ["all"]
tags: ["all"]
author: '["${postData.author}"]'
---\n\nEnter your content here...`
    )
    console.info(
      `\n\x1b[32m\nSUCCESS!!: content/blog/${postData.fileName} was created\x1b[0m`
    )
  }
})

rl.on('SIGINT', () => rl.pause())

rl.on('pause', () => {
  if (!finish) console.log('\nBye!\n')
})
