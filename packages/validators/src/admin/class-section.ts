import * as z from 'zod'

export const allSchema = z.object({
  roomId: z.cuid2().optional(),
  subjectId: z.cuid2().optional(),
  teacherId: z.cuid2().optional(),
  startDate: z.iso.date().optional(),
  endDate: z.iso.date().optional(),
})
export type AllInput = z.infer<typeof allSchema>

export const byIdSchema = z.object({
  id: z.cuid2(),
})
export type ByIdInput = z.infer<typeof byIdSchema>

export const createSchema = z.object({
  roomId: z.cuid2(),
  subjectId: z.cuid2(),
  teacherId: z.cuid2(),

  startDate: z.iso.date(),
  endDate: z.iso.date(),

  schedules: z.array(
    z.object({
      startTime: z.iso.time(),
      endTime: z.iso.time(),
      dateOfWeek: z.number().min(0).max(6),
    }),
  ),
})
export type CreateClassSectionInput = z.infer<typeof createSchema>

export const updateSchema = z.object({
  id: z.cuid2(),

  roomId: z.cuid2().optional(),
  subjectId: z.cuid2().optional(),
  teacherId: z.cuid2().optional(),

  startTime: z.iso.time().optional(),
  endTime: z.iso.time().optional(),

  date: z.iso.date().optional(),
})
export type UpdateClassSectionInput = z.infer<typeof updateSchema>
