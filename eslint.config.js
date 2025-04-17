import { base, defineConfig, sonarjs, tailwindcss } from './dist/index.js';

export default defineConfig([
  // ...typescript
  ...base,
  ...tailwindcss,
  ...sonarjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
