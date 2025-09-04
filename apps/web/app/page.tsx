'use client'

import { useSubscription } from '@trpc/tanstack-react-query'

import { useTRPC } from '@/trpc/react'

export default function HomePage(_: PageProps<'/'>) {
  const { trpc } = useTRPC()
  const { data, status } = useSubscription(
    trpc.nfc.onScan.subscriptionOptions(),
  )

  return (
    <main className='container'>
      <p>Status: {status}</p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}
