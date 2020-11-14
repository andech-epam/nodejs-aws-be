module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  ignorePatterns: ['**/*.config.js'],
  rules: {
    '@typescript-eslint/typedef': [
      'error',
      {
        parameter: true,
        arrowParameter: true,
        memberVariableDeclaration: true,
        propertyDeclaration: true,
      },
    ],
    '@typescript-eslint/no-inferrable-types': ['error'],
  },
};
