import { defineFlatConfig } from 'eslint-define-config';
import { sonar } from '../rules/index.js';

export const sonarjs = defineFlatConfig([...sonar]);
