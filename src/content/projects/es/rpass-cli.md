---
translationKey: rpass-cli
order: 17
locale: es
title: rpass-cli
description: Gestor local de contraseñas en Rust compatible con pass
href: https://crates.io/crates/rpass-cli
sourceUrl: https://github.com/rxtsel/rpass-cli
detailPage: true
logo: ../../../assets/projects/rpass.webp
screenshotOrientation: horizontal
publishDate: 2026-06-19
stack:
  - rust
tags: []
---

## Empezó con una espera que me molestaba

En Linux uso [Vicinae](https://www.vicinae.com/?ref=rxtsel.dev), porque [Raycast](https://www.raycast.com/?ref=rxtsel.dev) no está disponible para Linux. Vicinae es compatible con su API de extensiones, así que usaba la de Bitwarden.

Abrir el almacén y listar las entradas se me hacía demasiado lento. Entre la CLI de Bitwarden y las consultas al servicio, terminaba esperando para algo que quería consultar al instante. Empecé a buscar una alternativa que trabajara con los datos en local.

Así llegué a [pass](https://www.passwordstore.org/?ref=rxtsel.dev). Me gustó su forma de guardar las contraseñas en archivos cifrados con GPG. Lo usé desde la terminal, pero al pasar también a un equipo con Windows no conseguí mantener el flujo que quería.

## El motor en Rust

Hice rpass-cli para tener ese flujo en Windows, Linux y macOS. Conservé la compatibilidad con el formato de pass y dejé el cifrado en manos de GnuPG.

La CLI permite consultar y editar entradas, importar un almacén y obtener códigos TOTP. También genera contraseñas aleatorias y frases de paso usando aleatoriedad del sistema operativo. La entropía depende de la longitud y del conjunto de caracteres, o de la cantidad de palabras y del tamaño del diccionario.

Respeta los archivos `.gpg-id` de pass para saber para quién cifrar cada entrada. Puede usar varios destinatarios GPG y definirlos por carpeta, sin imponer una única identidad para todo el almacén.

Además del uso desde la terminal, añadí respuestas JSON y errores estructurados para que otros clientes pudieran consumirlo.

## Un cliente sin construir otra aplicación

A mí me gusta usar la terminal, pero quería que también pudiera usarlo alguien que no se sintiera cómodo con ella. En vez de crear otra aplicación de escritorio, hice un [cliente para Raycast y Vicinae](/es/proyectos/rpass/) sobre el mismo motor.

Así puedo buscar una entrada desde el lanzador y dejar que rpass-cli se encargue del trabajo.

## El mismo almacén entre equipos

Sincronizo el almacén con Git. Se puede usar un servidor propio o cualquier remoto compatible, como Bitbucket, GitLab o GitHub. La sincronización es una operación aparte; listar las entradas no necesita consultar una API remota.

La CLI funciona en Windows, Linux y macOS. En iOS y Android, el mismo formato permite usar clientes compatibles con pass. Yo uso Pass for iOS en el teléfono.

## Lo que uso a diario

En mi uso diario, listar las entradas es prácticamente instantáneo. Era lo que buscaba: consultar mis contraseñas en local y poder elegir dónde guardar y sincronizar los archivos cifrados.
