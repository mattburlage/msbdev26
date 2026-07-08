# Personal Site Copy — Coordination Doc

<!-- Read this before writing or editing any professional/bio/experience copy on this site (index page, about section, resume/experience blocks, project descriptions that reference client work). Agent-agnostic: applies whether the session is Claude Code or Devin. -->

## Source of Truth

The verified, fact-checked professional profile lives in a sibling repo: `../ai-job-search` (absolute: `/Users/matt/Repositories/Personal/ai-job-search`). That repo is Matthew's job-application workspace, and its profile was built through an extensive interview process that specifically corrected several inaccurate or over-specific claims that had drifted into earlier drafts of this site. Key files there, if deeper detail is ever needed:
- `CLAUDE.md` — condensed profile + a "Job Search Context" section
- `.claude/skills/job-application-assistant/01-candidate-profile.md` — full detailed profile
- `.claude/skills/job-application-assistant/02-behavioral-profile.md` — working style
- `.claude/skills/job-application-assistant/07-interview-prep.md` — has an "Internal Context (Not for CV/Cover Letters)" section with background on sensitive items (see Confidentiality Rules below)

**This document is the copy-ready translation of that profile for site use. Treat it as current; if the two ever disagree, the ai-job-search repo is authoritative and this file should be updated to match.**

## Corrections Needed to Existing Copy

The current homepage and `old-index.html.bak`/`old-sk.html.bak` (uncommitted backups of the pre-Astro site) were a structure/look-and-feel pass — the language in them was never vetted and should **not** be treated as accurate or reused as-is. Specific fixes:

1. **"Second in command for a team of five devs at Incyte Studios"** — inaccurate, already identified and walked back during CV work. Matthew was not confident this was a fair characterization of his actual authority. Replace with something like: *"the team's go-to for novel, ambiguous problems"* or *"trusted with the team's hardest, least-defined problems."*
2. **"Knowledge Integration" / "Fortune 100"** (from `old-sk.html.bak`) — too specific. The verified-safe framing is generic: *"a mission-critical equipment-tracking system for a Fortune 200 client"* (note: **200**, not 100 — this was corrected during profile-building). Do not name the client, the internal system name, the industry (oil field), or specific dollar figures — see Confidentiality Rules.
3. **Headline "SENIOR SOFTWARE ENGINEER & Team Leader"** and tagline **"I build secure software and lead teams that ship it"** — overweights people-management. Matthew's corrected positioning is hands-on development and architecture *with some* leadership, not the reverse (see "Positioning" below). Consider recasting toward architecture/technical-leadership language rather than "Team Leader."
4. **Hall County title inconsistency** — old copy says "Senior Software Developer"; the verified title is **Senior Applications Developer**. Use the verified title.
5. **Active Directory automation at Hall County** — this specific detail from the old copy (*"deep Active Directory automation at Hall County"*) is accurate and consistent with Matthew's verified IAM skill set (Okta, Entra ID, Active Directory) — fine to keep/reuse, just wasn't captured explicitly in the ai-job-search profile until now.

## Verified Professional Narrative

### Identity
- **Name:** Matthew Smith-Burlage
- **Based in:** Atlanta, GA (works remote)
- **Contact:** matt@msb.dev · github.com/mattburlage

### Positioning
Senior full-stack engineer who combines hands-on architecture and feature development with technical leadership — not a people-manager-first profile. Founded and built a public-sector development division from the ground up, modernized legacy platforms, and has real depth in enterprise identity integration (Okta, Entra ID, Active Directory). Genuinely excited by architecture/design work and hard technical problems — this should come through more than "manages teams."

### Experience (accurate, in order)

**Senior Applications Developer — Hall County Government** (2019–Present, remote since 2021)
- Founded and built the Enterprise Application Development division from the ground up
- Led development of mission-critical systems spanning Agenda Management, Personnel, Fleet, Finance, Policies, and IT Access automation
- Implemented a no-code CRUD application platform, adopted for building additional applications across county departments
- Developed the division's full SDLC from scratch, including tools, design paradigms, methodology, and stack decisions
- Managed and mentored non-senior developers; owned CI/CD across dev, staging, and production
- Deep Active Directory automation work

**Senior Software Engineer — Incyte Studios** (2021–2026)
- Contributed to a mission-critical equipment-tracking system for a Fortune 200 client (do not name client, system, or industry — see Confidentiality Rules)
- The team's go-to for novel, ambiguous problems (not "second in command")
- Solo-modernized a related legacy technician-dispatch web & mobile application
- Replaced legacy local Django authentication with Okta SSO for client logins
- Integrated a client's Entra ID with Okta for SSO; separately set up server-to-server Entra token negotiations
- Implemented a driver safety system integrated with company-wide training tracking
- Stack: Angular, Django, Vue, Nuxt, Hasura, React

**Freelance Video Production** (2025–Present)
- Freelance pipeline work: pre-production, shoot day, post-production, publishing

### Technical Skills
- **Frontend:** Vue, React, Angular, Nuxt, JavaScript/TypeScript
- **Backend:** Python (Django), WebSockets
- **Identity/IAM:** Okta SSO, Microsoft Entra ID, Active Directory, server-to-server token negotiation
- **Databases:** PostgreSQL, SQL Server, Hasura, Redis
- **DevOps/Infra:** Docker, Jenkins, GitHub Actions, DigitalOcean, GCP, Cloudflare
- **Also:** Swift (legacy iOS, some macOS), payments integration (Stripe), video encoding (Bunny.net)

## Confidentiality Rules (apply to ALL public copy — stricter than a CV)

A CV goes to one employer at a time; this site is visible to everyone, permanently, including Matthew's current employer and colleagues. Treat these as hard rules, not style preferences:
- Never name the Incyte client, the internal system name, or the industry (oil field/equipment). Use only: "a mission-critical equipment-tracking system for a Fortune 200 client."
- Never state or imply a specific transaction/dollar figure for that system.
- Do not use "second in command" or any specific claim of formal authority over the Incyte team that Matthew wasn't confident about — "go-to for novel problems" is the accurate framing.

## Open Judgment Calls (need Matthew's sign-off, not yet decided)

1. **Should the site signal "open to work" / actively job-searching at all?** The CV strategy was "list current employment honestly, don't volunteer intent to hold two jobs." A public site has no audience control — Hall County colleagues, current employer, and future employers all see the same page. Recommendation: keep this site as a straightforward professional/portfolio presence with no explicit "available for hire" banner or job-search framing; let CVs/cover letters/LinkedIn carry that signal instead, since those have some audience control and this site doesn't.
2. **Should Studio 5 Software (Matthew's own company — no-code CRUD platform + video production pipeline) be shown openly as a personal project?** The CV deliberately folds this into the Hall County/freelance-video entries rather than presenting it as "Founder," to avoid divided-attention concerns with a prospective single employer reviewing one application. A personal portfolio site is a different context — visitors expect to see side projects/ventures, and this is normal, not a red flag, in that setting. Recommendation: fine to list as a personal project here even though the CV downplays it, but confirm with Matthew before publishing since it's a deliberate divergence from the CV's treatment.

## Other Content on the Old Site (not verified against the job-search profile — personal/portfolio projects, not employment claims, no accuracy concerns raised)
- Open-source Django + React scaffolding (DRF, JWT, CORS)
- PostgreSQL backup automation tool
- Real-time scoreboard for the card game Nertz
- Restaurant delivery/pickup ordering app with Stripe payments
- A government meeting-workflow app and a dynamic form-building platform (may overlap with the Hall County CRUD platform / Agenda Management work above — worth checking for duplication when copy is rewritten)
