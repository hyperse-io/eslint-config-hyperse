import { defineConfig } from 'eslint/config';
import { react } from '../rules/index.js';
import { base } from './base.js';

export const reactjs = defineConfig([...base, ...react]);
