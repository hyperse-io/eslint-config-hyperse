import { type Config } from 'prettier';

const prettierBaseConfig = {
  // add semicolons at the end of statements
  semi: true,
  // use single quotes instead of double quotes
  singleQuote: true,
  // add trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  // keep it as default value for windows, mac endOfLine(lf).
} satisfies Config;

export const getPrettierConfig = (config: Config = {}): Config => {
  return {
    ...prettierBaseConfig,
    ...config,
    // highlight priority on .prettierrc
    plugins: ['prettier-plugin-tailwindcss'],
  };
};
