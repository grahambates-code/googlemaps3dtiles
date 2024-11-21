import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  plugins: [react(), ghPages()],
  build: {
    minify: false, // Disable minification for easier debugging
  },
  esbuild: {
    logOverride: { 'tsconfig.json': 'silent' },
  },
  server: {
    host: true, // Allows access from external networks
    port: 5173,
    https: false, // Optional: Change to true if needed
  },
  base: '/googlemaps3dtiles/', // Replace with your repository name
});
