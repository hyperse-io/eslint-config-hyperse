import { type Config } from 'prettier';

const prettierBaseConfig = {
  // use single quotes instead of double quotes
  singleQuote: true,
  // add semicolons at the end of statements
  semi: true,
  // add trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',
  // maintain the line endings of the file
  endOfLine: 'auto',
} satisfies Config;

export const getPrettierConfig = (config: Config = {}): Config => {
  return {
    ...prettierBaseConfig,
    ...config,
    // highlight priority on .prettierrc
    plugins: ['prettier-plugin-tailwindcss'],
  };
};
