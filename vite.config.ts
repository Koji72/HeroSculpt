import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  },
  build: {
    minify: 'esbuild',
  },
  server: {
    port: 5177,
    watch: {
      ignored: [
        '**/backup_*/**',
        '**/node_modules/**',
        '**/.git/**',
        '**/UI EXAMPLES/**',
        '**/docs/ui-prototype/**'
      ]
    }
  }
});
