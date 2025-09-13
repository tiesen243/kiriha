import baseConfig, { restrictEnvAccess } from '@kiriha/eslint-config/base'
import nextConfig from '@kiriha/eslint-config/next'
import reactConfig from '@kiriha/eslint-config/react'

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ['.next/**', 'next-env.d.ts'],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextConfig,
  ...restrictEnvAccess,
]
