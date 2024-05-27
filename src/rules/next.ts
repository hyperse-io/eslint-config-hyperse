import { defineFlatConfig } from 'eslint-define-config';
import pluginNext from '@next/eslint-plugin-next';

export const next = defineFlatConfig([
  {
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
  {
    ignores: ['.next/*'],
  },
]);
