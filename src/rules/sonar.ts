import { defineFlatConfig } from 'eslint-define-config';
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
export const sonar = defineFlatConfig([
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
    },
  },
]);
