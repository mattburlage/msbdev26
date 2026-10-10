import { createServer } from 'node:http';
import { readFile, rename, rm, writeFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));

export async function cleanResumePdf(distDir = root) {
  await Promise.all(['resume.pdf', 'resume.pdf.tmp'].map((file) =>
    rm(resolve(distDir, file), { force: true })));
}

// PDF extraction can split a word at font ligatures, while CSS spacing can
// visually separate adjacent DOM text nodes. Compare the complete character
// sequence after removing only whitespace, list markers and ligature encoding.
// No résumé copy lives in this script; order and punctuation must still match.
export function normalizePdfText(text) {
  return text.normalize('NFKC').replace(/[\s\u2022]/gu, '');
}

export function assertTextParity(expected, actual) {
  const source = normalizePdfText(expected);
  const extracted = normalizePdfText(actual);
  if (!source || source !== extracted) {
    let index = 0;
    while (index < Math.min(source.length, extracted.length) && source[index] === extracted[index]) index++;
    throw new Error(`PDF text does not match the built #resume. Refusing to publish it.\nFirst mismatch at character ${index}: source ${JSON.stringify(source.slice(index, index + 60))}; PDF ${JSON.stringify(extracted.slice(index, index + 60))}`);
  }
}

export async function generateResumePdf(distDir = root) {
  distDir = resolve(distDir);
  await cleanResumePdf(distDir);
  // Import after cleanup: a missing dependency must not leave a stale PDF.
  const { default: puppeteer } = await import('puppeteer');
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs');
  await readFile(resolve(distDir, 'index.html'));
  const contentTypes = {
    '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
    '.png': 'image/png', '.svg': 'image/svg+xml', '.woff2': 'font/woff2',
  };
  const server = createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      const file = resolve(distDir, `.${pathname === '/' ? '/index.html' : pathname}`);
      if (!file.startsWith(distDir + sep)) {
        res.writeHead(403).end();
        return;
      }
      const bytes = await readFile(file);
      res.writeHead(200, { 'Content-Type': contentTypes[extname(file)] ?? 'application/octet-stream' });
      res.end(bytes);
    } catch {
      res.writeHead(404).end();
    }
  });
  let browser;
  let pageCount;
  try {
    await new Promise((done, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', done);
    });
    const origin = `http://127.0.0.1:${server.address().port}`;
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    const failures = [];
    const required = (request) => ['document', 'stylesheet', 'script', 'font'].includes(request.resourceType());
    page.on('requestfailed', (request) => {
      if (required(request)) failures.push(`${request.url()}: ${request.failure()?.errorText}`);
    });
    page.on('response', (response) => {
      if (required(response.request()) && !response.ok()) failures.push(`${response.url()}: HTTP ${response.status()}`);
    });
    page.on('pageerror', (error) => failures.push(error.message));
    await page.emulateMediaType('print');
    await page.goto(origin, { waitUntil: 'networkidle0', timeout: 60_000 });
    await page.waitForFunction(() => {
      const email = document.querySelector('#resume [data-email]');
      return email?.getAttribute('href') === `mailto:${email.textContent}`;
    }, { timeout: 15_000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      if ([...document.fonts].some((font) => font.status === 'error')) throw new Error('A font failed to load.');
      const resume = document.querySelector('#resume');
      if (!resume || getComputedStyle(resume).display === 'none' || resume.getBoundingClientRect().height === 0) {
        throw new Error('The built print résumé is missing or hidden.');
      }
      for (const selector of ['#site', '#ide']) {
        const element = document.querySelector(selector);
        if (element && getComputedStyle(element).display !== 'none') throw new Error(`${selector} is not hidden for print.`);
      }
    });
    if (failures.length) throw new Error(`Required page resources failed:\n${failures.join('\n')}`);
    const expected = await page.$eval('#resume', (element) => element.innerText);
    const pdf = await page.pdf({
      format: 'Letter', preferCSSPageSize: true, printBackground: true,
      displayHeaderFooter: false, waitForFonts: true, timeout: 60_000,
    });
    const loadingTask = getDocument({ data: new Uint8Array(pdf), useSystemFonts: true });
    const texts = [];
    try {
      const document = await loadingTask.promise;
      for (let number = 1; number <= document.numPages; number++) {
        const content = await (await document.getPage(number)).getTextContent();
        texts.push(content.items.map((item) => 'str' in item ? item.str : '').join(' '));
      }
      assertTextParity(expected, texts.join('\n'));
      await writeFile(resolve(distDir, 'resume.pdf.tmp'), pdf);
      await rename(resolve(distDir, 'resume.pdf.tmp'), resolve(distDir, 'resume.pdf'));
      pageCount = document.numPages;
    } finally {
      await loadingTask.destroy();
    }
  } catch (error) {
    await cleanResumePdf(distDir);
    throw error;
  } finally {
    try {
      try { await browser?.close(); } finally {
        server.closeAllConnections();
        await new Promise((done) => server.close(done));
      }
    } catch (error) {
      await cleanResumePdf(distDir);
      throw error;
    }
  }
  console.log(`✓ Generated dist/resume.pdf (${pageCount} page(s)); text matches the built résumé`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv.includes('--clean')) await cleanResumePdf();
    else await generateResumePdf();
  } catch (error) {
    console.error('✗ Résumé PDF generation failed:', error.message);
    process.exitCode = 1;
  }
}
