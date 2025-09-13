import baseConfig from '@kiriha/eslint-config/base'
import reactConfig from '@kiriha/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.expo/**'],
  },
  ...baseConfig,
  ...reactConfig,
]
