// Normal-site animations: hero reveal, headline scramble, stat count-ups,
// scroll-staggered reveals, the bento crossfade row, the projects code
// texture, the principles wireframe parallax, and pointer flourishes.
// Under prefers-reduced-motion everything lands instantly instead.

import { animate, inView, stagger, scroll } from 'motion';
import { reduced, fine } from './prefs';

if (reduced) {
  document.documentElement.classList.add('reduced-motion');
  // No count-up animation, but the real numbers still need to land
  // (hero stat row + the README.md mirror of the same numbers).
  const yearsSince2019 = new Date().getFullYear() - 2019;
  document.getElementById('years-count')!.textContent = String(yearsSince2019);
  document.querySelectorAll('[data-stat="years"]').forEach((el) => { el.textContent = String(yearsSince2019); });
  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => { el.textContent = el.dataset.count!; });
} else {
  try {
    animate('[data-hero]', { opacity: [0, 1], y: [28, 0] },
      { duration: 0.7, delay: stagger(0.13), easing: [0.22, 1, 0.36, 1] });
  } catch (e) {
    console.warn('Hero animation error:', e);
  }

  const CHARS = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  function scramble(el: HTMLElement | null, delay = 0) {
    if (!el) return;
    const target = el.dataset.text!;
    let frame = 0;
    const totalFrames = target.length * 3 + 12;
    setTimeout(() => {
      const tick = () => {
        let o = '';
        for (let i = 0; i < target.length; i++) {
          const revealAt = i * 3 + 8;
          o += frame >= revealAt ? target[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
        }
        el.textContent = o;
        if (frame++ < totalFrames) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      tick();
    }, delay);
  }
  scramble(document.getElementById('scramble-1'), 150);
  scramble(document.getElementById('scramble-2'), 350);
  scramble(document.getElementById('scramble-3'), 550);

  const countUp = (el: HTMLElement | null, target: number, delay = 800, duration = 1400) => {
    if (!el || Number.isNaN(target)) return;
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        el.textContent = String(Math.round(easeOutCubic(t) * target));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = String(target);
      };
      requestAnimationFrame(tick);
    }, delay);
  };

  document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    countUp(el, parseInt(el.dataset.count!, 10));
  });

  // Stat card interactions
  // Injected from the shared `builds` array in the page frontmatter (see window.__BENTO__).
  const statData = window.__BENTO__ || { all: [], systems: [], integrations: [] };

  // Calculate years since 2019
  const yearsSince2019 = new Date().getFullYear() - 2019;
  countUp(document.getElementById('years-count'), yearsSince2019);
  // Same number, mirrored into the IDE's README.md stat block
  document.querySelectorAll('[data-stat="years"]').forEach((el) => { el.textContent = String(yearsSince2019); });

  const bentoRowContent = document.getElementById('bento-row-content');
  if (bentoRowContent) {
    interface BentoItem { name: string; sub: string }
    interface BentoSlot { pointer: number; faces: HTMLElement[]; active: number }

    let bentoRowTimers: ReturnType<typeof setTimeout>[] = [];

    const BENTO_ROW_VISIBLE = 3;

    function clearBentoRowTimers() {
      bentoRowTimers.forEach((t) => clearTimeout(t));
      bentoRowTimers = [];
    }

    function fillBentoFace(face: HTMLElement, item: BentoItem, number: number) {
      face.querySelector('[data-num]')!.textContent = String(number).padStart(2, '0');
      face.querySelector('[data-name]')!.textContent = item.name;
      const subEl = face.querySelector('[data-sub]');
      if (subEl) subEl.textContent = item.sub || '';
    }

    // Each slot holds two stacked faces and crossfades between them:
    // the incoming item fades in while the outgoing item fades out
    // simultaneously, on the slot's own randomized schedule.
    function scheduleBentoSlot(slot: BentoSlot, items: BentoItem[]) {
      const nextDelay = () => 2200 + Math.random() * 3800; // 2.2s–6s between swaps

      const tick = () => {
        // Advance this slot to its next item (each slot walks the list by step)
        slot.pointer = (slot.pointer + BENTO_ROW_VISIBLE) % items.length;
        const item = items[slot.pointer];

        const incoming = slot.faces[1 - slot.active];
        const outgoing = slot.faces[slot.active];

        fillBentoFace(incoming, item, slot.pointer + 1);
        // Partial crossfade: start the outgoing fade first, then bring the
        // incoming in after a short offset so there's a subtle dip between
        // items rather than a perfectly seamless dissolve.
        outgoing.style.opacity = '0';
        bentoRowTimers.push(setTimeout(() => {
          incoming.style.opacity = '1';
        }, 300));
        slot.active = 1 - slot.active;

        bentoRowTimers.push(setTimeout(tick, nextDelay()));
      };

      bentoRowTimers.push(setTimeout(tick, nextDelay()));
    }

    function updateBentoRow(stat: keyof typeof statData) {
      clearBentoRowTimers();
      const items = statData[stat];

      const faceClass = 'absolute inset-0 rounded-xl bg-void-900/95 backdrop-blur-sm border border-void-700/50 p-4 flex flex-col justify-between opacity-0 overflow-hidden transition-opacity duration-[1200ms] ease-in-out';

      // Build the fixed slots once, each with two stacked faces
      bentoRowContent!.innerHTML = Array.from({ length: BENTO_ROW_VISIBLE }, () => `
          <div class="relative">
              <div data-face class="${faceClass}">
                  <div data-num class="text-volt text-xs font-mono"></div>
                  <div>
                      <div data-name class="font-medium text-void-200 leading-snug"></div>
                      <div data-sub class="text-void-400 text-xs leading-snug mt-1"></div>
                  </div>
              </div>
              <div data-face class="${faceClass}">
                  <div data-num class="text-volt text-xs font-mono"></div>
                  <div>
                      <div data-name class="font-medium text-void-200 leading-snug"></div>
                      <div data-sub class="text-void-400 text-xs leading-snug mt-1"></div>
                  </div>
              </div>
          </div>
      `).join('');

      const slots = Array.from(bentoRowContent!.children);
      slots.forEach((slotEl, i) => {
        const faces = Array.from(slotEl.querySelectorAll<HTMLElement>('[data-face]'));
        const slot: BentoSlot = { pointer: i % items.length, faces, active: 0 };
        fillBentoFace(faces[0], items[slot.pointer], slot.pointer + 1);
        // Randomized initial fade-in
        bentoRowTimers.push(setTimeout(() => {
          faces[0].style.opacity = '1';
        }, Math.round(Math.random() * 700)));

        if (items.length > BENTO_ROW_VISIBLE) {
          scheduleBentoSlot(slot, items);
        }
      });
    }

    updateBentoRow('all');
  }

  document.querySelectorAll('[data-stagger]').forEach((group) => {
    try {
      inView(group, () => {
        animate(group.querySelectorAll('.m-reveal'),
          { opacity: [0, 1], y: [22, 0] },
          { duration: 0.55, delay: stagger(0.08), easing: [0.22, 1, 0.36, 1] });
      }, { amount: 0.1 });
    } catch (e) {
      console.warn('Stagger animation error:', e);
    }
  });
  document.querySelectorAll('.m-reveal:not([data-hero])').forEach((el) => {
    if (el.closest('[data-stagger]')) return;
    try {
      inView(el, () => {
        animate(el, { opacity: [0, 1], y: [22, 0] }, { duration: 0.55, easing: [0.22, 1, 0.36, 1] });
      }, { amount: 0.2 });
    } catch (e) {
      console.warn('Reveal animation error:', e);
    }
  });

  const progress = document.getElementById('progress');
  if (progress) {
    try {
      scroll(animate('#progress', { scaleX: [0, 1] }));
    } catch (e) {
      console.warn('Scroll animation error:', e);
    }
  }

  // ---------- Projects section: rendered HTML code texture ----------
  const codeContainer = document.getElementById('projects-code');
  if (codeContainer) {
    const width = codeContainer.offsetWidth;
    const height = codeContainer.offsetHeight;
    const lineHeight = 18;
    const charWidth = 6.5;
    const charsPerLine = Math.max(80, Math.ceil(width / charWidth));
    const lineCount = Math.max(12, Math.floor(height / lineHeight));

    const rawHtml = document.documentElement.outerHTML;
    // Strip mailto: links and bare email addresses to avoid exposing them in the texture,
    // then collapse all whitespace so the texture is a continuous stream of markup.
    const cleanedHtml = rawHtml
      .replace(/mailto:[^"'\s<>]+/g, 'mailto:hello@example.com')
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, 'hello@example.com')
      .replace(/\s+/g, '');

    const chunks: string[] = [];
    for (let i = 0; i < cleanedHtml.length; i += charsPerLine) {
      chunks.push(cleanedHtml.slice(i, i + charsPerLine));
    }

    for (let row = 0; row < lineCount; row++) {
      const line = document.createElement('div');
      line.className = 'code-line';
      line.style.top = (row * lineHeight) + 'px';
      line.textContent = chunks[row % chunks.length];
      codeContainer.appendChild(line);
    }
  }

  // ---------- Principles section: wireframe parallax ----------
  const principlesSection = document.getElementById('principles');
  const wireframe = document.getElementById('principles-wireframe');
  if (principlesSection && wireframe) {
    const updateWireframeParallax = () => {
      const rect = principlesSection.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (-rect.top + viewportH) / (rect.height + viewportH)));
      const shift = (progress - 0.5) * 400;
      wireframe.style.transform = `translateY(${shift}px)`;
    };
    window.addEventListener('scroll', updateWireframeParallax, { passive: true });
    window.addEventListener('resize', updateWireframeParallax, { passive: true });
    updateWireframeParallax();
  }

  if (fine) {
    document.querySelectorAll<HTMLElement>('.spot').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--spot-x', (e.clientX - r.left) + 'px');
        card.style.setProperty('--spot-y', (e.clientY - r.top) + 'px');
        card.style.setProperty('--spot-o', '1');
      }, { passive: true });
      card.addEventListener('pointerleave', () => card.style.setProperty('--spot-o', '0'));
    });

    const mag = document.getElementById('magnetic');
    if (mag) {
      mag.addEventListener('pointermove', (e) => {
        const r = mag.getBoundingClientRect();
        mag.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`;
      }, { passive: true });
      mag.addEventListener('pointerleave', () => {
        mag.style.transform = '';
        mag.style.transition = 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
        setTimeout(() => mag.style.transition = '', 350);
      });
    }
  }
}
