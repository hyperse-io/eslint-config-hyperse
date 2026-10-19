---
'@hyperse/eslint-config-hyperse': minor
---

Raise the shared TypeScript `target` from `ES2020` to `ES2023` and pin `lib` explicitly.

`target: "ES2020"` implicitly resolved `lib` to `lib.es2020.full.d.ts`, so any consumer
using ES2021+/ES2022+ built-ins (`String.prototype.replaceAll`, `Array.prototype.at`,
`Object.hasOwn`, `Array.prototype.findLast`, `Error.cause`, ...) failed with
`TS2550: Property 'x' does not exist` plus the "Try changing the 'lib' compiler option
to 'es2022' or later" hint, reported against this shared file.

`lib` is now explicit (`ES2023` plus the same DOM/worker entries that
`lib.es2023.full.d.ts` referenced, so DOM projects keep working without re-declaring it)
instead of being derived from `target`. `ES2023` matches the emitted syntax to the
declared types, and Node 22 — the minimum in `engines` — supports it natively.

Note: this is a `minor` rather than a `major`. Emitted output syntax moves from ES2020 to
ES2023, which is fine for every currently supported runtime, and consumers that need ES2024
built-ins (`Object.groupBy`, `Promise.withResolvers`) can still opt in per project:

```json
{
  "extends": "@hyperse/eslint-config-hyperse/tsconfig.base.json",
  "compilerOptions": { "lib": ["ES2024", "DOM", "DOM.Iterable"] }
}
```
