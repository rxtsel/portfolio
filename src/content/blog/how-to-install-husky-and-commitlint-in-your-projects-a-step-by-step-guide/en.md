---
title: 'How to Install Husky and Commitlint in Your Projects: A Step-by-Step Guide'
draft: false
description: 'Learn how to enhance commit quality and consistency in your software projects with Husky and Commitlint. This guide provides step-by-step instructions on installing and configuring these powerful tools, ensuring better collaboration and code maintenance through standardized commit messages.'
pubDate: '2024-02-07T18:40:10.762Z'
cover: ''
categories: ['Commits', 'Linter']
tags:
  [
    'Commits',
    'Linter',
    'Automation',
    'Quality',
    'Conventions',
    'Tools',
    'Collaboration'
  ]
author: ['Cristhian Melo']
keywords: 'Software development, code quality, consistent commits, commit conventions, Husky, Commitlint, Git Hooks, process automation, version control'
lang: en
---

## Introduction

**Husky** and **Commitlint** are powerful tools that can enhance the quality and consistency of your commits in software development projects. [Husky](https://typicode.github.io/husky/) allows you to set up [Git Hooks](#what-is-a-git-hook) in your Git repository, while [Commitlint](https://commitlint.js.org/#/) helps enforce consistent commit message conventions ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)). In this step-by-step guide, you will learn how to install and configure Husky and Commitlint in your projects.

### Why Husky and Commitlint?

Have you ever experienced uploading changes to your repository and the CI performs an automatic deployment, but something goes wrong? When you check the logs, you realize that sometimes it's as simple as an indentation error. Well, with Husky, you can avoid these issues by running the linter before each commit. This way, you prevent changes with errors from being pushed and also ensure that such commits are not recorded in the history.

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/indent-problem.webp)

## ❌

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/no-conventional-commit.webp)

## ✅

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/conventional-commit.webp)

## What is a Git Hook?

A "Git Hook" is a custom script that you can trigger in response to specific events during the Git process. These events could be actions such as committing changes, pushing, merging branches, among others. Hooks allow you to execute scripts or perform actions automatically before or after these events occur in Git.

Git offers a series of predefined hooks, which you can adapt to fit your workflow needs. Some of the most common hooks include:

- **pre-commit**: Executes before committing changes. You can use it to perform tasks such as running automated tests or checking code quality.

- **pre-push**: Executes before pushing changes to the remote repository. It can be used to perform additional checks before sending changes to the server.

- **post-commit**: Executes after a change has been committed. It can be used to perform additional tasks after a commit has been made.

- **post-receive**: Executes in the remote repository after receiving new changes. It can be useful for performing actions on the server after changes have been pushed to the remote repository.

## Installation and Configuration of Husky and Commitlint

### Step 1: Set up Git Project

If you haven't already set up a Git repository for your project, initialize it by running the following command in your terminal:

```bash
git init
```

### Step 2: Install Husky

Husky can be easily installed using any package manager. In your terminal, run the following command to install Husky as a development dependency in your project:

```shell
npx husky-init && npm i
```

This will create a folder named `.husky` in the root of your project, which contains Husky's predefined hooks. Husky will also add a `prepare` script to your `package.json` file that will automatically run after your project dependencies are installed.

### Step 3: Configure Husky

Now, you need to add the scripts you want to run before committing. For example, you can have it run the `lint` script from your `package.json` to execute the linter before each commit and automatically fix errors. In this case, we'll use `eslint` as the linter.

```json
  "scripts": {
    "lint": "eslint \"*/**/*.{js,ts,jsx,tsx}\" --fix",
    "prepare": "husky install"
  }
```

Then, let's modify the `pre-commit` script in the `.husky/pre-commit` file to execute the `lint` script before each commit.

```diff title=".husky/pre-commit"
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- npm test
+ npm run lint
```

- _Replace `npm` with the package manager you are using._

> Note: You can add any script you want to run before each commit in the `.husky/pre-commit` file, such as running automated tests, checking code quality, etc.

### Step 4: Install Commitlint

Now that Husky is set up to run Commitlint before each commit, you need to install Commitlint in your project. You can do this by running the following command in your terminal:

```shell
npm i @commitlint/cli @commitlint/config-conventional -D
```

### Step 5: Configure Commitlint

After installing Commitlint, you need to configure it to use a set of rules.

Create a file named `commitlint.config.js` in the root of your project with the following command:

```shell
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js
```

Create the script to make commitlint run with the following command:

```shell
node node_modules/husky/lib/bin add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

## Ready to Commit!

Congratulations! You have successfully set up Husky and Commitlint in your project. Now, every time you make a commit to your Git repository, Husky will run Commitlint to ensure that your commit message complies with the defined conventions.

## Conclusion

In this guide, you have learned how to install and configure Husky and Commitlint in your software development projects. By following these instructions, you can improve the quality and consistency of commit messages in your Git repository, making collaboration and code maintenance easier over time.

Now you are ready to start committing with confidence!
