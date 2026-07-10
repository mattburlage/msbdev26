// Builds every syntax-highlighted "code file" string shown in the hero teaser
// window and the IDE's editor panes, from the same data modules that render
// the normal site — one source, everywhere. Also assembles SITE_DATA, the
// object installed as window.__SITE__ for the IDE terminal.

import { EMAIL_FALLBACK, EMPTY_STATE_TITLE, NAME, TITLE } from '../data/identity';
import { systemsCount, integrationsCount } from '../data/builds';
import { featuredRoles, compactRoles } from '../data/roles';
import { principles } from '../data/principles';
import { REVEAL_ALIASES } from '../data/skills';
import { resume } from '../data/resume';
import { hlEsc, kw, st, nm, cm, jkey, jsList } from './highlight';

// The msb object: rendered into the hero code window and installed as
// window.msb in the IDE terminal, so both stay word-for-word.
const msbCore = {
  name: NAME,
  role: TITLE,
  year: 2019,
  frontend: ['Vue', 'React', 'Angular'],
  backend: ['Django', 'Node'],
  db: ['PostgreSQL', 'SQL Server', 'Hasura'],
  securityFirst: true,
  // One count, everywhere: derived from the same `builds` array as section 02.
  systems: systemsCount,
  integrations: integrationsCount,
};

export const heroCode = `${kw('import')} { msb } ${kw('from')} ${st('./career')};

<span class="text-void-100">msb</span>.role;  ${cm('// ' + msbCore.role)}
<span class="text-void-100">msb</span>.year; ${cm('// ' + msbCore.year)}
<span class="text-void-100">msb</span>.frontend; ${cm('// ' + jsList(msbCore.frontend))}
<span class="text-void-100">msb</span>.backend; ${cm('// ' + jsList(msbCore.backend))}
<span class="text-void-100">msb</span>.db; ${cm('// ' + jsList(msbCore.db))}
<span class="text-void-100">msb</span>.contact(); <span class="text-syn-cm">// <span data-email-text>${EMAIL_FALLBACK}</span></span>`;

// IDE-flavored mirror of the hero's stat row (years / systems / integrations),
// as direct assignments rather than the hero's "property; // comment" style —
// these are exact values, not documentation. "years" is time-dependent, so
// it's a placeholder filled client-side by the same computation that
// animates the hero's counter.
export const readmeStatsCode = `<span class="text-void-100">career</span>.years <span class="text-void-500">=</span> <span class="text-syn-num" data-stat="years">–</span>;
<span class="text-void-100">systems</span>.length <span class="text-void-500">=</span> <span class="text-syn-num">${systemsCount}</span>;
<span class="text-void-100">integrations</span>.length <span class="text-void-500">=</span> <span class="text-syn-num">${integrationsCount}</span>;`;

// experience.ts — generated from `roles`, the same array that renders section 01.
const roleIdent = (company: string): string =>
  company.split(/\s+/).map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase())).join('');

export const experienceCode = [
  cm('// experience.ts: the same data that renders the main site'),
  '',
  ...featuredRoles.map((r) => [
    `${kw('export const')} ${roleIdent(r.company)} = {`,
    `  role: ${st(r.title)},`,
    `  year: ${nm(r.start)},`,
    '  highlights: [',
    ...r.highlights.map((h) => `    ${st(h)},`),
    '  ],',
    '};',
    '',
  ].join('\n')),
  `${kw('export const')} earlier = [`,
  ...compactRoles.map((r) => `  { company: ${st(r.company)}, role: ${st(r.title)}, year: ${nm(r.start)} }, ${cm('// ' + r.highlights[0])}`),
  '];',
].join('\n');

// skills.json — generated from resume.skills, the same object that renders the
// print resume. Every mapped skill is a button that runs msb.reveal(...) in the
// terminal; REVEAL_ALIASES translates the visible label to a deep-dive blurb key
// in the terminal's SKILLS registry.
const skillBtn = (label: string): string => REVEAL_ALIASES[label]
  ? `<button data-run='msb.reveal("${label}")' class="text-syn-str underline decoration-dotted decoration-void-500 underline-offset-4 hover:text-volt transition-colors cursor-pointer">"${hlEsc(label)}"</button>`
  : st(label);

export const skillsCode = '{\n'
  + Object.entries(resume.skills).map(([cat, items]) => `  ${jkey(cat)}: [${items.map(skillBtn).join(', ')}],`).join('\n')
  + `\n  ${jkey('education')}: ${st(resume.education[0].degree + ', ' + resume.education[0].school)}\n}`;

// Shared data injected into the client script as window.__SITE__: the IDE
// terminal's window.msb, msb.experience(), and the reveal alias map all come
// from the objects above.
export const SITE_DATA = {
  msb: msbCore,
  experience: featuredRoles.map((r) => ({ company: r.company, role: r.title, year: Number(r.start) })),
  revealAliases: REVEAL_ALIASES,
  principleFiles: principles.map((p) => ({ id: p.slug, name: `principles/${p.slug}.md` })),
  emptyStateTitle: EMPTY_STATE_TITLE,
};

export type SiteData = typeof SITE_DATA;
