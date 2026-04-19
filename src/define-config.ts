import { type Config, defineConfig as defineFlatConfig } from 'eslint/config';
import { getDefaultIgnorePatterns } from './getDefaultIgnorePatterns.js';

/**
 * Define a config.
 * @param config - The config to define.
 * @param ignores - An array of glob patterns indicating the files that the configuration object should not apply to.
 * @see {@link https://eslint.org/docs/latest/use/configure/configuration-files-new#ignores}
 * @returns The config.
 */
export const defineConfig = (
  config: Parameters<typeof defineFlatConfig>,
  ignores: string[] = []
): Config[] => {
  return defineFlatConfig(
    config.concat({
      ignores: getDefaultIgnorePatterns(ignores),
    })
  );
};
