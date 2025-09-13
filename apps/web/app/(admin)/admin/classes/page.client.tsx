'use client'

import { useMemo } from 'react'
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

  const formattedData = useMemo(
    () =>
      Object.entries(Object.groupBy(data?.classes ?? [], (c) => c.code)).map(
        ([code, classes]) =>
          classes
            ? {
                code,
                subject: classes.at(0)?.subject,
                teacher: classes.at(0)?.teacher,
                room: classes.at(0)?.room,
                startDate: classes
                  .sort((a, b) => a.date.getTime() - b.date.getTime())
                  .at(0)?.date,
                endDate: classes
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .at(0)?.date,
              }
            : null,
      ),
    [data?.classes],
  )

  return (
    <Table>
      <TableCaption>List of classes</TableCaption>
      <ClassTableHeader />

      <TableBody>
        {status !== 'success' ? (
          <LoadingRows cells={6} />
        ) : (
          formattedData.map((cls) => (
            <TableRow key={cls?.code} className='h-14'>
              <TableCell>{cls?.code}</TableCell>
              <TableCell>{cls?.subject}</TableCell>
              <TableCell>{cls?.teacher}</TableCell>
              <TableCell>{cls?.room}</TableCell>
              <TableCell>
                {cls?.startDate?.toLocaleDateString('en-GB')}
              </TableCell>
              <TableCell>{cls?.endDate?.toLocaleDateString('en-GB')}</TableCell>
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
      <TableHead className='w-[200px]'>Teacher</TableHead>
      <TableHead className='w-[80px]'>Room</TableHead>
      <TableHead className='w-[100px]'>Start Date</TableHead>
      <TableHead className='w-[100px]'>End Date</TableHead>
    </TableRow>
  </TableHeader>
)
