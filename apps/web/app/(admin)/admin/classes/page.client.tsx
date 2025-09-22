'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import type { RouterOutputs } from '@kiriha/api'
import { Button } from '@kiriha/ui/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kiriha/ui/table'

import { LoadingRows } from '@/app/(admin)/_components/loading-rows'
import { useTRPC } from '@/trpc/react'

export const ClassTable: React.FC = () => {
  const trpc = useTRPC()
  const { data, status } = useQuery(trpc.classSection.all.queryOptions({}))

  return (
    <Table>
      <TableCaption>List of classes</TableCaption>
      <ClassTableHeader />
      <TableBody>
        {status !== 'success' ? (
          <LoadingRows cells={7} />
        ) : (
          data.classes.map((c) => (
            <ClassTableRow key={c.code} classSection={c} />
          ))
        )}
      </TableBody>
    </Table>
  )
}

const ClassTableHeader: React.FC = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[150px]'>Code</TableHead>
      <TableHead>Subject</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Teachers</TableHead>
      <TableHead>Rooms</TableHead>
      <TableHead>Total Sections</TableHead>
      <TableHead>Start Date</TableHead>
      <TableHead>End Date</TableHead>
      <TableCell>Actions</TableCell>
    </TableRow>
  </TableHeader>
)

const ClassTableRow: React.FC<{
  classSection: RouterOutputs['classSection']['all']['classes'][number]
}> = ({ classSection }) => {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    ...trpc.classSection.delete.mutationOptions(),
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.classSection.all.queryFilter({}))
    },
  })

  return (
    <TableRow key={classSection.code} className='h-14'>
      <TableCell>{classSection.code}</TableCell>
      <TableCell>{classSection.subject}</TableCell>
      <TableCell>{classSection.status}</TableCell>
      <TableCell>{classSection.teachers.join(', ')}</TableCell>
      <TableCell>{classSection.rooms.join(', ')}</TableCell>
      <TableCell>{classSection.totalSection}</TableCell>
      <TableCell>
        {classSection.startDate?.toLocaleDateString('en-GB')}
      </TableCell>
      <TableCell>{classSection.endDate?.toLocaleDateString('en-GB')}</TableCell>
      <TableCell>
        <Button
          size='sm'
          variant='destructive'
          disabled={isPending}
          onClick={() => {
            mutate({ code: classSection.code })
          }}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}
