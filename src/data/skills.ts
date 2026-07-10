// Skill lists shared between server-rendered markup and client scripts.

// The scrolling marquee in section "skills" — one list drives both the
// aria-label (server) and the rendered tags (client), so they can't drift.
export const SKILL_TAGS = [
  'Vue', 'React', 'Angular', 'Nuxt', 'TypeScript', 'Python', 'Django', 'Node', 'WebSockets',
  'Okta', 'Entra ID', 'Active Directory', 'PostgreSQL', 'SQL Server', 'Hasura', 'Redis',
  'Docker', 'Jenkins', 'GitHub Actions', 'DigitalOcean', 'GCP', 'Cloudflare', 'Stripe',
];

// Maps the labels shown in skills.json (and anything a visitor might type,
// case-insensitively) onto the terminal's SKILLS deep-dive keys. Injected from
// the server so the clickable pane and the terminal resolve identically.
// Labels must not contain quote characters.
export const REVEAL_ALIASES: Record<string, string> = {
  'JavaScript/TypeScript': 'frontend',
  'Vue': 'frontend',
  'React': 'frontend',
  'Angular': 'frontend',
  'Nuxt': 'frontend',
  'Python (Django)': 'django',
  'Okta SSO': 'okta',
  'Microsoft Entra ID': 'entra',
  'Active Directory': 'activedirectory',
  'server-to-server token negotiation': 'entra',
  'Founded and led an application development division': 'leadership',
  'SDLC design': 'leadership',
  'technical mentorship': 'leadership',
  'CI/CD (Jenkins, GitHub Actions, Docker)': 'cicd',
  'DigitalOcean': 'cicd',
  'GCP': 'cicd',
  'Cloudflare': 'cicd',
  'PostgreSQL': 'databases',
  'SQL Server': 'databases',
  'Redis': 'databases',
  'Hasura': 'databases',
  'ERP/CRM integration': 'integrations',
  'payments (Stripe)': 'integrations',
  'dispatch/logistics systems': 'mobile',
  'government/public-sector systems': 'leadership',
};
