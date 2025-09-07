import { headers } from 'next/headers'

import { EditSubjectForm } from '@/app/(admin)/admin/subjects/[id]/page.client'
import { createApi } from '@/trpc/rsc'

export default async function EditSubjectPage({
  params,
}: PageProps<'/admin/subjects/[id]'>) {
  const { id } = await params

  const api = createApi({ headers: await headers() })
  const subject = await api.admin.subject.byId({ id })

  return (
    <main className='container py-4'>
      <EditSubjectForm subject={subject} />
    </main>
  )
}
