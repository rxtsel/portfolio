---
translationKey: appimage-install
order: 0
locale: en
title: appimage-install
description: AppImage integration for Linux and NixOS
href: https://github.com/rxtsel/appimage-install
sourceUrl: https://github.com/rxtsel/appimage-install
publishDate: 2025-06-25
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/appimage-install/install.webp
    title: Installing an AppImage
    alt: Terminal running appimage-install for Obsidian, moving the file, extracting its icon and creating a .desktop launcher.
stack:
  - linux
tags: []
---

## Why I built it

Coming from Arch Linux, I kept doing the same manual work with AppImages: setting permissions, moving files and creating launchers so apps would appear in my menus with an icon. I wrote a script to handle those steps.

## What it does

Run `appimage-install name.AppImage`. The script moves the file to `~/AppImages`, makes it executable, extracts its icon when available and creates a `.desktop` entry for application menus and launchers.

## Adapting it to NixOS

I later adapted it for NixOS. It detects when `appimage-run` is needed and provides installation hints for missing optional dependencies. It can also be installed or run through a Nix flake.
