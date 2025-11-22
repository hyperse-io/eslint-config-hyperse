import appRoot from 'app-root-path';
import { defineConfig } from 'eslint/config';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { getTsconfig } from 'get-tsconfig';

function extractPaths(paths: Record<string, string[]>) {
  return Object.keys(paths).map((key) => {
    return key.split('/')[0];
  });
}

const tsConfig = getTsconfig(appRoot.path, 'tsconfig.json');
const jsConfig = getTsconfig(appRoot.path, 'jsconfig.json');

let pathsNames: string[] = [];

if (tsConfig && tsConfig.config.compilerOptions?.paths) {
  pathsNames = extractPaths(tsConfig.config.compilerOptions.paths);
} else if (jsConfig && jsConfig.config.compilerOptions?.paths) {
  pathsNames = extractPaths(jsConfig.config.compilerOptions.paths);
}

export const imports = defineConfig([
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            [
              // Anything that starts with react
              // e.g: import { useState } from 'react'
              // e.g: import { useFela } from 'react-fela'
              '^react',
              // Anything that starts with next
              // e.g: import { useRouter } from 'next/router'
              '^next',
              // Anything that starts with a letter
              // e.g: import Downshift from 'downshift'
              '^[a-z]',
              // Anything that starts with an alias (see jsconfig.json)
              // e.g: import ListDropdown from '@shared/components/ListDropdown'
              `^(${pathsNames.join('|')})(/.*|$)`,
              // Anything that starts with @
              // e.g: import { yupResolver } from '@hookform/resolvers/yup'
              '^@',
              // Anything that starts with a dot
              // e.g: import { matchIsDate } from './utils/date
              '^\\.',
              // Side effect imports from lib
              // e.g: import 'react-toastify/dist/ReactToastify.css'
              '^\\u0000',
              // Side effect import that starts with a dot
              // e.g: import './setup-config'
              '^\\u0000\\.',
            ],
          ],
        },
      ],
    },
  },
]);
