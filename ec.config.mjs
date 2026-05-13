import { defineEcConfig } from "astro-expressive-code"

// https://expressive-code.com/reference/configuration/
export default defineEcConfig({
  themes: ["github-dark-default", "github-light-default"],
  themeCssRoot: "html",
  useDarkModeMediaQuery: true,
  themeCssSelector: (theme) => {
    return `.${theme.name}, [data-theme="${theme.name}"]`
  },
  styleOverrides: {
    frames: {
      shadowColor: "transparent",
      tooltipSuccessBackground: "#4895EF",
    },
    borderRadius: "0",
  },
})
