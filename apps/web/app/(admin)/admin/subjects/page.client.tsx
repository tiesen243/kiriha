'use client'

import Link from 'next/link'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { subjectsSearchParams } from '@/app/(admin)/admin/subjects/page.lib'
import { useTRPC } from '@/trpc/react'

export const SubjectTable: React.FC = () => {
  const [options, setOptions] = useQueryStates(subjectsSearchParams)

  const { trpc } = useTRPC()
  const { data, status } = useQuery(
    trpc.admin.subject.all.queryOptions(options),
  )

  return (
    <Table>
      <TableCaption>List of subjects</TableCaption>
      <SubjectTableHeader />

      <TableBody>
        {status !== 'success' ? (
          <LoadingRows rows={options.limit} cells={6} />
        ) : (
          data.subjects.map((subject) => (
            <SubjectTableRow key={subject.id} subject={subject} />
          ))
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell>
            Total: {status === 'success' ? data.total : 0} subjects
          </TableCell>

          <TableCell colSpan={5}>
            <SubjectTablePagination
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

const SubjectTableHeader: React.FC = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[220px]'>ID</TableHead>
      <TableHead className='min-w-xs'>Name</TableHead>
      <TableHead className='w-[80px] text-center'>Code</TableHead>
      <TableHead className='w-[200px]'>Created At</TableHead>
      <TableHead className='w-[200px]'>Updated At</TableHead>
      <TableHead className='w-[150px] text-center'>Actions</TableHead>
    </TableRow>
  </TableHeader>
)

const SubjectTableRow: React.FC<{
  subject: RouterOutputs['admin']['subject']['all']['subjects'][number]
}> = ({ subject }) => {
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
      <TableCell>{subject.id}</TableCell>
      <TableCell>
        {subject.name.replace(/^([A-Z])(\d{2})(\d{2})$/, '$1$2.$3')}
      </TableCell>
      <TableCell>{subject.code}</TableCell>
      <TableCell>{subject.createdAt.toLocaleString()}</TableCell>
      <TableCell>{subject.updatedAt.toLocaleString()}</TableCell>
      <TableCell className='flex justify-end gap-2'>
        <Button size='sm' variant='outline' asChild>
          <Link href={`/admin/subjects/${subject.id}`}>Edit</Link>
        </Button>
        <Button
          size='sm'
          variant='destructive'
          onClick={() => {
            deleteSubject.mutate({ id: subject.id })
          }}
          disabled={deleteSubject.isPending}
        >
          Delete
        </Button>
      </TableCell>
    </TableRow>
  )
}

const SubjectTablePagination: React.FC<{
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
