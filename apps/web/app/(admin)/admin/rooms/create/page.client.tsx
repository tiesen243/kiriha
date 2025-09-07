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
import { createSchema } from '@attendify/validators/admin/room'

import { useTRPC } from '@/trpc/react'

export const CreateRoomForm: React.FC = () => {
  const { trpc, trpcClient, queryClient } = useTRPC()
  const router = useRouter()

  const { control, handleSubmit, state } = useForm({
    defaultValues: { name: '', capacity: 0 },
    validator: createSchema,
    onSubmit: trpcClient.admin.room.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.admin.room.all.queryFilter())
      router.push('/admin/rooms')
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
              <Input placeholder='Room Name' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='capacity'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Capacity</FormLabel>
            <FormControl {...field}>
              <Input type='number' placeholder='Room Capacity' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <Button type='submit' disabled={state.isPending}>
        Create Room
      </Button>
    </form>
  )
}
