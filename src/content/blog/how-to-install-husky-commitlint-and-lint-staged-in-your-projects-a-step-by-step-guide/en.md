---
title: 'How to Install Husky, Commitlint, and lint-staged in Your Projects: A Step-by-Step Guide'
draft: false
description: 'Learn how to improve the quality and consistency of your commits in software projects with Husky, Commitlint and lint-staged. This guide provides step-by-step instructions on how to install and configure these powerful tools, ensuring better collaboration and code maintenance through standardized commit messages.'
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

**Husky**, **Commitlint** and **lint-staged** are powerful tools that can improve the quality and consistency of your commits in software development projects. [Husky](https://typicode.github.io/husky/) allows you to configure [Git Hooks](#what-is-a-git-hook) in your Git repository, while [Commitlint](https://commitlint.js.org/#/) helps enforce consistent commit message conventions. ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)). [lint-staged]() allows you to run linters on staged files before committing them.

In this step-by-step guide, you'll learn how to install and configure Husky, Commitlint and lint-staged in your projects.

### Why Husky, Commitlint and lint-staged?

Have you ever pushed changes to your repository and the CI automatically deploys, but something goes wrong? When you check the logs, you realize it's something as simple as an indentation error. With Husky, you can prevent these issues by running the linter before each commit. This way, you avoid committing changes with errors, and also prevent that commit from being recorded in the history.

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/indent-problem.webp)

## ❌

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/no-conventional-commit.webp)

## ✅

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/conventional-commit.webp)

## What is a Git Hook?

A "Git Hook" is a custom script that can be triggered in response to specific events during the Git process. These events can include actions such as committing, pushing, merging branches, among others. Hooks allow you to run scripts or perform actions automatically before or after these events occur in Git.

Git provides a set of predefined hooks, which you can adapt to your workflow needs. Some common hooks are:

- **pre-commit**: Runs before committing changes. You can use it to run tasks such as automated tests or code quality checks.

- **pre-push**: Runs before pushing changes to the remote repository. It can be used to perform additional checks before sending changes to the server.

- **post-commit**: Runs after a change has been committed. It can be used to perform additional tasks after a commit has been made.

- **post-receive**: Runs on the remote repository after receiving new changes. It can be useful for performing actions on the server after changes have been pushed to the remote repository.

## Installing and Configuring Husky, Commitlint and lint-staged

### Step 1: Set Up the Git Project

If you don't have a Git repository set up for your project yet, initialize it by running the following command in your terminal:

```bash
git init
```

### Step 2: Install Husky

> Note:
> I will use the `ppnpm` package manager in this example, but you can use `pnpm` or `yarn` according to your preferences.

Husky can be easily installed using any package manager. In your terminal, run the following command to install Husky as a development dependency in your project:

```shell
pnpx husky-init && pnpm i
```

This will create a `.husky` folder at the root of your project, containing Husky's predefined hooks. Husky will also add a `prepare` script to your `package.json`, which will run automatically after your project dependencies are installed.

### Step 3: Configure Husky

Now, you need to add the scripts you want to run before committing. For example, you can run the `lint` script from your `package.json` to execute the linter before each commit and automatically fix any errors. In this case, we'll use `eslint` as the linter.

```json
  "scripts": {
    "lint": "eslint \"*/**/*.{js,ts,jsx,tsx}\" --fix",
    "prepare": "husky install"
  }
```

Then, modify the `pre-commit` script in the `.husky/pre-commit` file to run the `lint` script before each commit.

```diff title=".husky/pre-commit"
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- pnpm test
+ pnpm run lint
```

- _Replace `pnpm` with the package manager you are using._

> Note: you can add any script you want to run before each commit in the `.husky/pre-commit` file, such as running automated tests, checking code quality, etc.

### Step 4: Install Commitlint

Now that Husky is set up to run Commitlint before each commit, you need to install Commitlint in your project. You can do this by running the following command in your terminal:

```shell
pnpm i @commitlint/cli @commitlint/config-conventional -DE
```

### Step 5: Configure Commitlint

After installing Commitlint, you need to configure it to use a set of rules.

Create a file called `commitlint.config.js` in the root of your project with the following command:

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

Create the script to run commitlint with the following command:

```shell
node node_modules/husky/lib/bin add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

Congratulations! You have successfully configured Husky and Commitlint in your project. Now, whenever you make a commit in your Git repository, Husky will run Commitlint to ensure your commit message follows the defined conventions.

## lint-staged

If you want to run the linter only on modified files before each commit, you can install `lint-staged` and configure it in your project.

1. Install `lint-staged`:

   ```shell
   pnpm i lint-staged -DE
   ```

2. Create a `.lintstagedrc` file in the root of your project and add the desired configuration. For example, to run `eslint` on modified `{js,jsx,ts,tsx}` files:

   ```json
   {
     "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
   }
   ```

3. Add the script to `.husky/pre-commit` to run `lint-staged` before each commit:

   ```diff title=".husky/pre-commit"
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/\_/husky.sh"

   pnpm run lint
   + pnpx lint-staged
   ```

Now, `lint-staged` will run the linter only on modified files before each commit.

## Conclusion

In this guide, you've learned how to install and configure Husky and Commitlint in your software development projects. By following these instructions, you can improve the quality and consistency of commit messages in your Git repository, making collaboration and code maintenance easier over time.

Now you're ready to start committing with confidence!
