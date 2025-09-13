import Link from 'next/link'

import { Button } from '@kiriha/ui/button'

import { ClassTable } from '@/app/(admin)/admin/classes/page.client'

export default function ClassesPage(_: PageProps<'/admin/classes'>) {
  return (
    <main className='container py-4'>
      <div className='mb-4 flex items-center justify-between'>
        <h1 className='text-xl font-bold'>Class Sections Management</h1>
        <Button size='sm' asChild>
          <Link href='/admin/classes/create'>Create Class</Link>
        </Button>
      </div>

      <ClassTable />
    </main>
  )
}
