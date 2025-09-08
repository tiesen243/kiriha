import { headers } from 'next/headers'

import { CreateClassForm } from '@/app/(admin)/admin/classes/create/page.client'
import { createApi } from '@/trpc/rsc'

export default async function CreateClassPage() {
  const api = createApi({ headers: await headers() })

  const subjects = await api.admin.subject.all({ limit: 999 })
  const teachers = await api.admin.user.byRole({
    role: 'teacher',
    limit: 999,
  })
  const rooms = await api.admin.room.all({ limit: 999 })

  return (
    <main className='container py-4'>
      <CreateClassForm
        subjects={subjects.subjects}
        teachers={teachers.users}
        rooms={rooms.rooms}
      />
    </main>
  )
}
