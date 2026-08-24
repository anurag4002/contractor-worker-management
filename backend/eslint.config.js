import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,

  {
    files: ['**/*.js'],

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',

      globals: {
        ...globals.node,
      },
    },

    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-debugger': 'warn',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
    },
  },

  {
    files: ['**/tests/**/*.test.js', '**/tests/**/*.spec.js', '**/tests/setup/*.js'],

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        jest: 'readonly',
      },
    },
  },

  prettier,
];
