// User preference media queries, read once and shared by every module.

export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fine = window.matchMedia('(pointer: fine)').matches;
