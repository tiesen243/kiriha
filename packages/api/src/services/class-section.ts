import { TRPCError } from '@trpc/server'

import type { ClassSectionModel } from '@kiriha/validators/class-section'
import { and, db, desc, eq, gte, lte, max, min, sql } from '@kiriha/db'
import {
  classSections,
  rooms,
  subjects,
  teachers,
  users,
} from '@kiriha/db/schema'
import { dayOfWeekMap } from '@kiriha/validators/class-section'

import type { CacheEntry } from '../trpc'

export abstract class ClassSectionService {
  static CACHE_TTL = 30 * 60 * 1000 // 30 minutes
  static caches = new Map<string, CacheEntry<unknown>>()

  static async findMany(query: ClassSectionModel.ManyQuery) {
    const { page, limit, subjectId, startDate, endDate } = query
    const cacheKey = JSON.stringify(['findMany', query])

    const cached = this.caches.get(cacheKey) as CacheEntry<typeof result>
    if (cached && cached.expires > Date.now()) return cached.result

    const whereClauses = []
    if (subjectId)
      whereClauses.push(eq(min(classSections.subjectId), subjectId))
    if (startDate)
      whereClauses.push(gte(min(classSections.date), new Date(startDate)))
    if (endDate)
      whereClauses.push(lte(max(classSections.date), new Date(endDate)))

    const classList = await db
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
      .where(and(...whereClauses))
      .groupBy(classSections.code)
      .innerJoin(subjects, eq(subjects.id, classSections.subjectId))
      .innerJoin(teachers, eq(teachers.id, classSections.teacherId))
      .innerJoin(users, eq(users.id, teachers.userId))
      .innerJoin(rooms, eq(rooms.id, classSections.roomId))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(min(classSections.startTime)))

    const [{ total } = { total: 0 }] = await db.execute<{ total: number }>(
      sql`select count(distinct ${classSections.code}) as total from ${classSections}`,
    )

    const result = {
      classes: classList,
      total: parseInt(total.toString(), 10),
      page,
      totalPages: Math.ceil(total / limit),
    }
    this.caches.set(cacheKey, { result, expires: Date.now() + this.CACHE_TTL })
    return result
  }

  static async findOne(query: ClassSectionModel.OneQuery) {
    const { id } = query
    const cacheKey = JSON.stringify(['findOne', query])

    const cached = this.caches.get(cacheKey) as CacheEntry<typeof result>
    if (cached && cached.expires > Date.now()) return cached.result

    const [classSection] = await db
      .select({
        id: classSections.id,
        code: classSections.code,
        status: classSections.status,
        subject: subjects.name,
        teacher: users.name,
        room: rooms.name,
        date: classSections.date,
        startTime: classSections.startTime,
        endTime: classSections.endTime,
      })
      .from(classSections)
      .where(eq(classSections.id, id))
      .innerJoin(subjects, eq(subjects.id, classSections.subjectId))
      .innerJoin(teachers, eq(teachers.id, classSections.teacherId))
      .innerJoin(users, eq(users.id, teachers.userId))
      .innerJoin(rooms, eq(rooms.id, classSections.roomId))
      .limit(1)

    if (!classSection)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Class section not found',
      })

    const result = { classSection }
    this.caches.set(cacheKey, { result, expires: Date.now() + this.CACHE_TTL })
    return result
  }

  static async create(data: ClassSectionModel.CreateBody) {
    const { subjectId, teacherId, roomId, schedules, startDate, endDate } = data
    const classCode = Math.floor(1e11 + Math.random() * 9e11).toString()

    const insertedClassSections = await db
      .insert(classSections)
      .values(
        schedules.flatMap(({ dayOfWeek, startTime, endTime }) =>
          this.getDatesBetween(
            new Date(startDate),
            new Date(endDate),
            dayOfWeek,
          ).map((date) => ({
            code: classCode,
            subjectId,
            teacherId,
            roomId,
            date: new Date(date),
            startTime,
            endTime,
          })),
        ),
      )
      .returning({ id: classSections.id })

    return { numberOfSections: insertedClassSections.length }
  }

  static async update(data: ClassSectionModel.UpdateBody) {
    const { id, date, ...updateData } = data

    await db
      .update(classSections)
      .set({ ...updateData, date: date ? new Date(date) : undefined })
      .where(eq(classSections.id, id))

    return { classSectionId: id }
  }

  static async delete(query: ClassSectionModel.OneQuery) {
    const { id } = query
    await db.delete(classSections).where(eq(classSections.id, id))
    return { classSectionId: id }
  }

  private static getDatesBetween(
    startDate: Date,
    endDate: Date,
    dayOfWeek: keyof typeof dayOfWeekMap,
  ): Date[] {
    const dates: Date[] = []
    const currentDate = new Date(startDate)

    currentDate.setDate(
      currentDate.getDate() +
        ((dayOfWeekMap[dayOfWeek].getDay - currentDate.getDay() + 7) % 7),
    )
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 7)
    }
    return dates
  }
}
