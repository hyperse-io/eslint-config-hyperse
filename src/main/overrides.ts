import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';

export const overrides = defineConfig([
  {
    ...tseslint.configs.base,
    languageOptions: {
      parserOptions: {
        // https://typescript-eslint.io/users/configs/#stylistic-type-checked
        //
        // `projectService` builds a TypeScript program covering every linted
        // file. Its cost scales with the repository's total type surface rather
        // than with the size of the file being linted, so it dominates lint
        // memory in larger repositories — ~3.5GB of heap on a ~2k-file
        // package spanning 4 TS projects.
        //
        // It stays on because `@typescript-eslint/consistent-type-imports`
        // reads `emitDecoratorMetadata` / `experimentalDecorators` from parser
        // services and, when both are set, skips any file containing a
        // decorator (typescript-eslint#5468). Those imports are still needed
        // at runtime for `design:type` metadata, so `import type` would break
        // NestJS / TypeORM consumers. Without the program that guard is
        // silently disabled and the rule emits false positives whose autofix
        // strips the imports.
        //
        // Turning this off therefore requires also turning off
        // `consistent-type-imports`; see the README section "Type-aware rules
        // are opt-in" for the trade-off and the measurements.
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
      /**
       * Disabled by default.
       *
       * This is the only type-aware rule the preset ships and the trigger for
       * out-of-memory lint runs: measured on a ~2k-file package spanning 4 TS
       * projects, enabling it makes `eslint .` exceed the default Node heap.
       * `TIMING=1` also shows it consuming ~27.8s of rule time, 62% of the
       * total and ~2.3x the next most expensive rule (`prettier/prettier`).
       *
       * Re-enable per project when the repository is small enough to afford
       * it — see the README section "`@typescript-eslint/no-deprecated` is
       * opt-in".
       */
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
]);
