// index.html tab: shows the page's own rendered output. window.__RENDERED_HTML__
// is injected post-build (see scripts/post-build.js) with the dist HTML captured
// before that injection happens, so this can't be highlighted server-side in the
// frontmatter like the other panes — the content doesn't exist until after the
// Astro build finishes. Only present in production builds, not `astro dev`.

const code = document.getElementById('rendered-html-code');

if (code) {
  const raw = window.__RENDERED_HTML__;
  if (!raw) {
    code.innerHTML = '<span class="text-syn-cm">// only available in production builds — run `npm run build` or `npm run preview`</span>';
  } else {
    code.innerHTML = highlightHtml(raw);
  }
}

function highlightHtml(raw: string): string {
  const escapeHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)(\s*=\s*)("[^"]*"|'[^']*'|[^\s>]+)?/g;

  const highlightAttrs = (attrs: string) => {
    let out = '', last = 0;
    let m: RegExpExecArray | null;
    attrRe.lastIndex = 0;
    while ((m = attrRe.exec(attrs))) {
      out += escapeHtml(attrs.slice(last, m.index));
      out += `<span class="text-syn-fn">${escapeHtml(m[1])}</span>`;
      if (m[2]) out += escapeHtml(m[2]);
      if (m[3]) out += `<span class="text-syn-str">${escapeHtml(m[3])}</span>`;
      last = attrRe.lastIndex;
    }
    out += escapeHtml(attrs.slice(last));
    return out;
  };

  const tagRe = /(<!--[\s\S]*?-->)|(<\/?[a-zA-Z][a-zA-Z0-9-]*)((?:\s+[a-zA-Z_:][-a-zA-Z0-9_:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*)\s*(\/?>)/g;
  let out = '', last = 0;
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(raw))) {
    out += escapeHtml(raw.slice(last, m.index));
    if (m[1]) {
      out += `<span class="text-syn-cm">${escapeHtml(m[1])}</span>`;
    } else {
      out += `<span class="text-syn-kw">${escapeHtml(m[2])}</span>`;
      out += highlightAttrs(m[3] || '');
      out += escapeHtml(m[4]);
    }
    last = tagRe.lastIndex;
  }
  out += escapeHtml(raw.slice(last));
  return out;
}
