module.exports = {
  env: {
    'jest/globals': true,
    node: true,
  },
  extends: '@toznysecure/eslint-config/typescript',
  plugins: ['jest'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
