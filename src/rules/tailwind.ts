import { defineFlatConfig } from 'eslint-define-config';
import tailwindcss from 'eslint-plugin-tailwindcss';

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss
export const tailwind = defineFlatConfig([
  ...tailwindcss.configs['flat/recommended'],
]);
