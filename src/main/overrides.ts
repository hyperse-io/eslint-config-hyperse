import type { FlatESLintConfig } from 'eslint-define-config';
import { defineFlatConfig } from 'eslint-define-config';
import tseslint from 'typescript-eslint';

export const overrides = defineFlatConfig([
  {
    ...tseslint.configs.base,
    languageOptions: {
      // https://typescript-eslint.io/users/configs/#stylistic-type-checked
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        // https://github.com/typescript-eslint/typescript-eslint/issues/10200
        // Support `nestjs` decorator metadata, constructor DI class, we can not import type for `nestjs`
        emitDecoratorMetadata: true,
      },
    },
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
