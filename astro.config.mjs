// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import clerk from '@clerk/astro';

// https://astro.build/config
export default defineConfig({
  server: {
    host: '0.0.0.0'
  },
  output: 'server',
  adapter: cloudflare(),
  integrations: [clerk()],
  vite: {
    plugins: [tailwindcss()]
  }
});