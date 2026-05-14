---
translationKey: basic-commands-for-neovim
locale: en
published: true
title: Basic Commands for Neovim
description: Learn some basic commands to use in Neovim.
publishDate: 2024-01-09
updatedDate: 2026-05-14
categories:
  - tutorials
  - editors
  - neovim
seo:
  description: Learn essential Neovim commands, modes, navigation shortcuts, and editing basics to start using this terminal editor with confidence.
  keywords: neovim commands, vim basics, neovim tutorial, terminal editor, learn neovim
---

## What is Neovim?

Neovim is a text editor that runs in the terminal. It is an enhanced version of Vim, created to improve the user experience and make maintenance easier. It is very, very **fast**. Many people, including myself, say: **_"Once you try Neovim, there's no turning back."_**

It is a very powerful text editor with many features, but don't worry: you don't need to know all of them to use it. Over time, you will learn them. You can also customize it to your liking with plugins, themes, keymaps, settings, and more.

To use Neovim, you first need to install it. You can learn how to do that in the following [link](https://www.neovim.io/). This will install a completely clean version of Neovim, without plugins or additional configuration, just the editor.

Configuring Neovim is a whole different world. However, you can choose to use [LazyVim](https://www.lazyvim.org/), which is a Neovim configuration that comes with plugins, themes, and many tools ready to use. This way, you will save a lot of configuration time and can go straight to using it. There are many other configurations, but I recommend `LazyVim` to start getting familiar with Neovim. This is my Neovim configuration in case you want to check it out: [My nvim setup](https://github.com/rxtsel/nvim).

You may feel a bit lost when using it at first, but don't worry. Here I will show you some basic commands to help you get started.

## Neovim Modes

You should know that Neovim has different modes:

- **Normal mode:** The default mode, where you can navigate the document, copy, paste, cut, etc.
- **Insert mode:** The mode where you can type in the document.
- **Visual mode:** The mode where you can select text.
- **Command mode:** The mode where you can run Neovim commands.
- **Terminal mode:** The mode where you can run terminal commands.

I have a plugin that shows me which mode I am in, but if you do not have one, you can see it in the bottom-left corner. It will show the mode you are currently in:

- Normal mode: ![Normal mode in Neovim statusline](/uploads/lualine-normal-mode.webp)
- Insert mode: ![Insert mode in Neovim statusline](/uploads/lualine-insert-mode.webp)
- Visual mode: ![Visual mode in Neovim statusline](/uploads/lualine-visual-mode.webp)
- Command mode: ![Command mode in Neovim statusline](/uploads/lualine-command-mode.webp)
- Terminal mode: ![Terminal mode in Neovim statusline](/uploads/lualine-terminal-mode.webp)

## Commands

### Basics

| Command | Description |
| --- | --- |
| **i** | Enter `Insert` mode |
| **Esc** | Exit any mode and return to `Normal` mode |
| **v** | Enter `Visual` mode |
| **:** | Enter `Command` mode |
| **o** | Create a new line below the cursor and enter `Insert` mode |
| **O** | Create a new line above the cursor and enter `Insert` mode |
| **zz** | Center the cursor on the screen |
| **u** | Undo changes |
| **Ctrl + r** | Redo changes |
| **:q** | Exit Neovim |
| **:w** | Save changes |
| **:wq** | Save changes and exit Neovim |

### Navigation

| Command | Description |
| --- | --- |
| **h** | Move the cursor to the left |
| **j** | Move the cursor down |
| **k** | Move the cursor up |
| **l** | Move the cursor to the right |
| **0** | Move the cursor to the beginning of the line |
| **$** | Move the cursor to the end of the line |
| **%** | Move the cursor to the next matching pair of characters, such as `()`, `{}`, `[]` |
| **Ctrl + e** | Scroll down |
| **Ctrl + y** | Scroll up |
| **gg** | Move the cursor to the beginning of the document |
| **G** | Move the cursor to the end of the document |
| **w** | Move the cursor to the beginning of the next word |
| **b** | Move the cursor to the beginning of the previous word |
| **e** | Move the cursor to the end of the next word |
| **Ctrl + u** | Scroll the screen several lines up |
| **Ctrl + d** | Scroll the screen several lines down |

### Change uppercase and lowercase

| Command | Description |
| --- | --- |
| **veU** | Convert the selection to uppercase |
| **veu** | Convert the selection to lowercase |

### Operations with numbers

| Command | Description |
| --- | --- |
| **4j** | Move the cursor 4 lines down |
| **6k** | Move the cursor 6 lines up |

You can use any number with any direction. For example: `10j`, `3k`, `5w`, or `2b`.

### Text Selection

| Command | Description |
| --- | --- |
| **viw** | Select the word under the cursor |
| **vec** | Replace from the cursor position to the end of the word and enter `Insert` mode |
| **ciw** | Replace the word under the cursor and enter `Insert` mode |
| **yiw** | Copy the word under the cursor |
| **diw** | Delete the word under the cursor and return to `Normal` mode |
| **vi(** | Select the content inside parentheses. Works with other pairs of characters |
| **ci"** | Replace the content inside double quotes and enter `Insert` mode. Works with other pairs of characters |
| **va(** | Select the content inside parentheses and the parentheses themselves. Works with other pairs of characters |
| **da(** | Delete the content inside parentheses and the parentheses themselves. Return to `Normal` mode. Works with other pairs of characters |
| **ca"** | Replace the content inside double quotes and the quotes themselves. Enter `Insert` mode. Works with other pairs of characters |

### Copy, paste, and cut

| Command | Description |
| --- | --- |
| **yy** | Copy the line under the cursor |
| **dd** | Cut the line under the cursor |
| **p** | Paste after the cursor. If you copied a full line, it pastes below |
| **P** | Paste before the cursor. If you copied a full line, it pastes above |
| **x** | Cut the character under the cursor |
| **vy** | Select the character under the cursor and copy it |

### Search and replace

| Command | Description |
| --- | --- |
| **/** | Search for the word you type throughout the document |
| **n** | Go to the next occurrence |
| **N** | Go to the previous occurrence |
| **fh** | Search for the first occurrence of the letter `h` after the cursor. Works with any character |
| **Fh** | Search for the first occurrence of the letter `h` before the cursor. Works with any character |
| **r** | Replace the character under the cursor with the character you specify |
| **#** | Search for the word under the cursor backward |
| **\*** | Search for the word under the cursor forward |
| **:%s/aaa/bbbb/g** | Replace all occurrences of `aaa` with `bbb` throughout the document |

## Quick practice

If you want to start practicing, you can follow these steps:

1. Open a file with `nvim file.txt`.
2. Press `i` to enter `Insert` mode.
3. Write a sentence.
4. Press `Esc` to return to `Normal` mode.
5. Move around with `h`, `j`, `k`, and `l`.
6. Use `yy` to copy a line.
7. Use `p` to paste it below.
8. Use `/word` to search for a word inside the file.
9. Save the changes with `:w`.
10. Exit Neovim with `:q`.

## Ready, with these basic commands, you can navigate well in Neovim. Enjoy! 😃
