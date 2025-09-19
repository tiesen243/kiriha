import { notFound } from 'next/navigation'

import { EditRoomForm } from '@/app/(admin)/admin/rooms/[id]/page.client'
import { api } from '@/trpc/rsc'

export default async function EditRoomPage({
  params,
}: PageProps<'/admin/rooms/[id]'>) {
  const { id } = await params

  try {
    const { room } = await api.room.byId({ id })

    return (
      <main className='container py-4'>
        <EditRoomForm room={room} />
      </main>
    )
  } catch {
    notFound()
  }
}
