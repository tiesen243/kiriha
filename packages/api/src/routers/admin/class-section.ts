import type { TRPCRouterRecord } from '@trpc/server'

import { and, desc, eq, gte } from '@attendify/db'
import { classes } from '@attendify/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  updateSchema,
} from '@attendify/validators/admin/class-section'

import { adminProcedure } from '../../trpc'

export const classSectionRouter = {
  all: adminProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const { roomId, subjectId, teacherId, startDate, endDate } = input

    const whereClause = []
    if (roomId) whereClause.push(eq(classes.roomId, roomId))
    if (subjectId) whereClause.push(eq(classes.subjectId, subjectId))
    if (teacherId) whereClause.push(eq(classes.teacherId, teacherId))
    if (startDate) whereClause.push(gte(classes.date, new Date(startDate)))
    if (endDate) whereClause.push(gte(classes.date, new Date(endDate)))

    return await ctx.db
      .select()
      .from(classes)
      .where(and(...whereClause))
      .orderBy(desc(classes.date))
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { subjectId, teacherId, roomId, endTime, startTime } = input
      const { startDate, endDate, dateOfWeek } = input

      const dates = getDatesBetween(
        new Date(startDate),
        new Date(endDate),
        dateOfWeek,
      )
      await ctx.db.insert(classes).values(
        dates.map((date) => ({
          roomId,
          subjectId,
          teacherId,

          date,
          endTime,
          startTime,
        })),
      )
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, date, ...data } = input

      await ctx.db
        .update(classes)
        .set({ ...data, date: date ? new Date(date) : undefined })
        .where(eq(classes.id, id))
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(classes).where(eq(classes.id, input.id))
  }),
} satisfies TRPCRouterRecord

function getDatesBetween(
  startDate: Date,
  endDate: Date,
  dayOfWeek: number,
): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)

  currentDate.setDate(
    currentDate.getDate() + ((dayOfWeek - currentDate.getDay() + 7) % 7),
  )
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 7)
  }
  return dates
}
