import baseConfig from '@kiriha/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/no-namespace': 'off',
    },
  },
]
