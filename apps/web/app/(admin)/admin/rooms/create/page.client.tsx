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
import { RoomModel } from '@kiriha/validators/room'

import { useTRPC, useTRPCClient } from '@/trpc/react'

export const CreateRoomForm: React.FC = () => {
  const queryClient = useQueryClient()
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const router = useRouter()

  const { control, handleSubmit, state } = useForm({
    defaultValues: { name: '', capacity: 0 },
    validator: RoomModel.createBody,
    onSubmit: trpcClient.room.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.room.all.queryFilter())
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
