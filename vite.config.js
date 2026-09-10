import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      ignored: ['**/anh/**'],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        duan: resolve(__dirname, 'duan/index.html'),
      },
    },
  },
});
