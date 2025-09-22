'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'

import type { RouterOutputs } from '@kiriha/api'
import { Button } from '@kiriha/ui/button'
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxTrigger,
} from '@kiriha/ui/combobox'
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
import { toast } from '@kiriha/ui/sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@kiriha/ui/table'
import {
  ClassSectionModel,
  dayOfWeekMap,
} from '@kiriha/validators/class-section'

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

  const { control, handleSubmit, state, setValue } = useForm({
    defaultValues: {
      subjectId: '',
      teacherId: '',
      roomId: '',
      startDate: '',
      endDate: '',
      schedules: [],
    } as ClassSectionModel.CreateBody,
    validator: ClassSectionModel.createBody,
    onSubmit: trpcClient.classSection.create.mutate,
    onSuccess: async () => {
      await queryClient.invalidateQueries(trpc.classSection.all.queryFilter())
      router.push('/admin/classes')
    },
    onError: (error) => {
      toast.error(error.message)
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
            <Combobox value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <ComboboxTrigger
                  className='w-full'
                  placeholder='Select a subject'
                />
              </FormControl>

              <ComboboxContent>
                {subjects.map((subject) => (
                  <ComboboxItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
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
            <Combobox value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <ComboboxTrigger
                  className='w-full'
                  placeholder='Select a teacher'
                />
              </FormControl>

              <ComboboxContent>
                {teachers.map((teacher) => (
                  <ComboboxItem
                    key={teacher.id}
                    value={String(teacher.teacherId)}
                  >
                    {teacher.name}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
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
            <Combobox value={field.value} onValueChange={field.onChange}>
              <FormControl name={field.name}>
                <ComboboxTrigger
                  className='w-full'
                  placeholder='Select a room'
                />
              </FormControl>

              <ComboboxContent>
                {rooms.map((room) => (
                  <ComboboxItem key={room.id} value={room.id}>
                    {room.name}
                  </ComboboxItem>
                ))}
              </ComboboxContent>
            </Combobox>
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
        render={({ field }) => (
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
                  onSubmit={(
                    schedule: ClassSectionModel.CreateBody['schedules'][number],
                  ) => {
                    setValue('schedules', [...field.value, schedule])
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
                    key={`${schedule.dayOfWeek}-${schedule.startTime}-${schedule.endTime}`}
                  >
                    <TableCell>
                      {dayOfWeekMap[schedule.dayOfWeek].name}
                    </TableCell>
                    <TableCell>{schedule.startTime}</TableCell>
                    <TableCell>{schedule.endTime}</TableCell>
                    <TableCell>
                      <Button
                        variant='destructive'
                        size='sm'
                        onClick={() => {
                          setValue(
                            'schedules',
                            field.value.filter((s) => s !== schedule),
                          )
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
  onSubmit: (
    schedule: ClassSectionModel.CreateBody['schedules'][number],
  ) => void
}> = ({ onSubmit }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: { startTime: '', endTime: '', dayOfWeek: 'mon' },
    validator: ClassSectionModel.createBody.shape.schedules.element,
    onSubmit,
  })

  return (
    <>
      <div className='grid gap-4'>
        <FormField
          control={control}
          name='dayOfWeek'
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
                  {Object.keys(dayOfWeekMap).map((day) => (
                    <SelectItem key={day} value={day}>
                      {dayOfWeekMap[day as keyof typeof dayOfWeekMap].name}
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
