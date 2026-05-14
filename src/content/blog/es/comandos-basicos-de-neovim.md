---
translationKey: basic-commands-for-neovim
locale: es
published: true
title: Comandos básicos de Neovim
description: Aprende algunos comandos básicos para que uses en neovim.
publishDate: 2024-01-09
updatedDate: 2026-05-14
categories:
  - tutorials
  - editors
  - neovim
seo:
  description: Aprende comandos esenciales de Neovim, modos, navegación y edición básica para usar este editor de terminal con confianza.
  keywords: comandos neovim, tutorial neovim, vim básico, editor de terminal, aprender neovim
---

## ¿Qué es Neovim?

Neovim es un editor de texto que se ejecuta en la terminal. Es una versión mejorada de Vim, creada con el fin de mejorar la experiencia de usuario y facilitar su mantenimiento. Es muy, pero muy **rápido**. Hay muchas personas, y me incluyo, que dicen: **_"Una vez pruebas Neovim, no hay vuelta atrás"_**.

Es un editor de texto muy potente, con muchas funcionalidades, pero no te preocupes: no necesitas saberlas todas para poder usarlo. Con el tiempo las irás aprendiendo. Además, puedes personalizarlo a tu gusto con plugins, temas, atajos, configuraciones y más.

Para poder usar Neovim, primero debes instalarlo. Puedes ver cómo hacerlo en el siguiente [enlace](https://www.neovim.io/). Esto instalará Neovim totalmente limpio, sin plugins ni configuraciones adicionales, solo el editor.

Configurar Neovim es otro mundo totalmente diferente. Pero puedes optar por usar [LazyVim](https://www.lazyvim.org/), que es una configuración de Neovim que viene con plugins, temas y muchas herramientas listas para usar. Así te ahorrarás bastante tiempo de configuración y podrás pasar directamente a usarlo. También hay muchas otras configuraciones, pero yo te recomiendo `LazyVim` para empezar a familiarizarte. Esta es mi configuración de Neovim, por si quieres verla: [My nvim setup](https://github.com/rxtsel/nvim).

Puede ser que te sientas un poco perdido al usarlo, pero no te preocupes. Aquí te enseñaré algunos comandos básicos para que puedas empezar.

## Modos de Neovim

Debes saber que Neovim tiene diferentes modos:

- **Modo normal:** Es el modo por defecto, en el que puedes navegar por el documento, copiar, pegar, cortar, etc.
- **Modo insertar:** Es el modo en el que puedes escribir en el documento.
- **Modo visual:** Es el modo en el que puedes seleccionar texto.
- **Modo comando:** Es el modo en el que puedes ejecutar comandos de Neovim.
- **Modo terminal:** Es el modo en el que puedes ejecutar comandos de la terminal.

Yo tengo un plugin que me muestra en qué modo estoy, pero si tú no lo tienes, puedes verlo en la esquina inferior izquierda. Allí se mostrará el modo en el que estás:

- Modo normal: ![Modo normal en statusline de Neovim](/uploads/lualine-normal-mode.webp)
- Modo insertar: ![Modo insertar en statusline de Neovim](/uploads/lualine-insert-mode.webp)
- Modo visual: ![Modo visual en statusline de Neovim](/uploads/lualine-visual-mode.webp)
- Modo comando: ![Modo comando en statusline de Neovim](/uploads/lualine-command-mode.webp)
- Modo terminal: ![Modo terminal en statusline de Neovim](/uploads/lualine-terminal-mode.webp)

## Comandos

### Básicos

| Comando | Descripción |
| --- | --- |
| **i** | Entra a modo `Insert` |
| **Esc** | Sale de cualquier modo y vuelve a modo `Normal` |
| **v** | Entra a modo `Visual` |
| **:** | Entra a modo `Comando` |
| **o** | Crea una nueva línea debajo del cursor y entra a modo `Insert` |
| **O** | Crea una nueva línea encima del cursor y entra a modo `Insert` |
| **zz** | Centra el cursor en la pantalla |
| **u** | Deshace cambios |
| **Ctrl + r** | Rehace cambios |
| **:q** | Sale de Neovim |
| **:w** | Guarda los cambios |
| **:wq** | Guarda los cambios y sale de Neovim |

### Navegación

| Comando | Descripción |
| --- | --- |
| **h** | Mueve el cursor hacia la izquierda |
| **j** | Mueve el cursor hacia abajo |
| **k** | Mueve el cursor hacia arriba |
| **l** | Mueve el cursor hacia la derecha |
| **0** | Mueve el cursor al inicio de la línea |
| **$** | Mueve el cursor al final de la línea |
| **%** | Mueve el cursor al siguiente par de caracteres, como: `()`, `{}`, `[]` |
| **Ctrl + e** | Desplaza la pantalla hacia abajo |
| **Ctrl + y** | Desplaza la pantalla hacia arriba |
| **gg** | Mueve el cursor al inicio del documento |
| **G** | Mueve el cursor al final del documento |
| **w** | Mueve el cursor al inicio de la siguiente palabra |
| **b** | Mueve el cursor al inicio de la palabra anterior |
| **e** | Mueve el cursor al final de la siguiente palabra |
| **Ctrl + u** | Desplaza la pantalla varias líneas hacia arriba |
| **Ctrl + d** | Desplaza la pantalla varias líneas hacia abajo |

### Cambiar mayúsculas y minúsculas

| Comando | Descripción |
| --- | --- |
| **veU** | Convierte a mayúsculas la selección |
| **veu** | Convierte a minúsculas la selección |

### Operaciones con números

| Comando | Descripción |
| --- | --- |
| **4j** | Mueve el cursor 4 líneas hacia abajo |
| **6k** | Mueve el cursor 6 líneas hacia arriba |

Puedes usar cualquier número con cualquier dirección. Por ejemplo: `10j`, `3k`, `5w` o `2b`.

### Selección de texto

| Comando | Descripción |
| --- | --- |
| **viw** | Selecciona la palabra bajo el cursor |
| **vec** | Reemplaza desde donde está el cursor hasta el final de la palabra y queda en modo `Insert` |
| **ciw** | Reemplaza la palabra bajo el cursor y queda en modo `Insert` |
| **yiw** | Copia la palabra bajo el cursor |
| **diw** | Borra la palabra bajo el cursor y queda en modo `Normal` |
| **vi(** | Selecciona el contenido entre paréntesis. Funciona con otros pares de caracteres |
| **ci"** | Reemplaza el contenido entre comillas y queda en modo `Insert`. Funciona con otros pares de caracteres |
| **va(** | Selecciona el contenido entre paréntesis y también los paréntesis. Funciona con otros pares de caracteres |
| **da(** | Borra el contenido entre paréntesis y también los paréntesis. Queda en modo `Normal`. Funciona con otros pares de caracteres |
| **ca"** | Reemplaza el contenido entre comillas y también las comillas. Queda en modo `Insert`. Funciona con otros pares de caracteres |

### Copiar, pegar y cortar

| Comando | Descripción |
| --- | --- |
| **yy** | Copia la línea bajo el cursor |
| **dd** | Corta la línea bajo el cursor |
| **p** | Pega después del cursor. Si copiaste una línea completa, la pega debajo |
| **P** | Pega antes del cursor. Si copiaste una línea completa, la pega encima |
| **x** | Corta el carácter bajo el cursor |
| **vy** | Selecciona el carácter bajo el cursor y lo copia |

### Buscar y reemplazar

| Comando | Descripción |
| --- | --- |
| **/** | Busca la palabra que escribas en todo el documento |
| **n** | Va a la siguiente ocurrencia |
| **N** | Va a la ocurrencia anterior |
| **fh** | Busca la primera ocurrencia después del cursor para la letra `h`. Funciona con cualquier carácter |
| **Fh** | Busca la primera ocurrencia antes del cursor para la letra `h`. Funciona con cualquier carácter |
| **r** | Reemplaza el carácter bajo el cursor por el carácter que indiques |
| **#** | Busca la palabra bajo el cursor hacia atrás |
| **\*** | Busca la palabra bajo el cursor hacia adelante |
| **:%s/aaa/bbbb/g** | Reemplaza todas las ocurrencias de `aaa` por `bbb` en todo el documento |

## Práctica rápida

Si quieres empezar a practicar, puedes seguir estos pasos:

1. Abre un archivo con `nvim archivo.txt`.
2. Presiona `i` para entrar a modo `Insert`.
3. Escribe una frase.
4. Presiona `Esc` para volver a modo `Normal`.
5. Muévete con `h`, `j`, `k` y `l`.
6. Usa `yy` para copiar una línea.
7. Usa `p` para pegarla debajo.
8. Usa `/palabra` para buscar una palabra dentro del archivo.
9. Guarda los cambios con `:w`.
10. Sal de Neovim con `:q`.

## ¡Listo, con estos comandos básicos puedes desenvolverte muy bien en Neovim. Que los disfrutes! 😃
