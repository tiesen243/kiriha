'use client'

import { useRouter } from 'next/navigation'

import { Button } from '@attendify/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@attendify/ui/form'
import { Input } from '@attendify/ui/input'
import { createSchema } from '@attendify/validators/admin/subject'

import { useTRPC } from '@/trpc/react'

export const CreateSubjectForm: React.FC = () => {
  const { trpc, trpcClient, queryClient } = useTRPC()
  const router = useRouter()

  const { control, handleSubmit, state } = useForm({
    defaultValues: { name: '' },
    validator: createSchema,
    onSubmit: trpcClient.admin.subject.create.mutate,
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
              <Input placeholder='Subject Name' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={state.isPending}>
        Create Subject
      </Button>
    </form>
  )
}
