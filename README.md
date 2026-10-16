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

Use `definePrettierConfig()` so Prettier CLI matches ESLint `prettier/prettier` (base options and `prettier-plugin-tailwindcss`, with the plugin always last when you add more plugins). The name mirrors this package’s `defineConfig` helper for ESLint.

Create `prettier.config.mjs`:

```js
import { definePrettierConfig } from '@hyperse/eslint-config-hyperse';

/**
 * @see https://prettier.io/docs/configuration
 * @see https://github.com/tailwindlabs/prettier-plugin-tailwindcss#installation
 */
export default definePrettierConfig({
  // ...your overrides (e.g. Tailwind v4)
});
```

Optional slim import (no ESLint stack): `@hyperse/eslint-config-hyperse/definePrettierConfig` (the legacy path `@hyperse/eslint-config-hyperse/getPrettierConfig` still resolves to the same module).

The previous name `getPrettierConfig` remains exported but is deprecated; prefer `definePrettierConfig`.

### Tailwind CSS Integration

Configure Tailwind via `definePrettierConfig` (paths are resolved relative to this config file):

```js
import { definePrettierConfig } from '@hyperse/eslint-config-hyperse';

export default definePrettierConfig({
  tailwindStylesheet: './src/app/globals.css',
  tailwindFunctions: ['tw', 'clsx', 'twMerge', 'extendVariants'],
  tailwindAttributes: ['className', 'classNames'],
});
```

## Important Notes

- TypeScript settings:
  - `isolatedModules`: true (default)
  - `verbatimModuleSyntax`: true (default)
- JSON/JSONC files: VS Code formatting is disabled by default
- React ESLint rules: See [source code](https://github.com/hyperse-io/eslint-config-hyperse/blob/1e23efbfb64f4e5a8b0c6387d187b7f6341f1e61/src/rules/react.ts)

### Performance Considerations

The following ESLint rules may impact performance during linting/formatting:

- `prettier/prettier`: Can be slow on large files due to full reformatting
- `sonarjs/arguments-order`: Complex analysis of function argument usage patterns

Consider selectively disabling these rules for specific files if performance becomes an issue.

#### `@typescript-eslint/no-deprecated` is opt-in

This rule is the only type-aware rule the preset ships, and it is **disabled by
default** because enabling it is what pushes `eslint .` past the default Node
heap on larger repositories.

Measured on a ~2k-file monorepo package spanning 4 TS projects, from repeated
runs against the default Node heap (~4GB):

| configuration                                  | outcome                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `projectService: true` + `no-deprecated: warn` | `eslint .` exits with `Ineffective mark-compacts near heap limit` |
| `projectService: true` + `no-deprecated: off`  | completes; needs >3GB of heap                                     |

`TIMING=1` also shows the rule consuming **~27.8s** of rule time — 62% of the
total, and ~2.3x the next most expensive rule (`prettier/prettier` at ~12.1s).

Re-enable it per project when the repository is small enough to afford it:

```ts
import { base, defineConfig } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  ...base,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-deprecated': 'warn',
    },
  },
]);
```

> **Keep the `files` selector, and don't enable it with the CLI `--rule` flag.**
> `--rule` applies to every file ESLint visits, not just TypeScript. Files
> matched by other configs — `.json` among them — carry no `parserOptions`, so
> the run aborts with:
>
> ```text
> Error while loading rule '@typescript-eslint/no-deprecated':
> You have used a rule which requires type information, but don't have
> parserOptions set to generate type information for this file.
> ```
>
> Configure it in `eslint.config.js` as above instead.

#### `projectService` stays on, and why

`projectService` builds a TypeScript program covering every linted file, and
that program is where the remaining >3GB of heap goes. It is kept enabled
because `@typescript-eslint/consistent-type-imports` depends on it for
correctness, not just accuracy.

The rule reads `emitDecoratorMetadata` and `experimentalDecorators` from parser
services and, when both are set, **skips any file containing a decorator**
([typescript-eslint#5468](https://github.com/typescript-eslint/typescript-eslint/issues/5468)).
Imports in those files are still referenced at runtime through `design:type`
metadata, so rewriting them with `import type` changes behaviour.

Without the program that guard is silently disabled. On the package above,
turning `projectService` off made the rule report **615 new errors** — e.g. in
a TypeORM entity where the import is used only in a decorated property:

```ts
import { StocksEtlJobStatus } from './stocks-enums.js';

@Entity('stocks_etl_job')
export class StocksEtlJob {
  @Column({ type: 'varchar' })
  status: StocksEtlJobStatus; // `emitDecoratorMetadata` emits this at runtime
}
```

The suggested autofix would turn that into `import type`, replacing the emitted
metadata with `Object`. That is why this preset keeps `projectService` on by
default.

If you want the ~512MB heap instead and do not rely on
`consistent-type-imports`, turn both off together:

```ts
import { base, defineConfig } from '@hyperse/eslint-config-hyperse';

export default defineConfig([
  ...base,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: { projectService: false },
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
]);
```
