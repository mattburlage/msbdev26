import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [mdx()],
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
