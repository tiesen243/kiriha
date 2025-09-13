'use client'

import { useQuery } from '@tanstack/react-query'

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
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.admin.class.all.queryOptions({}))

  return (
    <Table>
      <TableCaption>List of classes</TableCaption>
      <ClassTableHeader />
      <TableBody>
        {status !== 'success' ? (
          <LoadingRows cells={7} />
        ) : (
          data.classes.map((c) => (
            <TableRow key={c.code} className='h-14'>
              <TableCell>{c.code}</TableCell>
              <TableCell>{c.subject}</TableCell>
              <TableCell>{c.status}</TableCell>
              <TableCell>{c.teachers.join(', ')}</TableCell>
              <TableCell>{c.rooms.join(', ')}</TableCell>
              <TableCell>{c.startDate?.toLocaleDateString('en-GB')}</TableCell>
              <TableCell>{c.endDate?.toLocaleDateString('en-GB')}</TableCell>
            </TableRow>
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
      <TableHead>Start Date</TableHead>
      <TableHead>End Date</TableHead>
    </TableRow>
  </TableHeader>
)
