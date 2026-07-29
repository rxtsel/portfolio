---
translationKey: reverse-engineering-and-fixing-a-lenovo-thinkpad-firmware-bug
locale: es
published: true
title: Ingeniería inversa y corrección de un bug de firmware en un Lenovo ThinkPad
description: Cómo encontré y corregí un bug de firmware en un Lenovo ThinkPad provocado por un método ACPI inexistente utilizando una SSDT personalizada cargada desde el initrd.
publishDate: 2026-07-29
updatedDate: ""
categories:
  - linux
  - firmware
seo:
  description: Descubre cómo investigué y corregí un bug de firmware en un Lenovo ThinkPad causado por un método ACPI inexistente (PEGP.DDNT) utilizando un override SSDT en NixOS.
  keywords: ACPI, SSDT, Lenovo ThinkPad, NixOS, firmware, ingeniería inversa, bug de firmware, PEGP.DDNT, AE_NOT_FOUND, thermal_zone6, initrd, ACPICA
---

## Ingeniería inversa y corrección de un bug de firmware en un Lenovo ThinkPad

A veces los mejores bugs son los que nunca deberían existir.

Después de instalar NixOS en mi **Lenovo ThinkPad T14 Gen 2 Intel**, noté que el kernel mostraba los mismos errores de ACPI en cada arranque:

```text
ACPI BIOS Error (bug): Could not resolve symbol [_SB.PC00.RP09.PEGP.DDNT], AE_NOT_FOUND
ACPI Error: Aborting method _SB.PC00.LPCB.EC.SEN4._TMP
```

El sistema funcionaba con normalidad, pero una de las zonas térmicas (`SEN4`) quedaba deshabilitada porque el método `_TMP` fallaba durante su ejecución.

Toda esta investigación fue realizada sobre un **Lenovo ThinkPad T14 Gen 2 Intel** ejecutando **NixOS**, con la versión de BIOS **N34ET71W (1.71)**.

Como seguramente le pasaría a muchos usuarios de Linux, mi primera reacción fue pensar:

> "Seguramente es otro de esos errores inofensivos del BIOS."

No lo era.

## La investigación

En lugar de ignorar el mensaje, decidí entender qué estaba ocurriendo realmente.

El primer paso fue extraer todas las tablas ACPI expuestas por el firmware:

```bash
acpidump > acpidump
acpixtract -a acpidump
iasl -d *.dat
```

Después de desensamblarlas a ASL, empecé a buscar el método que el kernel decía que no existía.

Finalmente encontré el origen del problema.

Dentro de una de las SSDT de DPTF de Lenovo, el sensor térmico `SEN4` implementaba su método `_TMP` de esta forma:

```asl
Method (_TMP)
{
    ...
    _SB.PC00.RP09.PEGP.DDNT(Local0)
    ...
}
```

El problema era evidente.

El firmware esperaba encontrar un método llamado `DDNT`, pero ese método simplemente no existía.

Busqué `DDNT` en absolutamente todas las tablas ACPI extraídas del firmware y únicamente encontré esta declaración:

```asl
External (_SB.PC00.RP09.PEGP.DDNT, MethodObj)
```

No había ninguna implementación.

El firmware hacía referencia a un método que Lenovo nunca incluyó.

## Entendiendo el problema

En ese momento quedó claro que Linux no estaba haciendo nada incorrecto.

ACPICA simplemente estaba ejecutando el código AML exactamente como el firmware lo había definido.

Cuando `_TMP` intentaba ejecutar `DDNT`, ACPICA no podía resolver el símbolo y abortaba la ejecución del método con el error `AE_NOT_FOUND`.

Como consecuencia:

- `thermal_zone6` (`SEN4`) quedaba deshabilitada.
- No era posible leer la temperatura de ese sensor.
- Cada arranque generaba exactamente los mismos errores de firmware.

No era un bug de Linux.

Era un bug del firmware.

## La solución

Afortunadamente, Linux proporciona un mecanismo oficial para extender las tablas ACPI durante las primeras etapas del arranque.

Es posible cargar SSDT adicionales directamente desde el initrd antes de que comience la inicialización de ACPI, permitiendo corregir errores del firmware sin modificar ni el BIOS ni el kernel.

En lugar de modificar la SSDT original de Lenovo, decidí crear una SSDT suplementaria que únicamente implementara el método que faltaba.

```asl
DefinitionBlock ("", "SSDT", 2, "RXTS", "DDNTFIX", 0x00000001)
{
    External (_SB.PC00.RP09.PEGP, DeviceObj)

    Scope (_SB.PC00.RP09.PEGP)
    {
        Method (DDNT, 1, NotSerialized)
        {
            Return (Zero)
        }
    }
}
```

El objetivo no era reconstruir la lógica original que Lenovo había pensado para ese método.

Lo único necesario era proporcionar una implementación válida para que ACPICA pudiera evaluar `_TMP` sin lanzar `AE_NOT_FOUND`.

En este caso, una implementación mínima fue suficiente.

Si Lenovo corrige el firmware en una futura actualización del BIOS, bastará con eliminar este override.

## Empaquetando la SSDT

La SSDT fue compilada utilizando el compilador de ACPICA:

```bash
iasl SSDT-DDNT.dsl
```

Después fue empaquetada dentro de un initrd sin compresión con la siguiente estructura:

```text
kernel/
└── firmware/
    └── acpi/
        └── SSDT-DDNT.aml
```

Finalmente la empaqueté como un paquete reutilizable de Nix y la integré en mi configuración de NixOS mediante `boot.initrd.prepend`.

Toda la solución es declarativa, reproducible y forma parte de mi configuración del sistema como cualquier otro paquete.

## Validación

Después de reiniciar el equipo, el kernel mostró lo siguiente:

```text
ACPI: SSDT ACPI table found in initrd
ACPI: Table Upgrade: install [SSDT- RXTS DDNTFIX]
```

La SSDT personalizada había sido cargada correctamente durante las primeras etapas del arranque.

Pero lo más importante fue el resultado:

- Los errores `AE_NOT_FOUND` desaparecieron por completo.
- `SEN4` dejó de estar deshabilitada.
- `thermal_zone6` volvió a estar disponible.
- El error del firmware dejó de interrumpir la evaluación de ACPI.

## Evidencia

Después de aplicar el override, el kernel registró:

```text
ACPI: SSDT ACPI table found in initrd
ACPI: Table Upgrade: install [SSDT- RXTS DDNTFIX]
```

Antes del cambio, cada arranque generaba errores de firmware y deshabilitaba la zona térmica `SEN4`.

Después del override:

- Ya no aparecieron errores `AE_NOT_FOUND`.
- `thermal_zone6` pasó de `disabled` a `enabled`.
- El sensor volvió a exponer una temperatura a través de `sysfs`.

La solución funcionó exactamente como esperaba.

## Lo que aprendí

Lo interesante de toda esta investigación no fue escribir diez líneas de ASL.

Lo realmente interesante fue descubrir que el firmware hacía referencia a un método que nunca existió.

Linux estaba haciendo exactamente lo que debía hacer.

ACPICA también.

El problema estaba en el firmware.

También me recordó que el kernel de Linux ya incorpora mecanismos oficiales para corregir este tipo de defectos del firmware. Son características que la mayoría de usuarios nunca necesitarán, pero cuando las necesitas resultan increíblemente útiles.

## Reflexión final

Esto nunca fue un problema de Linux.

Se trataba de entender el firmware lo suficiente como para demostrar dónde estaba realmente el bug.

La ingeniería inversa de las tablas ACPI convirtió lo que parecía un simple mensaje molesto durante el arranque en un defecto reproducible del firmware con una solución limpia, declarativa y completamente integrada en el sistema.

Si alguna vez te encuentras con un error de ACPI, no asumas inmediatamente que Linux tiene la culpa.

A veces el kernel simplemente está diciendo la verdad.

Solo hay que seguir las pistas.

## Referencias

- [Linux Kernel Documentation — ACPI Support](https://docs.kernel.org/admin-guide/acpi/index.html)
- [Linux Kernel Documentation — Upgrading ACPI Tables via initrd](https://docs.kernel.org/admin-guide/acpi/initrd_table_override.html)
- [Linux Kernel Documentation — SSDT Overlays](https://docs.kernel.org/admin-guide/acpi/ssdt-overlays.html)
- [ACPICA Project](https://acpica.org/)
