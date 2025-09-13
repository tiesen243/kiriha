import Constants from 'expo-constants'

export function getBaseUrl(): string {
  const debuggerHost = Constants.expoConfig?.hostUri
  const localhost = debuggerHost?.split(':')[0]

  if (!localhost) {
    // return "https://kiriha.vercel.app"
    throw new Error(
      'Failed to get localhost. Please point to your production server.',
    )
  }
  return `http://${localhost}:3000`
}
