import { defineFlatConfig } from 'eslint-define-config';
import pluginMdx from 'eslint-plugin-markdown';

export const mdx = defineFlatConfig([...pluginMdx.configs.recommended]);
