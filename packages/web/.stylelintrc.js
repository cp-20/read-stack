module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-idiomatic-order',
    'stylelint-prettier/recommended',
    'stylelint-config-prettier',
  ],
  rules: {
    'string-quotes': 'single',
    'at-rule-no-unknown': null,
    'function-url-quotes': 'always',
    'selector-class-pattern': null,
    'hue-degree-notation': 'number',
    'color-function-notation': 'legacy',
    'alpha-value-notation': 'number',
    'function-no-unknown': null,
    'function-name-case': null,
  },
  overrides: [
    {
      files: ['**/*.{js,ts,jsx,tsx}'],
      customSyntax: '@stylelint/postcss-css-in-js',
    },
  ],
};
