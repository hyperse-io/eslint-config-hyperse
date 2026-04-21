import type { Config } from 'prettier';

const TAILWIND_PLUGIN = 'prettier-plugin-tailwindcss' as const;

export const prettierBaseOptions = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
} satisfies Config;

/**
 * Ensures `prettier-plugin-tailwindcss` is present exactly once and last, per
 * https://github.com/tailwindlabs/prettier-plugin-tailwindcss#compatibility-with-other-prettier-plugins
 */
export function finalizePrettierPlugins(
  plugins: Config['plugins']
): NonNullable<Config['plugins']> {
  const list = normalizePlugins(plugins);
  const withoutTailwind = list.filter((p) => p !== TAILWIND_PLUGIN);
  return [...withoutTailwind, TAILWIND_PLUGIN];
}

function normalizePlugins(
  plugins: Config['plugins']
): NonNullable<Config['plugins']> {
  if (plugins === undefined) {
    return [];
  }
  return Array.isArray(plugins) ? [...plugins] : [plugins];
}
