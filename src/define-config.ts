import { defineFlatConfig, FlatESLintConfig } from 'eslint-define-config';
import { getDefaultIgnorePatterns } from './getDefaultIgnorePatterns.js';

export const defineConfig = (
  config: ReadonlyArray<FlatESLintConfig>,
  ignores: string[] = []
): FlatESLintConfig[] => {
  return defineFlatConfig(
    config.concat({
      ignores: getDefaultIgnorePatterns(ignores),
    })
  );
};
