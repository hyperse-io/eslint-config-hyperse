import { type Config, defineConfig as defineFlatConfig } from 'eslint/config';
import { getDefaultIgnorePatterns } from './getDefaultIgnorePatterns.js';

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
