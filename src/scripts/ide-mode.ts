// Dev-mode toggle: the full-screen IDE overlay. Entered via any [data-ide-open]
// button, the '.' key, or arriving with #ide / a saved preference; left via
// [data-ide-close], Esc, or the terminal's exit command.

import { reduced } from './prefs';

const body = document.body;

export function enterIDE() {
  body.classList.add('ide-mode');
  localStorage.setItem('msb-mode', 'ide');
  setTimeout(() => document.getElementById('repl-in')?.focus(), reduced ? 0 : 550);
}

export function exitIDE() {
  body.classList.remove('ide-mode');
  localStorage.setItem('msb-mode', 'site');
}

document.querySelectorAll('[data-ide-open]').forEach((el) => el.addEventListener('click', enterIDE));
document.querySelectorAll('[data-ide-close]').forEach((el) => el.addEventListener('click', exitIDE));

window.addEventListener('keydown', (e) => {
  const tag = (document.activeElement as HTMLElement | null)?.tagName;
  if (e.key === '.' && !e.ctrlKey && !e.metaKey && !e.altKey && tag !== 'INPUT' && tag !== 'TEXTAREA') {
    body.classList.contains('ide-mode') ? exitIDE() : enterIDE();
    e.preventDefault();
  }
  if (e.key === 'Escape' && body.classList.contains('ide-mode')) exitIDE();
});

// Arriving from another page's "dev mode" link (e.g. /#ide from the blog nav)
if (localStorage.getItem('msb-mode') === 'ide' || location.hash === '#ide') enterIDE();
