module.exports = {
  extends: ['airbnb-base', 'prettier'],
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
  },
  rules: {
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-warning-comments': ['error', { terms: ['eslint-disable'], location: 'anywhere' }],
  },
  overrides: [
    {
      files: ['tests/**/*.js', '**/*.test.js', '**/*.spec.js'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'TryStatement',
            message: 'Try-catch blocks are not allowed in test files. Use accurate test assertions instead.',
          },
        ],
      },
    },
  ],
};
