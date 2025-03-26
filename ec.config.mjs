import { defineEcConfig, lighten } from 'astro-expressive-code'

// https://expressive-code.com/reference/configuration/
export default defineEcConfig({
  themes: ['github-dark', 'github-light'],
  themeCssRoot: 'html',
  useDarkModeMediaQuery: true,
  themeCssSelector: (theme) => {
    return `.${theme.name}, [data-theme="${theme.name}"]`
  },
  styleOverrides: {
    frames: {
      shadowColor: 'transparent',
      editorBackground: 'transparent',
      terminalBackground: 'inherit',
      terminalTitlebarBackground: 'inherit',
      tooltipSuccessBackground: '#4895EF',
      editorTabBarBackground: 'transparent',
      terminalBorder: 'transparent'
    },
    borderColor: ({ theme }) =>
      lighten(
        theme.colors['editor.background'],
        theme.type === 'dark' ? 0.1 : -0.15
      ),
    borderRadius: '0.375rem'
  }
})
