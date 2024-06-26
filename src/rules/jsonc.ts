import { defineFlatConfig } from 'eslint-define-config';
import eslintPluginJsonc from 'eslint-plugin-jsonc';

export const jsonc = defineFlatConfig([
  ...eslintPluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    rules: {
      // override/add rules settings here, such as:
      // 'jsonc/rule-name': 'error'
    },
  },
]);
