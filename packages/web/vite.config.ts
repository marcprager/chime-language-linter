import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/chime-language-linter/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@chime-linter/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
