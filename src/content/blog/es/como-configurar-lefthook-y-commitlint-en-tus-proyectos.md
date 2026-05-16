---
translationKey: how-to-set-up-lefthook-and-commitlint-in-your-projects
locale: es
published: true
title: Cómo configurar Lefthook y commitlint en tus proyectos
description: Aprende a configurar Lefthook junto a commitlint para automatizar linters, formateadores y validación de commits en cualquier proyecto JavaScript o TypeScript.
publishDate: 2026-05-15
updatedDate: ""
categories:
  - git
  - tooling
seo:
  description: Guía paso a paso para instalar y configurar Lefthook y commitlint con pnpm. Automatiza linters, formateadores y validación de commits en tus proyectos.
  keywords: lefthook, commitlint, husky alternativa, git hooks, conventional commits, pnpm, biome, pre-commit, pre-push
---

## Introducción

Lefthook es una alternativa a Husky notablemente más rápida, escrita en Go. Puede instalarse como binario independiente o como paquete de Node.js. En esta guía usaremos la segunda opción para que quede declarado como dependencia del proyecto y cualquier persona que lo clone lo tenga disponible automáticamente tras instalar dependencias.

Se asume que ya conoces qué son los [git hooks](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks?utm_source=rxtsel.dev&utm_medium=blog) y para qué sirven. A lo largo de esta guía configuraremos los hooks `pre-commit`, `commit-msg` y `pre-push`, que son los más utilizados en el día a día, aunque en la documentación oficial encontrarás todos los hooks disponibles.

Puedes usar cualquier gestor de paquetes. En los ejemplos usaré **pnpm**.

## Instalación

Instala las siguientes dependencias de desarrollo:

```sh
pnpm add -DE lefthook@latest @commitlint/cli@latest @commitlint/config-conventional@latest
```

_Se instalan las versiones exactas más recientes, sin carets (`^`), como dependencias de desarrollo._

> **Nota:** Si usas pnpm, asegúrate de agregar `lefthook` a `onlyBuiltDependencies` en `pnpm-workspace.yaml` y a `pnpm.onlyBuiltDependencies` en tu `package.json` raíz, de lo contrario el script `postinstall` del paquete lefthook no se ejecutará y los hooks no se instalarán.

```yaml title="pnpm-workspace.yaml" ins={2}
onlyBuiltDependencies:
  - lefthook
```

Y agrega lefthook a la sección `onlyBuiltDependencies` en tu `package.json` raíz:

```json title="package.json" ins={5}
{
  ...
  "pnpm": {
    "onlyBuiltDependencies": [
      "lefthook"
    ]
  }
}
```

## Configuración de commitlint

Commitlint valida que los mensajes de commit sigan el estándar de [Conventional Commits](https://www.conventionalcommits.org?utm_source=rxtsel.dev&utm_medium=blog), lo que facilita generar changelogs automáticos y mantener un historial legible.

Crea el archivo de configuración en la raíz del proyecto:

```js title="commitlint.config.js"
export default { extends: ["@commitlint/config-conventional"] }
```

## Configuración de Lefthook

Para este ejemplo asumiré que el proyecto tiene [Biome](https://biomejs.dev?utm_source=rxtsel.dev&utm_medium=blog) como linter y formateador, con los siguientes scripts en `package.json`:

```json title="package.json"
{
  ...
  "scripts": {
    "format": "biome format",
    "lint": "biome lint",
    "check": "biome check",
  }
}
```

Crea el archivo `lefthook.yml` en la raíz del proyecto:

```yaml title="lefthook.yml"
# Ejecuta linters y formateadores en los archivos preparados antes de confirmar los cambios
pre-commit:
  parallel: false # Ejecutar todos los comandos de forma concurrente
  commands:
    check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: pnpm run check --write --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {staged_files}
      stage_fixed: true

# Validar mensajes de commit
commit-msg:
  commands:
    commitlint:
      run: pnpm commitlint --edit {1}

# Verificar el formato y el lint antes de hacer push
pre-push:
  commands:
    check:
      glob: "*.{js,ts,cjs,mjs,d.cts,d.mts,jsx,tsx,json,jsonc}"
      run: npx @biomejs/biome check --no-errors-on-unmatched --files-ignore-unknown=true --colors=off {push_files}
```

Cada sección corresponde a un hook de Git:

- **`pre-commit`** — se ejecuta sobre los archivos en staging antes de crear el commit. La opción `stage_fixed: true` re-agrega automáticamente los archivos que Biome haya corregido.
- **`commit-msg`** — valida el mensaje de commit con commitlint antes de registrarlo.
- **`pre-push`** — revisa todos los archivos modificados en el push, sin aplicar correcciones automáticas.

La opción `parallel` controla si los comandos dentro de un hook se ejecutan en paralelo o en secuencia. Como en este ejemplo `pre-commit` solo tiene un comando, el valor `false` (que es el predeterminado) no cambia nada, pero lo incluyo para que sea explícito si luego agregas más comandos.

Puedes ampliar esta configuración según las necesidades del proyecto: tests unitarios en `pre-commit`, pruebas end-to-end en `pre-push`, generación de tipos, etc. Consulta la [documentación oficial de Lefthook](https://lefthook.dev?utm_source=rxtsel.dev&utm_medium=blog) para ver todas las opciones disponibles.
