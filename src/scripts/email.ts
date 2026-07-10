// Email obfuscation — the address ships as character codes (see
// data/identity.ts) and is decoded here at runtime, out of reach of scrapers
// that read static HTML.

const decodeEmail = (encoded: string): string =>
  encoded.split(',').map((code) => String.fromCharCode(parseInt(code))).join('');

export const realEmail = decodeEmail(window.__EMAIL__);

// Links get the real address + mailto; plain-text spots (code panes) showed
// the obfuscation fallback until now.
document.querySelectorAll<HTMLAnchorElement>('[data-email]').forEach((link) => {
  link.textContent = realEmail;
  link.href = 'mailto:' + realEmail;
});
document.querySelectorAll('[data-email-text]').forEach((el) => { el.textContent = realEmail; });
