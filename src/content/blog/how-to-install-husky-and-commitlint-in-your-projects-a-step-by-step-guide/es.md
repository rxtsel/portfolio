---
title: 'Cómo Instalar Husky, Commitlint y lint-staged en tus Proyectos: Una Guía Paso a Paso'
draft: false
description: 'Aprende cómo mejorar la calidad y consistencia de tus commits en proyectos de software con Husky y Commitlint. Esta guía proporciona instrucciones paso a paso sobre cómo instalar y configurar estas poderosas herramientas, asegurando una mejor colaboración y mantenimiento del código a través de mensajes de commit estandarizados.'
pubDate: '2024-02-07T18:40:10.762Z'
cover: ''
categories: ['Commits', 'Linter']
tags:
  [
    'Commits',
    'Linter',
    'Automation',
    'Quality',
    'Conventions',
    'Tools',
    'Collaboration'
  ]
author: ['Cristhian Melo']
keywords: 'Desarrollo de software, calidad del código, commits consistentes, convenciones de commit, Husky, Commitlint, Git Hooks, automatización de procesos, control de versiones'
lang: es
---

## Introducción

**Husky** y **Commitlint** son herramientas poderosas que pueden mejorar la calidad y consistencia de tus commits en proyectos de desarrollo de software. [Husky](https://typicode.github.io/husky/) te permite configurar [Git Hooks](#qué-es-un-git-hook) en tu repositorio de Git, mientras que [Commitlint](https://commitlint.js.org/#/) te ayuda a aplicar convenciones de mensajes de commit consistentes. ([Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)). En esta guía paso a paso, aprenderás cómo instalar y configurar Husky y Commitlint en tus proyectos.

### ¿Por qué Husky y Commitlint?

¿Te ha pasado que has subido cambios a tu repositorio y el CI hace un deploy automático, pero algo falla? Cuando ves los logs, te das cuenta de que a veces es algo tan simple como un error de identación. Pues con Husky, puedes evitar estos problemas haciendo que corra el linter antes de cada commit. Así, evitas, por un lado, que se suban cambios con errores y, además, que ese commit quede registrado en el historial.

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/indent-problem.webp)

## ❌

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/no-conventional-commit.webp)

## ✅

![image](/blog/how-to-install-husky-and-commitlint-in-your-projects-a-step-by-step-guide/conventional-commit.webp)

## ¿Qué es un Git Hook?

Un “Git Hook” (gancho o hook en español) es un script personalizado que puedes activar en respuesta a eventos específicos durante el proceso de Git. Estos eventos podrían ser acciones como realizar un commit, hacer push, fusionar ramas, entre otros. Los ganchos permiten ejecutar scripts o llevar a cabo acciones automáticamente antes o después de que estos eventos ocurran en Git.

Git ofrece una serie de ganchos predefinidos, los cuales puedes adaptar según las necesidades de tu flujo de trabajo. Algunos de los ganchos más habituales son:

- **pre-commit**: Se ejecuta antes de confirmar los cambios. Puedes usarlo para realizar tareas como ejecutar pruebas automáticas o comprobar la calidad del código.

- **pre-push**: Se ejecuta antes de empujar los cambios al repositorio remoto. Puede ser utilizado para realizar verificaciones adicionales antes de enviar los cambios al servidor.

- **post-commit**: Se ejecuta después de que se ha confirmado un cambio. Puede utilizarse para realizar tareas adicionales después de que se ha realizado un commit.

- **post-receive**: Se ejecuta en el repositorio remoto después de recibir nuevos cambios. Puede ser útil para realizar acciones en el servidor después de que se hayan empujado cambios al repositorio remoto.

## Instalación y Configuración de Husky, Commitlint y lint-staged

### Paso 1: Configurar el Proyecto de Git

Si aún no tienes un repositorio de Git configurado para tu proyecto, inicialízalo ejecutando el siguiente comando en tu terminal:

```bash
git init
```

### Paso 2: Instalar Husky

> Nota:
> Yo usare el gestor de paquetes `ppnpm` en este ejemplo, pero tú puedes usar `pnpm` o `yarn` según tus preferencias.

Husky se puede instalar fácilmente usando cualquier gestor de paquetes. En tu terminal, ejecuta el siguiente comando para instalar Husky como una dependencia de desarrollo en tu proyecto:

```shell
pnpx husky-init && pnpm i
```

Esto te creará una carpeta llamada `.husky` en la raíz de tu proyecto, que contiene los ganchos predefinidos de Husky. Husky también añadirá un script `prepare` a tu archivo `package.json` que se ejecutará automáticamente después de que se instalen las dependencias de tu proyecto.

### Paso 3: Configurar Husky

Ahora, necesitas agregar los scripts que quieras que se ejecuten antes de hacer commit. Por ejemplo, puedes hacer que corra el script `lint` de tu `package.json`
para que ejecute el linter antes de cada commit y resuelva los errores automáticamente. En este caso, usaremos `eslint` como linter.

```json
  "scripts": {
    "lint": "eslint \"*/**/*.{js,ts,jsx,tsx}\" --fix",
    "prepare": "husky install"
  }
```

Entonces, vamos a modificar el script `pre-commit` en el archivo `.husky/pre-commit` para que ejecute el script `lint` antes de cada commit.

```diff title=".husky/pre-commit"
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

- pnpm test
+ pnpm run lint
```

- _Reemplaza `pnpm` por el gestor de paquetes que estés utilizando._

> Nota: puedes agregar cualquier script que desees ejecutar antes de cada commit en el archivo `.husky/pre-commit`, como ejecutar pruebas automáticas, comprobar la calidad del código, etc.

### Paso 4: Instalar Commitlint

Ahora que Husky está configurado para ejecutar Commitlint antes de cada commit, necesitas instalar Commitlint en tu proyecto. Puedes hacerlo ejecutando el siguiente comando en tu terminal:

```shell
pnpm i @commitlint/cli @commitlint/config-conventional -DE
```

### Paso 5: Configurar Commitlint

Después de instalar Commitlint, necesitas configurarlo para que utilice un conjunto de reglas.

Creamos un archivo llamado `commitlint.config.js` en la raíz de tu proyecto con el siguiente comando:

```shell
echo "module.exports = { extends: ['@commitlint/config-conventional'] }" > commitlint.config.js
```

Creamos el script para que se ejecute commitlint con el siguiente comando:

```shell
node node_modules/husky/lib/bin add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

¡Felicidades! Has configurado con éxito Husky y Commitlint en tu proyecto. Ahora, cada vez que realices un commit en tu repositorio de Git, Husky ejecutará Commitlint para asegurarse de que tu mensaje de commit cumpla con las convenciones definidas.

## lint-staged

Si deseas ejecutar el linter solo en los archivos que han sido modificados antes de cada commit, puedes instalar `lint-staged` y configurarlo en tu proyecto.

1. Instalar `lint-staged`:

   ```shell
   pnpm i lint-staged -DE
   ```

2. Crear un archivo `.lintstagedrc` en la raíz de tu proyecto y agregar la configuración deseada. Por ejemplo, para ejecutar `eslint` en los archivos `{js,jsx,ts,tsx}` modificados:

   ```json
   {
     "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
   }
   ```

3. Agregar el script a `.husky/pre-commit` para ejecutar `lint-staged` antes de cada commit:

   ```diff title=".husky/pre-commit"
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/\_/husky.sh"

   pnpm run lint
   + pnpx lint-staged
   ```

Listo, ahora `lint-staged` ejecutará el linter solo en los archivos modificados antes de cada commit.

## Conclusion

En esta guía, has aprendido cómo instalar y configurar Husky y Commitlint en tus proyectos de desarrollo de software. Al seguir estas instrucciones, puedes mejorar la calidad y consistencia de los mensajes de commit en tu repositorio de Git, lo que facilita la colaboración y el mantenimiento del código a lo largo del tiempo.

¡Ahora estás listo para empezar a commitear con confianza!
