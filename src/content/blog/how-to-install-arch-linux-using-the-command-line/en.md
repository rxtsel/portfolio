---
title: 'How to Install Arch Linux Using the Command Line'
draft: false
description: 'Explore the comprehensive guide on installing Arch Linux effortlessly using the command line interface.'
pubDate: '2024-02-02T20:29:07.661Z'
cover: ''
categories: ['all']
tags: ['Linux', 'Arch Linux', 'Terminal']
author: ['Cristhian Melo']
keywords: 'Arch Linux, Arch Linux Installation, Terminal, Window Manager, Desktop Environment, bspwm, qtile, wayland, KDE, GNOME, XFCE, Linux Configuration, Dotfiles'
lang: en
---

## Introduction

Arch Linux is a Linux distribution known for its simplicity and minimalism. Although it is one of the most difficult Linux distributions to install, it is one of the most popular among Linux enthusiasts. In this article, I will show you how to install Arch Linux using the command line in case you get tangled up with the [Arch Wiki](https://wiki.archlinux.org/title/Installation_guide).

You must know that there is now the possibility of installing **Arch Linux** with a graphical installer, but in this article, we will focus on the installation using the command line.

There are people who feel a bit "dirty" if they don't install Arch Linux from the **terminal**, because with a graphical installer, they don't have complete control over what they are installing. And the Arch Linux terminology is **"Keep It Simple, Stupid"**, so let's install it from the terminal.

## Important:

**Note:** This article assumes that you have a basic understanding of how Linux works and that you have a stable internet connection. If you don't have basic Linux knowledge, I would recommend learning the basics first before proceeding with this article.

> Personally, I learned a lot about Linux by installing Arch, as following the Arch Wiki initially seemed a bit challenging. However, after several days of attempts, with a lot of trial and error, I succeeded. And I decided to create a simpler step-by-step guide of what needs to be done.

## Requirements

1. A device with at least 512 MB of RAM.
2. A stable internet connection.
3. A USB storage device with at least 2 GB of free space.
4. **UEFI** system.

> Note: This installation has been done with a **UEFI** system and **GPT** partitions.

## Installation

1. Verify UEFI Boot

   - Press <kbd>Win</kbd> + <kbd>R</kbd>, type msinfo32, and press Enter.

   - Look for the BIOS Mode entry.

   - If the value is Legacy, the boot environment is BIOS (Installation would be different). If it is another value like **GPT**, the corresponding boot environment will be displayed.

2. **Download Arch Linux:**
   First, you need to download the latest version of Arch Linux from the [official website](https://archlinux.org/download/).

3. **Boot Arch on a USB:**
   To create a bootable USB, you can use **Rufus** on Windows.

Once Arch is booted, you can run the following commands:

### 1. Change Keyboard Layout

```bash
loadkeys la-latin1
```

`la-latin1` is the keyboard layout for Latin America, but you can choose the one you need. You can view more layouts with the following command:

```bash
localectl list-keymaps
```

### 2. Connect to Wi-Fi:

```bash
lwctl --passphrase "contraseñaWifi" station wlan0 connect "nombreWifi"
```

### 3. Verify Internet Connection

```bash
ping 8.8.8.8
```

You should receive a response; if not, go back to step 2.

### 4. Update the system clock

```bash
timedatectl set-ntp true
```

### 5. Partition the Disk

We need at least 3 partitions: one for **boot**, another for **swap**, and another for **root**.

| SIZE               | PARTITION TYPE          |
| ------------------ | ----------------------- |
| **512M**           | EFI System              |
| **YOUR GB OF RAM** | SWAP (linux swap)       |
| **REMAINING GB**   | ROOT (linux filesystem) |

With the following command, we can see the disks we have:

```bash
cfdisk
```

Make sure to select the correct disk; in my case, it's `/dev/sda`. If you have an SSD, it's likely to be `/dev/nvme0n1`.

If your disk or partition doesn't appear with the previous command, run this command to view all partitions and take note of your partition:

```bash
lsblk
```

So, you run this command:

```bash
cfdisk /dev/tu_partición_aqui
```

### 6. Format the Disks:

```bash
mkfs.fat -F32 /dev/aqui_EFI_partition   # <- For EFI
mkfs.ext4 /dev/aqui_ROOT_partition      # <- For ROOT
mkswap /dev/aqui_SWAP_partition         # <- For SWAP
```

### 7. Mount the Disks:

First, create a mount point for EFI:

```bash
mkdir /mnt/efi
```

Then mount the partitions:

```bash
mount /dev/aqui_EFI_partition /mnt/efi   # <- For EFI
mount /dev/aqui_ROOT_partition /mnt      # <- For ROOT
swapon /dev/aqui_SWAP_partition          # <- For SWAP
```

### 8. Install Essential Packages:

```bash
pacstrap /mnt base linux linux-firmware neovim iwd
```

### 9. Execute fstab:

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

### 10. Execute chroot:

```bash
arch-chroot /mnt
```

### 11. Configure Time Zone:

In my case, I will use the Bogota time zone, but you can choose the one you need.

```bash
ln -sf /usr/share/zoneinfo/America/Bogota /etc/localtime
```

Run hwclock to synchronize the system clock:

```bash
hwclock –-systohc
```

### 12. Edit Locale:

From here on, I'll use **nvim** as the text editor. If you're not familiar with it, you can follow this guide on [Basic Commands for Neovim](/en/blog/basic-commands-for-neovim). At least, so you know how to save and exit Neovim.

```bash"
nvim /etc/locale.gen
```

- Locate the line containing: **es_CO.UTF-8** for Colombia locale and uncomment it. Remove the **#** from the line and save the file.

```diff title="/etc/locale.gen"
- #es_CO.UTF-8 UTF-8
+ es_CO.UTF-8 UTF-8
```

### 13. Configure locale.conf:

```bash
nvim /etc/locale.conf
```

```diff title="/etc/locale.conf"
+ LANG=es_CO.UTF-8
```

### 14. Configure Keyboard:

```bash
nvim /etc/vconsole.conf
```

```diff title="/etc/vconsole.conf"
+ KEYMAP=la-latin1
```

### 15. Configure Hostname:

```bash
nvim /etc/hostname
```

- Enter a name for your **PC**; in my case, I'll put **rxtsel**

```diff title="/etc/hostname"
rxtsel
```

### 16. Configure host:

```bash
nvim /etc/hosts
```

![image](https://user-images.githubusercontent.com/85462420/152463120-22b7cd94-42d2-40a1-8dda-d3320d9fc1a0.png)

- _Write exactly as shown in the image. Just replace `myhostname` with the name you set in your `host`_

### 17. Execute initramfs:

```bash
mkinitcpio -P
```

### 18. Install Grub and Other Packages:

```bash
pacman -S grub base-devel efibootmgr os-prober mtools dosfstools linux-headers networkmanager nm-connection-editor pulseaudio pavucontrol dialog gvfs xdg-user-dirs dhcp
```

### 19. Create EFI Directory:

```bash
mkdir /boot/EFI
```

### 20. Mount the EFI Partition:

```bash
mount /dev/partition_efi /boot/EFI
```

### 21. Install bootloader:

We will install Grub, but you can choose to install another bootloader like [systemd-boot](https://wiki.archlinux.org/title/systemd-boot):

```bash
grub-install --target=x86_64-efi –-bootloader-id=grub_uefi –-recheck
```

### 22. Configure grub:

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

### 23. Enable Network Manager:

```bash
systemctl enable NetworkManager
```

### 24. Add new user:

```bash
useradd -m -G wheel rxtsel
```

### 25. Add Sudo Permissions:

```bash
EDITOR=nvim visudo
```

- **_Uncomment: %wheel ALL=(ALL) ALL and save._**

```diff title="visudo"
- # %wheel ALL=(ALL) ALL
+ %wheel ALL=(ALL) ALL
```

### 26. Password for the New User:

```bash
passwd rxtsel
```

- Set a password for the user you created, in my case, for **rxtsel**.

### 27. Configure Root Password:

```bash
passwd root
```

- _Set a password for the **root** user._

### 28. Install Display Driver:

---

If you have an **INTEL** GPU, run the following command:

```bash
pacman -S xf86-video-intel
```

---

If you have an **AMD** GPU, run the following command:

```bash
pacman -S vulkan-radeon vulkan-icd-loader mesa
```

---

### 29. Install Display Server:

```bash
pacman -S xorg xorg-server xorg-xinit
```

### At this point, we have the basic Arch Linux setup. From here, you can restart and reconnect to the internet to install a desktop environment or window manager of your choice.

<br/>

#### Exit to arch-chroot:

```bash
exit
```

#### Unmount all partitions:

```bash
umount -a
```

#### Reboot system:

```bash
reboot
```

_And remove the USB..._

Once restarted, you'll see that it asks for a username and password in the console, but you still **DON'T** have any desktop environment or window manager. Therefore, we'll need to download one. If you are connected by cable, you don't need to follow these steps as you already have an internet connection. In case of using WIFI, run the following commands:

```bash
# List available networks
nmcli device wifi list
# Connect to your WIFI
nmcli device wifi connect NAME_WIFI password TU_PASSWORD
```

Alright, now test the connection with:

```bash
ping 8.8.8.8
```

You now have an internet connection.

# Installing Your Desktop Environment or Window Manager

### From here, it's your choice. You can install the desktop environment you prefer, or a window manager, or simply stick with the terminal. Some popular choices include:

<br/>

Window Managers (TWM):

- [bspwm](https://wiki.archlinux.org/title/Bspwm)
- [qtile](https://wiki.archlinux.org/title/Qtile)
- [wayland](https://wiki.archlinux.org/title/Wayland)

Desktop Environments:

- [KDE](https://wiki.archlinux.org/title/KDE)
- [GNOME](https://wiki.archlinux.org/title/GNOME)
- [XFCE](https://wiki.archlinux.org/title/Xfce)

You can explore and choose the one you like the most. In my case, I prefer **TWM**. Here you can check my [dotfiles](https://github.com/rxtsel/dot/wiki)

<details>
  <summary>TWM Gallery</summary>

![image](https://user-images.githubusercontent.com/85462420/158041264-df60aa28-7a8f-4941-a195-c557fd5188c1.png)

![2022-02-08_23-54](https://user-images.githubusercontent.com/85462420/153124501-184c5032-5d63-4e65-8555-d28113140f6c.png)

</details>

