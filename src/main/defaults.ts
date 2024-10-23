import type { FlatESLintConfig } from 'eslint-define-config';
import { defineFlatConfig } from 'eslint-define-config';
import tseslint from 'typescript-eslint';

export const defaults = defineFlatConfig([
  {
    ...tseslint.configs.base,
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { disallowTypeAnnotations: false },
      ],
    },
  } as FlatESLintConfig,
]);
