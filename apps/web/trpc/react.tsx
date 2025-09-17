'use client'

import type { QueryClient } from '@tanstack/react-query'
import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import {
  createTRPCClient,
  httpBatchStreamLink,
  httpSubscriptionLink,
  splitLink,
} from '@trpc/client'
import { createTRPCContext } from '@trpc/tanstack-react-query'
import SuperJSON from 'superjson'

import type { AppRouter } from '@kiriha/api'

import { getBaseUrl } from '@/lib/utils'
import { createQueryClient } from '@/trpc/query-client'

let clientQueryClientSingleton: QueryClient | undefined = undefined
const getQueryClient = () => {
  if (typeof window === 'undefined') return createQueryClient()
  else return (clientQueryClientSingleton ??= createQueryClient())
}

const { useTRPC, useTRPCClient, TRPCProvider } = createTRPCContext<AppRouter>()

function TRPCReactProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const queryClient = getQueryClient()

  // eslint-disable-next-line @eslint-react/naming-convention/use-state
  const [trpcClient] = React.useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        splitLink({
          condition: (op) => op.type === 'subscription',
          false: httpBatchStreamLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            headers() {
              const headers = new Headers()
              headers.set('x-trpc-source', 'react-nextjs')
              return headers
            },
            fetch(input, init) {
              return fetch(input, { ...init, credentials: 'include' })
            },
          }),
          true: httpSubscriptionLink({
            transformer: SuperJSON,
            url: getBaseUrl() + '/api/trpc',
            eventSourceOptions() {
              const headers = new Headers()
              headers.set('x-trpc-source', 'react-nextjs')
              return { headers }
            },
          }),
        }),
      ],
    }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </TRPCProvider>
    </QueryClientProvider>
  )
}

export { useTRPC, useTRPCClient, TRPCReactProvider }
