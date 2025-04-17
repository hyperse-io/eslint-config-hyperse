import { defineFlatConfig } from 'eslint-define-config';
import { tailwind } from '../rules/index.js';

export const tailwindcss = defineFlatConfig([...tailwind]);
