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
└── post-build.js    # injects the rendered HTML back into the page for the IDE's index.html tab
```

Server-side data flows to the client through one inline bootstrap script
(`window.__SITE__`), keeping the IDE terminal's `window.msb` word-for-word identical to
the objects that render the page.

## Commands

| Command           | Action                                              |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4025`                      |
| `npm run check`   | Type-check (`astro check`, strict)                  |
| `npm run build`   | Type-check + production build + post-build injection |
| `npm run preview` | Preview the production build                        |
| `npm run deploy`  | Build and deploy via Wrangler                       |

## License

MIT — see [LICENSE](LICENSE).
