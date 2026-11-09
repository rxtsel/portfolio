---
translationKey: rpass
order: 18
locale: es
title: rpass
description: Cliente de contraseñas para Raycast y Vicinae
href: https://www.raycast.com/rxtsel/rpass
sourceUrl: https://github.com/raycast/extensions/tree/f221118834d65884520ada04e7d3ef46376a31a1/extensions/rpass/
detailPage: true
logo: ../../../assets/projects/rpass.webp
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/rpass/vault.webp
    title: Almacén de contraseñas
    alt: Entradas de ejemplo en el almacén, con búsqueda y categorías por carpeta.
  - src: ../../../assets/projects/rpass/folders.webp
    title: Carpetas
    alt: Selector de carpetas para filtrar las entradas del almacén.
  - src: ../../../assets/projects/rpass/entry-actions.webp
    title: Acciones de una entrada
    alt: Menú para consultar, editar, sincronizar o eliminar una entrada.
  - src: ../../../assets/projects/rpass/entry-fields.webp
    title: Campos de una entrada
    alt: Campos de una entrada con acciones para copiar, pegar en la aplicación activa y ocultar valores.
  - src: ../../../assets/projects/rpass/edit-entry.webp
    title: Editar una entrada
    alt: Formulario de edición con carpeta, nombre, contraseña y campos adicionales de ejemplo.
  - src: ../../../assets/projects/rpass/new-password.webp
    title: Generar una contraseña
    alt: Formulario para generar y guardar una contraseña, con las acciones de creación y regeneración.
  - src: ../../../assets/projects/rpass/new-passphrase.webp
    title: Generar una frase de paso
    alt: Formulario para crear una frase de paso dentro de una carpeta, con un valor de ejemplo.
  - src: ../../../assets/projects/rpass/git-sync.webp
    title: Sincronización con Git
    alt: Historial de cambios del almacén y acciones para descargar o subir cambios con Git.
publishDate: 2026-07-27
stack:
  - nodejs
  - react
  - typescript
tags:
  - clean-architecture
  - screaming-architecture
  - vertical-slicing
  - solid
  - design-patterns
---

## El almacén, desde el lanzador

rpass es un cliente de [rpass-cli](/es/proyectos/rpass-cli/) para trabajar con un almacén compatible con pass desde [Raycast](https://www.raycast.com/?ref=rxtsel.dev) o [Vicinae](https://www.vicinae.com/?ref=rxtsel.dev). Funciona en Windows, Linux y macOS.

## Buscar, usar y actualizar

Desde el lanzador puedes buscar una entrada, copiar sus campos o pegarlos en la aplicación activa. También puedes editarla, generar contraseñas y frases de paso, y consultar códigos TOTP.

Si el almacén usa Git, la extensión permite revisar el historial y descargar o subir cambios sin abrir la terminal.

## La interfaz y la CLI

La extensión se encarga de presentar las entradas y las acciones. Las operaciones sobre el almacén las realiza rpass-cli; el cifrado y descifrado se apoyan en la instalación local de GnuPG.

Para listar las entradas consulta la salida JSON de la CLI sin descifrarlas en bloque. El descifrado se solicita al abrir o usar una entrada.
