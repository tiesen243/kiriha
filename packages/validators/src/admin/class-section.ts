import * as z from 'zod'

export const allSchema = z.object({
  roomId: z.cuid2().optional(),
  subjectId: z.cuid2().optional(),
  teacherId: z.cuid2().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),

  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})
export type AllInput = z.infer<typeof allSchema>

export const byIdSchema = z.object({
  id: z.cuid2(),
})
export type ByIdInput = z.infer<typeof byIdSchema>

export const createSchema = z
  .object({
    roomId: z.cuid2(),
    subjectId: z.cuid2(),
    teacherId: z.cuid2(),

    startDate: z.iso.date(),
    endDate: z.iso.date(),

    schedules: z.array(
      z
        .object({
          startTime: z.iso.time(),
          endTime: z.iso.time(),
          dateOfWeek: z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']),
        })
        .refine((val) => val.startTime < val.endTime, {
          message: 'endTime must be after startTime',
          path: ['endTime'],
        }),
    ),
  })
  .refine((val) => val.startDate < val.endDate, {
    message: 'endDate must be after startDate',
    path: ['endDate'],
  })
export type CreateInput = z.infer<typeof createSchema>
export const dateOfWeekMap: Record<
  CreateInput['schedules'][number]['dateOfWeek'],
  { name: string; getDay: number }
> = {
  sun: { name: 'Sunday', getDay: 0 },
  mon: { name: 'Monday', getDay: 1 },
  tue: { name: 'Tuesday', getDay: 2 },
  wed: { name: 'Wednesday', getDay: 3 },
  thu: { name: 'Thursday', getDay: 4 },
  fri: { name: 'Friday', getDay: 5 },
  sat: { name: 'Saturday', getDay: 6 },
}

export const updateSchema = z.object({
  id: z.cuid2(),

  roomId: z.cuid2().optional(),
  subjectId: z.cuid2().optional(),
  teacherId: z.cuid2().optional(),

  startTime: z.iso.time().optional(),
  endTime: z.iso.time().optional(),

  date: z.iso.date().optional(),
})
export type UpdateInput = z.infer<typeof updateSchema>
