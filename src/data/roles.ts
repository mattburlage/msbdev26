// Career data shared by the portfolio (section 01), the IDE's experience.ts
// pane, and the printable resume.

export interface Role {
  company: string;
  title: string;
  location: string;
  start: string;
  end: string;
  /** 'featured' roles get full cards + resume entries; 'compact' get one-liners. */
  priority: 'featured' | 'compact';
  highlights: string[];
  /** Condensed set used by the one-page print resume (featured roles only). */
  resumeHighlights?: string[];
}

export const roles: Role[] = [
  {
    company: 'Hall County Government',
    title: 'Senior Applications Developer',
    location: 'Atlanta, GA (Remote since 2021)',
    start: '2019',
    end: 'Present',
    priority: 'featured',
    highlights: [
      'Founded and built the Enterprise Application Development division from the ground up.',
      'Led development of mission-critical systems spanning Agenda Management, Personnel, Fleet, Finance, Policies, and IT Access automation, including deep Active Directory automation.',
      'Implemented a no-code CRUD application platform, adopted for building additional applications across county departments.',
      "Developed the division's full SDLC from scratch, including foundational decisions on tools, design paradigms, methodology, and stack.",
      'Managed and mentored non-senior developers toward business and career goals.',
      'Owned timelines, goals, and sprints for scrum development.',
      'Installed, configured, and managed CI/CD across dev, staging, and production.',
      "Introduced GitHub Copilot into the division's engineering workflow and established internal guidelines for responsible AI use in a government context.",
    ],
    resumeHighlights: [
      'Founded and built the Enterprise Application Development division from the ground up.',
      'Led development of mission-critical systems spanning Agenda Management, Personnel, Fleet, Finance, Policies, and IT Access automation, including deep Active Directory automation.',
      'Implemented a no-code CRUD application platform, adopted for building additional applications across county departments.',
      "Developed the division's full SDLC from scratch; owned timelines, goals, and sprints for scrum development.",
      'Managed and mentored non-senior developers toward business and career goals.',
      'Installed, configured, and managed CI/CD across dev, staging, and production.',
    ],
  },
  {
    company: 'Incyte Studios',
    title: 'Senior Software Engineer',
    location: '',
    start: '2021',
    end: '2026',
    priority: 'featured',
    highlights: [
      'Contributed to a mission-critical equipment-tracking system for a Fortune 200 client.',
      'Key contributor to an asset-tracking initiative within that system.',
      'Go-to developer for the team lead on a 5-person internal team, frequently assigned novel/ambiguous problems.',
      'Solo-modernized a related legacy Technician Dispatch web & mobile application.',
      'Replaced legacy local Django authentication with Okta SSO for client logins.',
      "Integrated a client's Entra ID with Okta for SSO.",
      'Set up server-to-server Entra token negotiations.',
      'Implemented a driver safety system integrated with company-wide training tracking.',
    ],
    resumeHighlights: [
      'Contributed to a mission-critical equipment-tracking system for a Fortune 200 client; key contributor to an asset-tracking initiative within that system.',
      'Go-to developer for the team lead on a 5-person internal team, frequently assigned novel/ambiguous problems.',
      'Solo-modernized a related legacy Technician Dispatch web & mobile application.',
      "Replaced legacy local Django authentication with Okta SSO for client logins; integrated a client's Entra ID with Okta and set up server-to-server Entra token negotiations.",
      'Implemented a driver safety system integrated with company-wide training tracking.',
    ],
  },
  {
    company: 'Hall County Government',
    title: 'PC Technician',
    location: 'Atlanta, GA',
    start: '2017',
    end: '2019',
    priority: 'compact',
    highlights: ['Hardware and software support for county systems.'],
  },
  {
    company: 'Geek Squad',
    title: 'Advanced Repair Agent',
    location: '',
    start: '2013',
    end: '2017',
    priority: 'compact',
    highlights: ['Repaired computers and consumer electronics.'],
  },
  {
    company: 'French Woods Festival',
    title: 'Stage Manager, Magic Department',
    location: '',
    start: '2007',
    end: '2013',
    priority: 'compact',
    highlights: ['Managed a theater, taught kids to cut each other in half.'],
  },
];

export const featuredRoles = roles.filter((r) => r.priority === 'featured');
export const compactRoles = roles.filter((r) => r.priority === 'compact');
