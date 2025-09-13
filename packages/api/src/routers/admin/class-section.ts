import type { TRPCRouterRecord } from '@trpc/server'

import { and, eq, gte, lte, max, min, sql } from '@kiriha/db'
import {
  classSections,
  rooms,
  subjects,
  teachers,
  users,
} from '@kiriha/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  dateOfWeekMap,
  updateSchema,
} from '@kiriha/validators/admin/class-section'

import { adminProcedure, publicProcedure } from '../../trpc'

export const classSectionRouter = {
  all: publicProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const { page, limit, subjectId, startDate, endDate } = input

    const conditions = []
    if (subjectId) conditions.push(eq(min(classSections.subjectId), subjectId))
    if (startDate)
      conditions.push(gte(min(classSections.date), new Date(startDate)))
    if (endDate)
      conditions.push(lte(max(classSections.date), new Date(endDate)))

    const result = await ctx.db
      .select({
        code: classSections.code,
        status: min(classSections.status),
        subject: min(subjects.name),
        teachers: sql<string[]>`array_agg(distinct ${users.name})`,
        rooms: sql<string[]>`array_agg(distinct ${rooms.name})`,
        startDate: min(classSections.date),
        endDate: max(classSections.date),
        totalSection: sql<number>`count(${classSections.code})`.mapWith(Number),
      })
      .from(classSections)
      .where(and(...conditions))
      .innerJoin(subjects, eq(subjects.id, classSections.subjectId))
      .innerJoin(teachers, eq(teachers.id, classSections.teacherId))
      .innerJoin(users, eq(users.id, teachers.userId))
      .innerJoin(rooms, eq(rooms.id, classSections.roomId))
      .groupBy(classSections.code)
      .limit(limit)
      .offset((page - 1) * limit)

    const [{ total } = { total: 0 }] = await ctx.db.execute<{ total: number }>(
      sql`select count(distinct ${classSections.code}) as total from ${classSections}`,
    )

    return {
      classes: result,
      total: parseInt(total.toString(), 10),
      page,
      totalPages: Math.ceil(total / limit),
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

      await ctx.db.insert(classSections).values(classSessions)
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, date, ...data } = input

      await ctx.db
        .update(classSections)
        .set({ ...data, date: date ? new Date(date) : undefined })
        .where(eq(classSections.id, id))
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(classSections).where(eq(classSections.id, input.id))
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
