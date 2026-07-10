// Drag-to-resize for the IDE sidebar and terminal, with arrow-key nudging for
// keyboard users and persistence across visits.

interface ResizerOptions {
  handle: HTMLElement | null;
  target: HTMLElement | null;
  axis: 'x' | 'y';
  prop: 'width' | 'height';
  min: number;
  max: () => number;
  storageKey: string;
  /** [grow, shrink] arrow keys for keyboard resizing. */
  growKeys: [string, string];
}

function makeResizer({ handle, target, axis, prop, min, max, storageKey, growKeys }: ResizerOptions) {
  if (!handle || !target) return;
  const clamp = (v: number) => Math.min(max(), Math.max(min, v));
  const dim = axis === 'x' ? 'width' : 'height';
  const point = axis === 'x' ? 'clientX' : 'clientY';

  const stored = parseInt(localStorage.getItem(storageKey) ?? '', 10);
  if (!Number.isNaN(stored)) target.style[prop] = clamp(stored) + 'px';

  let startPos = 0, startSize = 0, dragging = false;
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    const delta = (axis === 'x' ? 1 : -1) * (e[point] - startPos);
    target.style[prop] = clamp(startSize + delta) + 'px';
  };
  const onUp = () => {
    if (!dragging) return;
    dragging = false;
    // Same token as the hover state (bg-syn-fn/25) at higher opacity — toggled in JS
    // rather than via CSS :active, since :active drops the instant the pointer
    // leaves the 6px strip mid-drag.
    handle.classList.remove('bg-syn-fn/40');
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
    localStorage.setItem(storageKey, String(parseInt(target.style[prop], 10)));
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
  };
  handle.addEventListener('pointerdown', (e) => {
    dragging = true;
    handle.classList.add('bg-syn-fn/40');
    startPos = e[point];
    startSize = target.getBoundingClientRect()[dim];
    document.body.style.userSelect = 'none';
    document.body.style.cursor = axis === 'x' ? 'col-resize' : 'row-resize';
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    e.preventDefault();
  });
  // Arrow-key nudge for keyboard users operating the separator.
  handle.addEventListener('keydown', (e) => {
    let dir = 0;
    if (e.key === growKeys[0]) dir = 1;
    else if (e.key === growKeys[1]) dir = -1;
    if (!dir) return;
    e.preventDefault();
    const size = clamp(target.getBoundingClientRect()[dim] + dir * 16);
    target.style[prop] = size + 'px';
    localStorage.setItem(storageKey, String(size));
  });
  window.addEventListener('resize', () => {
    if (target.style[prop]) target.style[prop] = clamp(parseFloat(target.style[prop])) + 'px';
  });
}

makeResizer({
  handle: document.getElementById('sidebar-resizer'),
  target: document.getElementById('ide-sidebar'),
  axis: 'x', prop: 'width', min: 180, max: () => Math.min(480, window.innerWidth * 0.5),
  storageKey: 'msb-sidebar-width', growKeys: ['ArrowRight', 'ArrowLeft'],
});
makeResizer({
  handle: document.getElementById('terminal-resizer'),
  target: document.getElementById('ide-terminal'),
  axis: 'y', prop: 'height', min: 120, max: () => Math.min(600, window.innerHeight * 0.7),
  storageKey: 'msb-terminal-height', growKeys: ['ArrowUp', 'ArrowDown'],
});
