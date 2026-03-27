import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // ✅ deve ser 'dist' para o Dockerfile
  },
  server: {
    port: 5173,
  },
});