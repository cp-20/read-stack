module.exports = {
  env: {
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    extraFileExtensions: ['.mdx'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'google',
    'prettier',
    'plugin:storybook/recommended',
  ],
  plugins: [
    'react-hooks',
    'react',
    '@typescript-eslint',
    'import',
    'simple-import-sort',
  ],
  rules: {
    'require-jsdoc': ['off'],
    'valid-jsdoc': ['off'],
    'import/order': [
      'error',
      {
        alphabetize: {
          order: 'asc',
        },
      },
    ],
    '@next/next/no-img-element': ['off'],
    'react/no-unknown-property': [
      'error',
      {
        ignore: ['css'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': ['off'],
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        prefer: 'type-imports',
      },
    ],
    'react/jsx-boolean-value': 'error',
    'react/jsx-curly-brace-presence': 'error',
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    'react/jsx-pascal-case': 'error',
  },
  overrides: [
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/consistent-type-imports': 'off',
      },
    },
  ],
};
