import { defineConfig } from 'eslint/config';
import * as pluginMdx from 'eslint-plugin-mdx';

export const mdx = defineConfig([
  {
    ...pluginMdx.flat,
  },
]);
