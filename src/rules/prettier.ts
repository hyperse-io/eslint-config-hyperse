import { defineConfig } from 'eslint/config';
import { getPrettierConfig } from '../getPrettierConfig.js';
const { ...prettierConfig } = getPrettierConfig();
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export const prettier = defineConfig([
  {
    ...eslintPluginPrettier,
    rules: {
      ...eslintPluginPrettier.rules,
      'prettier/prettier': ['error', prettierConfig],
    },
  },
]);
