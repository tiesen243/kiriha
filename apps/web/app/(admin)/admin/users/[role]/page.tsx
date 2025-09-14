import { UserTable } from '@/app/(admin)/admin/users/[role]/page.client'
import { usersSearchParamsCache } from '@/app/(admin)/admin/users/[role]/page.lib'

export default async function UserPage({
  params,
  searchParams,
}: PageProps<'/admin/users/[role]'>) {
  const { role } = await params
  if (!['admin', 'teacher', 'student'].includes(role))
    return (
      <main className='container grid min-h-[calc(100dvh-4rem)] place-items-center py-4'>
        <h1 className='text-xl font-bold'>Invalid role</h1>
      </main>
    )

  await usersSearchParamsCache.parse(searchParams, { strict: true })

  return (
    <main className='container py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Users Management</h1>
      </div>

      <UserTable role={role as 'admin' | 'teacher' | 'student'} />
    </main>
  )
}
