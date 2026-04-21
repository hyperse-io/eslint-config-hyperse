import { defineConfig } from 'eslint/config';
import { definePrettierConfig } from '../definePrettierConfig.js';
const { ...prettierConfig } = definePrettierConfig();
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
