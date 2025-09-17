'use client'

import Link from 'next/link'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import type { RouterOutputs } from '@kiriha/api'
import { Button } from '@kiriha/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@kiriha/ui/table'

import { LoadingRows } from '@/app/(admin)/_components/loading-rows'
import { roomsSearchParams } from '@/app/(admin)/admin/rooms/page.lib'
import { useTRPC } from '@/trpc/react'

export const RoomTable: React.FC = () => {
  const [options, setOptions] = useQueryStates(roomsSearchParams)

  const trpc = useTRPC()
  const { data, status } = useQuery(trpc.room.all.queryOptions(options))

  return (
    <Table>
      <TableCaption>List of rooms</TableCaption>
      <RoomTableHeader />

      <TableBody>
        {status !== 'success' ? (
          <LoadingRows rows={options.limit} cells={6} />
        ) : (
          data.rooms.map((room) => <RoomTableRow key={room.id} room={room} />)
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell>
            Total: {status === 'success' ? data.total : 0} rooms
          </TableCell>

          <TableCell colSpan={5}>
            <RoomTablePagination
              page={options.page}
              totalPages={status === 'success' ? data.totalPages : 1}
              setPage={(page) => setOptions({ page })}
            />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}

const RoomTableHeader: React.FC = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[220px]'>ID</TableHead>
      <TableHead className='min-w-xs'>Name</TableHead>
      <TableHead className='w-[80px] text-center'>Capacity</TableHead>
      <TableHead className='w-[200px]'>Created At</TableHead>
      <TableHead className='w-[200px]'>Updated At</TableHead>
      <TableHead className='w-[150px] text-center'>Actions</TableHead>
    </TableRow>
  </TableHeader>
)

const RoomTableRow: React.FC<{
  room: RouterOutputs['room']['all']['rooms'][number]
}> = ({ room }) => {
  const queryClient = useQueryClient()
  const trpc = useTRPC()
  const deleteRoom = useMutation(
    trpc.room.delete.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries(trpc.room.all.queryFilter()),
    }),
  )

  return (
    <TableRow className='h-14'>
      <TableCell>{room.id}</TableCell>
      <TableCell>
        {room.name.replace(/^([A-Z])(\d{2})(\d{2})$/, '$1$2.$3')}
      </TableCell>
      <TableCell>{room.capacity}</TableCell>
      <TableCell>{room.createdAt.toLocaleString()}</TableCell>
      <TableCell>{room.updatedAt.toLocaleString()}</TableCell>
      <TableCell className='flex justify-end gap-2'>
        <Button size='sm' variant='outline' asChild>
          <Link href={`/admin/rooms/${room.id}`}>Edit</Link>
        </Button>
        <Button
          size='sm'
          variant='destructive'
          onClick={() => {
            deleteRoom.mutate({ id: room.id })
          }}
          disabled={deleteRoom.isPending}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}

const RoomTablePagination: React.FC<{
  page: number
  totalPages: number
  setPage: (page: number) => void
}> = ({ page, totalPages, setPage }) => {
  const increasePage = () => {
    if (page < totalPages) setPage(page + 1)
  }
  const decreasePage = () => {
    if (page > 1) setPage(page - 1)
  }

  return (
    <div className='flex items-center justify-end gap-2'>
      <Button
        size='sm'
        variant='outline'
        disabled={page <= 1}
        onClick={decreasePage}
      >
        Previous
      </Button>

      <span>
        Page {page} / {totalPages}
      </span>

      <Button
        size='sm'
        variant='outline'
        disabled={page >= totalPages}
        onClick={increasePage}
      >
        Next
      </Button>
    </div>
  )
}
