import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const distIndex = join(process.cwd(), 'dist', 'index.html');

try {
  const html = readFileSync(distIndex, 'utf-8');
  
  // Find the closing </body> tag and inject the rendered HTML before it.
  // The page contains its own </script> tags (from its inline scripts), and
  // JSON.stringify doesn't escape "/" — embedding it verbatim would let the
  // HTML parser close this <script> early at the first one it hits, spilling
  // the rest of the JSON string out as raw (mis-parsed) markup. Escaping every
  // "<" as its unicode escape keeps the JS string intact.
  const json = JSON.stringify(html).replace(/</g, '\\u003c');
  const renderedHtmlScript = `
<script>
  window.__RENDERED_HTML__ = ${json};
</script>`;
  
  const modifiedHtml = html.replace('</body>', renderedHtmlScript + '</body>');
  
  writeFileSync(distIndex, modifiedHtml, 'utf-8');
  console.log('✓ Injected rendered HTML into dist/index.html');
} catch (e) {
  console.error('✗ Error injecting rendered HTML:', e.message);
  process.exit(1);
}