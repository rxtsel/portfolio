---
translationKey: onlysend
order: 9
locale: es
title: OnlySend
description: Envía y recibe correos con tu dominio desde el escritorio mediante Resend
href: https://rxtsel.github.io/onlysend
sourceUrl: https://github.com/rxtsel/onlysend
logo: ../../../assets/projects/onlysend.png
detailPage: true
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/onlysend/compose.webp
    title: Redactar un correo
    alt: Editor de OnlySend con remitente del dominio propio, destinatario, asunto y opciones de formato.
publishDate: 2025-11-26
stack:
  - rust
  - svelte
tags: []
---

## Quería enviar correo desde mi dominio

Inicié OnlySend el 26 de noviembre de 2025. Ya tenía un dominio y me resultaba extraño pagar una suscripción de correo solo para poder escribir desde una dirección como `yo@midominio.com`. Podía crear alias y redirecciones, y durante mucho tiempo usé Cloudflare Email Routing para recibir mensajes, pero seguía necesitando abrir Gmail u Outlook para leerlos.

Quería una app donde elegir mi remitente, escribir y enviar correos desde el escritorio. Resend se encargaba de la entrega; OnlySend era la interfaz. De ahí el nombre: al principio **solo enviaba**.

## La respuesta que no cabía en la app

Resend devolvía el ID del mensaje enviado, así que podía usarlo para mantener el hilo al responder. El problema era la otra mitad de la conversación. Cuando alguien escribía a mi dominio, una redirección llevaba el correo a mi cuenta de Gmail u Outlook. Para responder desde OnlySend tenía que buscar el mensaje allí, copiar su ID y pegarlo manualmente en la app. Funcionaba, pero no era un flujo de correo usable.

## De enviar a tener una bandeja de entrada

Cuando Resend añadió soporte para recibir correo, retomé el proyecto. Ahora puedo activar la recepción para mis dominios, leer los mensajes en OnlySend y responder sin pasar por otro cliente. La recepción es opcional: requiere cambiar los registros MX y puede afectar la ruta del correo que ya recibe el dominio.

La app también admite varias cuentas y remitentes, correos con formato y adjuntos, CC y CCO, borradores que se guardan solos y envíos programados. Mantiene una copia local de los mensajes descargados para poder leerlos sin conexión y permite buscar y filtrar el correo. Está hecha con Svelte y Rust/Tauri; Resend sigue procesando el envío y la recepción, no es un servidor de correo propio.

OnlySend es gratuita y de código abierto. Para usarla necesitas un dominio verificado y una cuenta de Resend, con los límites y costes que correspondan a ese servicio. El archivo local no está cifrado, por lo que no lo presento como almacenamiento seguro de mensajes sensibles.
