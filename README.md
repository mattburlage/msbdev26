# msb.dev

Personal site and interactive resume of **Matthew Smith Burlage** — senior software
engineer & systems architect. Live at [msb.dev](https://www.msb.dev).

Built with [Astro](https://astro.build), Tailwind CSS, and TypeScript; deployed as a
static site on Cloudflare Workers.

## The gimmick

The site has two faces:

- **The normal site** — portfolio sections, animated hero, printable one-page resume
  (`⌘P` / the "Print resume" button prints an actual resume, not the web page).
- **Dev mode** — press <kbd>.</kbd> or click *dev mode* to flip the whole site into a
  working IDE: a file explorer, tabbed editor panes, and a terminal that is a **real JS
  console** (try `help`, `ls()`, `msb.reveal("okta")`, or any JavaScript). The
  `index.html` file in the sidebar shows the page's own rendered production HTML.

Both faces render from the same data modules, so the resume, the site sections, and the
IDE's fake source files can never drift apart.

## Architecture

```
src/
├── data/            # single source of truth (roles, builds, skills, resume, identity)
├── lib/             # build-time helpers
│   ├── highlight.ts   # renders data as syntax-highlighted code strings
│   ├── ide-code.ts    # builds the IDE's "source files" from src/data
│   └── env.ts         # environment flags
├── components/
│   ├── home/          # one component per site section (Hero, Experience, …)
│   ├── ide/Ide.astro  # the full-screen IDE overlay
│   ├── Nav.astro
│   └── Resume.astro   # print-only one-page resume
├── scripts/         # client-side TypeScript modules, bundled by Astro
│   ├── main.ts        # entry point; imports the side-effectful modules below
│   ├── ide-terminal.ts / ide-files.ts / ide-mode.ts / ide-resizers.ts
│   ├── animations.ts / dot-grid.ts / marquee.ts / smooth-scroll.ts
│   └── email.ts       # scraper-resistant email decoding
├── content/blog/    # markdown posts (content collection)
├── pages/           # index, blog, 404
└── layouts/         # base layout: meta, global CSS, accent-color picker
scripts/
├── post-build.js    # injects the rendered HTML back into the page for the IDE's index.html tab
└── generate-resume-pdf.js # prints the newly built homepage to dist/resume.pdf
```

Server-side data flows to the client through one inline bootstrap script
(`window.__SITE__`), keeping the IDE terminal's `window.msb` word-for-word identical to
the objects that render the page.

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4025`                      |
| `npm run check`   | Type-check (`astro check`, strict)                  |
| `npm run build`   | Type-check + production build + injection + matching PDF |
| `npm run preview` | Preview the production build                        |
| `npm run deploy`  | Build and deploy via Wrangler                       |

## Generated résumé PDF

Every successful `npm run build` produces `/resume.pdf` in the same `dist/`
output as the website. Share `https://www.msb.dev/resume.pdf` after deployment.
There is no separate résumé document or copy to maintain: Puppeteer opens the
newly built homepage on a temporary loopback-only server and uses its existing
`#resume` component and `@media print` styles, including the CSS page margins.
The default paper size is US Letter; a future CSS `@page size` takes precedence.

Generation waits for styles, fonts, and the site's email decoder. It then checks
the complete extracted PDF character sequence against the rendered résumé
(ignoring whitespace, list bullets, and font ligature encoding; order and
punctuation must match). A missing
resource, failed browser launch, or text mismatch fails the build. Previous and
partial PDFs are removed, and the final file is written only after validation.
No résumé data, copy, or print styles are rewritten by the generator.

### Build-host requirements

- Use Node.js 22.13.0 or later (Node 24 LTS recommended).
- Run `npm ci` with development dependencies and package install scripts enabled.
  Puppeteer installs its pinned Chrome for Testing; the build host also needs
  permission to launch sandboxed Chromium. The Ubuntu 24.04 x86_64 Workers
  build image's missing libraries are prepared automatically as described below.
- Keep Puppeteer's browser cache available to the build. If the dependency cache
  is restored without the browser cache, run `npx puppeteer browsers install chrome`
  before building. `PUPPETEER_CACHE_DIR` can select a writable cache directory.
  `PUPPETEER_EXECUTABLE_PATH` can instead select a compatible, preinstalled Chrome.
- The existing Space Grotesk (400/500/600/700) and JetBrains Mono (400/500/600)
  fonts are self-hosted through pinned Fontsource packages. Vite includes their
  assets in the same build, so rendering needs no Google Fonts network request.
  The families, weights, and swap display behavior are unchanged. Missing font
  assets still fail the build instead of silently printing fallbacks. Font license
  notices are included under `public/static/fonts/`. The seven imported weights
  add about 548 KiB of font assets to `dist/` (WOFF and WOFF2, all supported
  subsets; browsers request only the faces/subsets they need). The font packages
  occupy about 3.2 MiB in `node_modules`; no extra font fetch runs during a build.
- Configure Cloudflare's build command to run `npm run build` and deploy `dist/`
  only on success. The existing `npm run deploy` already gates Wrangler on this
  command. Do not deploy a partial output after a failed build or bypass it with
  a bare `astro build` / `wrangler deploy`.
- This is build-time tooling only: the deployed Cloudflare static assets need no
  browser binding. Cloudflare's published build-image tool list does not guarantee
  Chromium support; verify the PDF step on the actual configured build host before
  merging. Do not disable the browser sandbox to work around a host restriction.

See [Puppeteer installation](https://pptr.dev/guides/installation),
[Linux requirements](https://pptr.dev/troubleshooting), and
[Cloudflare's build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/).

### Cloudflare build-image dependency preparation

Cloudflare Workers Builds currently uses Ubuntu 24.04 x86_64, but does not include
all of Chrome's shared libraries (for example `libatk-1.0.so.0`). The generator
checks the pinned executable with `ldd` before launch. On that exact OS/architecture,
`scripts/prepare-chrome.js` prepares missing dependencies without root:

1. Read the `deb.deps` declaration shipped by Google with that pinned Chrome.
2. Use private APT state and a copy of the installed-package database. Fetch only
   Noble, Noble Updates, and Noble Security from official Ubuntu HTTPS archives,
   authenticated with the build image's existing Ubuntu archive keyring. APT's
   signature and package-hash checks remain enabled.
3. Resolve and download dependencies with `apt-get --download-only satisfy`, then
   extract package payloads with `dpkg-deb`. No package install/maintainer scripts,
   sudo, global package database updates, or system configuration changes occur.
   Any proposed replacement of the host C library/loader is rejected.
4. Recheck `ldd` and pass the temporary library/font paths only to Chrome. Remove
   the temporary files after the browser closes, including on failure.

This needs `apt-get`, `dpkg-deb`, the Ubuntu archive keyring and outbound HTTPS to
Ubuntu's repositories. Other OSes use their existing dependencies and get a clear
error if libraries are missing. The browser sandbox stays enabled: this resolves
library loading, not a host policy that forbids sandboxed Chrome. The normal PDF
content/resource checks and nonzero build failure remain mandatory. Actual hosting
build success must be verified after deploying this change.

References: [Cloudflare build image](https://developers.cloudflare.com/workers/ci-cd/builds/build-image/),
[Puppeteer system dependencies](https://pptr.dev/troubleshooting),
[APT download-only/satisfy](https://manpages.ubuntu.com/manpages/noble/man8/apt-get.8.html),
[package extraction](https://manpages.ubuntu.com/manpages/noble/man1/dpkg-deb.1.html).

### Checks

- `npm run test:resume`: content-parity and stale-file cleanup unit tests.
- `RESUME_PDF_INTEGRATION=1 npm run test:resume`: also run real-browser rendering,
  missing-stylesheet, invalid-print-style and one-page overflow checks on a Chromium-capable host.
- `npm run build`: verifies the actual current site and creates the PDF. Review
  `dist/resume.pdf` visually after changing the résumé layout or content.

The shared print résumé explicitly uses self-hosted Noto Sans (pinned Fontsource
5.3.0, regular and bold), matching the font family in the reviewed one-page PDF.
This prevents host-specific system fonts from changing pagination. Its OFL license
is included in `public/static/fonts/Noto-Sans-LICENSE.txt`. The build refuses to
publish a PDF longer than one page; it never shrinks or truncates content to fit.

Noto Sans adds about 745 KiB of built font assets (all supported subsets) and
8.1 MiB to the development install; browsers fetch only the subsets they use.
It needs no network request during the build or PDF render.

## License

MIT — see [LICENSE](LICENSE).
