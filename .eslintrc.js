module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['prettier'],
  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'prettier/prettier': ['error'],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'never'],
  },
}
