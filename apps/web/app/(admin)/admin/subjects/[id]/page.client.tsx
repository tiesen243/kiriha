'use client'

import { useRouter } from 'next/navigation'

import type { RouterOutputs } from '@kiriha/api'
import { Button } from '@kiriha/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@kiriha/ui/form'
import { Input } from '@kiriha/ui/input'
import { updateSchema } from '@kiriha/validators/admin/subject'

import { useTRPC } from '@/trpc/react'

export const EditSubjectForm: React.FC<{
  subject: RouterOutputs['admin']['subject']['byId']
}> = ({ subject }) => {
  const { trpc, trpcClient, queryClient } = useTRPC()
  const router = useRouter()

  const { control, handleSubmit, state } = useForm({
    defaultValues: {
      id: subject.id,
      name: subject.name,
      credit: subject.credit,
    },
    validator: updateSchema,
    onSubmit: trpcClient.admin.subject.update.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.admin.subject.all.queryFilter())
      router.push('/admin/subjects')
    },
  })

  return (
    <form className='grid gap-4' onSubmit={handleSubmit}>
      <FormField
        control={control}
        name='name'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Name</FormLabel>
            <FormControl {...field}>
              <Input placeholder='e.g. Mathematics, Physics, Chemistry' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='credit'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Credit</FormLabel>
            <FormControl {...field}>
              <Input type='number' placeholder='e.g. 2, 3, 4' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={state.isPending}>
        Update Subject
      </Button>
    </form>
  )
}
