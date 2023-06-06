import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
    }),
  ],
  test: {
    globals: true,
    environment: 'happy-dom', // jsdomの代わりにhappy-domを設定した
    setupFiles: [],
    coverage: {
      provider: 'c8',
    },
    restoreMocks: true, // restore mocks before every tests run
  },
});
