import { headers } from 'next/headers'

import { EditRoomForm } from '@/app/(admin)/admin/rooms/[id]/page.client'
import { createApi } from '@/trpc/rsc'

export default async function EditRoomPage({
  params,
}: PageProps<'/admin/rooms/[id]'>) {
  const { id } = await params

  const api = createApi({ headers: await headers() })
  const room = await api.admin.room.byId({ id })

  return (
    <main className='container py-4'>
      <EditRoomForm room={room} />
    </main>
  )
}
