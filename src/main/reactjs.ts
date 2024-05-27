import { defineFlatConfig } from 'eslint-define-config';
import { react, tailwind } from '../rules/index.js';
import { base } from './base.js';

export const reactjs = defineFlatConfig([...base, ...react, ...tailwind]);
