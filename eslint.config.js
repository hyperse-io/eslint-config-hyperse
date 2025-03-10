import { base, defineConfig, sonarjs } from './dist/index.js';

export default defineConfig([
  // ...typescript
  ...base,
  ...sonarjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
