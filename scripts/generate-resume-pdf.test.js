import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { assertTextParity, cleanResumePdf, generateResumePdf } from './generate-resume-pdf.js';

test('PDF parity tolerates layout, bullets and font ligatures', () => {
  assert.doesNotThrow(() => assertTextParity('Office engineer — 2020', '• Ofﬁce\nengineer — 2020'));
});
test('PDF parity handles split ligatures and CSS-spaced text nodes', () => {
  assert.doesNotThrow(() => assertTextParity('Cloudflare configured GeorgiaGraduated', 'Cloud fl are con fi gured Georgia Graduated'));
});
test('PDF parity rejects missing, extra, changed and duplicate prose', () => {
  for (const actual of ['Senior engineer', 'Senior systems engineer extra', 'Junior systems engineer', 'Senior systems engineer engineer', 'engineer systems Senior']) {
    assert.throws(() => assertTextParity('Senior systems engineer', actual), /does not match/);
  }
  assert.throws(() => assertTextParity('', ''), /does not match/);
});
test('cleanup removes stale PDF and interrupted output only', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'resume-clean-'));
  try {
    for (const name of ['resume.pdf', 'resume.pdf.tmp', 'index.html']) await writeFile(join(dir, name), 'old');
    await cleanResumePdf(dir);
    for (const name of ['resume.pdf', 'resume.pdf.tmp']) await assert.rejects(readFile(join(dir, name)), { code: 'ENOENT' });
    assert.equal(await readFile(join(dir, 'index.html'), 'utf8'), 'old');
  } finally { await rm(dir, { recursive: true }); }
});
test('missing built homepage fails without retaining a stale PDF', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'resume-failure-'));
  try {
    await writeFile(join(dir, 'resume.pdf'), 'old');
    await assert.rejects(generateResumePdf(dir));
    await assert.rejects(readFile(join(dir, 'resume.pdf')), { code: 'ENOENT' });
  } finally { await rm(dir, { recursive: true }); }
});

// Run on a host that supports sandboxed Chromium. These exercise real browser
// rendering and PDF extraction; they do not substitute for reviewing the site's PDF.
const integration = { skip: process.env.RESUME_PDF_INTEGRATION !== '1' };
const fixture = (extra = '') => `<!doctype html><html><head>
<style>@media print { #site, #ide { display:none } } @page { margin:0.5in }</style>
${extra}</head><body><div id="site">Do not print this</div><div id="ide"></div>
<div id="resume"><h1>Print fixture</h1><a data-email href="mailto:test@example.com">test@example.com</a>
<p>Exact words, dates 2020–2026, punctuation &amp; repeated repeated words.</p></div></body></html>`;
for (const [name, html, succeeds] of [
  ['renders and validates the built print content', fixture(), true],
  ['fails closed when a required stylesheet is missing', fixture('<link rel="stylesheet" href="/missing.css">'), /Required page resources failed/],
  ['fails closed when print styles leak the website into the PDF', fixture('<style>@media print { #site { display:block } }</style>'), /#site is not hidden/],
]) {
  test(name, integration, async () => {
    const dir = await mkdtemp(join(tmpdir(), 'resume-browser-'));
    try {
      await writeFile(join(dir, 'index.html'), html);
      await writeFile(join(dir, 'resume.pdf'), 'stale');
      if (succeeds === true) {
        await generateResumePdf(dir);
        assert.equal((await readFile(join(dir, 'resume.pdf'))).subarray(0, 5).toString(), '%PDF-');
      } else {
        await assert.rejects(generateResumePdf(dir), succeeds);
        await assert.rejects(readFile(join(dir, 'resume.pdf')), { code: 'ENOENT' });
      }
      await assert.rejects(readFile(join(dir, 'resume.pdf.tmp')), { code: 'ENOENT' });
    } finally { await rm(dir, { recursive: true }); }
  });
}
