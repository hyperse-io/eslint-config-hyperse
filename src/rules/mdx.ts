import { defineFlatConfig } from 'eslint-define-config';
import pluginMdx from 'eslint-plugin-mdx';

export const mdx = defineFlatConfig([
  {
    ...(pluginMdx.flat as any),
    // optional, if you want to lint code blocks at the same
    processor: pluginMdx.createRemarkProcessor({
      lintCodeBlocks: true,
      // optional, if you want to disable language mapper, set it to `false`
      // if you want to override the default language mapper inside, you can provide your own
      languageMapper: {},
    }),
  },
]);
