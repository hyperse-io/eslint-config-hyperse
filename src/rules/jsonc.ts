import { defineConfig } from 'eslint/config';
import pluginJsonc from 'eslint-plugin-jsonc';

export const jsonc = defineConfig([
  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    rules: {
      // override/add rules settings here, such as:
      // 'jsonc/rule-name': 'error'
    },
  },
]);
