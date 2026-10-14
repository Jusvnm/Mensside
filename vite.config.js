import { defineConfig } from 'vite';

// Prototipo local. La publicación (dominio/hosting) queda para una fase posterior.
export default defineConfig({
  base: './',
  server: { host: '127.0.0.1', port: 5173 },
  build: { target: 'es2020' },
});
