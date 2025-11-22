import { defineConfig } from 'eslint/config';
import regexpPlugin from 'eslint-plugin-regexp';

const regexpPatterns = {
  files: ['**/*.{js,jsx,jsx,tsx,mts,cts,mjs,cjs}'],
};

// @see https://github.com/ota-meshi/eslint-plugin-regexp
export const regexp = defineConfig([
  {
    files: regexpPatterns.files,
    plugins: {
      regexp: regexpPlugin,
    },
    rules: {
      ...regexpPlugin.configs.recommended.rules,
      'regexp/prefer-result-array-groups': 'off',
    },
  },
]);
