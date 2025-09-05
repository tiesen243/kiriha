import baseConfig, { restrictEnvAccess } from '@attendify/eslint-config/base'
import nextConfig from '@attendify/eslint-config/next'
import reactConfig from '@attendify/eslint-config/react'

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
