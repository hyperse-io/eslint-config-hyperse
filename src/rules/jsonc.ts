import { defineFlatConfig } from 'eslint-define-config';
import pluginJsonc from 'eslint-plugin-jsonc';

export const jsonc = defineFlatConfig([
  ...pluginJsonc.configs['flat/recommended-with-jsonc'],
  {
    rules: {
      // override/add rules settings here, such as:
      // 'jsonc/rule-name': 'error'
    },
  },
]);
