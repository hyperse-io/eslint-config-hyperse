import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintJs from '@eslint/js';
import eslintReact from '@eslint-react/eslint-plugin';

const reactPatterns = {
  files: ['**/*.{jsx,tsx}'],
};
export const react = defineConfig([
  {
    files: reactPatterns.files,
    // Extend recommended rule sets from:
    // 1. ESLint JS's recommended rules
    // 2. TypeScript ESLint recommended rules
    // 3. ESLint React's recommended-typescript rules
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs['recommended-typescript'],
    ],
    languageOptions: {
      // Use TypeScript ESLint parser for TypeScript files
      parser: tseslint.parser,
      parserOptions: {
        // Enable project service for better TypeScript integration
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Custom rule overrides (modify rule levels or disable rules)
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
]);
