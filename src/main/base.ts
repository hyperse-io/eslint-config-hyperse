import { defineFlatConfig } from 'eslint-define-config';
import {
  imports,
  jsonc,
  mdx,
  prettier,
  regexp,
  typescript,
  vitest,
} from '../rules/index.js';
import { overrides } from './overrides.js';

export const base = defineFlatConfig([
  ...typescript,
  ...vitest,
  ...imports,
  ...prettier,
  ...regexp,
  ...jsonc,
  ...mdx,
  ...overrides,
]);
