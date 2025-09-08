import type { TRPCRouterRecord } from '@trpc/server'

import { and, desc, eq, gte } from '@attendify/db'
import { classes, rooms, subjects, teachers, users } from '@attendify/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  dateOfWeekMap,
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

    const result = await ctx.db
      .select({
        id: classes.id,
        code: classes.code,
        subject: subjects.name,
        teacher: users.name,
        room: rooms.name,
        status: classes.status,
        date: classes.date,
        startTime: classes.startTime,
        endTime: classes.endTime,
      })
      .from(classes)
      .where(and(...whereClause))
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .orderBy(desc(classes.date))
      .innerJoin(subjects, eq(subjects.id, classes.subjectId))
      .innerJoin(teachers, eq(teachers.id, classes.teacherId))
      .innerJoin(users, eq(users.id, teachers.userId))
      .innerJoin(rooms, eq(rooms.id, classes.roomId))
    const totalItems = await ctx.db.$count(classes)

    return {
      classes: result,
      total: totalItems,
      page: input.page,
      totalPages: Math.ceil(totalItems / input.limit),
    }
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { subjectId, teacherId, roomId } = input
      const { startDate, endDate, schedules } = input

      const classCode = Math.floor(1e11 + Math.random() * 9e11).toString()
      const classSessions = schedules.flatMap(
        ({ dateOfWeek, startTime, endTime }) =>
          getDatesBetween(
            new Date(startDate),
            new Date(endDate),
            dateOfWeek,
          ).map((date) => ({
            code: classCode,
            subjectId,
            teacherId,
            roomId,
            date,
            startTime,
            endTime,
          })),
      )

      await ctx.db.insert(classes).values(classSessions)
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
  dateOfWeek: keyof typeof dateOfWeekMap,
): Date[] {
  const dates: Date[] = []
  const currentDate = new Date(startDate)

  currentDate.setDate(
    currentDate.getDate() +
      ((dateOfWeekMap[dateOfWeek].getDay - currentDate.getDay() + 7) % 7),
  )
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 7)
  }
  return dates
}
