import type { iProject } from '@/types/project'

export const works: iProject[] = [
  {
    title: 'Novadeha React.js',
    description:
      'Diseño y desarrollo de sitio web con react por elección del cliente.',
    descriptionEn:
      'Design and development of website with react by client choice.',
    url: 'https://reactjs.agency/',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'CSS', 'Inertia.js']
  },
  {
    title: 'Qantto.io',
    description: 'Landing page para cotizador de servicios online.',
    descriptionEn: 'Landing page for quote services online.',
    url: 'https://qantto.io/',
    gh: 'https://github.com/abouthernan/qantto',
    tags: ['Astro', 'TypeScript', 'Tailwind CSS', 'Figma', 'React']
  },
  {
    title: 'Qantto Dashboard',
    description: 'Panel de control para gestionar los servicios de Qantto.io.',
    descriptionEn: 'Dashboard to manage Qantto.io services.',
    url: 'https://app.qantto.io/',
    tags: [
      'Next.js',
      'TypeScript',
      'MUI',
      'Django',
      'PostgreSQL',
      'AWS',
      'Stripe',
      'Redis'
    ],
    team: ['rxtsel', 'DongnutLa', 'andergcp', 'AlejoCasti']
  },
  {
    title: 'Isarte Portafolio',
    titleEn: 'Isart Portfolio',
    description:
      'Descubre la trayectoria, obras, exposiciones y premios de una artista colombiana.',
    descriptionEn:
      'Discover the trajectory, works, exhibitions and awards of a Colombian artist.',
    url: 'https://isabelrengifo.art/',
    gh: 'https://github.com/abouthernan/isarte',
    tags: ['Astro', 'CSS']
  },
  {
    title: 'Agencia Vehement',
    titleEn: 'Vehement Agency',
    description: 'Diseño y desarrollo de sitio web para agencia.',
    descriptionEn: 'Design and development of website for agency.',
    url: 'https://vehement.co/',
    gh: 'https://github.com/abouthernan/vehement',
    tags: ['Astro', 'CSS', 'Figma', 'React']
  },
  {
    title: 'María Alicia Cabrera',
    description:
      'Website para escritora Colombiana, proporcionándole un panel de control para gestionar toda la información del sitio web.',
    descriptionEn:
      'Website for Colombian writer, providing a control panel to manage all the information on the website.',
    url: 'https://mariaaliciacabrera.com/',
    gh: 'https://github.com/abouthernan/maria-alicia-cabrera',
    tags: ['Astro', 'CSS', 'Strapi']
  }
]
