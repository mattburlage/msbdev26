// The IDE's file explorer: tree, tabs, editor panes, and the empty state
// (plus its tumbleweed). Pane markup is server-rendered in Ide.astro; this
// module only switches visibility and manages tabs.

export const FILE_NAMES: Record<string, string> = {
  readme: 'README.md', experience: 'experience.ts', projects: 'projects.md',
  skills: 'skills.json', contact: 'contact.sh', rendered: 'index.html',
};
// One file per principle, injected from the same array that renders section 03.
window.__SITE__.principleFiles.forEach((f) => { FILE_NAMES[f.id] = f.name; });

// Empty state: shown whenever every tab is closed. A tumbleweed rolls
// through if that stays true for a while — nobody's expected to see it,
// it's just there for anyone who closes everything and wanders off.
const editorEmpty = document.getElementById('editor-empty')!;
const tumbleweedWrap = document.getElementById('tumbleweed-wrap')!;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const TUMBLEWEED_DELAY = 10000;
let tumbleweedTimer: ReturnType<typeof setTimeout> | null = null;

function showEmptyState() {
  editorEmpty.classList.remove('hidden');
  editorEmpty.classList.add('flex');
  document.getElementById('status-file')!.textContent = window.__SITE__.emptyStateTitle;
  tumbleweedTimer = setTimeout(() => {
    tumbleweedWrap.classList.remove('hidden');
    if (!reduced) tumbleweedWrap.classList.add('rolling');
  }, TUMBLEWEED_DELAY);
}

function hideEmptyState() {
  editorEmpty.classList.add('hidden');
  editorEmpty.classList.remove('flex');
  tumbleweedWrap.classList.add('hidden');
  tumbleweedWrap.classList.remove('rolling');
  if (tumbleweedTimer) clearTimeout(tumbleweedTimer);
}

// Files without an open tab get one appended on first open, like an IDE.
// Each tab is a label (switches to the file) plus a close button.
function ensureTab(id: string) {
  const tabs = document.getElementById('tabs')!;
  if (tabs.querySelector(`.tab[data-file="${id}"]`)) return;
  const name = FILE_NAMES[id].split('/').pop()!;
  const tab = document.createElement('div');
  tab.dataset.file = id;
  tab.setAttribute('role', 'tab');
  tab.className = 'tab group flex items-center gap-2 pl-4 pr-2 py-2 text-xs text-void-400 whitespace-nowrap border-r border-void-700 hover:text-void-200 transition-colors cursor-pointer';
  tab.addEventListener('click', () => openFile(id));

  const label = document.createElement('span');
  label.textContent = name;
  tab.appendChild(label);

  const close = document.createElement('button');
  close.className = 'tab-close shrink-0 w-3.5 h-3.5 flex items-center justify-center rounded-sm text-void-500 opacity-0 group-hover:opacity-100 hover:text-void-100 hover:bg-void-700 transition-colors cursor-pointer';
  close.setAttribute('aria-label', 'Close ' + name);
  close.innerHTML = '<svg width="8" height="8" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13"/></svg>';
  close.addEventListener('click', (e) => { e.stopPropagation(); closeFile(id); });
  tab.appendChild(close);

  tabs.appendChild(tab);
}

function closeFile(id: string) {
  const tabEl = document.querySelector(`#tabs .tab[data-file="${id}"]`);
  if (!tabEl) return;
  const wasActive = tabEl.classList.contains('active');
  const fallback = wasActive ? (tabEl.previousElementSibling || tabEl.nextElementSibling) : null;
  tabEl.remove();
  if (!wasActive) return;
  if (fallback) {
    openFile((fallback as HTMLElement).dataset.file!);
  } else {
    document.querySelectorAll('.file-pane').forEach((p) => p.classList.remove('active'));
    document.querySelectorAll('#tree .tree-item').forEach((el) => el.classList.remove('active'));
    showEmptyState();
  }
}

export function openFile(id: string): boolean {
  if (!FILE_NAMES[id]) return false;
  hideEmptyState();
  ensureTab(id);
  document.querySelectorAll('.file-pane').forEach((p) => p.classList.toggle('active', p.id === 'pane-' + id));
  document.querySelectorAll<HTMLElement>('#tabs .tab, #tree .tree-item').forEach((el) =>
    el.classList.toggle('active', el.dataset.file === id));
  document.getElementById('status-file')!.textContent = FILE_NAMES[id];
  const editor = document.getElementById('editor')!;
  editor.scrollTop = 0;
  editor.scrollLeft = 0;
  // If the file lives in a collapsed tree folder (e.g. opened from the
  // terminal), expand the folder so the highlighted item is visible.
  const treeItem = document.querySelector(`#tree .tree-item[data-file="${id}"]`);
  const folder = treeItem && treeItem.closest('#folder-principles-children');
  if (folder && folder.classList.contains('hidden')) togglePrinciplesFolder();
  return true;
}

function togglePrinciplesFolder() {
  const kids = document.getElementById('folder-principles-children')!;
  const open = !kids.classList.toggle('hidden');
  document.getElementById('folder-principles')!.setAttribute('aria-expanded', String(open));
  document.getElementById('folder-principles-chevron')!.classList.toggle('rotate-90', open);
}

document.getElementById('folder-principles')?.addEventListener('click', togglePrinciplesFolder);
// Tabs bind their own click/close handlers in ensureTab; this only covers the tree.
document.querySelectorAll<HTMLElement>('#tree [data-file]').forEach((el) =>
  el.addEventListener('click', () => openFile(el.dataset.file!)));
document.querySelectorAll<HTMLElement>('[data-open]').forEach((el) =>
  el.addEventListener('click', () => openFile(el.dataset.open!)));

openFile('readme');
