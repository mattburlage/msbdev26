// Identity copy shared word-for-word by the hero, the IDE's README.md, the
// print resume header, and the <title>/meta description in Layout.

export const NAME = 'Matthew Smith Burlage';
export const TITLE = 'Senior Software Engineer';
export const SUBTITLE = 'Leader & Systems Architect';
export const TAGLINE =
  'I design, build, and scale secure, mission-critical software while mentoring those around me.';

// Shown in the editor pane AND echoed to the status bar when every tab is closed.
export const EMPTY_STATE_TITLE = 'No file open';

// Email obfuscation — simple encoding to protect from scrapers.
export const EMAIL = 'matt@msb.dev';
export const ENCODED_EMAIL = EMAIL.split('').map((c) => c.charCodeAt(0)).join(',');
// Static fallback text; the client script swaps in the decoded address at runtime.
export const EMAIL_FALLBACK = 'matt [at] msb.dev';
