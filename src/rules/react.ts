import { defineFlatConfig } from 'eslint-define-config';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const reactPatterns = {
  files: ['**/*.{jsx,tsx}'],
};
export const react = defineFlatConfig([
  {
    files: reactPatterns.files,
    ...pluginReact.configs.flat.recommended,
    languageOptions: {
      ...pluginReact.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
    rules: {
      // The full available rules before can be found here
      // https://github.com/hyperse-io/eslint-config-hyperse/blob/1e23efbfb64f4e5a8b0c6387d187b7f6341f1e61/src/rules/react.ts
      ...pluginReact.configs.flat.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: reactPatterns.files,
    ...pluginReactHooks.configs['recommended-latest'],
  },
]);
