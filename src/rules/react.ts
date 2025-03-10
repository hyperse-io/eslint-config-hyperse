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
  },
  {
    files: reactPatterns.files,
    ...pluginReactHooks.configs['recommended-latest'],
  },
]);
