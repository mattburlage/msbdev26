// Single source of truth for "things I've built" — drives the hero bento cards
// (name + sub), section 02, and the IDE projects pane (name + sub + content).

export interface Build {
  type: 'system' | 'integration';
  name: string;
  sub: string;
  /** Longer description; empty string = card renders without body copy. */
  content: string;
}

export const builds: Build[] = [
  { type: 'system', name: 'Position Control', sub: 'Employee Paperwork Automation', content: 'Budgeted positions, employee records, and labor-budget forecasting for HR and Finance.' },
  { type: 'system', name: 'IT Access Management', sub: 'Onboarding Automation w/ Active Directory', content: 'Automates employee access provisioning and onboarding through Active Directory.' },
  { type: 'system', name: 'Agenda Publishing', sub: 'Data collection, document creation and publishing', content: 'Meeting workflows for local governments: data collection, document generation, and publishing.' },
  { type: 'system', name: 'Technician Dispatch', sub: 'Safety and qualification management', content: 'A technician-dispatch platform across web and mobile that I solo-modernized, with safety and qualification checks before dispatch.' },
  { type: 'system', name: 'Service Orders & ERP', sub: 'Enterprise-scale order and asset tracking', content: 'Order and asset tracking built to handle enterprise volume.' },
  { type: 'system', name: 'Request for Proposals', sub: 'Handle requirements for public bids', content: 'Manages requirements and submissions for public procurement bids.' },
  { type: 'system', name: 'Video Production Suite', sub: 'Automated video editing and organization', content: 'Automates video editing and asset organization across the production pipeline.' },
  { type: 'system', name: 'Incident Management', sub: 'Maintain incident records and signatures', content: 'Maintains incident records and captures the sign-offs and signatures that go with them.' },
  { type: 'system', name: 'Time & Attendance', sub: 'Custom Attendance mechanism made simple', content: 'A custom time-and-attendance system that keeps tracking simple for staff.' },
  { type: 'system', name: 'Financial Records', sub: 'Recurring expenses, linked to each employee', content: 'Tracks recurring expenses and financial records linked to each employee.' },
  { type: 'system', name: 'Invoice Lifecycle Management', sub: 'Coordination between billing and ERP systems', content: 'Coordinates the invoice lifecycle between billing and ERP systems.' },
  { type: 'system', name: 'Contract Lifecycle Management', sub: 'Track contracts and renewals', content: 'Tracks contracts through their full lifecycle, including renewals.' },
  { type: 'integration', name: 'Okta integration', sub: 'Moved away from local auth to SSO', content: '' },
  { type: 'integration', name: 'Entra Server to Server', sub: 'Secure integration between systems', content: '' },
  { type: 'integration', name: 'Technician Risk Management', sub: 'Check Training system before dispatching', content: '' },
  { type: 'integration', name: 'Salesforce', sub: 'Massive integration of internal billing system', content: '' },
  { type: 'integration', name: 'Enterprise Resource Planning', sub: 'Track inventory and shipments across systems', content: '' },
  { type: 'integration', name: 'Video Post Production', sub: 'Automate graphics, footage organization', content: '' },
  { type: 'integration', name: 'Employee Onboarding', sub: 'Automatically create and provision new accounts', content: '' },
];

export const systemsCount = builds.filter((b) => b.type === 'system').length;
export const integrationsCount = builds.filter((b) => b.type === 'integration').length;

// Lightweight projection injected into the client-side bento script (name + sub only).
export const bento = {
  all: builds.map((b) => ({ name: b.name, sub: b.sub })),
  systems: builds.filter((b) => b.type === 'system').map((b) => ({ name: b.name, sub: b.sub })),
  integrations: builds.filter((b) => b.type === 'integration').map((b) => ({ name: b.name, sub: b.sub })),
};

export type BentoData = typeof bento;
