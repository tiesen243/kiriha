import { CreateClassForm } from '@/app/(admin)/admin/classes/create/page.client'
import { api } from '@/trpc/rsc'

export default async function CreateClassPage() {
  const [teachers, subjects, rooms] = await Promise.all([
    api.user.all({ role: 'teacher', limit: 100 }),
    api.subject.all({ limit: 100 }),
    api.room.all({ limit: 100 }),
  ])

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
