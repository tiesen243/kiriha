import baseConfig from '@attendify/eslint-config/base'
import reactConfig from '@attendify/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['dist/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
