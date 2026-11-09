---
translationKey: dotfiles
order: -2
locale: es
title: dotfiles
description: Mi entorno Linux reproducible con NixOS y Home Manager
href: https://github.com/rxtsel/dotfiles
sourceUrl: https://github.com/rxtsel/dotfiles
publishDate: 2022-02-03
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/dotfiles/desktop.webp
    title: Escritorio Linux
    alt: Mi escritorio NixOS con Niri, Noctalia, una terminal, Neovim y un gestor de archivos.
stack:
  - linux
tags: []
---

## Todo empezó con una computadora lenta

Hace más de una década, mi padre me compró una computadora con Windows 7. Me gustaba mucho, pero tenía poca RAM, poco almacenamiento y era lenta. Quería que funcionara mejor, así que empecé a averiguar por qué iba tan mal. Por el camino fui aprendiendo sobre hardware. También llegué a buscar en YouTube cómo descargar más RAM.

En esa búsqueda encontré Linux. Leía que corría hasta en una tostadora y terminé dando con Arch. Decían que era de lo más difícil de instalar, así que me fui por él. Me gustan los retos, aunque a veces eso signifique complicarme la vida.

Tardé semanas en instalarlo desde la línea de comandos. Así aprendí Linux: equivocándome, buscando y volviendo a intentar. Después probé muchas distribuciones, pero pasé muchísimos años en Arch y le sigo teniendo mucho cariño.

## De repetir los pasos a reproducir el entorno

Con el tiempo escribí una [guía para instalar Arch Linux desde la terminal](/es/blog/como-instalar-arch-linux-usando-la-linea-de-comandos/). La seguía cada vez que instalaba Linux en otra computadora y después copiaba mis dotfiles.

Funcionaba, hasta que alguna dependencia cambiaba de versión, rompía la compatibilidad o hacía que una configuración dejara de servir. Pasé mucho tiempo arreglando esas diferencias entre equipos.

Este año decidí darle una oportunidad a NixOS. Quería poder reproducir mi entorno sin repetir todo ese trabajo. Con flakes, `flake.lock` fija las versiones de las entradas de la configuración, incluida `nixpkgs`, de donde salen los paquetes. Así tengo una base concreta que puedo volver a usar, en vez de depender de las versiones disponibles al instalar.

Ahora configurar mi entorno me lleva menos de diez minutos. Sigue habiendo ajustes propios de cada equipo, pero ya no tengo que reconstruir todo a mano.

## Las herramientas también van con el proyecto

Otra cosa que me gustó fue `nix develop`. Cada proyecto puede tener su `flake.nix` con las herramientas y versiones que necesita, sin que tenga que instalarlas globalmente.
