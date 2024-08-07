import { defineFlatConfig } from 'eslint-define-config';
import pluginVitest from 'eslint-plugin-vitest-2';

const vitestPatterns = {
  files: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
};

// @see https://github.com/veritem/eslint-plugin-vitest
export const vitest = defineFlatConfig([
  {
    files: vitestPatterns.files,
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      // you can also use vitest.configs.all.rules to enable all rules
      ...pluginVitest.configs.recommended.rules,
      // you can also modify rules' behavior using option like this
      'vitest/max-nested-describe': ['error', { max: 3 }],
      'vitest/no-disabled-tests': 2,
      'vitest/valid-title': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-object-literal-type-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
    },
    settings: {
      vitest: {
        typecheck: true,
      },
    },
    languageOptions: {
      globals: {
        ...pluginVitest.environments.env.globals,
      },
    },
  },
]);
