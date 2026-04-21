import { definePrettierConfig } from '../../dist/definePrettierConfig.js';

/**
 * Example app: use the package name once published (`@hyperse/eslint-config-hyperse`).
 * In this workspace we import the built helper relative to the repo root.
 *
 * @see https://prettier.io/docs/configuration
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#installation
 */
export default definePrettierConfig({
  tailwindStylesheet: './src/app.css',
});
