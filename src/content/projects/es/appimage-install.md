---
translationKey: appimage-install
order: 0
locale: es
title: appimage-install
description: Integración de AppImages en Linux y NixOS
href: https://github.com/rxtsel/appimage-install
sourceUrl: https://github.com/rxtsel/appimage-install
publishDate: 2025-06-25
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/appimage-install/install.webp
    title: Instalación de un AppImage
    alt: Terminal ejecutando appimage-install con Obsidian, moviendo el archivo, extrayendo el icono y creando el lanzador .desktop.
stack:
  - linux
tags: []
---

## Por qué lo hice

Vengo de Arch Linux y con los AppImages terminaba repitiendo los mismos pasos: dar permisos, mover archivos y crear lanzadores para que las aplicaciones aparecieran en los menús con su icono. Hice un script para encargarme de eso.

## Qué hace

Se ejecuta con `appimage-install name.AppImage`. Mueve el archivo a `~/AppImages`, le da permisos de ejecución, extrae el icono cuando está disponible y crea una entrada `.desktop` para los menús y lanzadores.

## La adaptación a NixOS

Después lo adapté para NixOS. Detecta cuándo hace falta `appimage-run` y ofrece indicaciones para instalar dependencias opcionales que falten. También se puede instalar o ejecutar mediante un flake de Nix.
