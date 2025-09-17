'use client'

import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

import { Button } from '@kiriha/ui/button'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@kiriha/ui/form'
import { Input } from '@kiriha/ui/input'
import { SubjectModel } from '@kiriha/validators/subject'

import { useTRPC, useTRPCClient } from '@/trpc/react'

export const CreateSubjectForm: React.FC = () => {
  const queryClient = useQueryClient()
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const router = useRouter()

  const { control, handleSubmit, state } = useForm({
    defaultValues: { name: '', credit: 2 },
    validator: SubjectModel.createBody,
    onSubmit: trpcClient.subject.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.subject.all.queryFilter())
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
        Create Subject
      </Button>
    </form>
  )
}
