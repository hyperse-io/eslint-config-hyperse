import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Format, Options } from 'tsup';
import { build } from 'tsup';

const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

async function buildAll() {
  const entries: Record<string, Options & { outputEntry: string }> = {
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
    'src/main/tailwindcss.ts': {
      format: ['esm'],
      outputEntry: 'main/tailwindcss',
      dts: true,
      clean: false,
    },
  };

  for (const [key, value] of Object.entries(entries)) {
    const { format, outputEntry, dts, clean } = value;
    await build({
      splitting: false,
      treeshake: true,
      tsconfig: './tsconfig.build.json',
      entry: {
        [outputEntry]: key,
      },
      dts,
      clean,
      format: format as Format[],
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
