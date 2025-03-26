import { defineFlatConfig } from 'eslint-define-config';
import * as pluginMdx from 'eslint-plugin-mdx';

export const mdx = defineFlatConfig([
  {
    ...(pluginMdx.flat as any),
  },
]);
