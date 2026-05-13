---
translationKey: how-to-sync-bluetooth-in-dual-boot-triple-boot-windows-linux-macos
locale: en
published: true
title: How to Sync Bluetooth in Dual Boot, Multi Boot (Windows, Linux, macOS)
description: Guide to syncing Bluetooth devices in multi-boot environments, preventing connection issues when switching operating systems.
publishDate: 2025-03-17
updatedDate: 2026-05-13
categories:
  - tutorials
  - windows
  - linux
  - macos
  - dual-boot
  - multiboot
  - hackintosh
seo:
  description: Sync Bluetooth pairing keys across Windows, Linux, and macOS multi-boot setups to stop reconnecting devices after switching systems.
  keywords: sync bluetooth dual boot, bluetooth linux windows, bluetooth triple boot, hackintosh bluetooth, multiboot bluetooth
---

## Introduction

If you use **dual boot or multi boot**, you may have noticed that when you switch operating systems, your Bluetooth devices do not connect automatically.

This is really annoying, especially if you have a Bluetooth keyboard and mouse and need to connect them manually every time you switch operating systems.

### Why does this happen?

When you pair a Bluetooth device on an operating system, a synchronization key (`LinkKey`) is generated. Since this key is not shared between systems, when you switch operating systems, the device cannot authenticate correctly.

### What is the solution?

It is as simple as having the same synchronization keys on all your operating systems. To do this, you need to copy the Bluetooth synchronization keys from one operating system to another.

---

## Sync Bluetooth in dual boot (Windows and Linux)

### Connect devices in Linux

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

Copy the device MAC address and use:

```sh
   connect XX:XX:XX:XX:XX:XX
```

4. **Verify the connection and exit `bluetoothctl`**:

```sh
   exit
```

### Connect devices in Windows

1. **Connect** your Bluetooth devices in Windows. Follow the usual steps from the Windows Bluetooth settings.
2. **Verify that the device was connected successfully.**

### Copy Bluetooth keys from Windows to Linux

1. **Download** [**PsTools**](https://learn.microsoft.com/en-us/sysinternals/downloads/pstools) **and extract `PsExec` into a quickly accessible folder, for example: `C:\Windows`.**
2. **Find your MAC address**.
   Open `cmd` and run:

```sh
   getmac /V /FO LIST
```

Look for the MAC address of your Bluetooth device and write it down.

3. **Run `cmd` as administrator**, navigate to the folder where you saved `PsExec`, and run:

```sh
   psexec -s -i regedit
```

_This will open the Registry Editor with administrator permissions._

4. **In the Registry Editor, navigate to:**

```plain
"
   HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\BTHPORT\Parameters\Keys\<MAC_ADDRESS>
```

5. **Find your device key and double-click its name. A new window will open.**
6. **In the new window, copy the key value found under `Value data`.**
7. **Reboot into Linux.**
8. **In Linux**
9. **Open the terminal and run:**

```sh
   sudo su
```

_Enter your administrator password._

2. **Navigate to the Bluetooth folder:**

```sh
   cd /var/lib/bluetooth/<MAC_ADDRESS>/<DEVICE_MAC>
```

_Replace `<MAC_ADDRESS>` with the MAC address of your internal Bluetooth adapter and `<DEVICE_MAC>` with the MAC address of your external device._

9. **Edit the `info` file**

   Locate the `[LinkKey]` line and replace the value of the `Key` property with the key copied from Windows:

```sh
title="info" {2}
   [LinkKey]
   Key=B3798087E81E306CDAB046...
```

Restart Linux and the device should connect automatically.

---

## Sync Bluetooth in multi boot (macOS, Windows, and Linux)

> **NOTE:** The steps are the same if you only have dual boot with macOS.

### Pair Bluetooth devices on each system

1. **Pair first on Linux.** You can follow steps 1 through 4 from the [first section](#sync-bluetooth-in-dual-boot-windows-and-linux).
2. **Pair on Windows.**
3. **Finally, pair on macOS.**

### Extract and transfer the LinkKey

1. **On macOS, open Spotlight and search for `Keychain Access`.**
2. **Search for `bluetooth`** in the search bar and double-click the latest `MobileBluetooth` result.
3. **In that new window**, you will see your device MAC address in the **Account** field (`xx:xx:xx:xx:xx:xx`). Write it down.
4. **Then, in the same window**, check the **Show password** box and enter your credentials. You will be asked for them twice.
5. **The revealed password is actually a full XML file**. Click inside the field, press
   <kbd>Option + a</kbd> or <kbd>Ctrl + a</kbd>, then copy it and paste it somewhere else.

   _Make sure to copy the entire content and save it in your notes._

6. **Under `<key>LinkKey</key>`**, copy the value between the `<string>xx-xx-xx-xx</string>` tags to your notes.

> NOTE: **If you have multiple devices connected, do the same for each one.**

7. **Reboot into Windows.**
8. **Transfer the `LinkKey` to Windows and Linux, or to all operating systems other than macOS:**

- **For Windows**
  1. Follow steps 3 through 4 from [the previous section](#copy-bluetooth-keys-from-windows-to-linux).
  2. Identify your device MAC address and double-click it.
  3. A new window will open with your device key.
  4. Select the values separated by spaces one by one and replace them with the values you copied from macOS. They have the same length, so replace them pair by pair.

- **For Linux**
  1. Follow the same file-editing steps in Linux.

Once the keys are added, the device should connect automatically on all systems.

---

## Additional Notes

- **Some Linux distributions may store the keys in slightly different paths.** If the steps do not work, check `bluetoothctl info <MAC_ADDRESS>`.
- **If you still have problems, try removing and pairing the device again after transferring the key.**
- **If you use a USB Bluetooth dongle, the MAC address may change depending on the USB port where you connect it.**

With these steps, your Bluetooth devices will be synchronized across all your operating systems.

## References

- [YouTube](https://youtu.be/o5nPUUagW_c?si=Ar0cY_jQILe11uyU)
- [Reddit](https://www.reddit.com/r/hackintosh/comments/p5ost3/macos_monterey_and_windows_bluetooth_pairing/)
