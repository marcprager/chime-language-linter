import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  // For GitHub Pages: set to '/chime-language-linter/'
  // For custom domain or internal hosting: set to '/'
  base: '/chime-language-linter/',
  plugins: [react()],
  resolve: {
    alias: {
      '@chime-linter/core': path.resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
