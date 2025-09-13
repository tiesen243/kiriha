import Link from 'next/link'

import { Button } from '@kiriha/ui/button'

import { RoomTable } from '@/app/(admin)/admin/rooms/page.client'
import { roomsSearchParamsCache } from '@/app/(admin)/admin/rooms/page.lib'

export default function RoomsPage({ searchParams }: PageProps<'/admin/rooms'>) {
  void roomsSearchParamsCache.parse(searchParams, { strict: true })

  return (
    <main className='container py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Rooms Management</h1>
        <Button size='sm' asChild>
          <Link href='/admin/rooms/create'>Create Room</Link>
        </Button>
      </div>

      <RoomTable />
    </main>
  )
}
