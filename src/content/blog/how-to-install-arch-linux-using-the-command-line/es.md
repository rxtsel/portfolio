---
title: 'Cómo instalar Arch Linux usando la línea de comandos'
draft: false
description: 'Explora la guía completa sobre cómo instalar Arch Linux de manera sencilla utilizando la interfaz de línea de comandos.'
pubDate: '2024-02-02T20:29:07.661Z'
cover: ''
categories: ['all']
tags: ['Linux', 'Arch Linux', 'Terminal']
author: ['Cristhian Melo']
keywords: 'Arch Linux, Instalación Arch Linux, Terminal, Gestor de Ventanas, Entorno de Escritorio, bspwm, qtile, wayland, KDE, GNOME, XFCE, Configuración Linux, Dotfiles'
lang: es
---

## Introducción

Arch Linux es una distribución de Linux que es conocida por su simplicidad y minimalismo. Aunque es una de las distribuciones de Linux más difíciles de instalar, es una de las más populares entre los entusiastas de Linux. En este artículo, te mostraré cómo instalar Arch Linux usando la línea de comandos por si te enredas con la [Arch Wiki](https://wiki.archlinux.org/title/Installation_guide).

Debes saber que ahora existe la posibilidad de instalar **Arch Linux** con un instalador gráfico, pero en este artículo nos centraremos en la instalación usando la línea de comandos.

Hay personas que se sienten un poco "sucios" si no instalan Arch Linux desde la **terminal**, por que con un instalador gráfico no tienen el control total de lo que van a instalar. Y la terminología de Arch Linux es **"Keep It Simple, Stupid"**, así que vamos a instalarlo desde la terminal.

## Importante:

**Nota:** Este artículo asume que tienes un conocimiento básico de cómo funciona Linux y que tienes una conexión a Internet estable. Si no tienes conocimientos básicos de Linux, te recomendaría que primero aprendas los conceptos básicos antes de seguir con este artículo.

> Aunque personalmente, aprendí mucho de Linux instalando Arch, puesto que siguiendo la Arch Wiki se me tornaba un poco complicado, pero al final luego de varios dias de intentos, de tanta prueba y error, lo logré. Y decidí hacer una guía más sencilla paso a paso de lo que se debe hacer.

## Requisitos

1. Un dispositivo con al menos 512 MB de RAM.
2. Una conexión a Internet estable.
3. Un dispositivo de almacenamiento USB con al menos 2 GB de espacio libre.
4. Sistema **UEFI**.

> Nota: Esta instalación se ha hecho con sistema **UEFI** y particiones **GPT**.

## Instalación

1. Verificar el arranque en UEFI

   - Pulse <kbd>Win</kbd> + <kbd>R</kbd> escriba msinfo32 y pulse Intro.

   - Busque la entrada Modo de BIOS.

   - Si el valor indicado es Heredado, el entorno de arranque es BIOS (La instalación sería diferente). Si es otro valor como **GPT**, se mostrará el entorno de arranque correspondiente.

2. **Descargar Arch Linux:**
   Primero, necesitas descargar la última versión de Arch Linux desde el [sitio web oficial](https://archlinux.org/download/).

3. **Bootea Arch en una USB:**
   Para crear un USB booteable, puedes usar **Rufus** en Windows.

Una vez booteado Arch, podemos ejecutar los siguientes comandos:

### 1. Cambiar distribución de teclado

```bash
loadkeys la-latin1
```

`la-latin1` es el layout de teclado para latinoamérica, pero puedes elegir el que necesites, puedes ver más layouts con el siguiente comando:

```bash
localectl list-keymaps
```

### 2. Nos conectamos a wifi:

```bash
lwctl --passphrase "contraseñaWifi" station wlan0 connect "nombreWifi"
```

### 3. Verificar la conexión a Internet

```bash
ping 8.8.8.8
```

Deberías recibir una respuesta, si no, vuelve al paso 2.

### 4. Actualizar el reloj del sistema

```bash
timedatectl set-ntp true
```

### 5. Particionar el disco

Nesecitamos al menos 3 particiones, una para el **boot**, otra para el **swap** y otra para el **root**.

| CANTIDAD          | TIPO DE PARTICION       |
| ----------------- | ----------------------- |
| **512M**          | EFI System              |
| **TUS GB DE RAM** | SWAP (linux swap)       |
| **RESTO DE GB**   | ROOT (linux filesystem) |

Con el siguiente comando podemos ver los discos que tenemos:

```bash
cfdisk
```

Asegurate de seleccionar el disco correcto, en mi caso es `/dev/sda`. Si tienes un disco SSD, probablemente sea `/dev/nvme0n1`.

Sí con el comando anterior no aparece tu disco o partición, entonces ejecuta este comando para ver todas las particiones y toma nota de tu partición:

```bash
lsblk
```

Entonces ejecutas este comando:

```bash
cfdisk /dev/tu_partición_aqui
```

### 6. Formatear los discos:

```bash
mkfs.fat -F32 /dev/aqui_EFI_partition   # <- Para EFI
mkfs.ext4 /dev/aqui_ROOT_partition      # <- Para ROOT
mkswap /dev/aqui_SWAP_partition         # <- Para SWAP
```

### 7. Montar los discos:

Primero crear una montura para EFI:

```bash
mkdir /mnt/efi
```

Luego montar las particiones:

```bash
mount /dev/aqui_EFI_partition /mnt/efi   # <- Para EFI
mount /dev/aqui_ROOT_partition /mnt      # <- Para ROOT
swapon /dev/aqui_SWAP_partition          # <- Para SWAP
```

### 8. Instalar paquetes esenciales:

```bash
pacstrap /mnt base linux linux-firmware neovim iwd
```

### 9. Ejecutar fstab:

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### 10. Ejecutar chroot:

En mi caso, usaré la zona horaria de Bogotá, pero puedes elegir la que necesites.

```bash
arch-chroot /mnt
```

### 11. Configurar zona horaria:

```bash
ln -sf /usr/share/zoneinfo/America/Bogota /etc/localtime
```

Ejecutar hwclock para sincronizar el reloj del sistema:

```bash
hwclock –-systohc
```

### 12. Editar localización:

Apartir de aquí, usaré **nvim** como editor de texto, sino sabes cómo usarlo, puedes seguir esta guía de [Commandos Básicos de Neovim](/es/blog/basic-commands-for-neovim). Al menos para que sepas cómo guardar y salir de neovim.

```bash"
nvim /etc/locale.gen
```

- Ubica la linea que contenga: **es_CO.UTF-8** para localización de Colombia y descoméntala. Remueve el **#** de la linea y guarda el archivo.

```diff title="/etc/locale.gen"
- #es_CO.UTF-8 UTF-8
+ es_CO.UTF-8 UTF-8
```

### 13. Configurar locale.conf:

```bash
nvim /etc/locale.conf
```

```diff title="/etc/locale.conf"
+ LANG=es_CO.UTF-8
```

### 14. Configurar teclado:

```bash
nvim /etc/vconsole.conf
```

```diff title="/etc/vconsole.conf"
+ KEYMAP=la-latin1
```

### 15. Configurar hostname:

```bash
nvim /etc/hostname
```

- Escribe un nombre para tu **pc**, en mi caso pondré **rxtsel**

```diff title="/etc/hostname"
rxtsel
```

### 16. Configurar host:

```bash
nvim /etc/hosts
```

![image](https://user-images.githubusercontent.com/85462420/152463120-22b7cd94-42d2-40a1-8dda-d3320d9fc1a0.png)

- _Escribe tal cuál la imagen. sólo reemplaza `myhostname` por el nombre que pusiste en tu `host`_

### 17. Ejecutar initframs:

```bash
mkinitcpio -P
```

### 18. Instalar grub y otros paquetes:

```bash
pacman -S grub base-devel efibootmgr os-prober mtools dosfstools linux-headers networkmanager nm-connection-editor pulseaudio pavucontrol dialog gvfs xdg-user-dirs dhcp
```

### 19. Crear Directorio EFI:

```bash
mkdir /boot/EFI
```

### 20. Montar la partición EFI:

```bash
mount /dev/partition_efi /boot/EFI
```

### 21. Instalar bootloader:

Instalaremos grub, pero puedes optar por instalar otro bootloader cómo [systemd-boot](https://wiki.archlinux.org/title/systemd-boot):

```bash
grub-install --target=x86_64-efi –-bootloader-id=grub_uefi –-recheck
```

### 22. Configurar grub:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

### 23. Encender Network Manager:

```bash
systemctl enable NetworkManager
```

### 24. Agregar un nuevo usario:

```bash
useradd -m -G wheel rxtsel
```

### 25. Añadir persmisos de sudo:

```bash
EDITOR=nvim visudo
```

- **_Descomentar: %wheel ALL=(ALL) ALL y guardar._**

```diff title="visudo"
- # %wheel ALL=(ALL) ALL
+ %wheel ALL=(ALL) ALL
```

### 26. Contraseña para el nuevo usuario:

```bash
passwd rxtsel
```

- Pon una contraseña para el usuario que creaste, en mi caso para **rxtsel**.

### 27. Configurar contraseña de root:

```bash
passwd root
```

- _Pon una contraseña para el usuario **root**._

### 28. Instalar driver de display:

Si tienes gpu **INTEL**, ejecuta el siguiente comando:

---

```bash
pacman -S xf86-video-intel
```

---

Si tienes gpu **AMD**, ejecuta el siguiente comando:

```bash
pacman -S vulkan-radeon vulkan-icd-loader mesa
```

---

### 29. Instalar servidor de display:

```bash
pacman -S xorg xorg-server xorg-xinit
```

### En este punto ta tenemos toda la base de arch linux, apartir de aqui ya puedes reiniciar y volver a conectarte a internet para poder instalar un entorno de escritorio o un gestor de ventanas de tu preferencia.

<br/>

#### Salir de arch-chroot:

```bash
exit
```

#### Desmontar las particiones:

```bash
umount -a
```

#### Reiniciar el sistema:

```bash
reboot
```

_Y quitamos la usb..._

Una vez reiniciado verás que te pide un usuario y una contraseña en consola, pero aún **NO** tienes ningún entorno de escritorio, ni un gestor de ventanas, por lo tanto tendremos que descargalo. Si estás conectado por cable no es necesario que hagas estos pasos porque ya tienes conexión a internet. En caso de conectarse por WIFI, ejecuta los siguientes comandos:

```bash
# Lista las redes disponibles
nmcli device wifi list
# Conéctate a tu red
nmcli device wifi connect NAME_WIFI password TU_PASSWORD
```

Listo, ahora prueba la conexión con:

```bash
ping 8.8.8.8
```

Ya tienes conexión a internet.

# Instalando nuestro Entorno de escritorio o gestor de ventana

### Apartir de aquí ya queda a tu elección, puedes instalar el entorno de escritorio que quieras, o un gestor de ventanas, o simplemente quedarte con la terminal. Algunos más populares son:

<br/>

Gestores de Ventanas (TWM):

- [bspwm](https://wiki.archlinux.org/title/Bspwm)
- [qtile](https://wiki.archlinux.org/title/Qtile)
- [wayland](https://wiki.archlinux.org/title/Wayland)

Entornos de Escritorio:

- [KDE](https://wiki.archlinux.org/title/KDE)
- [GNOME](https://wiki.archlinux.org/title/GNOME)
- [XFCE](https://wiki.archlinux.org/title/Xfce)

Puedes buscar sobre ello y elegir el que más te guste, en mi caso prefiero **TWM**. Aquí pudes ver mi [dotfiles](https://github.com/rxtsel/dot/wiki)

<details>
  <summary>TWM Galería</summary>

![image](https://user-images.githubusercontent.com/85462420/158041264-df60aa28-7a8f-4941-a195-c557fd5188c1.png)

![2022-02-08_23-54](https://user-images.githubusercontent.com/85462420/153124501-184c5032-5d63-4e65-8555-d28113140f6c.png)

</details>
