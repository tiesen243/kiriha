import '@kiriha/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@kiriha/api',
    '@kiriha/auth',
    '@kiriha/db',
    '@kiriha/ui',
    '@kiriha/validators',
  ],
} satisfies NextConfig

export default nextConfig
