---
translationKey: amusic
order: 8
locale: es
title: amusic
description: Apple Music en Linux con Discord Rich Presence
href: ""
sourceUrl: https://github.com/rxtsel/amusic
detailPage: true
publishDate: 2025-03-28
stack:
  - rust
tags: []
---

## Quería que Discord mostrara lo que escuchaba

Cuando usaba Apple Music en Linux, quería que mis amigos vieran lo que estaba escuchando en Discord, como ocurre con Spotify. Usaba [Apple Music desde la web](https://music.apple.com/?ref=rxtsel.dev), porque no había una aplicación oficial para Linux, y me faltaba esa integración.

Hice amusic para resolverlo. Es una aplicación de escritorio para Linux que abre la versión web de Apple Music y muestra la reproducción en la actividad de Discord.

## Apple Music web, Rust y MPRIS

En Linux, [MPRIS](https://specifications.freedesktop.org/mpris-spec/latest/?ref=rxtsel.dev) permite consultar qué está reproduciendo un reproductor y su estado. Me apoyé en esa información para conectar Apple Music con Discord.

Escribí la lógica en Rust y puse Apple Music web dentro de una WebView. La integración con Discord usa un SDK para mostrar la actividad como “Listening to Apple Music”, junto con la canción, la carátula y el progreso de reproducción.

También reacciona al cambiar de canción, pausar o volver a reproducir. Quería que la actividad acompañara lo que estaba escuchando sin tener que actualizar nada a mano.

## Mi propia app durante un par de años

Usé amusic durante un par de años como mi aplicación de Apple Music en Linux. Lo hice para mí, lo compartí y otras personas que querían esa misma integración también lo usaron.

Ahora uso YouTube Music, así que amusic ya no forma parte de mi día a día. Durante ese tiempo hizo justo lo que necesitaba.
