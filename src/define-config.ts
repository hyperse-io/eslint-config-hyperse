import { type Config, defineConfig as defineFlatConfig } from 'eslint/config';
import { getDefaultIgnorePatterns } from './getDefaultIgnorePatterns.js';
import {
  getGitignoreIgnorePatterns,
  resolveIgnoresCwd,
} from './getGitignoreIgnorePatterns.js';

export interface DefineConfigOptions {
  /**
   * Extra ignore globs appended after the defaults and any `.gitignore`
   * derived patterns.
   */
  ignores?: string[];
  /**
   * Directory whose `.gitignore` chain should be honoured.
   *
   * Defaults to `process.cwd()`. Only set this when the config is authored
   * somewhere other than where eslint is invoked.
   */
  cwd?: string;
  /**
   * Set `false` to opt out of deriving ignores from `.gitignore`.
   *
   * Not recommended: ESLint does not read `.gitignore` on its own, so build
   * artifacts would be linted. See {@link getGitignoreIgnorePatterns} for why
   * that can make linting appear to hang.
   *
   * @default true
   */
  useGitignore?: boolean;
}

/**
 * Define an ESLint config with sane, high-performance ignore defaults.
 *
 * ## Ignore resolution order
 *
 * 1. Built-in defaults (`dist`, `build`, `node_modules`, …)
 * 2. Patterns derived from the project's `.gitignore` chain
 * 3. `options.ignores`
 *
 * ## Backwards compatibility
 *
 * The legacy `defineConfig(config, ignores)` call signature is still
 * supported:
 *
 * ```ts
 * export default defineConfig([...base], ['scripts/out/**']);
 * ```
 *
 * The object form is preferred for new code:
 *
 * ```ts
 * export default defineConfig([...base], {
 *   ignores: ['scripts/out/**'],
 *   useGitignore: true,
 * });
 * ```
 *
 * @param config - The flat config array.
 * @param ignoresOrOptions - Legacy ignore array, or an options object.
 */
export const defineConfig = (
  config: Parameters<typeof defineFlatConfig>,
  ignoresOrOptions: string[] | DefineConfigOptions = []
): Config[] => {
  const options: DefineConfigOptions = Array.isArray(ignoresOrOptions)
    ? { ignores: ignoresOrOptions }
    : ignoresOrOptions;

  const { ignores = [], cwd, useGitignore = true } = options;

  const gitignorePatterns = useGitignore
    ? getGitignoreIgnorePatterns(resolveIgnoresCwd(cwd))
    : [];

  return defineFlatConfig(
    config.concat({
      ignores: getDefaultIgnorePatterns([...gitignorePatterns, ...ignores]),
    })
  );
};
