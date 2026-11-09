---
translationKey: portctl
order: 14
locale: es
title: portctl
description: Inspecciona puertos TCP/UDP y termina procesos desde Noctalia
href: https://noctalia.dev/plugins/community/portctl
sourceUrl: https://github.com/noctalia-dev/community-plugins/tree/main/portctl
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/portctl/overview.webp
    title: Portctl en Noctalia
    alt: Portada del plugin con su indicador en la barra y un panel de puertos de desarrollo.
  - src: ../../../assets/projects/portctl/panel.webp
    title: El panel en mi escritorio
    alt: Panel de Portctl con TCP y UDP activados, puertos en uso, nombres de procesos y sus PID.
publishDate: 2026-07-01
stack:
  - linux
  - lua
tags: []
---

## Un aporte a la barra que uso

Antes usaba Waybar. Ahora uso [Noctalia](https://noctalia.dev/?ref=rxtsel.dev): me gustan sus animaciones sutiles y cómo se integra en mi escritorio. Cuando empecé con Linux, cada MB de RAM importaba. Hoy tengo equipos más potentes y puedo permitirme elegir también por cómo se siente usarlos.

Quería aportar algo a Noctalia y tenía un problema bastante cotidiano que resolver.

## Otra vez el puerto ocupado

A veces cerraba una pestaña de tmux, algo se quedaba congelado o un servidor seguía ejecutándose sin que me diera cuenta. Al levantarlo de nuevo, el puerto habitual estaba ocupado. O la herramienta elegía otro puerto automáticamente y yo terminaba buscando qué había pasado.

Tocaba abrir la terminal, averiguar qué proceso estaba escuchando y buscar su PID para terminarlo. Portctl lleva ese recorrido a la barra.

## Verlo y resolverlo desde el panel

El indicador muestra cuántos puertos están en uso y se oculta cuando no detecta ninguno. Un clic abre el panel, con los puertos agrupados en desarrollo, bases de datos, contenedores, servidores, cloud y otros.

Puedes buscar por puerto, proceso o PID, y mostrar TCP, UDP o ambos. Un clic en el PID lo copia. Para terminar un proceso, pulsas la cruz y confirmas en la misma fila, sin abrir otro diálogo.

Lo hice para mi escritorio y lo compartí como plugin de la comunidad de Noctalia. Ahora también lo usan otras personas que se encontraban con el mismo problema.

## Qué puede detectar

El escaneo usa `ss`, de `iproute2`, y se hace en local. No consulta servicios de red ni eleva privilegios para terminar procesos de otros usuarios.

El panel solo puede mostrar lo que detecta `ss`. Por ejemplo, los puertos de contenedores reenviados mediante `pasta` no aparecen si no crean un socket en el host. Los procesos de root sin información accesible tampoco se pueden terminar desde el plugin.
