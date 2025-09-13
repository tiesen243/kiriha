import '@/app/globals.css'

import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { SessionProvider } from '@kiriha/auth/react'
import { cn, ThemeProvider } from '@kiriha/ui'

import { createMetadata } from '@/lib/metadata'
import { TRPCReactProvider } from '@/trpc/react'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'flex min-h-dvh flex-col font-sans antialiased',
          geistSans.variable,
          geistMono.variable,
        )}
      >
        <ThemeProvider attribute='class' disableTransitionOnChange enableSystem>
          <NuqsAdapter>
            <TRPCReactProvider>
              <SessionProvider>{children}</SessionProvider>
            </TRPCReactProvider>
          </NuqsAdapter>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = createMetadata()
