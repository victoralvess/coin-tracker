// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.strict,
  {
    files: ['**/*.ts'],
    rules: {
      semi: 'off',
      '@typescript-eslint/semi': 'error',
      '@typescript-eslint/member-delimiter-style': 'error',
      quotes: ['error', 'single', { avoidEscape: true }],
      'quote-props': ['error', 'as-needed']
    }
  }
);