import { EditSubjectForm } from '@/app/(admin)/admin/subjects/[id]/page.client'
import { api } from '@/trpc/rsc'

export default async function EditSubjectPage({
  params,
}: PageProps<'/admin/subjects/[id]'>) {
  const { id } = await params

  const subject = await api.subject.byId({ id })

  return (
    <main className='container py-4'>
      <EditSubjectForm subject={subject} />
    </main>
  )
}
