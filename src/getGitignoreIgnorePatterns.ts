import type { Dirent } from 'node:fs';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';

/**
 * Derive ESLint `ignores` from the project's `.gitignore` chain.
 *
 * ## Why this exists
 *
 * **ESLint flat config does not read `.gitignore`.** Unless artifacts are
 * ignored explicitly, `eslint .` crawls them. This is not just slow — it can
 * effectively hang:
 *
 * A directory of ~13k JSON cache files (~361MB) made `eslint .` run for
 * **over 17 minutes without returning any output**. Root cause is
 * `prettier/prettier`, which performs a full format comparison for every
 * "lintable" file, costing O(total bytes).
 *
 * Controlled experiment (2000 files × ~10KB of JSON):
 *   - with `prettier/prettier`    → no result in >75s
 *   - without `prettier/prettier` → 8.2s
 *
 * So the fix is to ensure artifact directories are ignored. Deriving the list
 * from `.gitignore` keeps a single source of truth: adding a new build/output
 * directory to `.gitignore` is automatically enough.
 *
 * ## Supported syntax
 *
 * Comments, blank lines, trailing-space escaping, `!` negation, leading `/`
 * anchors, trailing `/` (directory-only), `**`, `*` and `?`.
 *
 * ## Layering (mono-repos)
 *
 * The ignore-file chain is walked in both directions from `cwd`, mirroring how
 * git scopes rules to the directory that declares them:
 *
 * - **Upward**, from `cwd` to the git root (the nearest ancestor holding a
 *   `.git` entry). This matters because `cwd` is the *package* directory in a
 *   workspace — e.g. `yarn workspaces foreach run lint` executes each package's
 *   script with `cwd` set to that package, so a purely downward scan would
 *   never see the repository-root `.gitignore`.
 * - **Downward**, to a shallow depth, so a package-local `.gitignore` is
 *   honoured when linting from the repo root.
 *
 * Patterns keep the scope of the file that declares them: a `/.next` inside
 * `packages/app` ignores `packages/app/.next` and never the repo-root `.next`,
 * while a bare `dist` in the root `.gitignore` still matches at any depth.
 *
 * Absolute (`/…`) or inner-slash rules declared by an ancestor only apply when
 * they actually point below `cwd`; rules aimed at sibling directories are
 * dropped, since ESLint never lints outside `cwd`.
 *
 * ## Known limitation
 *
 * ESLint `ignores` can only add exclusions — it has no re-include support, so a
 * gitignore negation cannot be represented as a glob. We approximate git's
 * "last match wins" by letting a `!pattern` cancel an earlier rule that uses
 * the *same pattern in the same directory*. A negation that tries to re-include
 * a path already excluded by a broader rule (e.g. `dist/` + `!dist/keep.ts`, or
 * a nested `!dist` overriding a parent `dist`) is best-effort and will not take
 * effect.
 */

/** Ignore files merged in this order; later entries win, like git. */
const IGNORE_FILE_NAMES = ['.gitignore', '.eslintignore', '.prettierignore'];

/** Depth limit when scanning for nested ignore files in a mono-repo. */
const MAX_NESTED_DEPTH = 3;

const toPosixPath = (value: string) =>
  sep === '/' ? value : value.split(sep).join('/');

/** Join a POSIX-style directory prefix onto a glob body. */
const joinPosix = (baseDir: string, body: string) =>
  baseDir ? `${baseDir}/${body}` : body;

/** Remove leading `/` characters without a backtracking-prone regex. */
const stripLeadingSlashes = (value: string): string => {
  let start = 0;
  while (start < value.length && value[start] === '/') start += 1;
  return value.slice(start);
};

/** Remove trailing `/` characters without a backtracking-prone regex. */
const stripTrailingSlashes = (value: string): string => {
  let end = value.length;
  while (end > 0 && value[end - 1] === '/') end -= 1;
  return value.slice(0, end);
};

/** Strip insignificant trailing whitespace, honouring `\ ` escapes. */
const stripTrailingWhitespace = (line: string): string => {
  let end = line.length;
  while (end > 0) {
    const char = line[end - 1];
    if ((char !== ' ' && char !== '\t') || line[end - 2] === '\\') break;
    end -= 1;
  }
  return line.slice(0, end);
};

interface IgnoreFile {
  /** Absolute path to the ignore file. */
  path: string;
  /** Absolute directory that declares the rule. */
  dir: string;
  /** POSIX path from `cwd` to `dir` (`''` for `cwd` itself). */
  relToDir: string;
}

interface IgnoreRule {
  /** Glob as written in the ignore file, relative to its own directory. */
  pattern: string;
  /** Absolute directory that declares the rule. */
  dir: string;
  /** POSIX path from `cwd` to `dir` (`''` for `cwd` itself). */
  relToDir: string;
  negated: boolean;
}

const parseIgnoreContent = (
  content: string,
  file: IgnoreFile
): IgnoreRule[] => {
  const rules: IgnoreRule[] = [];

  for (const rawLine of content.split(/\r?\n/)) {
    // Trailing whitespace is insignificant unless escaped.
    const line = stripTrailingWhitespace(rawLine);

    if (!line || line.startsWith('#')) continue;

    const negated = line.startsWith('!');
    const pattern = negated ? line.slice(1) : line;

    if (pattern) {
      rules.push({
        pattern,
        dir: file.dir,
        relToDir: file.relToDir,
        negated,
      });
    }
  }

  return rules;
};

/** Nearest ancestor holding a `.git` entry, i.e. the repository root. */
const findGitRoot = (start: string): string | undefined => {
  let dir = start;
  for (;;) {
    if (existsSync(join(dir, '.git'))) return dir;
    const parent = dirname(dir);
    if (parent === dir) return undefined;
    dir = parent;
  }
};

/** Ignore files declared directly inside `dir`. */
const ignoreFilesIn = (dir: string, cwd: string): IgnoreFile[] => {
  const relToDir = toPosixPath(relative(cwd, dir));
  const found: IgnoreFile[] = [];

  for (const name of IGNORE_FILE_NAMES) {
    const candidate = join(dir, name);
    if (existsSync(candidate)) {
      found.push({ path: candidate, dir, relToDir });
    }
  }

  return found;
};

/** Ancestor directories from the git root down to (excluding) `cwd`. */
const ancestorDirs = (cwd: string): string[] => {
  const gitRoot = findGitRoot(cwd);
  if (!gitRoot || gitRoot === cwd) return [];

  const chain: string[] = [];
  let dir = dirname(cwd);
  for (;;) {
    chain.unshift(dir);
    if (dir === gitRoot) break;
    const parent = dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return chain;
};

/** Discover ignore files: ancestors, then `cwd`, then nested (deeper wins). */
const discoverIgnoreFiles = (cwd: string): IgnoreFile[] => {
  const files: IgnoreFile[] = [];

  for (const dir of ancestorDirs(cwd)) {
    files.push(...ignoreFilesIn(dir, cwd));
  }

  files.push(...ignoreFilesIn(cwd, cwd));

  const visited = new Set<string>([cwd]);
  const queue: Array<{ dir: string; depth: number }> = [{ dir: cwd, depth: 0 }];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || current.depth >= MAX_NESTED_DEPTH) continue;

    let entries: Dirent<string>[];
    try {
      entries = readdirSync(current.dir, {
        withFileTypes: true,
        encoding: 'utf8',
      });
    } catch {
      continue;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const name = entry.name;
      if (name === 'node_modules' || name.startsWith('.git')) continue;

      const child = join(current.dir, name);
      if (visited.has(child)) continue;
      visited.add(child);

      files.push(...ignoreFilesIn(child, cwd));
      queue.push({ dir: child, depth: current.depth + 1 });
    }
  }

  return files;
};

/**
 * Whether a gitignore rule is anchored to its declaring directory.
 *
 * A rule is root-relative when it starts with `/` or contains a separator in
 * the middle. A leading globstar is the exception: git treats a pattern such as
 * `[globstar]/docs/*.pem` as "any depth", so it stays portable across
 * directories.
 */
const isRootRelative = (body: string, anchored: boolean): boolean =>
  anchored || (body.includes('/') && !body.startsWith('**/'));

/**
 * Turn one gitignore rule into ESLint ignore globs.
 *
 * Two globs are emitted per path so that both mechanisms ESLint uses are
 * covered:
 *   - the bare path (`dist`) lets ESLint prune the directory during traversal
 *     (`isDirectoryIgnored` only honours patterns that match the directory
 *     itself, not `dist/**`);
 *   - the contents path (`dist/**`) ignores children even when the directory
 *     is reached via an explicit file argument.
 */
const toEslintIgnoreGlobs = (rule: IgnoreRule, cwd: string): string[] => {
  const anchored = rule.pattern.startsWith('/');
  let body = anchored ? stripLeadingSlashes(rule.pattern) : rule.pattern;
  body = stripTrailingSlashes(body).trim();

  if (!body) return [];

  // A leading globstar already means "any depth" and matches the bare name too
  // (globstar is zero-or-more), so it subsumes the un-prefixed form. Adding a
  // second `**/` would be a no-op, so don't.
  const anyDepth = body.startsWith('**/') ? body : `**/${body}`;

  const entities: string[] = [];

  if (isRootRelative(body, anchored)) {
    // Anchored to the declaring directory: resolve to a `cwd`-relative path,
    // dropping rules that land outside `cwd` (ESLint never lints up there).
    const target = toPosixPath(relative(cwd, join(rule.dir, body)));
    if (!target || target.startsWith('..')) return [];
    entities.push(target);
  } else if (!rule.relToDir || rule.relToDir.startsWith('..')) {
    // A bare name declared at `cwd` — or in an ancestor above it — matches at
    // any depth below `cwd`, so no directory prefix is needed (prefixing an
    // ancestor would escape `cwd`, which ESLint never lints anyway).
    entities.push(anyDepth);
  } else {
    // A nested, below-`cwd` rule stays scoped to its own directory.
    entities.push(joinPosix(rule.relToDir, anyDepth));
  }

  const globs = new Set<string>();
  for (const entity of entities) {
    globs.add(entity);
    globs.add(`${entity}/**`);
  }

  return [...globs];
};

/**
 * Read the `.gitignore` chain around `cwd` and return ESLint ignore globs.
 *
 * Returns an empty array when no ignore files exist, so behaviour is
 * unchanged for projects that do not use this convention.
 */
export const getGitignoreIgnorePatterns = (cwd: string): string[] => {
  const rules: IgnoreRule[] = [];

  for (const file of discoverIgnoreFiles(cwd)) {
    try {
      rules.push(...parseIgnoreContent(readFileSync(file.path, 'utf8'), file));
    } catch {
      // A malformed/unreadable ignore file must never break linting.
    }
  }

  // Later rules win, exactly like git. Keying by directory keeps a negation
  // in a nested package from cancelling the repo-root rule of the same name.
  const effective = new Map<string, IgnoreRule>();
  for (const rule of rules) {
    effective.set(`${rule.dir}\u0000${rule.pattern}`, rule);
  }

  const globs = new Set<string>();
  for (const rule of effective.values()) {
    if (rule.negated) continue;
    for (const glob of toEslintIgnoreGlobs(rule, cwd)) globs.add(glob);
  }

  // `**/x` matches `x` (globstar is zero-or-more) and also matches at any
  // depth, so a bare `x`/`x/**` is redundant once `**/x`/`**/x/**` exists.
  // ESLint walks the whole ignores array for every path it visits, so dropping
  // the redundant entries meaningfully reduces traversal cost on large repos.
  for (const glob of [...globs]) {
    if (globs.has(`**/${glob}`)) globs.delete(glob);
  }

  return [...globs].sort((a, b) => a.localeCompare(b));
};

/**
 * Resolve the directory whose `.gitignore` should be honoured.
 *
 * Defaults to `process.cwd()` — the directory where eslint was invoked, which
 * is what users intuitively expect (e.g. `eslint .` inside a package). The
 * ancestor chain above it is read too, so workspace packages still inherit the
 * repository-root `.gitignore`. See {@link getGitignoreIgnorePatterns}.
 */
export const resolveIgnoresCwd = (explicit?: string): string =>
  explicit ? resolve(explicit) : process.cwd();
