---
'@hyperse/eslint-config-hyperse': minor
---

feat: derive ESLint `ignores` from `.gitignore` to prevent lint hangs

ESLint flat config does not read `.gitignore`, so `eslint .` crawls build
artifacts and generated data. This is not merely slow — it can effectively
hang: a directory of ~13k JSON cache files (~361MB) made `eslint .` run for
**over 17 minutes without returning any output**.

The cause is `prettier/prettier`, which does a full format comparison for
every "lintable" file, costing O(total bytes). Controlled experiment
(2000 files × ~10KB JSON):

- with `prettier/prettier` → no result in >75s
- without `prettier/prettier` → 8.2s

`defineConfig` now merges ignore globs derived from the project's ignore-file
chain (`.gitignore`, `.eslintignore`, `.prettierignore`) on top of the built-in
defaults.

Resolution order: built-in defaults → `.gitignore`-derived → explicit ignores.

## Workspace layering

The chain is walked in both directions from `cwd`, mirroring how git scopes
rules to the directory that declares them:

- **Upward**, from `cwd` to the git root. This matters because in a workspace
  `cwd` is the _package_ directory — `yarn workspaces foreach run lint`
  executes each package's script with `cwd` set to that package, so a purely
  downward scan would never see the repository-root `.gitignore`. Rules that
  only target siblings or directories above `cwd` are dropped.
- **Downward**, to a shallow depth, so a package-local `.gitignore` is honoured
  when linting from the repo root.

`/.next` declared in `packages/app/.gitignore` ignores `packages/app/.next` and
never the repo-root `.next`, while a bare `dist` in the root `.gitignore` still
matches at any depth.

## Limitation

ESLint `ignores` can only exclude — it has no re-include support, so gitignore
negations cannot be expressed as globs. A `!pattern` only cancels an earlier
rule with the _same pattern in the same directory_. A negation that re-includes
a path already covered by a broader rule (e.g. `dist/` + `!dist/keep.ts`, or
`.env.*` + `!.env*.example`) will not take effect. Malformed or unreadable
ignore files never break linting.

## API

The existing `defineConfig(config, ignores)` signature keeps working. A new
options object form is also supported:

```ts
export default defineConfig([...base], {
  ignores: ['some/local/path/**'],
  // cwd: process.cwd(),   // optional override
  // useGitignore: true,   // default; set false to opt out
});
```

Leading `/` anchors, trailing `/` directory markers, `**`, `*` and `?` are
supported.

## Note on cost

ESLint walks the whole `ignores` array for every path it visits, so the derived
list is kept minimal: an any-depth form (`**/dist`) subsumes the bare `dist`,
and only the latter is dropped. On a 10.5k-file tree this roughly halved the
matching overhead versus emitting both.
