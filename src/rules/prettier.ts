import { defineFlatConfig } from 'eslint-define-config';
import { getPrettierConfig } from '../getPrettierConfig.js';
const { ...prettierConfig } = getPrettierConfig();
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export const prettier = defineFlatConfig([
  {
    ...(eslintPluginPrettier as any),
    rules: {
      ...eslintPluginPrettier.rules,
      'prettier/prettier': ['error', prettierConfig],
    },
  },
  {
    files: ['**/*.json'],
    rules: {
      'prettier/prettier': ['error', prettierConfig],
      '@typescript-eslint/no-unused-expressions': 'off',
    },
  },
]);
