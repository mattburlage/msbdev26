// Skills marquee — built from the same SKILL_TAGS list that renders the
// section's aria-label, duplicated once for a seamless CSS loop.

import { SKILL_TAGS } from '../data/skills';

const track = document.getElementById('marquee-track');
if (track) {
  for (let copy = 0; copy < 2; copy++) {
    SKILL_TAGS.forEach((s) => {
      const el = document.createElement('span');
      el.className = 'px-4 py-2 border border-void-700 rounded bg-void-900 whitespace-nowrap';
      el.textContent = s;
      track.appendChild(el);
    });
  }
}
