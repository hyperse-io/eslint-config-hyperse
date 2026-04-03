import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Format, InlineConfig } from 'tsdown';
import { build } from 'tsdown';

const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

async function buildAll() {
  const entries: Record<string, InlineConfig & { outputEntry: string }> = {
    'src/index.ts': {
      format: ['esm', 'cjs'],
      outputEntry: 'index',
      dts: true,
      clean: true,
    },
    'src/main/base.ts': {
      format: ['esm'],
      outputEntry: 'main/base',
      dts: true,
      clean: false,
    },
    'src/main/nextjs.ts': {
      format: ['esm'],
      outputEntry: 'main/nextjs',
      dts: true,
      clean: false,
    },
    'src/main/reactjs.ts': {
      format: ['esm'],
      outputEntry: 'main/reactjs',
      dts: true,
      clean: false,
    },
    'src/main/sonarjs.ts': {
      format: ['esm'],
      outputEntry: 'main/sonarjs',
      dts: true,
      clean: false,
    },
  };

  for (const [key, value] of Object.entries(entries)) {
    const { format, outputEntry, dts, clean } = value;
    await build({
      treeshake: true,
      tsconfig: './tsconfig.build.json',
      entry: {
        [outputEntry]: key,
      },
      dts,
      clean,
      format: format as Format | Format[],
      // Align with package.json exports (`.js` / `.cjs`), not `.mjs`.
      fixedExtension: false,
    });
  }
}
(async () => {
  const dist = getDirname(import.meta.url, './dist');
  if (existsSync(dist)) {
    await rm(dist, {
      recursive: true,
    });
  }
  await buildAll();
})();
