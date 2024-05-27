import { defineFlatConfig } from 'eslint-define-config';
import { next } from '../rules/next.js';
import { reactjs } from './reactjs.js';

export const nextjs = defineFlatConfig([...reactjs, ...next]);
