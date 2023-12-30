/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        cBlack: '#1A1A1A',
        cWhite: '#F5F5F5',
        cAccent: '#838383',
        cBlue: '#4895EF',
        cRed: '#D14343'
      }
    }
  },
  plugins: []
}
