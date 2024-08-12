import { defineFlatConfig } from 'eslint-define-config';
import pluginMdx from 'eslint-plugin-mdx';

export const mdx = defineFlatConfig([
  {
    ...(pluginMdx.flat as any),
  },
]);
