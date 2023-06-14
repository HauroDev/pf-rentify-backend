module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['./node_modules/standard/eslintrc.json', 'eslint:recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {}
}
