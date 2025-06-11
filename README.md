# @hyperse/eslint-config-hyperse

<p align="left">
  <a aria-label="Build" href="https://github.com/hyperse-io/eslint-config-hyperse/actions?query=workflow%3ACI">
    <img alt="build" src="https://img.shields.io/github/actions/workflow/status/hyperse-io/eslint-config-hyperse/ci-integrity.yml?branch=main&label=ci&logo=github&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="stable version" href="https://www.npmjs.com/package/@hyperse/eslint-config-hyperse">
    <img alt="stable version" src="https://img.shields.io/npm/v/%40hyperse%2Feslint-config-hyperse?branch=main&label=version&logo=npm&style=flat-quare&labelColor=000000" />
  </a>
  <a aria-label="Top language" href="https://github.com/hyperse-io/eslint-config-hyperse/search?l=typescript">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/hyperse-io/eslint-config-hyperse?style=flat-square&labelColor=000&color=blue">
  </a>
  <a aria-label="Licence" href="https://github.com/hyperse-io/eslint-config-hyperse/blob/main/LICENSE">
    <img alt="Licence" src="https://img.shields.io/github/license/hyperse-io/eslint-config-hyperse?style=flat-quare&labelColor=000000" />
  </a>
</p>

🛠 A comprehensive ESLint and Prettier configuration for TypeScript projects, with support for monorepos and ESM. Optimized for Next.js and React applications. ⚡️

## Features

- 🎯 **TypeScript & JavaScript Linting**: Latest standards-based linting for both TypeScript and JavaScript
- 🔧 **Multiple Config Presets**: Ready-to-use configurations for `react`, `hooks`, `next`, and more
- 📝 **Shared TypeScript Config**: Pre-configured `tsconfig.json` for consistent TypeScript settings
- 💅 **Prettier Integration**: Automatic code formatting with sensible defaults
- ♿️ **Accessibility**: Built-in rules for JSX accessibility
- 📦 **Monorepo Support**: Optimized for monorepo setups
- 🔄 **Module Support**: Full compatibility with both ESM and CommonJS
- 🎨 **Tailwind CSS**: Built-in support for Tailwind CSS class sorting
- 🔍 **SonarJS**: Optional integration for code quality rules

# Installation & Configuration

## Basic Setup

1. Initialize your project (if needed):

   ```bash
   npm init
   ```

2. Install the ESLint config:

   ```bash
   npm i -D @hyperse/eslint-config-hyperse
   ```

3. Create ESLint configuration:

   - Create `eslint.config.js` (or `eslint.config.mjs` for CommonJS) in your project root
   - Add the base configuration:

   ```ts
   import { base, defineConfig } from '@hyperse/eslint-config-hyperse';

   export default defineConfig([
     ...base,
     {
       rules: {
         '@typescript-eslint/no-explicit-any': 'off',
       },
     },
   ]);
   ```

## TypeScript Configuration

### Base Configuration (`tsconfig.json`)

```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "@hyperse/eslint-config-hyperse/tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": "./",
    "rootDir": ".",
    "outDir": "dist",
    "types": ["vitest/globals"],
    "paths": {}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"]
}
```

### Build Configuration (`tsconfig.build.json`)

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": "./",
    "incremental": false,
    "paths": {}
  },
  "exclude": ["**/*.stories.tsx", "**/*.stories.mdx", ".storybook/**", "dist"]
}
```

## Available Scripts

Add to your `package.json`:

```json
{
  "scripts": {
    "lint": "tsc --noEmit && eslint .",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

Or for JavaScript-only projects:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

## Framework-Specific Configurations

### Next.js

```ts
import { defineConfig, nextjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  ...nextjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
```

### React.js (without Next.js)

```ts
import { defineConfig, reactjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  ...reactjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
```

### SonarJS Integration

```ts
import { defineConfig, sonarjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  ...sonarjs,
  {
    rules: {
      'sonarjs/fixme-tag': 'warn',
      'sonarjs/todo-tag': 'warn',
    },
  },
]);
```

## VS Code Integration

1. Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

2. Configure VS Code settings (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "never"
  },
  "[jsonc]": { "editor.formatOnSave": false },
  "[json]": { "editor.formatOnSave": false },
  "eslint.workingDirectories": [
    "./apps/docs",
    "./apps/web",
    "./packages/core",
    "./packages/utils"
  ],
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "tailwindCSS.classFunctions": ["tw", "clsx", "twMerge", "extendVariants"],
  "tailwindCSS.classAttributes": ["className", "classNames"],
  "tailwindCSS.experimental.configFile": {
    "apps/web/src/app/globals.css": "apps/web/src/**",
    "apps/docs/src/app/globals.css": "apps/docs/src/**"
  }
}
```

## Additional Configuration

### Prettier Configuration

Create `prettier.config.mjs`:

```js
/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  // ... your custom config
};

export default config;
```

### Tailwind CSS Integration

1. Add type support in `types.d/global.d.ts`:

```ts
import 'prettier';
import 'prettier-plugin-tailwindcss';
```

2. Configure Tailwind in `prettier.config.mjs`:

```ts
const config = {
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['tw', 'clsx', 'twMerge', 'extendVariants'],
  tailwindAttributes: ['className', 'classNames'],
};

export default config;
```

## Important Notes

- TypeScript settings:
  - `isolatedModules`: true (default)
  - `verbatimModuleSyntax`: true (default)
- JSON/JSONC files: VS Code formatting is disabled by default
- React ESLint rules: See [source code](https://github.com/hyperse-io/eslint-config-hyperse/blob/1e23efbfb64f4e5a8b0c6387d187b7f6341f1e61/src/rules/react.ts)
