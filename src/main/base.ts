import { defineFlatConfig } from 'eslint-define-config';
import {
  imports,
  mdx,
  prettier,
  regexp,
  sonar,
  typescript,
  vitest,
} from '../rules/index.js';
import { jsonc } from '../rules/jsonc.js';

export const base = defineFlatConfig([
  ...typescript,
  ...vitest,
  ...imports,
  ...prettier,
  ...regexp,
  ...sonar,
  ...jsonc,
  ...mdx,
]);
