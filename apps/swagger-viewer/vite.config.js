import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    disabled: false,
  },
  build: {
    minify: true,
    commonjsOptions: {
      include: [],
    },
  },
});
