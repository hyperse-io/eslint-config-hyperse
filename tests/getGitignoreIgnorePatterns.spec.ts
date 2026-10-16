import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { defineConfig } from '../src/define-config.js';
import { getGitignoreIgnorePatterns } from '../src/getGitignoreIgnorePatterns.js';

const withTempProject = (
  files: Record<string, string>,
  run: (cwd: string) => void
) => {
  const cwd = mkdtempSync(join(tmpdir(), 'hps-eslint-ignores-'));
  try {
    for (const [relativePath, content] of Object.entries(files)) {
      const absolute = join(cwd, relativePath);
      mkdirSync(join(absolute, '..'), { recursive: true });
      writeFileSync(absolute, content);
    }
    run(cwd);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
};

describe('getGitignoreIgnorePatterns', () => {
  it('returns an empty array when there is no ignore file', () => {
    withTempProject({}, (cwd) => {
      expect(getGitignoreIgnorePatterns(cwd)).toEqual([]);
    });
  });

  it('derives ignore globs from .gitignore', () => {
    withTempProject(
      {
        '.gitignore': ['/dist', '/scripts/out/', 'node_modules'].join('\n'),
      },
      (cwd) => {
        expect(getGitignoreIgnorePatterns(cwd)).toEqual([
          '**/node_modules',
          '**/node_modules/**',
          'dist',
          'dist/**',
          'scripts/out',
          'scripts/out/**',
        ]);
      }
    );
  });

  it('ignores comments and blank lines', () => {
    withTempProject(
      { '.gitignore': '# a comment\n\n/dist\n\n   \n' },
      (cwd) => {
        expect(getGitignoreIgnorePatterns(cwd)).toEqual(['dist', 'dist/**']);
      }
    );
  });

  it('applies negated last-wins precedence like git', () => {
    withTempProject(
      { '.gitignore': ['/out', '!/out', '/out/keep'].join('\n') },
      (cwd) => {
        // `/out` was negated, `/out/keep` re-added
        expect(getGitignoreIgnorePatterns(cwd)).toEqual([
          'out/keep',
          'out/keep/**',
        ]);
      }
    );
  });

  it('merges .eslintignore and .prettierignore too', () => {
    withTempProject(
      {
        '.gitignore': '/dist',
        '.eslintignore': '/generated',
        '.prettierignore': '/coverage',
      },
      (cwd) => {
        expect(getGitignoreIgnorePatterns(cwd)).toEqual(
          expect.arrayContaining([
            'dist',
            'dist/**',
            'generated',
            'generated/**',
            'coverage',
            'coverage/**',
          ])
        );
      }
    );
  });

  it('scopes a nested absolute pattern to its own directory', () => {
    withTempProject(
      {
        '.gitignore': '/dist',
        'packages/app/.gitignore': '/.next',
      },
      (cwd) => {
        const patterns = getGitignoreIgnorePatterns(cwd);
        expect(patterns).toEqual(
          expect.arrayContaining([
            'packages/app/.next',
            'packages/app/.next/**',
          ])
        );
        // Must not leak to the repo root.
        expect(patterns).not.toContain('.next');
        expect(patterns).not.toContain('.next/**');
      }
    );
  });

  it('scopes a nested bare name to its own directory', () => {
    withTempProject({ 'packages/app/.gitignore': 'logs' }, (cwd) => {
      const patterns = getGitignoreIgnorePatterns(cwd);
      // Scoped to the declaring directory; the any-depth form subsumes the
      // single-level one (`**/` matches zero segments).
      expect(patterns).toEqual([
        'packages/app/**/logs',
        'packages/app/**/logs/**',
      ]);
      expect(patterns).not.toContain('logs');
      expect(patterns).not.toContain('**/logs');
      expect(patterns).not.toContain('packages/app/logs');
    });
  });

  it('matches a root bare name at any depth, like git', () => {
    withTempProject({ '.gitignore': 'coverage' }, (cwd) => {
      // The any-depth form subsumes the bare one, so only it is emitted.
      expect(getGitignoreIgnorePatterns(cwd)).toEqual([
        '**/coverage',
        '**/coverage/**',
      ]);
    });
  });

  it('keeps file patterns as matchable globs, not directories', () => {
    withTempProject({ '.gitignore': '*.log\n.DS_Store' }, (cwd) => {
      const patterns = getGitignoreIgnorePatterns(cwd);
      expect(patterns).toEqual(
        expect.arrayContaining([
          '**/*.log',
          '**/*.log/**',
          '**/.DS_Store',
          '**/.DS_Store/**',
        ])
      );
      expect(patterns).not.toContain('*.log');
      expect(patterns).not.toContain('.DS_Store');
    });
  });

  it('emits no redundant bare form when an any-depth form exists', () => {
    withTempProject(
      {
        '.gitignore': ['coverage', '/dist', '*.log', '.swc'].join('\n'),
        'packages/app/.gitignore': 'logs',
      },
      (cwd) => {
        const patterns = getGitignoreIgnorePatterns(cwd);
        const set = new Set(patterns);
        // `**/x` matches `x`, so `x` must never survive alongside it. ESLint
        // walks the whole array for every path, so this keeps it lean.
        for (const glob of patterns) {
          expect(set.has(`**/${glob}`)).toBe(false);
        }
        expect(patterns).toContain('**/coverage');
        expect(patterns).toContain('dist');
      }
    );
  });

  it('treats an inner slash as root-relative', () => {
    withTempProject({ '.gitignore': 'foo/bar' }, (cwd) => {
      const patterns = getGitignoreIgnorePatterns(cwd);
      expect(patterns).toEqual(['foo/bar', 'foo/bar/**']);
    });
  });

  it('does not recurse into node_modules', () => {
    withTempProject(
      {
        '.gitignore': '/dist',
        'node_modules/pkg/.gitignore': '/should-not-be-read',
      },
      (cwd) => {
        expect(getGitignoreIgnorePatterns(cwd)).not.toContain(
          'should-not-be-read/**'
        );
      }
    );
  });

  it('never throws on unreadable or odd ignore content', () => {
    withTempProject(
      { '.gitignore': ['*', '**', '!', '/', '//', 'a b c'].join('\n') },
      (cwd) => {
        expect(() => getGitignoreIgnorePatterns(cwd)).not.toThrow();
      }
    );
  });
});

describe('defineConfig ignores integration', () => {
  it('folds gitignore patterns into the global ignores', () => {
    withTempProject({ '.gitignore': '/dist' }, (cwd) => {
      const config = defineConfig([], { cwd });
      const ignores = config.flatMap((entry) => entry.ignores ?? []);
      expect(ignores).toContain('dist');
      expect(ignores).toContain('dist/**');
    });
  });

  it('still supports the legacy ignores array signature', () => {
    withTempProject({}, (cwd) => {
      const config = defineConfig([], ['scripts/out/**']);
      const ignores = config.flatMap((entry) => entry.ignores ?? []);
      expect(ignores).toContain('scripts/out/**');
      // `cwd` is only meaningful through the object form; the array form
      // falls back to process.cwd() and must not throw.
      expect(cwd).toBeTruthy();
    });
  });

  it('can opt out of gitignore derivation', () => {
    withTempProject({ '.gitignore': '/dist' }, (cwd) => {
      const config = defineConfig([], { cwd, useGitignore: false });
      const ignores = config.flatMap((entry) => entry.ignores ?? []);
      expect(ignores).not.toContain('dist');
    });
  });
});

describe('workspace layering (ancestor .gitignore)', () => {
  // A `.git` entry marks the repository root, like `yarn workspaces foreach`
  // running a package's script with `cwd` set to that package.
  const repo = {
    '.git': '',
    '.gitignore': [
      '.swc',
      'logs',
      '/dist',
      '**/docs/ssl/*.pem',
      '/packages/app/generated',
      '/packages/sibling/thing',
    ].join('\n'),
    'packages/app/.gitignore': '/.next',
  };

  it('honours repo-root bare names from inside a package', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
      expect(patterns).toEqual(
        expect.arrayContaining([
          '**/.swc',
          '**/.swc/**',
          '**/logs',
          '**/logs/**',
        ])
      );
      expect(patterns).not.toContain('.swc');
      expect(patterns).not.toContain('logs');
    });
  });

  it('honours a repo-root path that points into the package', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
      expect(patterns).toEqual(
        expect.arrayContaining(['generated', 'generated/**'])
      );
    });
  });

  it('honours a leading-** pattern from inside a package', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
      expect(patterns).toContain('**/docs/ssl/*.pem');
    });
  });

  it('drops ancestor rules that only target siblings or upper dirs', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
      // `/dist` anchors at the repo root; `/packages/sibling/thing` is a sibling.
      expect(patterns).not.toContain('dist');
      expect(patterns).not.toContain('thing');
      expect(patterns.some((glob) => glob.startsWith('..'))).toBe(false);
    });
  });

  it('still reads the package-local .gitignore', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
      expect(patterns).toEqual(expect.arrayContaining(['.next', '.next/**']));
    });
  });

  it('does not walk above a repo root that is missing', () => {
    withTempProject(
      { '.gitignore': '.swc', 'packages/app/.gitignore': '/.next' },
      (root) => {
        const patterns = getGitignoreIgnorePatterns(join(root, 'packages/app'));
        expect(patterns).not.toContain('.swc');
        expect(patterns).toContain('.next');
      }
    );
  });

  it('reads ancestors down to the repo root when run from the root', () => {
    withTempProject(repo, (root) => {
      const patterns = getGitignoreIgnorePatterns(root);
      expect(patterns).toEqual(
        expect.arrayContaining([
          '**/.swc',
          'dist',
          'dist/**',
          'packages/app/generated',
          'packages/app/.next',
        ])
      );
    });
  });
});
