// The printable one-page resume, composed from the same role data that
// renders the site (see roles.ts). Rendered by components/Resume.astro
// behind @media print.

import { EMAIL } from './identity';
import { roles } from './roles';

export const resume = {
  name: 'Matthew Smith-Burlage',
  title: 'Senior Software Engineer & Systems Architect',
  contact: {
    email: EMAIL,
    github: 'github.com/mattburlage',
    website: 'www.msb.dev',
    location: 'Atlanta, GA, USA (Remote)',
  },
  summary:
    'Senior full-stack engineer with a track record of building and leading enterprise systems from the ground up, including founding a public-sector development division, modernizing legacy platforms, and integrating enterprise identity systems (Okta, Entra ID) for a Fortune 200-scale client. Combines hands-on architecture and feature development with technical leadership: setting stack direction, mentoring developers, and owning delivery, while staying close to the code.',
  skills: {
    'Full-Stack Development': ['JavaScript/TypeScript', 'Vue', 'React', 'Angular', 'Nuxt', 'Python (Django)'],
    'Identity & Access Management': ['Okta SSO', 'Microsoft Entra ID', 'Active Directory', 'server-to-server token negotiation'],
    'Systems Architecture & Leadership': ['Founded and led an application development division', 'SDLC design', 'technical mentorship'],
    'DevOps & Cloud Infrastructure': ['CI/CD (Jenkins, GitHub Actions, Docker)', 'DigitalOcean', 'GCP', 'Cloudflare'],
    'Databases': ['PostgreSQL', 'SQL Server', 'Redis', 'Hasura'],
    'Integration & Domain Systems': ['ERP/CRM integration', 'payments (Stripe)', 'dispatch/logistics systems', 'government/public-sector systems'],
  },
  experience: roles
    .filter((r) => r.priority === 'featured')
    .map((r) => ({ company: r.company, title: r.title, location: r.location, start: r.start, end: r.end, highlights: r.resumeHighlights ?? r.highlights })),
  earlier: roles
    .filter((r) => r.priority === 'compact')
    .map((r) => ({ company: r.company, title: r.title, start: r.start, end: r.end, note: r.highlights[0] })),
  education: [{ degree: 'Bachelor of Science in Computer Science', school: 'University of North Georgia', year: 'Graduated 2020' }],
};

export type Resume = typeof resume;
