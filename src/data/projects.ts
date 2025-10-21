import type { iProject } from '@/types/project'

export const projects: iProject[] = [
  {
    title: 'SoundAdvice',
    description:
      'Desarrollo de landing page. Conectando músicos con mentores de la industria musical y ofreciendo eventos como talleres y retiros.',
    descriptionEn:
      'Landing page for SoundAdvice, connecting musicians with music industry mentors and offering access to events such as workshops and retreats.',
    url: 'https://soundadvice.club/',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'CSS',
      'PostgreSQL',
      'TanStack Query',
      'Supabase'
    ],
    team: [
      {
        username: 'rxtsel',
        role: 'Software Developer'
      },
      {
        username: 'mattypiotrowski',
        url: 'https://mattypiotrowski.com/',
        role: 'UX/UI Designer'
      },
      {
        username: 'aggrey',
        url: 'https://www.linkedin.com/in/aggrey/',
        role: 'Founder'
      },
      {
        username: 'jason-burgos',
        url: 'https://www.linkedin.com/in/jason-burgos/',
        role: 'Founder'
      }
    ]
  },
  {
    title: 'Plataforma de Mentoría',
    titleEn: 'Mentorship Platform',
    description:
      'Desarrollo de plataforma web para conectar a profesionales de la música con mentores expertos para el crecimiento de su carrera.',
    descriptionEn:
      'Development of a web platform connecting music professionals with expert mentors for career growth.',
    url: 'https://app.soundadvice.club/',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'Supabase',
      'PostgreSQL',
      'Azure',
      'CI/CD',
      'GitHub Actions',
      'Playwright',
      'Docker',
      'Drizzle'
    ],
    team: [
      {
        username: 'rxtsel',
        role: 'Software Developer'
      },
      {
        username: 'glanikali',
        role: 'Lead Software Developer'
      },
      {
        username: 'devevangel',
        role: 'Software Developer'
      },
      {
        username: 'aggrey',
        url: 'https://www.linkedin.com/in/aggrey/',
        role: 'Founder'
      },
      {
        username: 'jason-burgos',
        url: 'https://www.linkedin.com/in/jason-burgos/',
        role: 'Founder'
      },
      {
        username: 'jasonlau96',
        url: 'https://www.linkedin.com/in/jasonlau96/',
        role: 'UX Designer'
      },
      {
        username: 'noeliavalle',
        url: 'https://www.linkedin.com/in/noeliavalle/',
        role: 'UX/UI Designer'
      },
      {
        username: 'briannabaysahunt',
        url: 'https://www.linkedin.com/in/briannabaysahunt/',
        role: 'UX Designer'
      },
      {
        username: 'anurgazin',
        role: 'Software Developer'
      }
    ]
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
    technologies: ['Astro', 'CSS']
  },
  {
    title: 'WeAreTop',
    description:
      'Diseño y desarrollo personalizado de sitio web con CMS para consultoría en educación internacional y experiencias académicas.',
    descriptionEn:
      'Custom design and development of a CMS-powered website for an international education consultancy and academic experiences.',
    url: 'https://wearetop.co/',
    technologies: ['Astro', 'Tailwind CSS', 'Figma']
  },
  {
    title: 'JPTradingBots',
    description:
      'Diseño y desarrollo personalizado en WordPress a petición del cliente. Rediseño completo, tema, plugins y sistema e-learning propio.',
    descriptionEn:
      'Custom design and development in WordPress at the client’s request. Full redesign with custom theme, plugins, and e-learning system.',
    url: 'https://jptradingbots.com/',
    technologies: ['WordPress', 'PHP', 'CSS', 'JavaScript', 'MySQL']
  },
  {
    title: 'Las Pretas',
    description:
      'Desarrollo personalizado en WordPress a petición del cliente. Implementación completa del diseño entregado en Figma.',
    descriptionEn:
      'Custom WordPress development at the client’s request. Full implementation of the provided Figma design.',
    url: 'https://laspretas.com/',
    technologies: ['WordPress', 'PHP', 'CSS', 'JavaScript', 'Figma'],
    team: [
      {
        role: 'Designer',
        username: 'chino',
        url: 'https://www.linkedin.com/in/jonathan-jones-8788a057'
      },
      {
        username: 'rxtsel',
        role: 'Developer'
      }
    ]
  },
  {
    title: 'María Alicia Cabrera',
    titleEn: 'Maria Alicia Cabrera',
    description:
      'Website para escritora Colombiana, proporcionándole un panel de control para gestionar toda la información del sitio web.',
    descriptionEn:
      'Website for Colombian writer, providing a control panel to manage all the information on the website.',
    url: 'https://mariaaliciacabrera.com/',
    gh: 'https://github.com/abouthernan/maria-alicia-cabrera',
    technologies: ['Astro', 'CSS', 'Strapi']
  }
]
