/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cBlack: '#1A1A1A',
        cPaper: '#1d1d1d',
        cWhite: '#F5F5F5',
        cAccent: '#838383',
        cBlue: '#4895EF',
        cRed: '#D14343'
      },
      fontSize: {
        xxs: '10px'
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
