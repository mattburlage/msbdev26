// Helpers that render shared site data as syntax-highlighted code strings, so
// the IDE panes can't drift from the objects that render the normal site.
// Output is passed through set:html because it contains literal { } which
// Astro would otherwise parse as expressions. The class names live in this
// file's source text, so Tailwind's content scanner picks them up.

export const hlEsc = (s: unknown): string =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Keyword, e.g. `import`, `export const`. */
export const kw = (s: string): string => `<span class="text-syn-kw">${s}</span>`;

/** Quoted string literal. */
export const st = (s: string): string => `<span class="text-syn-str">"${hlEsc(s)}"</span>`;

/** Numeric literal. */
export const nm = (s: string | number): string => `<span class="text-syn-num">${s}</span>`;

/** Comment. */
export const cm = (s: string): string => `<span class="text-syn-cm">${hlEsc(s)}</span>`;

/** JSON object key. */
export const jkey = (s: string): string => `<span class="text-syn-fn">"${hlEsc(s)}"</span>`;

/** Plain JS array literal, e.g. `["Vue", "React"]`. */
export const jsList = (arr: string[]): string => '[' + arr.map((v) => `"${v}"`).join(', ') + ']';
