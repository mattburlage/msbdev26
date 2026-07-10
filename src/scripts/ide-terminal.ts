// The IDE terminal: a real JS console with a small command layer on top.
// Commands are evaluated with new Function, so anything typed is genuine
// JavaScript; window.msb / ls() / open() are the guided surface.

import { reduced } from './prefs';
import { realEmail } from './email';
import { exitIDE } from './ide-mode';
import { FILE_NAMES, openFile } from './ide-files';

interface Skill {
  tag: string;
  text: string;
}

const SKILLS: Record<string, Skill> = {
  okta: { tag: 'auth / SSO', text: 'At Incyte Studios I replaced legacy Django authentication with Okta SSO for client logins: single sign-on for the client portal without disrupting existing users.' },
  entra: { tag: 'identity', text: 'Integrated a client\'s Microsoft Entra ID with Okta for SSO, and separately set up server-to-server Entra token negotiation for machine-to-machine access.' },
  frontend: { tag: 'frontend', text: 'Vue, React, Angular, and Nuxt in production since 2019: government agenda management, a no-code forms platform, and a technician-dispatch web & mobile app all shipped on this stack.' },
  django: { tag: 'backend', text: 'Django sits behind almost everything I have shipped: government agenda workflows, HR position control, form platforms, and REST APIs consumed by web and mobile clients.' },
  databases: { tag: 'data', text: 'PostgreSQL, SQL Server, Hasura, and Redis in production. I also wrote SmartBackup, an open-source PostgreSQL backup manager that automates recurring backups with dynamic consolidation.' },
  leadership: { tag: 'teams', text: 'At Incyte Studios I was the team\'s go-to for novel, ambiguous problems. Before that I founded Hall County\'s Enterprise Application Development division from the ground up and mentored its developers.' },
  mobile: { tag: 'web + mobile', text: 'I solo-modernized a legacy technician-dispatch application across web and mobile: triage, architecture, and shipping features end to end.' },
  activedirectory: { tag: 'identity', text: 'Deep Active Directory automation at Hall County, plus Okta and Entra ID integration at Incyte. Identity and access is a core part of what I do.' },
  cicd: { tag: 'devops', text: 'Installed, configured, and managed CI/CD across development, staging, and production: Docker, Jenkins, and GitHub Actions, with Sentry for error tracking.' },
  automation: { tag: 'philosophy', text: 'My favorite thing to kill is duplicate work. The no-code platform I built lets teams spin up a new form-based app in hours instead of weeks. If a process is done twice, I automate it.' },
  integrations: { tag: 'systems', text: 'Systems talking to systems: a massive Salesforce integration of an internal billing system, ERP inventory and shipment tracking across systems, and payments with Stripe.' },
};

// Maps the labels shown in skills.json (and anything a visitor might type,
// case-insensitively) onto the SKILLS keys above. Injected from the server so
// the clickable pane and the terminal resolve identically.
const REVEAL_LOOKUP: Record<string, string> = {};
Object.entries(window.__SITE__.revealAliases).forEach(([label, key]) => { REVEAL_LOOKUP[label.toLowerCase()] = key; });

function initTerminal() {
  const out = document.getElementById('repl-out');
  const input = document.getElementById('repl-in') as HTMLInputElement | null;
  if (!out || !input) return;

  let lastReveal: string | null = null;
  const history: string[] = [];
  let histIdx = -1;

  const esc = (s: unknown) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

  function print(html: string, cls = 'text-void-200') {
    const line = document.createElement('div');
    line.className = cls + ' whitespace-pre-wrap break-words py-0.5';
    out!.appendChild(line);
    if (reduced) {
      line.innerHTML = html;
      out!.scrollTop = out!.scrollHeight;
    } else {
      // Typewriter reveal: plain text first, the real markup swapped in at the end.
      const tmp = document.createElement('div');
      tmp.innerHTML = html;
      const full = tmp.textContent ?? '';
      let i = 0;
      const step = () => {
        i += 3;
        line.textContent = full.slice(0, i);
        out!.scrollTop = out!.scrollHeight;
        if (i < full.length) requestAnimationFrame(step);
        else { line.innerHTML = html; out!.scrollTop = out!.scrollHeight; }
      };
      step();
    }
  }

  window.msb = {
    ...window.__SITE__.msb,
    skills() { return Object.keys(SKILLS); },
    reveal(skill?: unknown) {
      let k: string | null = null;
      if (skill != null) {
        const q = String(skill).toLowerCase().trim();
        k = SKILLS[q] ? q : REVEAL_LOOKUP[q] || null;
      }
      if (!k) {
        const keys = Object.keys(SKILLS).filter((s) => s !== lastReveal);
        k = keys[Math.floor(Math.random() * keys.length)];
      }
      lastReveal = k;
      print('<b class="text-volt">' + k + '</b> <span class="text-void-500">[' + SKILLS[k].tag + ']</span> ' + esc(SKILLS[k].text));
    },
    experience() { return window.__SITE__.experience; },
    contact() {
      print('<a class="text-volt underline cursor-pointer" href="mailto:' + realEmail + '">' + realEmail + '</a> · <a class="text-volt underline cursor-pointer" target="_blank" rel="noopener" href="https://github.com/mattburlage">github.com/mattburlage</a>');
    },
  };
  window.ls = () => Object.values(FILE_NAMES);

  function resolveFile(f: unknown) {
    return Object.keys(FILE_NAMES).find((k) => FILE_NAMES[k] === f || k === String(f).replace(/\.\w+$/, ''));
  }
  window.openTab = (f) => {
    const id = resolveFile(f);
    if (id) { openFile(id); return FILE_NAMES[id]; }
    throw new Error('openTab(file): try one of ' + Object.values(FILE_NAMES).join(', '));
  };
  // Shadow window.open so open("experience.ts") works in the REPL; real URLs
  // still pass through to the browser via the stashed original.
  window.open_ = window.open;
  window.open = ((f: unknown) => {
    if (typeof f === 'string') {
      const id = resolveFile(f);
      if (id) { openFile(id); return FILE_NAMES[id]; }
      if (/^https?:\/\//.test(f)) return window.open_(f);
    }
    throw new Error('open(file): try one of ' + Object.values(FILE_NAMES).join(', '));
  }) as typeof window.open;

  function format(v: unknown): string {
    if (v === undefined) return '<span class="text-void-500">undefined</span>';
    if (v === null) return '<span class="text-void-500">null</span>';
    if (typeof v === 'string') return '<span class="text-syn-str">\'' + esc(v) + '\'</span>';
    if (typeof v === 'number' || typeof v === 'boolean') return '<span class="text-syn-num">' + v + '</span>';
    if (typeof v === 'function') return '<span class="text-void-400">ƒ ' + esc(v.name || 'anonymous') + '()</span>';
    try { return esc(JSON.stringify(v, null, 1).replace(/\n\s*/g, ' ')); }
    catch { return esc(String(v)); }
  }

  function run(raw: string) {
    const cmd = raw.trim();
    if (!cmd) return;
    print('<span class="text-volt">&gt;</span> <span class="text-void-400">' + esc(cmd) + '</span>', 'text-void-400');
    history.unshift(cmd);
    histIdx = -1;

    const bare = cmd.toLowerCase().replace(/[();\s]/g, '');
    if (bare === 'help' || bare === '?') {
      print('msb.reveal()          <span class="text-void-500">// random deep-dive on a skill</span>');
      print('msb.reveal("okta")    <span class="text-void-500">// a specific one</span>');
      print('msb.experience()      <span class="text-void-500">// work history</span>');
      print('msb.contact()         <span class="text-void-500">// ' + realEmail + ' · github.com/mattburlage</span>');
      print('ls()                        <span class="text-void-500">// list files</span>');
      print('open("experience.ts")       <span class="text-void-500">// open a file in the editor</span>');
      print('exit                      <span class="text-void-500">// back to the normal site</span>');
      print('<span class="text-void-500">...or any JavaScript. This is a real console.</span>', 'text-void-500');
      return;
    }
    if (bare === 'clear' || bare === 'cls') { out!.innerHTML = ''; return; }
    if (bare === 'exit' || bare === 'quit' || bare === 'q') { exitIDE(); return; }

    const fmtArgs = (args: unknown[]) => args.map((a) => typeof a === 'string' ? esc(a) : format(a)).join(' ');
    const replConsole = {
      ...window.console,
      log: (...a: unknown[]) => { window.console.log(...a); print(fmtArgs(a)); },
      info: (...a: unknown[]) => { window.console.info(...a); print(fmtArgs(a)); },
      warn: (...a: unknown[]) => { window.console.warn(...a); print(fmtArgs(a), 'text-yellow-400'); },
      error: (...a: unknown[]) => { window.console.error(...a); print(fmtArgs(a), 'text-red-400'); },
    };
    try {
      const result = new Function('console', '"use strict"; return (' + cmd + ');')(replConsole);
      print(format(result));
    } catch {
      try {
        const result = new Function('console', '"use strict"; ' + cmd)(replConsole);
        print(format(result));
      } catch (e2) {
        const err = e2 as Error;
        print('<span class="text-red-400">' + esc(err.name) + ':</span> ' + esc(err.message), 'text-void-400');
      }
    }
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { run(input.value); input.value = ''; }
    else if (e.key === 'ArrowUp') {
      if (histIdx < history.length - 1) { histIdx++; input.value = history[histIdx]; }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      if (histIdx > 0) { histIdx--; input.value = history[histIdx]; }
      else { histIdx = -1; input.value = ''; }
      e.preventDefault();
    }
  });
  document.querySelectorAll<HTMLElement>('[data-run]').forEach((el) =>
    el.addEventListener('click', () => { run(el.dataset.run!); input.focus(); }));

  print('<span class="text-void-500">Type</span> <b class="text-volt">help</b> <span class="text-void-500">for commands, or</span> <b class="text-volt">exit</b> <span class="text-void-500">to leave.</span>', 'text-void-500');
}

initTerminal();
