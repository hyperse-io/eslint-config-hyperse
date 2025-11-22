import { defineConfig } from 'eslint/config';
import sonarjs from 'eslint-plugin-sonarjs';

const sonarPatterns = {
  files: ['**/*.{js,jsx,ts,tsx,mts,cts,mjs,cjs}'],
  excludedFiles: [
    '**/?(*.)+(test).{js,jsx,ts,tsx,mts,cts,mjs,cjs}',
    '**/?(*.)+(spec).{js,jsx,ts,tsx,mts,cts,mjs,cjs}',
    '*.stories.{js,ts,jsx,tsx,mts,cts,mjs,cjs}',
  ],
};

// @see https://github.com/SonarSource/eslint-plugin-sonarjs
export const sonar = defineConfig([
  {
    files: sonarPatterns.files,
    ignores: sonarPatterns.excludedFiles,
    plugins: {
      sonarjs: sonarjs,
    },
    rules: {
      ...sonarjs.configs.recommended.rules,
      'sonarjs/cognitive-complexity': ['error', 20],
      'sonarjs/max-switch-cases': ['error', 20],
      'sonarjs/no-all-duplicated-branches': 'error',
      'sonarjs/no-element-overwrite': 'error',
      'sonarjs/no-identical-functions': 'error',
      'sonarjs/no-identical-expressions': 'error',
      'sonarjs/no-hook-setter-in-body': 'off',
      'sonarjs/public-static-readonly': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/fixme-tag': 'warn',
      'sonarjs/todo-tag': 'warn',
      // NOTE: performance issue for this rule
      // https://community.sonarsource.com/t/eslint-plugin-sonarjs-performance-issues-on-large-codebase/138392
      'sonarjs/no-commented-code': 'off',
      // NOTE: This rule has performance issue and now use `@typescript-eslint/no-deprecated` instead
      'sonarjs/deprecation': 'off',
    },
  },
]);
