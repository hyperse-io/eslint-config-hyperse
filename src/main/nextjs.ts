import { defineConfig } from 'eslint/config';
import { next } from '../rules/next.js';
import { reactjs } from './reactjs.js';

export const nextjs = defineConfig([...reactjs, ...next]);
