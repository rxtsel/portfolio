import { getLangFromUrl, useTranslations } from '@/i18n/utils'

const lang = globalThis.window
  ? getLangFromUrl(new URL(window.location.href))
  : 'es'

const t = useTranslations(lang)

export const ROUTES = {
  home: {
    path: '#top',
    name: t('nav.home')
  },
  portfolio: {
    path: '#portfolio',
    name: t('nav.portfolio')
  },
  aboutMe: {
    path: '#about-me',
    name: t('nav.about')
  },
  blog: {
    path: '/blog',
    name: 'Blog'
  }
}

export type TIconRoutes = keyof typeof ROUTES

export const SOCIALS = {
  github: 'https://github.com/rxtsel',
  linkedin: 'https://www.linkedin.com/in/rxtsel/',
  twitter: 'https://twitter.com/rxtsel',
  tiktok: 'https://www.tiktok.com/@rxtsel',
  whatsapp:
    'https://api.whatsapp.com/send?phone=573142216604&text=%C2%A1Hola,%20Cristhian!%20%C2%BFC%C3%B3mo%20est%C3%A1s?',
  email: 'mailto:contact@rxtsel.dev'
}
