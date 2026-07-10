// Tailwind 3 runs as a plain PostCSS plugin. Its Astro integration
// (@astrojs/tailwind) was retired at Astro 5 and is not compatible with
// Astro 6+; this file replaces it. Theme lives in tailwind.config.mjs.
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
