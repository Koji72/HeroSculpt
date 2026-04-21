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
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three'],
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
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
