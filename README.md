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

🛠 These are my settings for TypeScript / ESLint / Prettier in a project, also support mono / esm 📦

These are the ESLint and Prettier settings for a Next.js project ⚡️

# Table of Contents

- [Eslint / Prettier Setup of @hyperse 📦](#eslint--prettier-setup-of-hyperse)
- [Table of Contents](#table-of-contents)
  - [What it does](#what-it-does)
  - [Local / Per Project Install](#local--per-project-install)
  - [Scripts](#scripts)
  - [Extends tsconfig.json](#extends-tsconfigjson)
  - [If you use Next.js](#if-you-use-nextjs)
  - [If you use React.js](#if-you-use-reactjs)
  - [If you use VS Code](#if-you-use-vs-code)

## What it does

- Lints JavaScript / TypeScript based on the latest standards
- Multiple configs `react` `hooks` `next`..
- Shared `tsconfig.json`
- Fixes issues and formatting errors with Prettier
- Check for accessibility rules on JSX elements.

## Local / Per Project Install

1. If you don't already have a `package.json` file, create one with `npm init`.

2. Then we need to install the config:

```
npm i -D @hyperse/eslint-config-hyperse
```

1. Create a `eslint.config.js` file in the root of your project's directory (it should live where package.json does). Your `eslint.config.js` file should look like this:
2. if you are using `commonjs`, just change `eslint.config.js` to `eslint.config.mjs`
3. Extends your config with the minimal base of `@hyperse` config :

```ts
import { base, defineConfig } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  // ...typescript
  ...base,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
```

### Extends tsconfig.json

you can write you `tsconfig.json` via extends `@hyperse/eslint-config-hyperse/tsconfig.base.json`

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

write you `tsconfig.build.json` as below

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

### Scripts

You can add two scripts to your package.json to lint and/or fix your code:

```json
{
  "scripts": {
    "lint": "tsc --noEmit && eslint .",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "npm run lint -- --fix"
  }
}
```

## If you use Next.js

You can also add additional rules for Next.js

```ts
import { defineConfig, nextjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  // ...typescript
  ...nextjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
```

## If you use React.js

You can also add additional rules for only React.js ecosystem (without Next.js).

```ts
import { defineConfig, reactjs } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  // ...typescript
  ...reactjs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]);
```

## If you use VS Code

Once you have done. You probably want your editor to lint and fix for you.

1. Install the [ESLint package](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Now we need to setup some VS Code settings. Create a `.vscode` folder at your root project, and create a `settings.json` file in this folder. Then, add this little config:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "dbaeumer.vscode-eslint",
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit",
    "source.organizeImports": "never"
  },
  "[jsonc]": {
    "editor.formatOnSave": false
  },
  "[json]": {
    "editor.formatOnSave": false
  }
}
```

## Notes

we need to disable vscode editor language formatter for `json, jsonc`

```json
{
  "[jsonc]": {
    "editor.formatOnSave": false
  },
  "[json]": {
    "editor.formatOnSave": false
  }
}
```

1. Isolated Modules - isolatedModules (default:`true`)
2. Verbatim Module Syntax - verbatimModuleSyntax (default:`true`)
