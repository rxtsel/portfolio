---
title: 'Basic Commands for Neovim'
draft: false
description: 'Learn some basic commands to use in Neovim.'
pubDate: '2024-01-29T14:58:19.163Z'
heroImage: 'PWA.png'
categories: ['Terminal', 'Neovim']
tags: ['Terminal', 'Neovim']
author: ['Cristhian Melo']
keywords: 'rxtsel, Cristhian Melo, Blog, Neovim,Text editor,Normal mode,Insert mode,Visual mode,Command mode,Terminal mode,Basic commands,Navigation in Neovim,Neovim configuration,LazyVim,Neovim plugins,Neovim themes,Cristhian Melo,Terminal,Blog,Neovim tutorial,Text in the terminal,Customization Neovim,User experience'
lang: 'en'
---

## What is Neovim?

Neovim is a text editor that runs in the terminal, an enhanced version of Vim designed to improve user experience and ease of maintenance. It is very, very fast. Many people, including myself, say **_"Once you try Neovim, there's no turning back."_**

It is a powerful text editor with many features, but don't worry, you don't need to know them all to use it. Over time, you'll learn them. Moreover, you can customize it to your liking with plugins, themes, etc.

To use Neovim, you first need to install it. You can learn how to do it in the following [link](https://www.neovim.io/). This will install Neovim completely clean, without any plugins or anything, just the editor. Configuring Neovim is a whole different world. However, you can choose to use [LazyVim](https://www.lazyvim.org/), which is a Neovim configuration that comes with plugins, themes, etc. This way, you'll save a lot of configuration time and can go straight to using it. There are many other configurations, but I recommend `LazyVim` to start getting familiar. This is my Neovim configuration if you want to check it out: [My nvim setup](https://github.com/rxtsel/nvim).

You may feel a bit lost when using it, but don't worry, I'll teach you some basic commands to get you started.

## Neovim Modes

You should know that Neovim has different modes, which are:

- **Normal mode:** The default mode for navigating the document, copying, pasting, cutting, etc.
- **Insert mode:** The mode for typing in the document.
- **Visual mode:** The mode for selecting text.
- **Comand mode:** The mode for executing commands.
- **Terminal Mode:** The mode for running terminal commands.

I have a plugin that shows me the mode I'm in, but if you don't have it, you can see it in the bottom left corner; it will show you the mode you're in:

- Normal mode: ![image](/blog/240129-comandos-basicos-de-neovim/lualine-normal-mode.webp)
- Insertar mode: ![image](/blog/240129-comandos-basicos-de-neovim/lualine-insert-mode.webp)
- Visual mode: ![image](/blog/240129-comandos-basicos-de-neovim/lualine-visual-mode.webp)
- Command mode: ![image](/blog/240129-comandos-basicos-de-neovim/lualine-command-mode.webp)
- Terminal mode: ![image](/blog/240129-comandos-basicos-de-neovim/lualine-terminal-mode.webp)

## Commands

### Basics:

| Command      | Description                                                |
| ------------ | ---------------------------------------------------------- |
| **i**        | Enter `Instert` mode                                       |
| **Esc**      | Exit any mode and enter `Normal` mode                      |
| **v**        | Enter `Visual` mode                                        |
| **:**        | Enter `Command` mode                                       |
| **o**        | Create a new line below the cursor and enter `Insert mode` |
| **O**        | Create a new line above the cursor and enter `Insert mode` |
| **zz**       | Center the cursor on the screen                            |
| **u**        | Undo changes                                               |
| **Ctrl + r** | Redo changes                                               |
| **:q**       | Exit Neovim                                                |
| **:w**       | Save changes                                               |
| **:wq**      | Save changes and exit Neovim                               |

### Navegación:

| Command      | Description                                                      |
| ------------ | ---------------------------------------------------------------- |
| **h**        | Move the cursor to the left                                      |
| **j**        | Move the cursor down                                             |
| **k**        | Move the cursor up                                               |
| **l**        | Move the cursor to the right                                     |
| **0**        | Move the cursor to the beginning of the line                     |
| **$**        | Move the cursor to the end of the line                           |
| **%**        | Move the cursor to the next pair of characters, like: (), {}, [] |
| **Ctrl + e** | Scroll down                                                      |
| **Ctrl + y** | Scroll up                                                        |
| **gg**       | Move the cursor to the beginning of the document                 |
| **G**        | Move the cursor to the end of the document                       |
| **w**        | Move the cursor to the beginning of the next word                |
| **b**        | Move the cursor to the beginning of the previous word            |
| **e**        | Move the cursor to the end of the next word                      |
| **Ctrl + u** | Scroll the screen several lines up                               |
| **Ctrl + d** | Scroll the screen several lines down                             |

### Conversion:

| Command | Description                        |
| ------- | ---------------------------------- |
| **veU** | Convert the selection to uppercase |
| **veu** | Convert the selection to lowercase |

### Operations:

| Command | Description                  |
| ------- | ---------------------------- |
| **4j**  | Move the cursor 4 lines down |
| **6k**  | Move the cursor 6 lines up   |

- You can use any number and go in any direction.

### Text Selection:

| Command | Description                                                                                                              |
| ------- | ------------------------------------------------------------------------------------------------------------------------ |
| **viw** | Select the word under the cursor                                                                                         |
| **vec** | Replace from the cursor position to the end of the word, and enter `Insert` mode                                         |
| **ciw** | Replace the word under the cursor and enter `Insert` mode                                                                |
| **yiw** | Copy the word under the cursor                                                                                           |
| **diw** | Delete the word under the cursor and enter `Normal` mode                                                                 |
| **vi(** | Select the content between parentheses. (Works with any pair of characters)                                              |
| **ci"** | Replace the content between double quotes, and enter `Insert` mode. (Works with any pair of characters)                  |
| **va(** | Select the content between parentheses and the parentheses. (Works with any pair of characters)                          |
| **da(** | Delete the content between parentheses and the parentheses, and enter `Normal` mode. (Works with any pair of characters) |
| **ca"** | Replace the content between double quotes and the quotes, and enter `Insert` mode. (Works with any pair of characters)   |

### Copy, Paste, and Cut:

| Command | Description                                                |
| ------- | ---------------------------------------------------------- |
| **yy**  | Copy the line under the cursor                             |
| **dd**  | Cut the line under the cursor                              |
| **p**   | Paste what's in the clipboard on the line below the cursor |
| **P**   | Paste what's in the clipboard on the line above the cursor |
| **x**   | Cut the character under the cursor                         |
| **vy**  | Copy the character under the cursor                        |

### Search and Replace:

| Command            | Description                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------ |
| **/**              | Search for the word you type throughout the document                                             |
| **n**              | Search for the next occurrence                                                                   |
| **N**              | Search for the previous occurrence                                                               |
| **fh**             | Search for the first occurrence after the cursor for the letter `h`. (Works with any character)  |
| **Fh**             | Search for the first occurrence before the cursor for the letter `h`. (Works with any character) |
| **r**              | Replace the character under the cursor with the character you specify                            |
| **#**              | Search for the word under the cursor                                                             |
| **\***             | Search for the word under the cursor                                                             |
| **:%s/aaa/bbbb/g** | Replace all occurrences of `aaa` with `bbb` throughout the document                              |

## Ready, with these basic commands, you can navigate well in Neovim. Enjoy! 😃
