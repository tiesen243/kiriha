import type { ConfigContext, ExpoConfig } from 'expo/config'

// @ts-ignore
import packageJson from './package.json' with { type: 'json' }

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'attendify',
  slug: 'attendify',
  scheme: 'attendify',
  version: packageJson.version,

  newArchEnabled: true,
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  updates: {
    fallbackToCacheTimeout: 0,
  },

  ios: {
    bundleIdentifier: 'com.attendify.mobile',
    supportsTablet: true,
  },
  android: {
    package: 'com.attendify.mobile',
    edgeToEdgeEnabled: true,
  },

  plugins: ['expo-router', 'expo-splash-screen'],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
})
