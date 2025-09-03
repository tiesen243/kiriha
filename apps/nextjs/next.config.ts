import '@attendify/validators/env'

import type { NextConfig } from 'next'

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,

  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  transpilePackages: [
    '@attendify/api',
    '@attendify/auth',
    '@attendify/db',
    '@attendify/ui',
    '@attendify/validators',
  ],
} satisfies NextConfig

export default nextConfig
