import type { iProject } from '@/types/project'

export const projects: iProject[] = [
  {
    title: 'SoundAdvice Landing Page',
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
    title: 'SoundAdvice Mentorship Platform',
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
    title: 'Novadeha React.js',
    description:
      'Diseño y desarrollo de sitio web con react por elección del cliente.',
    descriptionEn:
      'Design and development of website with react by client choice.',
    url: 'https://reactjs.agency/',
    technologies: ['React', 'TypeScript', 'Tailwind CSS', 'CSS', 'Inertia.js']
  },
  {
    title: 'Qantto Dashboard',
    description: 'Panel de control para gestionar los servicios de Qantto.io.',
    descriptionEn: 'Dashboard to manage Qantto.io services.',
    url: 'https://app.cuantto.io/',
    technologies: [
      'Next.js',
      'TypeScript',
      'MUI',
      'Django',
      'PostgreSQL',
      'AWS',
      'Stripe',
      'Redis'
    ],
    team: [
      {
        username: 'rxtsel',
        role: 'Front-end Developer'
      },
      {
        username: 'DongnutLa',
        role: 'Front-end Developer'
      },
      {
        username: 'andergcp',
        role: 'Back-end Developer'
      },
      {
        username: 'AlejoCasti',
        role: 'Back-end Developer'
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
    title: 'Agencia Vehement',
    titleEn: 'Vehement Agency',
    description: 'Diseño y desarrollo de sitio web para agencia.',
    descriptionEn: 'Design and development of website for agency.',
    url: 'https://vehement.co/',
    gh: 'https://github.com/abouthernan/vehement',
    technologies: ['Astro', 'CSS', 'Figma', 'React']
  },
  {
    title: 'María Alicia Cabrera',
    description:
      'Website para escritora Colombiana, proporcionándole un panel de control para gestionar toda la información del sitio web.',
    descriptionEn:
      'Website for Colombian writer, providing a control panel to manage all the information on the website.',
    url: 'https://mariaaliciacabrera.com/',
    gh: 'https://github.com/abouthernan/maria-alicia-cabrera',
    technologies: ['Astro', 'CSS', 'Strapi']
  }
]
