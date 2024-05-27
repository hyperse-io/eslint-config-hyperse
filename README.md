# @hyperse-io/eslint-config-hyperse

🛠 These are my settings for TypeScript / ESLint / Prettier in a project, also support mono / esm 📦

These are the ESLint and Prettier settings for a Next.js project ⚡️

# Table of Contents

- [Eslint / Prettier Setup of @hyperse-io 📦](#eslint--prettier-setup-of-hyperse)
- [Table of Contents](#table-of-contents)
  - [What it does](#what-it-does)
  - [Local / Per Project Install](#local--per-project-install)
  - [Scripts](#scripts)
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
npm i -D @hyperse-io/eslint-config-hyperse
```

1. Create a `eslint.config.js` file in the root of your project's directory (it should live where package.json does). Your `eslint.config.js` file should look like this:

2. Extends your config with the minimal base of `@hyperse-io` config :

```ts
import { base, defineConfig } from '@hyperse-io/eslint-config-hyperse';

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

## If you use Next.js

You can also add additional rules for Next.js

```ts
import { base, nextjs, defineConfig } from '@hyperse-io/eslint-config-hyperse';

export default defineConfig([
  // ...typescript
  ...base,
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
import { base, nextjs, defineConfig } from '@hyperse-io/eslint-config-hyperse';

export default defineConfig([
  // ...typescript
  ...base,
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
  "eslint.experimental.useFlatConfig": true
}
```
