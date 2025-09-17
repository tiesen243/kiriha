'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

import type { RouterOutputs } from '@kiriha/api'
import type { CreateInput } from '@kiriha/validators/admin/class-section'
import { Button } from '@kiriha/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@kiriha/ui/dialog'
import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  useForm,
} from '@kiriha/ui/form'
import { Input } from '@kiriha/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kiriha/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kiriha/ui/table'
import {
  createSchema,
  dateOfWeekMap,
} from '@kiriha/validators/admin/class-section'

import { useTRPC, useTRPCClient } from '@/trpc/react'

export const CreateClassForm: React.FC<{
  subjects: RouterOutputs['subject']['all']['subjects']
  teachers: RouterOutputs['user']['all']['users']
  rooms: RouterOutputs['room']['all']['rooms']
}> = ({ subjects, teachers, rooms }) => {
  const queryClient = useQueryClient()
  const trpcClient = useTRPCClient()
  const trpc = useTRPC()
  const router = useRouter()

  const [open, setOpen] = useState(false)

  const { control, handleSubmit, state } = useForm({
    defaultValues: {
      subjectId: '',
      teacherId: '',
      roomId: '',
      startDate: '',
      endDate: '',
      schedules: [],
    } as CreateInput,
    validator: createSchema,
    onSubmit: trpcClient.class.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.class.all.queryFilter())
      router.push('/admin/classes')
    },
    onError: (error) => {
      console.error('Failed to create class:', error)
    },
  })

  return (
    <div className='grid gap-4'>
      <FormField
        control={control}
        name='subjectId'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Subject</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a subject' />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='teacherId'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Teacher</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a teacher' />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {teachers.map(
                  (teacher) =>
                    'teacherId' in teacher && (
                      <SelectItem
                        key={teacher.id}
                        value={teacher.teacherId ?? ''}
                      >
                        {teacher.name}
                      </SelectItem>
                    ),
                )}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='roomId'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Room</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select a room' />
                </SelectTrigger>
              </FormControl>

              <SelectContent>
                {rooms.map((room) => (
                  <SelectItem key={room.id} value={room.id}>
                    {room.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='startDate'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>Start Date</FormLabel>
            <FormControl {...field}>
              <Input type='date' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='endDate'
        render={({ field }) => (
          <div className='grid gap-2'>
            <FormLabel>End Date</FormLabel>
            <FormControl {...field}>
              <Input type='date' />
            </FormControl>
            <FormMessage />
          </div>
        )}
      />

      <FormField
        control={control}
        name='schedules'
        render={({ field, setValue }) => (
          <div className='grid gap-2'>
            <Dialog open={open} onOpenChange={setOpen}>
              <div className='flex items-center justify-between'>
                <FormLabel>Schedules</FormLabel>
                <DialogTrigger asChild>
                  <Button variant='outline' size='sm'>
                    Add Schedule
                  </Button>
                </DialogTrigger>
              </div>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Schedule</DialogTitle>
                  <DialogDescription>
                    Select the day and time for this class schedule.
                  </DialogDescription>
                </DialogHeader>
                <ScheduleForm
                  onSubmit={(schedule: CreateInput['schedules'][number]) => {
                    setValue([...field.value, schedule])
                    setOpen(false)
                  }}
                />
              </DialogContent>
            </Dialog>

            <FormMessage />

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Day of Week</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>End Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {field.value.map((schedule) => (
                  <TableRow
                    key={`${schedule.dateOfWeek}-${schedule.startTime}-${schedule.endTime}`}
                  >
                    <TableCell>
                      {dateOfWeekMap[schedule.dateOfWeek].name}
                    </TableCell>
                    <TableCell>{schedule.startTime}</TableCell>
                    <TableCell>{schedule.endTime}</TableCell>
                    <TableCell>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => {
                          setValue(field.value.filter((s) => s !== schedule))
                        }}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      />

      <Button type='button' disabled={state.isPending} onClick={handleSubmit}>
        Create Class
      </Button>
    </div>
  )
}

const ScheduleForm: React.FC<{
  onSubmit: (schedule: CreateInput['schedules'][number]) => void
}> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { startTime: '', endTime: '', dateOfWeek: 'mon' },
    validator: createSchema.shape.schedules.element,
    onSubmit,
  })

  return (
    <>
      <div className='grid gap-4'>
        <FormField
          control={control}
          name='dateOfWeek'
          render={({ field }) => (
            <div className='grid gap-2'>
              <FormLabel>Date of Week</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl name={field.name}>
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Select a day' />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {Object.keys(dateOfWeekMap).map((day) => (
                    <SelectItem key={day} value={day}>
                      {dateOfWeekMap[day as keyof typeof dateOfWeekMap].name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={control}
          name='startTime'
          render={({ field }) => (
            <div className='grid gap-2'>
              <FormLabel>Start Time</FormLabel>
              <FormControl {...field}>
                <Input type='time' required />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />

        <FormField
          control={control}
          name='endTime'
          render={({ field }) => (
            <div className='grid gap-2'>
              <FormLabel>End Time</FormLabel>
              <FormControl {...field}>
                <Input type='time' required />
              </FormControl>
              <FormMessage />
            </div>
          )}
        />
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='outline' type='button'>
            Cancel
          </Button>
        </DialogClose>

        <Button type='submit' onClick={handleSubmit}>
          Add Schedule
        </Button>
      </DialogFooter>
    </>
  )
}
