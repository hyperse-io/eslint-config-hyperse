import type { A } from './type.js';
import { b } from './type.js';

describe('ESLint', () => {
  describe('ESLint', () => {
    const a: A = b;
    it('should pass ESLint', () => {
      expect(a).toMatchObject({ a: '1' });
    });
  });
});
