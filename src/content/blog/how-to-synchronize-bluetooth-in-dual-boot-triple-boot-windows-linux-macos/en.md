---
title: 'How to Sync Bluetooth in Dual Boot, Triple Boot (Windows, Linux, macOS)'
draft: false
description: 'Guide to syncing Bluetooth devices in multi-boot environments, preventing connection issues when switching operating systems.'
pubDate: '2025-03-17T20:35:45.145Z'
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
lang: en
---

## Table of Contents

<!--toc:start-->

- [Introduction](#introduction)
  - [Why does this happen?](#why-does-this-happen)
  - [What’s the solution?](#whats-the-solution)
- [Syncing Bluetooth in Dual Boot (Windows and Linux)](#syncing-bluetooth-in-dual-boot-windows-and-linux)
  - [Connecting Devices in Linux](#connecting-devices-in-linux)
  - [Connecting Devices in Windows](#connecting-devices-in-windows)
  - [Copying Bluetooth Keys from Windows to Linux](#copying-bluetooth-keys-from-windows-to-linux)
- [Syncing Bluetooth in Triple Boot (macOS, Windows, and Linux)](#syncing-bluetooth-in-triple-boot-macos-windows-and-linux)
  - [Pairing Bluetooth Devices on Each System](#pairing-bluetooth-devices-on-each-system)
  - [Extracting and Transferring the LinkKey](#extracting-and-transferring-the-linkkey)
- [Additional Notes](#additional-notes)
- [References](#references)
<!--toc:end-->

## Introduction

If you use **dual boot or triple boot**, you may have noticed that when switching operating systems, your Bluetooth devices do not connect automatically.

This can be really annoying, especially if you have a Bluetooth keyboard and mouse and have to manually connect them every time you switch OS.

### Why does this happen?

When you pair a Bluetooth device on an operating system, a synchronization key (`LinkKey`) is generated. Since this key is not shared between systems, when switching OS, the device cannot authenticate properly.

### What’s the solution?

It’s as simple as having the same synchronization keys on all your operating systems. To do this, you need to copy the Bluetooth sync keys from one OS to another.

---

## Syncing Bluetooth in Dual Boot (Windows and Linux)

### Connecting Devices in Linux

1. **Open the terminal and run `bluetoothctl`**:

   ```sh
   bluetoothctl
   ```

2. **Enable pairing mode**:

   ```sh
   pairable on
   discoverable on
   ```

3. **Scan and pair the device**:

   ```sh
   scan on
   ```

   Copy the device's MAC address and use:

   ```sh
   connect XX:XX:XX:XX:XX:XX
   ```

4. **Verify the connection and exit `bluetoothctl`**:

   ```sh
   exit
   ```

### Connecting Devices in Windows

1. **Connect** your Bluetooth devices in Windows. Follow the usual steps in Windows Bluetooth settings.
2. **Ensure the device is properly connected.**

### Copying Bluetooth Keys from Windows to Linux

1. **Download [PsTools](https://learn.microsoft.com/en-us/sysinternals/downloads/pstools) and extract `PsExec` into an easy-to-access folder, such as `C:\Windows`.**
2. **Find your MAC address.**  
   Open `cmd` and run:

   ```sh
   getmac /V /FO LIST
   ```

   Find your Bluetooth device’s MAC address and note it down.

3. **Run `cmd` as administrator**, navigate to the folder where you saved `PsExec`, and run:

   ```sh
   psexec -s -i regedit
   ```

   _This will open the Registry Editor with administrator privileges._

4. **In the Registry Editor, navigate to:**

   ```
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\<MAC_ADDRESS>
   ```

5. **Find your device key, double-click on its name (a new window will open).**
6. **In the new window, copy the key value from the `Value Data` field.**
7. **Reboot into Linux.**
8. **In Linux**

   1. **Open the terminal and run:**

   ```sh
   sudo su
   ```

   _Enter your admin password._

   2. **Navigate to the Bluetooth folder:**

   ```sh
   cd /var/lib/bluetooth/<MAC_ADDRESS>/<DEVICE_MAC>
   ```

   _Replace `<MAC_ADDRESS>` with your internal Bluetooth adapter’s MAC address and `<DEVICE_MAC>` with your external device’s MAC address._

9. **Edit the `info` file**

   Locate the `[LinkKey]` section and replace the `Key` value with the one copied from Windows:

   ```sh title="info" {2}
   [LinkKey]
   Key=B3798087E81E306CDAB046...
   ```

Reboot Linux, and the device should connect automatically.

---

## Syncing Bluetooth in Triple Boot (macOS, Windows, and Linux)

> **NOTE:** The steps are the same if you only have dual boot with macOS.

### Pairing Bluetooth Devices on Each System

1. **Pair first on Linux.** (See steps 1-4 in the previous section).
2. **Pair on Windows.**
3. **Finally, pair on macOS.**

### Extracting and Transferring the LinkKey

1. **On macOS, open Spotlight and search for `KeyChain Access`.**
2. **Search for `bluetooth`** in the search bar and double-click the latest `MobileBluetooth` result.
3. **In the new window,** you will see your device’s MAC address in the **Account** field (`xx:xx:xx:xx:xx:xx`). Take note of it.
4. **Then, in the same window,** check **Show password**, and enter your credentials (it will ask twice).
5. **The revealed password is actually an XML file.** Click on the field, press <kbd>Option + A</kbd> or <kbd>Ctrl + A</kbd>, then copy and save it.

   _Make sure to copy the full content and save it._

6. **Under `<key>LinkKey</key>`, copy the value between `<string>xx-xx-xx-xx</string>` into your notes.**

> NOTE: **If you have multiple devices connected, do this for each one.**

7. **Reboot into Windows.**

8. **Transfer the `LinkKey` to Windows and Linux (or all OSes except macOS):**
   - **For Windows**
     1. Follow the steps up to step 4 in the previous section.
     2. Find your device’s MAC address and double-click it.
     3. A new window will open with your device’s key.
     4. Select the values one by one (separated by spaces) and replace them with the values copied from macOS. They are the same length, so replace them in pairs.
   - **For Linux**
     1. Follow the same Linux file editing steps.

- **Note:** You no longer need to reverse the key. If macOS gives `98-54-2f-...`, write `98 54 2f...` in the Windows registry.

Once the keys are added, the device should automatically connect across all systems.

---

## Additional Notes

- **Some Linux distributions may store keys in slightly different paths.** If the steps don’t work, check `bluetoothctl info <MAC_ADDRESS>`.
- **If you still have issues, try removing and re-pairing the device after transferring the key.**
- **If you use a USB Bluetooth dongle, the MAC address may change depending on the USB port used.**

With these steps, your Bluetooth devices will be synced across all your operating systems.

## References

- [YouTube](https://youtu.be/o5nPUUagW_c?si=Ar0cY_jQILe11uyU)
- [Reddit](https://www.reddit.com/r/hackintosh/comments/p5ost3/macos_monterey_and_windows_bluetooth_pairing/)
