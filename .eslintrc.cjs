module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/consistent-type-definitions': 'error',

    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: ['block-like'],
        next: ['block-like', 'return', 'let', 'const'],
      },
    ],

    'import/newline-after-import': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
        groups: [['builtin', 'external'], ['internal', 'parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        pathGroups: [
          {
            group: 'sibling',
            pattern: './*.module.css',
            position: 'after',
          },
        ],
      },
    ],

    'react-hooks/exhaustive-deps': 'error',
    'react-hooks/rules-of-hooks': 'error',
  },
}
