import type { ConfigContext, ExpoConfig } from 'expo/config'

// @ts-ignore
import packageJson from './package.json' with { type: 'json' }

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'kiriha',
  slug: 'kiriha',
  scheme: 'kiriha',
  version: packageJson.version,

  newArchEnabled: true,
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  updates: {
    fallbackToCacheTimeout: 0,
  },

  ios: {
    bundleIdentifier: 'com.kiriha.mobile',
    supportsTablet: true,
  },
  android: {
    package: 'com.kiriha.mobile',
    edgeToEdgeEnabled: true,
  },

  plugins: ['expo-router', 'expo-splash-screen'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
})
