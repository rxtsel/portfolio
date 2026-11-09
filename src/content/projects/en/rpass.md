---
translationKey: rpass
order: 18
locale: en
title: rpass
description: A password manager client for Raycast and Vicinae
href: https://www.raycast.com/rxtsel/rpass
sourceUrl: https://github.com/raycast/extensions/tree/f221118834d65884520ada04e7d3ef46376a31a1/extensions/rpass/
detailPage: true
logo: ../../../assets/projects/rpass.webp
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/rpass/vault.webp
    title: Password vault
    alt: Example vault entries with search and folder categories.
  - src: ../../../assets/projects/rpass/folders.webp
    title: Folders
    alt: Folder selector for filtering vault entries.
  - src: ../../../assets/projects/rpass/entry-actions.webp
    title: Entry actions
    alt: Actions menu for viewing, editing, syncing or deleting an entry.
  - src: ../../../assets/projects/rpass/entry-fields.webp
    title: Entry fields
    alt: Entry fields with actions to copy, paste into the active app and hide values.
  - src: ../../../assets/projects/rpass/edit-entry.webp
    title: Editing an entry
    alt: Entry editor with a folder, name, password and additional example fields.
  - src: ../../../assets/projects/rpass/new-password.webp
    title: Generating a password
    alt: Form for generating and saving a password, with creation and regeneration actions.
  - src: ../../../assets/projects/rpass/new-passphrase.webp
    title: Generating a passphrase
    alt: Form for creating a passphrase in a folder, with an example value.
  - src: ../../../assets/projects/rpass/git-sync.webp
    title: Git sync
    alt: Vault change history and actions to pull or push changes with Git.
publishDate: 2026-07-27
stack:
  - nodejs
  - react
  - typescript
tags:
  - clean-architecture
  - screaming-architecture
  - vertical-slicing
  - solid
  - design-patterns
---

## Your vault, from the launcher

rpass is a client for [rpass-cli](/projects/rpass-cli/) that brings a pass-compatible password store into [Raycast](https://www.raycast.com/?ref=rxtsel.dev) or [Vicinae](https://www.vicinae.com/?ref=rxtsel.dev). It works on Windows, Linux and macOS.

## Find, use and update entries

From the launcher, you can find an entry, copy its fields or paste them into the active app. You can also edit entries, generate passwords and passphrases, and retrieve TOTP codes.

If the store uses Git, the extension lets you review its history and pull or push changes without opening a terminal.

## The interface and the CLI

The extension presents the entries and actions. rpass-cli handles the store operations, using your local GnuPG installation for encryption and decryption.

Listing entries reads the CLI's JSON output without decrypting the whole store. Decryption is requested when you open or use an entry.
