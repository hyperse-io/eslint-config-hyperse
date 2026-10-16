---
'@hyperse/eslint-config-hyperse': major
---

fix: disable `@typescript-eslint/no-deprecated` by default

This rule was the only type-aware rule in the preset, and enabling it is what
pushed `eslint .` past the default Node heap on larger repositories, producing
`FATAL ERROR: Ineffective mark-compacts near heap limit`.

Measured on a ~2k-file monorepo package spanning 4 TS projects, from repeated
runs against the default Node heap (~4GB):

| configuration                                  | outcome                                                           |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `projectService: true` + `no-deprecated: warn` | `eslint .` exits with `Ineffective mark-compacts near heap limit` |
| `projectService: true` + `no-deprecated: off`  | completes; needs >3GB of heap                                     |

`TIMING=1` also shows the rule consuming **~27.8s** of rule time — 62% of the
total, and ~2.3x the next most expensive rule (`prettier/prettier` at ~12.1s).

Re-enable per project when the repository is small enough to afford it:

```ts
export default defineConfig([
  ...base,
  { rules: { '@typescript-eslint/no-deprecated': 'warn' } },
]);
```

**Breaking:** projects relying on the previous default no longer receive
deprecation warnings from ESLint until they opt in.

### Why `projectService` is deliberately still on

Turning `projectService` off would take the heap requirement under 1GB, but it
must not be done while `consistent-type-imports` is enabled.

That rule reads `emitDecoratorMetadata` / `experimentalDecorators` from parser
services and, when both are set, skips files containing a decorator
(typescript-eslint#5468). Those imports are still used at runtime via
`design:type` metadata. Without the program the guard is silently disabled: on
the package above, disabling `projectService` made the rule emit 615 new
errors, and its autofix rewrites decorated property types such as

```ts
@Column({ type: 'varchar' })
status: StocksEtlJobStatus;
```

into `import type`, which changes the emitted metadata. Projects that want the
lower memory footprint and do not need the rule should turn both off together —
see the README section "`projectService` stays on, and why".
