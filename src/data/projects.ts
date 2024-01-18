import type { iProject } from '@/types/project'

export const projects: iProject[] = [
  {
    title: 'Corrector Ortográfico IA',
    description: 'App para corregir errores ortográficos usando IA.',
    url: 'https://spell-check-ai.vercel.app/',
    gh: 'https://github.com/rxtsel/spell-check-ai',
    tags: ['Astro', 'Open IA', 'Tailwind CSS']
  },
  {
    title: 'Cotizador de servicios',
    description:
      'Diseñado para simplificar y agilizar el proceso de obtener cotizaciones.',
    url: 'https://quoter.vehement.co/',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Strapi']
  },
  {
    title: "Gold's Gym",
    description: 'Diseño y desarrollo de landing page para gymnasio.',
    url: 'https://rxtsel.github.io/gold-s-gym/',
    gh: 'https://github.com/rxtsel/gold-s-gym',
    tags: ['Figma', 'Astro', 'CSS']
  },
  {
    title: 'BioLinks',
    description:
      'Mi alternativa a linktree para mostrar enlaces en la biografías de las redes sociales.',
    url: 'https://links.rxtsel.dev/',
    gh: 'https://github.com/rxtsel/biolink',
    tags: ['HTML', 'CSS', 'JavaScript']
  },
  {
    title: 'LCA Desktop App',
    description:
      'Software de medición de la calidad del agua. Proyecto mintic 2022.',
    url: 'https://github.com/rxtsel/LCA/releases/tag/v.0.0.1',
    gh: 'https://github.com/rxtsel/LCA/tree/reto-4',
    tags: ['Java', 'SQLite']
  },
  {
    title: 'Administrador de gastos',
    description:
      'App web para gestionar y llevar el control de nuestro dinero.',
    url: 'https://expense-manager-react.netlify.app/',
    gh: 'https://github.com/rxtsel/Expense-control-react',
    tags: ['Java', 'SQLite']
  }
]
