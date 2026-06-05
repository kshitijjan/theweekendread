// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  output: 'server',
  adapter: node({
    mode: 'standalone'
  }),
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()]
  }
});