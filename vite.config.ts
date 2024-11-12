import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/pricing_tool/',
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    commonjsOptions: {
      include: [/lucide-react/, /node_modules/],
    },
    chunkSizeWarningLimit: 1000
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
});
