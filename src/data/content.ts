export const profile = {
  name: 'Chandu Thani',
  role: 'Full-Stack Software Engineer',
  location: 'Hyderabad, India',
  email: 'chanduthani40@gmail.com',
  linkedin: 'https://www.linkedin.com/in/chanduthani/',
  instagram: 'https://www.instagram.com/chanduthani/',
  financeApp: 'https://portfolio.chandu-thani.com/',
}

export const roles = [
  'Full-stack engineer',
  'Industrial data wrangler',
  'API architect',
  'Gymnast in progress',
  'Weekend runner',
]

export const heroStats = [
  { value: 3, suffix: '+', label: 'Years shipping' },
  { value: 40, suffix: '%', label: 'Faster app bootstrap' },
  { value: 8, suffix: '', label: 'Engineers’ worth of app, owned' },
]

export const skillGroups = [
  { title: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'PHP'] },
  { title: 'Backend', items: ['NestJS', 'Node.js', 'Django', 'FastAPI', 'Laravel', 'REST', 'WebSockets', 'TypeORM'] },
  { title: 'Frontend', items: ['React', 'Angular', 'HTML5', 'CSS3', 'Tailwind'] },
  { title: 'Data', items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Query Tuning'] },
  { title: 'Cloud & Ops', items: ['AWS EC2', 'S3', 'RDS', 'GitHub Actions', 'CI/CD', 'Git'] },
  { title: 'Security', items: ['JWT', 'OAuth2', 'RBAC', 'bcrypt', 'Stripe', 'Gmail API'] },
]

/** Labels shown on the 3D skill sphere. */
export const orbitSkills = [
  'React', 'TypeScript', 'NestJS', 'Node.js', 'PostgreSQL', 'Python', 'Angular', 'AWS',
  'Django', 'FastAPI', 'MySQL', 'Redis', 'MongoDB', 'JWT', 'OAuth2', 'Laravel',
  'Tailwind', 'TypeORM', 'Stripe', 'CI/CD', 'WebSockets', 'REST', 'SQL', 'Git',
]

export const experience = [
  {
    period: 'Jul 2023 — Now',
    title: 'Software Engineer',
    org: 'Divami Design Labs · Hyderabad',
    blurb: 'Full-stack on production systems, from PLC sensors to dashboards.',
    projects: [
      {
        name: 'LFC Manufacturing Analytics Platform',
        stack: 'Angular · NestJS · Django · PostgreSQL · AWS',
        points: [
          'Took end-to-end ownership of a production app previously run by a team of eight engineers.',
          'Built NestJS APIs and data workflows for PLC data — production quantities, machine speed, power, downtime and OEE.',
          'Tuned PostgreSQL queries and data-access patterns for high-frequency sensor data.',
          'Shipped Angular dashboards, and helped move the client from manual entry to automated machine-driven collection.',
        ],
      },
      {
        name: 'NestJS Core Platform Accelerators',
        stack: 'NestJS · TypeORM · JWT · Stripe',
        points: [
          'Designed reusable backend templates: JWT auth, RBAC, scheduled jobs, Stripe payments.',
          'Cut application bootstrap time by more than 40%.',
        ],
      },
      {
        name: 'Action Log Platform',
        stack: 'PHP · Laravel · MySQL',
        points: ['REST APIs and sync workflows for a meeting & action-item app across web, Android and iOS.'],
      },
    ],
  },
  {
    period: 'Jan — Jun 2023',
    title: 'Software Engineering Intern',
    org: 'Divami Design Labs',
    blurb: 'Where it started: React, Angular, NestJS, migrations and a lot of debugging.',
    projects: [],
  },
]

export const projects = [
  {
    index: '01',
    name: 'Personal Finance Automation',
    kind: 'Side project · Live',
    desc: 'Reads bank-alert emails through Gmail OAuth2, parses transactions with regex and PDF statements with pdf.js, then turns them into spending dashboards.',
    tags: ['React', 'NestJS', 'PostgreSQL', 'Gmail API', 'OAuth2'],
    metrics: ['10-table schema', '25+ endpoints', '8 modules'],
    href: profile.financeApp,
    hue: '#d6ff3f',
  },
  {
    index: '02',
    name: 'LFC Manufacturing Analytics',
    kind: 'Production · Divami',
    desc: 'Real-time machine-sensor analytics for a factory floor: OEE, downtime, power and speed, in dashboards operators and management actually use.',
    tags: ['Angular', 'NestJS', 'Django', 'PostgreSQL', 'AWS'],
    metrics: ['PLC data', 'High-frequency', 'OEE'],
    hue: '#ff5a36',
  },
  {
    index: '03',
    name: 'NestJS Core Accelerators',
    kind: 'Internal platform',
    desc: 'A modular backend starter that ships auth, roles, cron jobs and payments out of the box, so new enterprise apps start at feature one.',
    tags: ['NestJS', 'TypeORM', 'JWT', 'Stripe'],
    metrics: ['40%+ faster bootstrap', 'RBAC', 'Stripe'],
    hue: '#7a5cff',
  },
  {
    index: '04',
    name: 'Action Log',
    kind: 'Cross-platform app',
    desc: 'Backend for a meeting and action-management product that keeps web, Android and iOS clients in sync.',
    tags: ['PHP', 'Laravel', 'MySQL', 'REST'],
    metrics: ['3 clients', 'Data sync'],
    hue: '#38d9ff',
  },
]

export type LifeTile = {
  key: string
  tag: string
  title: string
  note: string
  img?: string
  pos?: string
}

/** Every tile renders at the same size. `run` and `ig` are custom tiles. */
export const life: LifeTile[] = [
  { key: 'gym', tag: 'Gym', title: 'Iron therapy', note: 'Daily iron. Sweat is the commit message.', img: '/photos/gym.jpg', pos: '50% 30%' },
  { key: 'rope', tag: 'Gymnastics', title: 'Upside-down', note: 'Upside-down is just another viewport.', img: '/photos/rope.jpg', pos: '50% 78%' },
  { key: 'cliff', tag: 'Gymnastics', title: 'Grip strength', note: 'Hanging from the edge of the world.', img: '/photos/cliff.jpg', pos: '50% 45%' },
  { key: 'run', tag: 'Running', title: 'Evening 10K', note: 'Hyderabad · Osman Sagar side' },
  { key: 'jump', tag: 'Travel', title: 'Above the clouds', note: 'The best deploy target.', img: '/photos/jump.jpg', pos: '42% 50%' },
  { key: 'sunset', tag: 'Travel', title: 'Golden ridgelines', note: 'Chasing the last light up a hill.', img: '/photos/sunset.jpg', pos: '50% 60%' },
  { key: 'ruins', tag: 'Travel', title: 'Ancient stones', note: 'Wandering through centuries-old ruins.', img: '/photos/ruins.jpg', pos: '50% 50%' },
  { key: 'ig', tag: 'Instagram', title: 'More on the gram', note: '@chanduthani' },
]

export const runStats = [
  { value: '10.0', unit: 'km', label: 'Distance' },
  { value: '1:16:28', unit: '', label: 'Time' },
  { value: '7′38″', unit: '/km', label: 'Avg pace' },
  { value: '548', unit: 'm', label: 'Elevation' },
]
