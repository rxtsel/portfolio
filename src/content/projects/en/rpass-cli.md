---
translationKey: rpass-cli
order: 15
locale: en
title: rpass-cli
description: A local password manager in Rust, compatible with pass
href: https://crates.io/crates/rpass-cli
sourceUrl: https://github.com/rxtsel/rpass-cli
logo: ../../../assets/projects/rpass.webp
detailPage: true
screenshotOrientation: horizontal
publishDate: 2026-06-19
stack:
  - rust
tags: []
---

## It started with a wait that bothered me

On Linux, I use [Vicinae](https://www.vicinae.com/?ref=rxtsel.dev) because [Raycast](https://www.raycast.com/?ref=rxtsel.dev) isn't available there. Vicinae supports its extension API, so I was using the Bitwarden extension.

Opening the vault and listing entries felt far too slow. Between the Bitwarden CLI and requests to the service, I kept waiting for something I wanted to look up immediately. I started looking for an alternative that worked with local data.

That's how I found [pass](https://www.passwordstore.org/?ref=rxtsel.dev). I liked its approach of keeping passwords in GPG-encrypted files. I used it from the terminal, but when I added a Windows machine, I couldn't get the workflow I wanted across both systems.

## The Rust engine

I built rpass-cli to have that workflow on Windows, Linux and macOS. I kept compatibility with the pass format and left encryption to GnuPG.

The CLI can read and edit entries, import a store and produce TOTP codes. It also generates random passwords and passphrases using operating-system randomness. Entropy depends on the length and character set, or on the number of words and the size of the word list.

It respects pass's `.gpg-id` files to determine who each entry is encrypted for. Multiple GPG recipients can be configured per folder, rather than using a single identity for the whole store.

Alongside terminal use, I added JSON responses and structured errors so other clients could use it.

## A client without building another app

I like using the terminal, but I also wanted it to work for someone who wasn't comfortable with it. Rather than build another desktop app, I made a [client for Raycast and Vicinae](/projects/rpass/) on top of the same engine.

That lets me find an entry from the launcher while rpass-cli does the work underneath.

## The same store across devices

I sync the store with Git. It can use a self-hosted server or any compatible remote, including Bitbucket, GitLab or GitHub. Sync is a separate operation; listing entries doesn't need a remote API request.

The CLI runs on Windows, Linux and macOS. On iOS and Android, the same format lets you use pass-compatible clients. I use Pass for iOS on my phone.

## What I use every day

In my daily use, listing entries is practically instant. That's what I was after: looking up passwords locally and choosing where to keep and sync the encrypted files.
