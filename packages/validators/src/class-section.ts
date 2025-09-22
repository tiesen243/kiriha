import * as z from 'zod'

export namespace ClassSectionModel {
  export const manyQuery = z.object({
    roomId: z.cuid2().optional(),
    subjectId: z.cuid2().optional(),
    teacherId: z.cuid2().optional(),
    startDate: z.iso.date().optional(),
    endDate: z.iso.date().optional(),

    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type ManyQuery = z.infer<typeof manyQuery>

  export const oneQuery = z.object({
    id: z.cuid2(),
  })
  export type OneQuery = z.infer<typeof oneQuery>

  export const createBody = z
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
            dayOfWeek: z.enum([
              'mon',
              'tue',
              'wed',
              'thu',
              'fri',
              'sat',
              'sun',
            ]),
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
  export type CreateBody = z.infer<typeof createBody>

  export const updateBody = z.object({
    id: z.cuid2(),

    roomId: z.cuid2().optional(),
    subjectId: z.cuid2().optional(),
    teacherId: z.cuid2().optional(),

    startTime: z.iso.time().optional(),
    endTime: z.iso.time().optional(),

    date: z.iso.date().optional(),
  })
  export type UpdateBody = z.infer<typeof updateBody>

  export const deleteQuery = z.object({
    id: z.cuid2().optional(),
    code: z.string().length(12).optional(),
  })
  export type DeleteQuery = z.infer<typeof deleteQuery>
}

export const dayOfWeekMap: Record<
  ClassSectionModel.CreateBody['schedules'][number]['dayOfWeek'],
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
