import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

// @see https://typescript-eslint.io/users/configs/
export const typescript = defineConfig(
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended
  // ...tseslint.configs.recommendedTypeChecked,
  // ...tseslint.configs.stylisticTypeChecked
);
