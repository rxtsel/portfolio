---
translationKey: nvim
order: 2
locale: es
title: nvim
description: Mi configuración de Neovim con Nix
href: https://github.com/rxtsel/nvim
sourceUrl: https://github.com/rxtsel/nvim
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/nvim/editing.webp
    title: Edición de código
    alt: Neovim con paneles de TypeScript, CSS y tests, diagnósticos de tipos y colores resaltados.
  - src: ../../../assets/projects/nvim/diff.webp
    title: Revisión de cambios
    alt: Explorador de cambios de Git en Neovim con un diff de Lua lado a lado.
publishDate: 2022-03-13
stack:
  - linux
  - lua
tags: []
---

## Mi entorno de edición

Sí, sé salir de Neovim. Simplemente no quiero.

Esta es mi configuración personal y uno de los proyectos a los que más cariño les tengo. Como escribí en mi [guía de comandos básicos de Neovim](/es/blog/comandos-basicos-de-neovim/): una vez lo pruebas, no hay vuelta atrás.

## Qué incluye

Reúne servidores de lenguaje, formateadores, Tree-sitter y herramientas de Git. Los atajos de teclado están documentados en el repositorio.

## Con o sin Nix

Se puede probar con `nix run github:rxtsel/nvim` sin reemplazar la configuración existente. El paquete de Nix incluye Neovim y sus herramientas de terminal, y mantiene sus datos separados. También se puede instalar manualmente; antes hay que hacer una copia de la configuración propia.
