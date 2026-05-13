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
    rules: {
      curly: ["error", "all"],
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-alert": "error",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-implicit-coercion": "error",
      "no-return-await": "error",
      "no-var": "error",
      "prefer-const": "error",
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".astro"],
        parser: tsParser,
        sourceType: "module",
      },
    },
    rules: {
      "astro/no-set-html-directive": "error",
      "astro/no-unused-css-selector": "warn",
      "astro/prefer-class-list-directive": "error",
      "astro/sort-attributes": [
        "error",
        {
          ignoreCase: true,
          order: "asc",
          type: "alphabetical",
        },
      ],
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          caughtErrors: "all",
          ignoreRestSiblings: false,
          vars: "all",
        },
      ],
    },
  },
]
