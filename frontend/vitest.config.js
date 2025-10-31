import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,              // ✅ Enables describe/it/expect/vi globally
    environment: 'jsdom',
    setupFiles: './src/tests/setup.js',
  },
});
