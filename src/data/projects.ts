import type { iProject } from '@/types/project'

export const projects: iProject[] = [
  {
    title: 'Corrector Ortográfico IA',
    titleEn: 'AI Spelling Checker',
    description: 'App para corregir errores ortográficos usando IA.',
    descriptionEn: 'App to correct spelling mistakes using AI.',
    url: 'https://spell-check-ai.vercel.app/',
    gh: 'https://github.com/rxtsel/spell-check-ai',
    tags: ['Astro', 'Open IA', 'Tailwind CSS']
  },
  {
    title: 'Cotizador de servicios',
    titleEn: 'Service Quoter',
    description:
      'Diseñado para simplificar y agilizar el proceso de obtener cotizaciones.',
    descriptionEn:
      'Designed to simplify and streamline the process of getting quotes.',
    url: 'https://quoter.vehement.co/',
    tags: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Strapi']
  },
  {
    title: "Gold's Gym",
    description: 'Diseño y desarrollo de landing page para gymnasio.',
    descriptionEn: 'Design and development of landing page for gym.',
    url: 'https://rxtsel.github.io/gold-s-gym/',
    gh: 'https://github.com/rxtsel/gold-s-gym',
    tags: ['Figma', 'Astro', 'CSS']
  },
  {
    title: 'BioLinks',
    description:
      'Mi alternativa a linktree para mostrar enlaces en la biografías de las redes sociales.',
    descriptionEn:
      'My alternative to linktree to show links in social media biographies.',
    url: 'https://links.rxtsel.dev/',
    gh: 'https://github.com/rxtsel/biolink',
    tags: ['HTML', 'CSS', 'JavaScript']
  },
  {
    title: 'LCA Desktop App',
    description:
      'Software de medición de la calidad del agua. Proyecto mintic 2022.',
    descriptionEn: 'Water quality measurement software. Mintic 2022 project.',
    url: 'https://github.com/rxtsel/LCA/releases/tag/v.0.0.1',
    gh: 'https://github.com/rxtsel/LCA/tree/reto-4',
    tags: ['Java', 'SQLite']
  },
  {
    title: 'Administrador de gastos',
    titleEn: 'Expense Manager',
    description:
      'App web para gestionar y llevar el control de nuestro dinero.',
    descriptionEn: 'Web app to manage and keep track of our money.',
    url: 'https://expense-manager-react.netlify.app/',
    gh: 'https://github.com/rxtsel/Expense-control-react',
    tags: ['React', 'CSS']
  }
]
