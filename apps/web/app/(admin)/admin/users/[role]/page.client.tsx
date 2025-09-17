'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
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
import { usersSearchParams } from '@/app/(admin)/admin/users/[role]/page.lib'
import { useTRPC } from '@/trpc/react'

export const UserTable: React.FC<{ role: 'admin' | 'teacher' | 'student' }> = ({
  role,
}) => {
  const [options, setOptions] = useQueryStates(usersSearchParams)

  const trpc = useTRPC()
  const { data, status } = useQuery(trpc.user.all.queryOptions({ role }))

  return (
    <Table>
      <TableCaption>List of {role}s</TableCaption>
      <UserTableHeader />
      <TableBody>
        {status !== 'success' ? (
          <LoadingRows cells={7} />
        ) : (
          data.users.map((user) => <UserTableRow key={user.id} user={user} />)
        )}
      </TableBody>

      <TableFooter>
        <TableRow>
          <TableCell colSpan={7}>
            <UserTablePagination
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

const UserTableHeader: React.FC = () => (
  <TableHeader>
    <TableRow>
      <TableHead className='w-[220px]'>ID</TableHead>
      <TableHead>Card ID</TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Email</TableHead>
      <TableHead className='w-[200px]'>Created At</TableHead>
      <TableHead className='w-[200px]'>Updated At</TableHead>
      <TableHead className='w-[150px] text-center'>Actions</TableHead>
    </TableRow>
  </TableHeader>
)

const UserTableRow: React.FC<{
  user: RouterOutputs['user']['all']['users'][number]
}> = ({ user }) => (
  <TableRow className='h-14'>
    <TableCell>{user.id}</TableCell>
    <TableCell>{user.cardId}</TableCell>
    <TableCell>{user.name}</TableCell>
    <TableCell>{user.email}</TableCell>
    <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
    <TableCell>{user.updatedAt.toLocaleDateString()}</TableCell>
    <TableCell className='flex justify-end gap-2'>
      <Button size='sm' variant='outline' asChild>
        <Link href={`/admin/users/edit?id=${user.id}`}>Edit</Link>
      </Button>
      <Button size='sm' variant='destructive'>
        Delete
      </Button>
    </TableCell>
  </TableRow>
)

const UserTablePagination: React.FC<{
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
