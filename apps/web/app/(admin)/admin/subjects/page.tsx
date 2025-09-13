import Link from 'next/link'

import { Button } from '@kiriha/ui/button'

import { SubjectTable } from '@/app/(admin)/admin/subjects/page.client'
import { subjectsSearchParamsCache } from '@/app/(admin)/admin/subjects/page.lib'

export default function SubjectsPage({
  searchParams,
}: PageProps<'/admin/subjects'>) {
  void subjectsSearchParamsCache.parse(searchParams, { strict: true })

  return (
    <main className='container py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Subjects Management</h1>
        <Button size='sm' asChild>
          <Link href='/admin/subjects/create'>Create Subject</Link>
        </Button>
      </div>

      <SubjectTable />
    </main>
  )
}
