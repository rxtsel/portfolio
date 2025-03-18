---
title: 'Cómo sincronizar Bluetooth en dual boot, triple boot (Windows, Linux, macOS)'
draft: false
description: 'Guía para sincronizar dispositivos Bluetooth en entornos de arranque múltiple, evitando problemas de conexión al cambiar de sistema operativo.'
pubDate: '2025-03-17T20:35:45.145Z'
updatedDate: '2025-03-17T20:35:45.145Z'
categories: ['linux', 'windows', 'macos']
tags:
  [
    'Tutorial',
    'dual boot',
    'hackintosh',
    'macOS',
    'linux',
    'Windows',
    'Multiboot',
    'Triple boot',
    'Bluetooth'
  ]
author: ['Cristhian Melo']
lang: es
---

## Tabla de contenido

<!--toc:start-->

- [Introducción](#introducción)
  - [¿Por qué ocurre esto?](#por-qué-ocurre-esto)
  - [¿Cuál es la solución?](#cuál-es-la-solución)
- [Sincronizar Bluetooth en dual boot (Windows y Linux)](#sincronizar-bluetooth-en-dual-boot-windows-y-linux)
  - [Conectar dispositivos en Linux](#conectar-dispositivos-en-linux)
  - [Conectar dispositivos en Windows](#conectar-dispositivos-en-windows)
  - [Copiar claves de Bluetooth de Windows a Linux](#copiar-claves-de-bluetooth-de-windows-a-linux)
- [Sincronizar Bluetooth en triple boot (macOS, Windows y Linux)](#sincronizar-bluetooth-en-triple-boot-macos-windows-y-linux)
  - [Emparejar dispositivos bluetooth en cada sistema](#emparejar-dispositivos-bluetooth-en-cada-sistema)
  - [Extraer y transferir la LinkKey](#extraer-y-transferir-la-linkkey)
- [Notas Adicionales](#notas-adicionales)
- [Referencias](#referencias)
<!--toc:end-->

## Introducción

Si utilizas **dual boot o triple boot**, habrás notado que al cambiar de sistema operativo, tus dispositivos Bluetooth no se conectan automáticamente.

Esto es algo realmente fastidioso, especialmente si tienes un teclado y un ratón Bluetooth y tienes que conectarlos manualmente cada vez que cambias de sistema operativo.

### ¿Por qué ocurre esto?

Cuando emparejas un dispositivo Bluetooth en un sistema operativo, se genera una clave de sincronización (`LinkKey`). Como esta clave no se comparte entre sistemas, al cambiar de sistema operativo, el dispositivo no puede autenticarse correctamente.

### ¿Cuál es la solución?

Es tan simple como tener las mismas claves de sincronización en todos tus sistemas operativos. Para hacer esto, necesitas copiar las claves de sincronización de Bluetooth de un sistema operativo a otro.

---

## Sincronizar Bluetooth en dual boot (Windows y Linux)

### Conectar dispositivos en Linux

1. **Abre la terminal y ejecuta `bluetoothctl`**:

   ```sh
   bluetoothctl
   ```

2. **Activa el modo emparejamiento**:

   ```sh
   pairable on
   discoverable on
   ```

3. **Escanea y empareja el dispositivo**:

   ```sh
   scan on
   ```

   Copia la dirección MAC del dispositivo y usa:

   ```sh
   connect XX:XX:XX:XX:XX:XX
   ```

4. **Verifica la conexión y cierra `bluetoothctl`**:

   ```sh
   exit
   ```

### Conectar dispositivos en Windows

1. **Conecta** tus dispositivos Bluetooth en Windows. Sigue los pasos habituales desde la configuración de Bluetooth de Windows.
2. **Verifica que el dispositivo se haya conectado correctamente.**

### Copiar claves de Bluetooth de Windows a Linux

1. **Descarga [PsTools](https://learn.microsoft.com/en-us/sysinternals/downloads/pstools) y extrae `PsExec` en una carpeta de acceso rápido, por ejemplo: `C:\Windows`.**
2. **Encuentra tu dirección MAC**.
   Abre `cmd` y ejecuta:

   ```sh
   getmac /V /FO LIST
   ```

   Busca la dirección MAC de tu dispositivo Bluetooth y toma nota de ella.

3. **Ejecuta `cmd` como administrador** y navega hasta la carpeta donde guardaste `PsExec` y ejecuta:

   ```sh
   psexec -s -i regedit
   ```

   _Esto abrirá el Editor del Registro con permisos de administrador._

4. **En el editor de registros, navega a:**

   ```"
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\<MAC_ADDRESS>
   ```

5. **Encuentra la clave de tu dispositivo y dale doble click en el nombre (Te abrirá una nueva ventana).**
6. **En la nueva ventana, copia el valor de la clave que esta en `Informacion de valor`**.
7. **Reinicia a Linux.**
8. **En Linux**

   1. **Abre la terminal y ejecuta:**

   ```sh
   sudo su
   ```

   _Ingresa tu contraseña de administrador._

   2. **Navega a la carpeta de Bluetooth:**

   ```sh
   cd /var/lib/bluetooth/<MAC_ADDRESS>/<DISPOSITIVO_MAC>
   ```

_Reemplaza `<MAC_ADDRESS>` con la dirección MAC de tu dispositivo Bluetooth interno y `<DISPOSITIVO_MAC>` con la dirección MAC de tu dispositivo externo._

9. **Edita el archivo `info`**

   Ubica la línea `[LinkKey]` y reemplaza el valor de la propiedad `Key` por la clave copiada de Windows:

   ```sh title="info" {2}
   [LinkKey]
   Key=B3798087E81E306CDAB046...
   ```

Reinicia Linux y el dispositivo debería conectarse automáticamente.

---

## Sincronizar Bluetooth en triple boot (macOS, Windows y Linux)

> **NOTA:** Los pasos son los mismos si solo tienes dual boot con macOS.

### Emparejar dispositivos bluetooth en cada sistema

1. **Empareja primero en Linux.** (Puedes ver del punto 1 al 4 de la sección anterior).
2. **Empareja en Windows.**
3. **Finalmente, empareja en MacOS.**

### Extraer y transferir la LinkKey

1. **En MacOS, abre spotlight y busca `KeyChain Access`.**
2. **Busca `bluetooth`** en la barra de búsqueda y dale doble clic al último resultado de `MobileBluetooth`.
3. **Desde esa nueva ventana**, verá la dirección MAC de tu dispositivo en el campo **Cuenta** (xx:xx:xx:xx:xx:xx). Tome nota de ello.
4. **Luego, en la misma ventana** marque la casilla **Mostrar contraseña** e ingrese sus credenciales (Se lo pedira dos veces).
5. **La contraseña ahora revelada es, de hecho, un archivo XML completo**. Haga clic en el campo, presione
   <kbd>Option + a</kbd> ó <kbd>Ctrl + a</kbd> y luego cópielo y péguelo aparte.

   _Asegurese de copiar completamente el contenido y de guardarlo en sus apuntes._

6. **Debajo de `<key>LinkKey</key>`**, copia el valor entre las etiquetas `<string>xx-xx-xx-xx</string>` a sus apuntes.

> NOTA: **Si tienes varios dispositivos conectados, haz lo mismo para cada uno.**

7. **Reinicia a Windows.**

8. **Transfiere la `LinkKey` a Windows y Linux (ó a todos tus sistemas operativos diferentes a MacOS):**
   - **Para Windows**
     1. Sigue los pasos hasta el punto 4 de la sección anterior.
     2. Identifica la dirección MAC de tu dispositivo y dale doble clic.
     3. Se te abrirá una nueva ventana con la clave de tu dispositivo.
     4. Ve seleccionando uno por uno los valores que estan separados por espacios y reemplazandolos por los valores que copiaste de MacOS. Tienen la misma longitud. Así que ve de a pares.
   - **Para linux**
     1. Sigue los mismos pasos de edición de archivos en Linux.

- **Nota:** Ya no es necesario revertir la clave. Si obtiene `98-54-2f-...` en macOS, escriba `98 54 2f...` en el registro de Windows.

Una vez agregadas las claves, el dispositivo debería conectarse automáticamente en todos los sistemas.

---

## Notas Adicionales

- **Algunas distribuciones de Linux pueden almacenar las claves en rutas ligeramente distintas.** Si los pasos no funcionan, revisa `bluetoothctl info <MAC_ADDRESS>`.
- **Si sigues teniendo problemas, intenta eliminar y volver a emparejar el dispositivo después de transferir la clave.**
- **Si usas un dongle Bluetooth USB, la dirección MAC podría cambiar según el puerto USB donde lo conectes.**

Con estos pasos, tus dispositivos Bluetooth estarán sincronizados en todos tus sistemas operativos.

## Referencias

- [YouTube](https://youtu.be/o5nPUUagW_c?si=Ar0cY_jQILe11uyU)
- [Reddit](https://www.reddit.com/r/hackintosh/comments/p5ost3/macos_monterey_and_windows_bluetooth_pairing/)
