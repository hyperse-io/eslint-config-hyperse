import type { Config } from 'prettier';
import type { PluginOptions } from 'prettier-plugin-tailwindcss';
import {
  finalizePrettierPlugins,
  prettierBaseOptions,
} from './prettierShared.js';

export type HypersePrettierConfig = Config & PluginOptions;

export const definePrettierConfig = (
  config: Config & Partial<PluginOptions> = {}
): HypersePrettierConfig => {
  const { plugins, ...rest } = config;
  return {
    ...prettierBaseOptions,
    ...rest,
    plugins: finalizePrettierPlugins(plugins),
  };
};
