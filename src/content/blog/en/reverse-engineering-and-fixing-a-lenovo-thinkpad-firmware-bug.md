---
translationKey: reverse-engineering-and-fixing-a-lenovo-thinkpad-firmware-bug
locale: en
published: true
title: Reverse Engineering and Fixing a Lenovo ThinkPad Firmware Bug
description: How I reverse engineered and fixed a Lenovo ThinkPad firmware bug caused by a missing ACPI method using a custom SSDT loaded from the initrd.
publishDate: 2026-07-29
updatedDate: ""
categories:
  - linux
  - firmware
seo:
  description: Reverse engineering and fixing a Lenovo ThinkPad firmware bug caused by a missing ACPI method (PEGP.DDNT) using an SSDT override on NixOS.
  keywords: ACPI, SSDT, Lenovo ThinkPad, NixOS, firmware bug, PEGP.DDNT, AE_NOT_FOUND, thermal_zone6, initrd
---

Sometimes the best bugs are the ones that shouldn't exist.

After installing NixOS on my **Lenovo ThinkPad T14 Gen 2 Intel**, I noticed the kernel printed the same ACPI errors on every boot:

```text
ACPI BIOS Error (bug): Could not resolve symbol [_SB.PC00.RP09.PEGP.DDNT], AE_NOT_FOUND
ACPI Error: Aborting method _SB.PC00.LPCB.EC.SEN4._TMP
```

Linux continued to work, but one thermal zone (`SEN4`) was disabled because its `_TMP` method aborted during execution.

This investigation was performed on a **Lenovo ThinkPad T14 Gen 2 Intel** running **NixOS**, with BIOS version **N34ET71W (1.71)**.

Like many Linux users, my first assumption was simple:

> "It's probably just another harmless BIOS bug."

It wasn't.

## The Investigation

Instead of ignoring the message, I wanted to understand **why** it happened.

The first step was dumping every ACPI table exposed by the firmware:

```bash
acpidump > acpidump
acpixtract -a acpidump
iasl -d *.dat
```

After disassembling every table into ASL, I searched through each generated DSDT and SSDT looking for the missing method.

Eventually I found the culprit.

Inside one of Lenovo's DPTF SSDTs, the `SEN4` thermal sensor implemented its `_TMP` method like this:

```asl
Method (_TMP)
{
    ...
    _SB.PC00.RP09.PEGP.DDNT(Local0)
    ...
}
```

The problem was immediately obvious.

The firmware expected a method named `DDNT`, but it didn't actually exist.

Searching every extracted ACPI table for `DDNT` returned only a single declaration:

```asl
External (_SB.PC00.RP09.PEGP.DDNT, MethodObj)
```

There was no implementation anywhere.

The firmware referenced a method that Lenovo never shipped.

## Understanding the Bug

At this point it became clear that Linux wasn't doing anything wrong.

ACPICA was simply executing the AML exactly as the firmware instructed it to.

When `_TMP` attempted to execute `DDNT`, ACPICA couldn't resolve the symbol and aborted the method with `AE_NOT_FOUND`.

As a consequence:

- `thermal_zone6` (`SEN4`) was disabled.
- No temperature could be read from that thermal zone.
- Every boot generated the same firmware errors.

This wasn't a Linux bug.

It was a firmware bug.

## The Fix

Fortunately, Linux provides an official mechanism for extending ACPI tables during early boot.

Additional SSDTs can be loaded directly from the initrd before ACPI initialization begins, allowing firmware defects to be corrected without modifying either the BIOS or the kernel.

Rather than modifying Lenovo's original SSDT, I chose to create a supplemental SSDT that only implements the missing method.

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

The goal wasn't to reverse engineer Lenovo's intended implementation.

The only objective was to provide the missing method so ACPICA could successfully evaluate `_TMP` without throwing `AE_NOT_FOUND`.

In this case, a minimal stub implementation was enough.

If Lenovo ever fixes the firmware in a future BIOS release, removing the override is all that's required.

## Packaging the SSDT

The SSDT was compiled using Intel's ACPICA compiler:

```bash
iasl SSDT-DDNT.dsl
```

It was then packaged into an uncompressed initrd archive:

```text
kernel/
└── firmware/
    └── acpi/
        └── SSDT-DDNT.aml
```

Finally, I packaged everything as a reusable Nix package and integrated it into my NixOS configuration through `boot.initrd.prepend`.

The entire solution is declarative, reproducible, and survives system rebuilds just like the rest of my configuration.

## Validation

After rebooting, the kernel reported:

```text
ACPI: SSDT ACPI table found in initrd
ACPI: Table Upgrade: install [SSDT- RXTS DDNTFIX]
```

The custom SSDT had been loaded successfully during early boot.

More importantly:

- The `AE_NOT_FOUND` errors disappeared completely.
- `SEN4` was no longer disabled.
- `thermal_zone6` became available again.
- The firmware bug no longer interrupted ACPI evaluation.

## Evidence

After applying the SSDT override, the kernel log showed:

```text
ACPI: SSDT ACPI table found in initrd
ACPI: Table Upgrade: install [SSDT- RXTS DDNTFIX]
```

Before the override, every boot produced firmware errors and disabled the `SEN4` thermal zone.

After the override:

- No `AE_NOT_FOUND` errors were reported.
- `thermal_zone6` changed from `disabled` to `enabled`.
- The thermal zone successfully exposed a temperature through sysfs.

The solution worked exactly as intended.

## Lessons Learned

The interesting part of this investigation wasn't writing ten lines of ASL.

It was discovering that the firmware referenced a method that never existed.

Linux behaved exactly as specified.

ACPICA behaved exactly as specified.

The firmware was wrong.

This also reminded me that the Linux kernel already provides a supported mechanism for working around firmware defects. Most users never need it, but when you do, it's an incredibly powerful feature.

## Final Thoughts

This wasn't about fixing Linux.

It was about understanding the firmware well enough to prove where the bug actually lived.

Reverse engineering the ACPI tables transformed what initially looked like an annoying boot warning into a reproducible firmware defect with a clean, declarative workaround.

If you encounter an ACPI error, don't immediately assume Linux is at fault.

Sometimes the kernel logs are telling the truth.

You just have to follow them.

## References

- [Linux Kernel Documentation — ACPI Support](https://docs.kernel.org/admin-guide/acpi/index.html)
- [Linux Kernel Documentation — Upgrading ACPI Tables via initrd](https://docs.kernel.org/admin-guide/acpi/initrd_table_override.html)
- [Linux Kernel Documentation — SSDT Overlays](https://docs.kernel.org/admin-guide/acpi/ssdt-overlays.html)
- [ACPICA Project](https://acpica.org/)
