import type { RedirectConfig } from "astro"

export const redirects: Record<string, RedirectConfig> = {
  // Old redirects
  "/blog/240129-comandos-basicos-de-neovim/": {
    status: 301,
    destination: "/es/blog/basic-commands-for-neovim/",
  },
  "/en/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide": {
    status: 301,
    destination:
      "/en/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/",
  },
  "es/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide": {
    status: 301,
    destination:
      "/es/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/",
  },

  // New redirects
  "es/blog/basic-commands-for-neovim/": {
    status: 301,
    destination: "/es/blog/comandos-basicos-de-neovim/",
  },
  "/en/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/": {
    status: 301,
    destination:
      "/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/",
  },
  "es/blog/how-to-install-husky-commitlint-and-lint-staged-in-your-projects-a-step-by-step-guide/": {
    status: 301,
    destination:
      "/es/blog/como-instalar-husky-commitlint-y-lint-staged-en-tus-proyectos-una-guia-paso-a-paso/",
  },
  "/en/blog/basic-commands-for-neovim/": {
    status: 301,
    destination: "/blog/basic-commands-for-neovim/",
  },
  "/en/blog/how-to-install-arch-linux-using-the-command-line/": {
    status: 301,
    destination: "/blog/how-to-install-arch-linux-using-the-command-line/",
  },
  "/en/blog/how-to-install-zsh-on-linux/": {
    status: 301,
    destination: "/blog/how-to-install-zsh-on-linux/",
  },
  "/en/blog/how-to-sync-bluetooth-in-dual-boot-triple-boot-windows-linux-macos/": {
    status: 301,
    destination: "/blog/how-to-sync-bluetooth-in-dual-boot-triple-boot-windows-linux-macos/",
  },
  "es/blog/how-to-install-arch-linux-using-the-command-line/": {
    status: 301,
    destination: "/es/blog/como-instalar-arch-linux-usando-la-linea-de-comandos/",
  },
  "es/blog/how-to-install-zsh-on-linux/": {
    status: 301,
    destination: "/es/blog/como-instalar-zsh-en-linux/",
  },
  "es/blog/how-to-sync-bluetooth-in-dual-boot-triple-boot-windows-linux-macos/": {
    status: 301,
    destination: "/es/blog/como-sincronizar-bluetooth-en-dual-boot-triple-boot-windows-linux-macos/",
  },
  "es/blog/how-to-synchronize-bluetooth-in-dual-boot-triple-boot-windows-linux-macos/": {
    status: 301,
    destination: "/es/blog/como-sincronizar-bluetooth-en-dual-boot-triple-boot-windows-linux-macos/",
  },
}
