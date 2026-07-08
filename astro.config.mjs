import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ],
  server: {
    port: 4025,
    allowedHosts: ['msb.ngrok.app'],
  },
  build: {
    format: 'file',
  },
  vite: {
    server: {
      watch: {
        usePolling: true,
      },
    },
  },
});