---
title: 'How to Install Zsh on Linux'
draft: false
description: 'Install and configure Zsh on your system with these simple steps. Optimize your terminal with oh-my-zsh for an enhanced command-line experience.'
pubDate: '2024-01-29T03:01:36.434Z'
heroImage: 'PWA.png'
categories: ['all', 'linux', 'terminal']
tags: ['all', 'linux', 'terminal']
author: ['Cristhian Melo']
keywords: 'Zsh, Linux terminal, Zsh installation, Zsh configuration, Oh-my-zsh, Command line, Pacman, Enhanced terminal, Default shell, Chsh, .zshrc file, Zsh plugins, Git, Nvim, Tmux, Fnm, Bun, Zsh theme, Zsh syntax highlighting, Zsh aliases'
lang: 'en'
---

## Installation

1. To begin, install **zsh** using your package manager. In this case, I'll use pacman with the following command:

```bash
sudo pacman -S zsh
```

2. Next, verify the newly installed zsh version:

```bash
zsh --version
```

3. To confirm that you are using the new shell, check the current shell with:

```bash
echo $SHELL
```

4. Now, open the /etc/passwd file with your preferred text editor. For example, you can use nvim:

```bash
sudo nvim /etc/passwd
```

5. Within the file, find the line corresponding to your username and replace `/bin/bash` with `/bin/zsh`. In my case, my username is rxtsel:

```diff title="/etc/passwd"
- rxtsel:x:1000:1000::/home/rxtsel:/bin/bash

+ rxtsel:x:1000:1000::/home/rxtsel:/bin/zsh
```

- _Save the changes and close the file._

6. Change the default shell by running the following command:

```bash
sudo chsh -s /bin/zsh
```

7. Continue by installing oh-my-zsh and git:

```bash
sudo pacman -S git &&
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```

8. Restart your terminal to apply the changes.

9. Then, edit the `.zshrc` file with your favorite text editor, which should be in the root of the user folder `/home/rxtsel/.zshrc`. In my case, I already have my customized configuration for **WSL**, but feel free to use the one you prefer:

   - For this configuration, you will need to install the following plugins and programs:

   * [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md)
   * [nvim](https://github.com/neovim/neovim)
   * [tmux](https://github.com/tmux/tmux)
   * [fnm](https://github.com/Schniz/fnm)
   * [bun](https://bun.sh/)

```zsh title=".zshrc"
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
ZSH_THEME="robbyrussell"

plugins=(
  sudo
  git
	zsh-syntax-highlighting
	)

source $ZSH/oh-my-zsh.sh

# CUSTOM ALIAS
alias zz="cd ~/.config"
alias vim=nvim
alias v=nvim
alias vcfg="cd ~/.config/nvim/ && nvim init.lua"
alias zr="source ~/.zshrc"
alias -s {html,js,css,py,go,lua}="nvim"
alias pro="cd ~/Projects"
alias t="tmux"
alias thunar="/mnt/c/Windows/explorer.exe ."

# fnm
export PATH="/home/rxtsel/.local/share/fnm:$PATH"
eval "`fnm env`"

# bun completions
[ -s "/home/rxtsel/.bun/_bun" ] && source "/home/rxtsel/.bun/_bun"

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

```

- Restart your terminal to apply the changes.

Congratulations! Now you have Zsh installed, configured with oh-my-zsh, and your terminal is ready to be used efficiently.
