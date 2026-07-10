// Slow scroll for in-page anchors. Native scroll-behavior: smooth has a fixed
// (fast) browser duration, so anchor clicks are animated by hand. Reduced
// motion keeps the CSS fallback (instant jump).

import { reduced } from './prefs';

if (!reduced) {
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]:not([data-email])').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.getElementById(a.getAttribute('href')!.slice(1));
      if (!target) return;
      e.preventDefault();
      const startY = window.scrollY;
      const endY = Math.min(target.getBoundingClientRect().top + startY, document.documentElement.scrollHeight - window.innerHeight);
      const duration = Math.min(4500, 600 + Math.abs(endY - startY) * 0.75);
      const t0 = performance.now();
      let cancelled = false;
      const cancel = () => { cancelled = true; };
      window.addEventListener('wheel', cancel, { once: true, passive: true });
      window.addEventListener('touchstart', cancel, { once: true, passive: true });
      const step = (now: number) => {
        if (cancelled) return;
        const t = Math.min(1, (now - t0) / duration);
        window.scrollTo({ top: startY + (endY - startY) * easeInOut(t), behavior: 'instant' });
        if (t < 1) requestAnimationFrame(step);
        else history.pushState(null, '', a.getAttribute('href'));
      };
      requestAnimationFrame(step);
    });
  });
}
