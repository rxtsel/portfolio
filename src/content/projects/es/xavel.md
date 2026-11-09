---
translationKey: xavel
order: 19
locale: es
title: Xavel
description: Facturación y cobros para freelancers
href: https://xavel.app
sourceUrl: ""
logo: ../../../assets/projects/xavel.webp
detailPage: true
faviconBackground: none
screenshotOrientation: horizontal
screenshots:
  - src: ../../../assets/projects/xavel/dashboard.webp
    title: Panel de facturación
    alt: Panel con uso del plan, estados de las facturas, importes por moneda y actividad de emisión.
  - src: ../../../assets/projects/xavel/new-invoice.webp
    title: Crear una factura
    alt: Formulario con cliente, moneda, conceptos y vista previa de la factura.
  - src: ../../../assets/projects/xavel/email-composer.webp
    title: Envío por correo
    alt: Editor de correo con destinatario, asunto, vista previa del mensaje y factura PDF adjunta.
  - src: ../../../assets/projects/xavel/collect-payment-with-link.webp
    title: Factura y actividad del cobro
    alt: Factura emitida con enlace de pago, contadores de visitas y aperturas, e historial de actividad.
  - src: ../../../assets/projects/xavel/public-invoice.webp
    title: La factura para el cliente
    alt: Vista pública de la factura con conceptos, importe y acciones para pagar, descargar el PDF o informar de un pago.
  - src: ../../../assets/projects/xavel/invoices-list.webp
    title: Seguimiento de facturas
    alt: Listado con facturas en borrador, emitidas, pagadas y canceladas, con vencimientos e importes en distintas monedas.
  - src: ../../../assets/projects/xavel/payment-providers.webp
    title: Opciones de cobro
    alt: Configuración de cobros manuales y proveedores de pago, incluidos Mercado Pago, Stripe, PayPal.me y Wompi.
publishDate: 2026-08-06
stack:
  - tanstack
  - react
  - typescript
  - tailwindcss
  - postgresql
  - playwright
  - vitest
  - redis
  - posthog
tags:
  - orpc
  - cloudflare
  - solid
  - cloudflare-r2
  - design-patterns
  - clean-code
  - ci-cd
  - vertical-slicing
  - clean-architecture
  - screaming-architecture
---

## Las facturas de cada mes

Mis clientes y la empresa con la que trabajo me pedían una factura cada mes para pagar mis honorarios. Usaba una plantilla de Google Sheets y repetía los mismos cambios: fechas, periodos, conceptos y datos del cliente. Como trabajaba con clientes de distintos países, también tenía que revisar la moneda.

Xavel nació para quitarme ese trabajo repetitivo. Empezó como Rxture, una herramienta para mis propias facturas, y fue creciendo hasta convertirse en un producto que también usan otras personas.

## De preparar la factura a seguir el cobro

En Xavel registro los clientes una vez y reutilizo sus datos al preparar una factura. Puedo revisar el documento, emitirlo, enviarlo por correo con su PDF y hacer seguimiento del pago.

Separé esas acciones: emitir una factura no crea un cobro automáticamente, y enviarla no cambia su estado financiero. Una factura emitida puede seguir pendiente sin estar asociada a una pasarela.

## Cambiar de framework sin rehacer la facturación

La primera versión estaba en Next.js. Después pasé por Svelte y también terminé demasiado acoplado a un proveedor de pagos. Cada cambio arrastraba más lógica de la que debía.

Reorganicé el producto en módulos por capacidad, como facturación, clientes y pagos, con puertos y adaptadores donde necesitaba sustituir una integración. Las reglas de una factura no dependen de React, TanStack ni del SDK de una pasarela. Los detalles de persistencia y de proveedores quedan en sus adaptadores.

Elegí TanStack Start para la implementación actual. Si vuelvo a cambiar la interfaz, quiero conservar las reglas y los casos de uso que ya resolví.

## Contratos explícitos entre la interfaz y el servidor

Con oRPC defino las entradas, las salidas y los errores de cada operación antes de conectar el handler. Esos contratos dan tipos a los consumidores y validación en el servidor. Los handlers delegan el comportamiento en casos de uso, en lugar de concentrar allí las reglas de negocio.

Esto también permite plantear otros consumidores sobre las mismas operaciones sin trasladarles la lógica de facturación.

## Casos que no quería dejar para después

- **Cambiar un cliente no debe reescribir una factura emitida.** La factura conserva una copia de los datos de quien cobra y de quien paga. Su historial no depende de que el perfil siga igual.
- **Dos solicitudes no deben emitir el mismo borrador dos veces.** La emisión comprueba el estado y guarda con una condición sobre el borrador. Una solicitud que pierde esa carrera recibe un resultado explícito.
- **Las monedas no se tratan todas igual.** Los importes se representan en unidades menores enteras y se distingue entre monedas con y sin decimales, como USD y CLP.
- **Avisar de un pago no significa haberlo recibido.** El reporte queda pendiente de revisión. Si una pasarela ya confirmó el pago, la revisión conserva ese comprobante en lugar de reemplazarlo.

Estos comportamientos tienen pruebas de dominio y de casos de uso que se pueden ejecutar sin arrancar la interfaz ni conectarse a una pasarela.
