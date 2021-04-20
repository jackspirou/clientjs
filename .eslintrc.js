'use strict';
module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'script',
  },
  extends: ['eslint:recommended'],
  env: {
    node: true,
  },
  rules: {
    strict: 'error',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
};
