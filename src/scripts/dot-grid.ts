// Hero dot-grid: ambient shimmer + scatter-and-fade on scroll.
// .dot-grid (static CSS) stays as the reduced-motion fallback; this canvas
// replaces it when motion is allowed.

import { reduced } from './prefs';

interface Dot {
  x: number;
  y: number;
  phase: number;
  dirX: number;
  dirY: number;
  distFromCenter: number;
  depth: number;
}

const dotCanvas = document.getElementById('dot-canvas') as HTMLCanvasElement | null;
const dotGrid = document.querySelector<HTMLElement>('.dot-grid');

if (!reduced && dotCanvas && dotGrid) {
  const ctx = dotCanvas.getContext('2d')!;
  const SPACING = 28;
  const BASE_RADIUS = 1.5;
  const SCATTER_RANGE = 1900; // px of scroll over which dots fully disperse + fade
  const SCATTER_DISTANCE = 220; // max px a dot drifts from its grid position
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width = 0, height = 0;
  let dots: Dot[] = [];
  let scrollY = window.scrollY;

  function buildGrid() {
    // Canvas is fixed to the viewport, so size it to the viewport.
    width = window.innerWidth;
    height = window.innerHeight;
    dotCanvas!.width = Math.round(width * dpr);
    dotCanvas!.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    dots = [];
    const cols = Math.ceil(width / SPACING);
    const rows = Math.ceil(height / SPACING);
    const centerX = (cols * SPACING) / 2;
    const centerY = (rows * SPACING) / 2;
    for (let i = 0; i <= cols; i++) {
      for (let j = 0; j <= rows; j++) {
        // Start on a strict pixel grid...
        const x = i * SPACING;
        const y = j * SPACING;
        const dx = x - centerX;
        const dy = y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const baseAngle = Math.atan2(dy, dx);
        // ...but scatter outward with a little random angle/spread so it
        // doesn't feel like a rigid wall flying apart.
        const angle = baseAngle + (Math.random() - 0.5) * 0.5;
        dots.push({
          x,
          y,
          phase: Math.random() * Math.PI * 2,
          dirX: Math.cos(angle),
          dirY: Math.sin(angle),
          distFromCenter: dist,
          depth: 0.4 + Math.random() * 0.6,
        });
      }
    }
  }

  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  let accentRGB = '163, 230, 53';
  function draw(time: number) {
    accentRGB = getComputedStyle(document.documentElement).getPropertyValue('--accent-rgb').trim() || accentRGB;
    ctx.clearRect(0, 0, width, height);

    // Normal downward scroll: dots explode outward and fade.
    // Upward overscroll: dots are pulled inward and condense.
    const isOverscroll = scrollY < 0;
    const scrollT = isOverscroll ? 0 : Math.min(1, scrollY / SCATTER_RANGE);
    const overscrollT = isOverscroll ? Math.min(-scrollY / 250, 1) : 0;
    const overscrollEased = overscrollT * (2 - overscrollT); // easeOutQuad

    // Ease into the explosion so it starts slowly and accelerates as the user scrolls.
    const easedScrollT = scrollT * scrollT;
    const scatterDist = easedScrollT * SCATTER_DISTANCE;
    const pullDist = -overscrollEased * 130;

    for (const dot of dots) {
      const shimmer = 0.5 + 0.5 * Math.sin(time * 0.0006 + dot.phase);
      const baseAlpha = 0.2 + shimmer * 0.35;
      const alpha = isOverscroll
        ? Math.min(1, baseAlpha * (1 + overscrollEased * 1.2))
        : baseAlpha * (1 - scrollT);
      if (alpha <= 0.01) continue;

      // "Toward the viewer" scaling on normal scroll; slight contraction on overscroll.
      const approach = easedScrollT * dot.depth;
      const scale = (1 + approach * 100.0) * (1 - overscrollEased * 0.35);
      const explosionFactor = 1 + dot.distFromCenter * 0.003;
      const displacement = (scatterDist * explosionFactor * scale) + pullDist;
      const x = dot.x + dot.dirX * displacement;
      const y = dot.y + dot.dirY * displacement;
      const radius = BASE_RADIUS * scale;

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${accentRGB}, ${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  dotGrid.style.display = 'none';
  dotCanvas.style.display = 'block';
  buildGrid();
  window.addEventListener('resize', buildGrid, { passive: true });
  // Web fonts loading async can reflow the header's height after the first measurement
  if (document.fonts) document.fonts.ready.then(buildGrid);
  requestAnimationFrame(draw);
}
