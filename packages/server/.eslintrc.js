module.exports = {
  env: {
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
    extraFileExtensions: ['.mdx'],
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'import', 'simple-import-sort'],
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
