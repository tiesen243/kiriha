import baseConfig from '@attendify/eslint-config/base'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
]
