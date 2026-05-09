import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
      'process.env.GEMINI_API_KEY': JSON.stringify(env['GEMINI_API_KEY']),
      '__APP_VERSION__': JSON.stringify(process.env['npm_package_version'] || '1.0.0'),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2022',
      minify: 'esbuild',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            charts: ['recharts'],
            icons: ['lucide-react'],
          },
        },
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'recharts', 'lucide-react'],
    },
  };
});
