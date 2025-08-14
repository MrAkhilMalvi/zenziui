import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    server: isDev
      ? {
          host: '::',
          port: 8081,
          proxy: {
            '/api': {
              target: 'http://localhost:3001',
              changeOrigin: true,
              secure: false,
            },
          },
        }
      : undefined,
    plugins: [react()],
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
    build: { outDir: 'dist' },
  };
});
