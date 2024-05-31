import { existsSync } from 'fs';
import { rm } from 'fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Format } from 'tsup';
import { build } from 'tsup';

const getDirname = (url: string, subDir = '') => {
  return join(dirname(fileURLToPath(url)), subDir);
};

async function buildAll() {
  const entries = {
    'src/index.ts': {
      format: ['esm'],
      entry: 'index',
      dts: true,
      clean: true,
    },
    'src/main/base.ts': {
      format: ['esm'],
      entry: 'main/base',
      dts: true,
      clean: false,
    },
    'src/main/nextjs.ts': {
      format: ['esm'],
      entry: 'main/nextjs',
      dts: true,
      clean: false,
    },
    'src/main/reactjs.ts': {
      format: ['esm'],
      entry: 'main/reactjs',
      dts: true,
      clean: false,
    },
  };

  for (const [key, value] of Object.entries(entries)) {
    const { format, entry, dts, clean } = value;
    await build({
      splitting: false,
      treeshake: true,
      tsconfig: './tsconfig.build.json',
      entry: {
        [entry]: key,
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
