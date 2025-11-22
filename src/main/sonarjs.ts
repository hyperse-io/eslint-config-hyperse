import { defineConfig } from 'eslint/config';
import { sonar } from '../rules/index.js';

export const sonarjs = defineConfig([...sonar]);
