import { TRPCError } from '@trpc/server'

import type { SubjectModel } from '@kiriha/validators/subject'
import { and, db, desc, eq, ilike } from '@kiriha/db'
import { subjects } from '@kiriha/db/schema'

export abstract class SubjectService {
  static async findMany(query: SubjectModel.ManyQuery) {
    const { search, page, limit } = query

    const whereClauses = []
    if (search) whereClauses.push(ilike(subjects.name, search))

    const subjectList = await db
      .select({
        id: subjects.id,
        code: subjects.code,
        name: subjects.name,
        credit: subjects.credit,
        createdAt: subjects.createdAt,
        updatedAt: subjects.updatedAt,
      })
      .from(subjects)
      .where(and(...whereClauses))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(subjects.updatedAt))
    const total = await db.$count(subjects, and(...whereClauses))

    return {
      subjects: subjectList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
  }

  static async findOne(query: SubjectModel.OneQuery) {
    const { id } = query

    const [subject] = await db
      .select({
        id: subjects.id,
        code: subjects.code,
        name: subjects.name,
        credit: subjects.credit,
        createdAt: subjects.createdAt,
        updatedAt: subjects.updatedAt,
      })
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)
    if (!subject)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })

    return { subject }
  }

  static async create(data: SubjectModel.CreateBody) {
    const { name, credit } = data

    const [newSubject] = await db
      .insert(subjects)
      .values({ name, credit })
      .returning({ id: subjects.id })
    if (!newSubject)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create subject',
      })

    return { subjectId: newSubject.id }
  }

  static async update(data: SubjectModel.UpdateInput) {
    const { id, name, credit } = data

    const [existingSubject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)
    if (!existingSubject)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })

    await db
      .update(subjects)
      .set({ name, credit, updatedAt: new Date() })
      .where(eq(subjects.id, id))

    return { subjectId: id }
  }

  static async delete(data: SubjectModel.OneQuery) {
    const { id } = data

    const [existingSubject] = await db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)
    if (!existingSubject)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })

    await db.delete(subjects).where(eq(subjects.id, id))

    return { subjectId: id }
  }
}
