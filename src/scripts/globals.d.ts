// Window globals shared between the inline bootstrap script (index.astro),
// the post-build injection (scripts/post-build.js), and the client modules.

import type { SiteData } from '../lib/ide-code';
import type { BentoData } from '../data/builds';

declare global {
  interface Window {
    /** Injected by the inline bootstrap script in index.astro. */
    __SITE__: SiteData;
    __BENTO__: BentoData;
    __EMAIL__: string;
    /** Injected into dist/index.html by scripts/post-build.js (production builds only). */
    __RENDERED_HTML__?: string;

    /** REPL surface installed by ide-terminal.ts. */
    msb: SiteData['msb'] & {
      skills(): string[];
      reveal(skill?: unknown): void;
      experience(): SiteData['experience'];
      contact(): void;
    };
    ls: () => string[];
    openTab: (f: string) => string;
    /** The original window.open, stashed by the REPL's open() file-opener shim. */
    open_: typeof window.open;
  }
}

export {};
