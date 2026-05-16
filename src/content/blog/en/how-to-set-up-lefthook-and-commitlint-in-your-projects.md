---
translationKey: how-to-set-up-lefthook-and-commitlint-in-your-projects
locale: en
published: true
title: How to set up Lefthook and commitlint in your projects
description: Learn how to configure Lefthook with commitlint to automate linters, formatters, and commit validation in any JavaScript or TypeScript project.
publishDate: 2026-05-15
updatedDate: ""
categories:
  - git
  - tooling
seo:
  description: Step-by-step guide to install and configure Lefthook and commitlint with pnpm. Automate linters, formatters, and commit validation in your projects.
  keywords: lefthook, commitlint, husky alternative, git hooks, conventional commits, pnpm, biome, pre-commit, pre-push
---

## Introduction

Lefthook is a significantly faster alternative to Husky, written in Go. It can be installed as a standalone binary or as a Node.js package. In this guide we will use the second option so it is declared as a project dependency and anyone who clones the repository will have it available automatically after installing dependencies.

This guide assumes you already know what [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks?utm_source=rxtsel.dev&utm_medium=blog) are and what they are used for. Throughout this guide we will configure the `pre-commit`, `commit-msg` and `pre-push` hooks, which are the most commonly used ones, although you will find all available hooks in the official documentation.

You can use any package manager. The examples use **pnpm**.

## Installation

Install the following development dependencies:

```sh
pnpm add -DE lefthook@latest @commitlint/cli@latest @commitlint/config-conventional@latest
```

_This installs the latest exact versions, without carets (`^`), as development dependencies._

> **Note:** If you use pnpm, make sure to update `pnpm-workspace.yaml`'s `onlyBuiltDependencies` with `lefthook` and add `lefthook` to `pnpm.onlyBuiltDependencies` in your root `package.json`, otherwise the `postinstall` script of the lefthook package won't be executed and hooks won't be installed.

```yaml title="pnpm-workspace.yaml" ins={2}
onlyBuiltDependencies:
  - lefthook
```

And add lefthook to the `onlyBuiltDependencies` section in your root `package.json`:

```json title="package.json" ins={5}
{
  ...
  "pnpm": {
    "onlyBuiltDependencies": [
      "lefthook"
    ]
  }
}
```

## Commitlint configuration

Commitlint validates that commit messages follow the [Conventional Commits](https://www.conventionalcommits.org?utm_source=rxtsel.dev&utm_medium=blog) standard, making it easier to generate automatic changelogs and maintain a readable history.

Create the configuration file at the root of your project:

```js title="commitlint.config.js"
export default { extends: ["@commitlint/config-conventional"] }
```

## Lefthook configuration

For this example I will assume the project uses [Biome](https://biomejs.dev?utm_source=rxtsel.dev&utm_medium=blog) as linter and formatter, with the following scripts in `package.json`:

```json title="package.json"
{
  ...
  "scripts": {
    "format": "biome format",
    "lint": "biome lint",
    "check": "biome check",
  }
}
```

Create the `lefthook.yml` file at the root of your project:

```yaml title="lefthook.yml"
# Run linters and formatters on staged files before committing
pre-commit:
  parallel: false # run all commands concurrently
  commands:
    check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: pnpm run check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {staged_files}
      stage_fixed: true

# Validate commit messages
commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}

# Check formatting and lint before pushing
pre-push:
  commands:
    check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: npx @biomejs/biome check --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {push_files}
```

Each section maps to a Git hook:

- **`pre-commit`** — runs on staged files before the commit is created. The `stage_fixed: true` option automatically re-stages any files that Biome has corrected.
- **`commit-msg`** — validates the commit message with commitlint before it is recorded.
- **`pre-push`** — checks all files modified in the push without applying automatic fixes.

The `parallel` option controls whether the commands within a hook run in parallel or sequentially. Since `pre-commit` only has one command in this example, the value `false` (which is the default) makes no difference, but I include it explicitly so it is clear if you add more commands later.

You can extend this configuration to fit your project's needs: unit tests in `pre-commit`, end-to-end tests in `pre-push`, type generation, and so on. Check the [official Lefthook documentation](https://lefthook.dev?utm_source=rxtsel.dev&utm_medium=blog) for all available options.
