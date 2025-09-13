'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'

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

import { useTRPC } from '@/trpc/react'

export const ClassTable: React.FC = () => {
  const { trpc } = useTRPC()
  const { data, status } = useQuery(trpc.admin.class.all.queryOptions({}))

  return (
    <Table>
      <TableCaption>List of subjects</TableCaption>
      <ClassTableHeader />

      <TableBody>
        {status !== 'success'
          ? Array.from({ length: 10 }, (_, idx) => (
              <TableRow key={idx} className='h-14'>
                {Array.from({ length: 8 }, (_, cellIdx) => (
                  <TableCell key={cellIdx}>
                    <div className='animate-pulse rounded-sm bg-muted-foreground'>
                      &nbsp;
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))
          : data.classes.map((cls) => <ClassTableRow key={cls.id} cls={cls} />)}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell>
            Total: {status === 'success' ? data.total : 0} classes
          </TableCell>

          <TableCell colSpan={7}>
            {/* <ClassTablePagination */}
            {/*   page={options.page} */}
            {/*   totalPages={status === 'success' ? data.totalPages : 1} */}
            {/*   setPage={(page) => setOptions({ page })} */}
            {/* /> */}
          </TableCell>
        </TableRow>
      </TableFooter>
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
      <TableHead className='w-[80px]'>Status</TableHead>
      <TableHead className='w-[100px]'> Date</TableHead>
      <TableHead className='w-[100px]'>Time</TableHead>
      <TableHead className='w-[150px] text-center'>Actions</TableHead>
    </TableRow>
  </TableHeader>
)

const ClassTableRow: React.FC<{
  cls: RouterOutputs['admin']['class']['all']['classes'][number]
}> = ({ cls }) => {
  const { trpc, queryClient } = useTRPC()
  const deleteSubject = useMutation(
    trpc.admin.subject.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.admin.subject.all.queryFilter(),
        )
      },
    }),
  )

  return (
    <TableRow className='h-14'>
      <TableCell>{cls.code}</TableCell>
      <TableCell>{cls.subject}</TableCell>
      <TableCell>{cls.teacher}</TableCell>
      <TableCell>{cls.room}</TableCell>
      <TableCell>{cls.status}</TableCell>
      <TableCell>{cls.date.toLocaleDateString('en-GB')}</TableCell>
      <TableCell>
        {cls.startTime.slice(0, 5)} - {cls.endTime.slice(0, 5)}
      </TableCell>

      <TableCell className='flex justify-end gap-2'>
        <Button size='sm' variant='outline' asChild>
          <Link href={`/admin/classes/${cls.id}`}>Edit</Link>
        </Button>
        <Button
          size='sm'
          variant='destructive'
          onClick={() => {
            deleteSubject.mutate({ id: cls.id })
          }}
          disabled={deleteSubject.isPending}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}

// const ClassTablePagination: React.FC<{
//   page: number
//   totalPages: number
//   setPage: (page: number) => void
// }> = ({ page, totalPages, setPage }) => {
//   const increasePage = () => {
//     if (page < totalPages) setPage(page + 1)
//   }
//   const decreasePage = () => {
//     if (page > 1) setPage(page - 1)
//   }
//
//   return (
//     <div className='flex items-center justify-end gap-2'>
//       <Button
//         size='sm'
//         variant='outline'
//         disabled={page <= 1}
//         onClick={decreasePage}
//       >
//         Previous
//       </Button>
//
//       <span>
//         Page {page} / {totalPages}
//       </span>
//
//       <Button
//         size='sm'
//         variant='outline'
//         disabled={page >= totalPages}
//         onClick={increasePage}
//       >
//         Next
//       </Button>
//     </div>
//   )
// }
