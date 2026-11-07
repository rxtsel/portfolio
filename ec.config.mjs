import { defineEcConfig } from "astro-expressive-code"

// https://expressive-code.com/reference/configuration/
export default defineEcConfig({
  themes: ["github-light-default", "github-dark-default"],
  themeCssRoot: "html",
  useDarkModeMediaQuery: false,
  themeCssSelector: (theme) => (theme.type === "dark" ? ".dark" : ":root:not(.dark)"),
  styleOverrides: {
    codeBackground: "var(--popover)",
    codeForeground: "var(--foreground)",
    borderColor: "var(--border)",
    borderWidth: "1px",
    uiFontFamily: "var(--font-sans)",
    frames: {
      shadowColor: "transparent",
      editorTabBarBackground: "var(--muted)",
      editorActiveTabBackground: "var(--popover)",
      editorActiveTabForeground: "var(--foreground)",
      editorActiveTabBorderColor: "var(--border)",
      editorActiveTabIndicatorTopColor: "var(--primary)",
      editorActiveTabIndicatorBottomColor: "var(--popover)",
      editorTabBarBorderBottomColor: "var(--border)",
      terminalTitlebarBackground: "var(--muted)",
      terminalTitlebarForeground: "var(--foreground)",
      terminalTitlebarBorderBottomColor: "var(--border)",
      terminalBackground: "var(--popover)",
      tooltipSuccessBackground: "var(--foreground)",
      tooltipSuccessForeground: "var(--background)",
    },
    borderRadius: "0",
  },
})
