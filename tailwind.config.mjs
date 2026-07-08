import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#050507',
          900: '#0b0b10',
          800: '#13131b',
          700: '#1e1e2a',
          500: '#3a3a4d',
          400: '#7c7c94',
          200: '#c4c4d4',
          100: '#ececf2',
        },
        volt: {
          DEFAULT: 'var(--accent)',
          dim: 'var(--accent-dim)',
        },
        syn: {
          kw: '#c084fc',
          str: 'var(--accent)',
          fn: '#7dd3fc',
          num: '#fbbf24',
          cm: '#4b5568',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [typography],
};