import WebView from 'react-native-webview'
import Constants from 'expo-constants'

import { getBaseUrl } from '@/lib/utils'

export default function RootLayout() {
  return (
    <WebView
      style={{ flex: 1, marginTop: Constants.statusBarHeight }}
      source={{ uri: getBaseUrl() }}
    />
  )
}
