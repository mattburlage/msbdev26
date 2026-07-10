// Client entry point for the home page. Each module is side-effectful and
// self-guarding (it no-ops if its DOM isn't present); import order mirrors
// the original top-to-bottom execution order, and the terminal's imports pin
// ide-files / ide-mode / email ahead of it regardless.
//
// Data flows in via window.__SITE__ / __BENTO__ / __EMAIL__, set by the inline
// bootstrap script in index.astro, which runs during parse — strictly before
// these deferred modules.

import './email';
import './dot-grid';
import './marquee';
import './smooth-scroll';
import './ide-mode';
import './ide-resizers';
import './ide-files';
import './rendered-pane';
import './ide-terminal';
import './animations';
