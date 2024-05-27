import { swcUnpluginTs } from 'swc-unplugin-ts';
import tsConfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsConfigPaths(), swcUnpluginTs.vite({})],
  resolve: {
    // https://github.com/aleclarson/vite-tsconfig-paths/issues/54
    alias: [
      // handle `@/*.js`
      { find: /^(@\/.*)\.js$/, replacement: '$1.ts' },
    ],
  },
  cacheDir: '.cache/vitest/main',
  test: {
    // Makebe suite for local debug
    testTimeout: 50000000,
    globals: true,
    environment: 'node',
    passWithNoTests: true,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'clover'],
      extension: ['js', 'jsx', 'ts', 'tsx'],
    },
    include: ['**/?(*.){test,spec}.?(c|m)[jt]s?(x)'],
    exclude: [
      '**/node_modules/**',
      'dist/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp}/**',
    ],
  },
});
