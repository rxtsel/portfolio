---
title: 'Cómo instalar zsh en linux'
draft: false
description: 'Instala y configura Zsh en tu sistema con estos simples pasos. Optimiza tu terminal con oh-my-zsh para una experiencia de línea de comandos mejorada.'
pubDate: '2024-01-29T03:01:36.434Z'
heroImage: 'PWA.png'
categories: ['all', 'linux', 'terminal']
tags: ['all', 'linux', 'terminal']
author: ['Cristhian Melo'],
keywords: 'rxtsel, Cristhian Melo, Blog'
---

## Instalación

1. Para comenzar, instala **zsh** utilizando tu gestor de paquetes. En este caso, lo haré con pacman con el siguiente comando:

```bash
sudo pacman -S zsh
```

2. A continuación, verifica la versión de zsh recién instalada:

```bash
zsh --version
```

3. Para confirmar que estás utilizando la nueva shell, verifica la shell actual con:

```bash
echo $SHELL
```

4. Ahora, abre el archivo /etc/passwd con tu editor de texto preferido. Por ejemplo, puedes usar nvim:

```bash
sudo nvim /etc/passwd
```

5. Dentro del archivo, encuentra la línea que corresponde a tu nombre de usuario y reemplaza `/bin/bash` por `/bin/zsh`. En mi caso mi username es `rxtsel`:

```diff title="/etc/passwd"
- rxtsel:x:1000:1000::/home/rxtsel:/bin/bash

+ rxtsel:x:1000:1000::/home/rxtsel:/bin/zsh
```

- _Guarda los cambios y cierra el archivo._

6. Cambia la shell predeterminada ejecutando el siguiente comando:

```bash
sudo chsh -s /bin/zsh
```

7. Continúa instalando oh-my-zsh y git:

```bash
sudo pacman -S git &&
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"

```

8. Reinicia tu terminal para aplicar los cambios.

9. Luego, edita el archivo `.zshrc` con tu editor de texto favorito que debe estar en la raíz de la carpeta de usuario `/home/rxtsel/.zshrc`. En mi caso ya tengo mi configuración personalizada para **WSL**, pero puedes usar la que más te guste:

   - Para esta configuración necesitarás instalar los siguientes plugins y programas:

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

- Reinicia tu terminal para aplicar los cambios.

¡Listo! Ahora tienes zsh instalado, configurado con oh-my-zsh, y tu terminal está lista para ser utilizada de manera eficiente.
