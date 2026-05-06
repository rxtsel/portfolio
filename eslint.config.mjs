import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import astro from "eslint-plugin-astro"

export default [
  js.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs["jsx-a11y-recommended"],
  {
    ignores: ["dist/**", ".astro/**"],
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tsParser,
      },
    },
  },
]
