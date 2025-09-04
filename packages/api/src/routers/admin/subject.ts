import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { eq, ilike } from '@attendify/db'
import { subjects } from '@attendify/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  updateSchema,
} from '@attendify/validators/admin/subject'

import { adminProcedure } from '../../trpc'

export const subjectRouter = {
  all: adminProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const whereClause = input.search
      ? ilike(subjects.name, input.search)
      : undefined

    const subjectList = await ctx.db
      .select()
      .from(subjects)
      .where(whereClause)
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
    const totalItems = await ctx.db.$count(subjects)

    return {
      subjects: subjectList,
      total: totalItems,
      page: input.page,
      totalPages: Math.ceil(totalItems / input.limit),
    }
  }),

  byId: adminProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const { id } = input

    const [subject] = await ctx.db
      .select()
      .from(subjects)
      .where(eq(subjects.id, id))
      .limit(1)
    if (!subject)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })

    return subject
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { name } = input
      const code = generateSubjectCode(name)

      const [newSubject] = await ctx.db
        .insert(subjects)
        .values({ name, code })
        .returning({ id: subjects.id })
      return newSubject
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name } = input

      const [currentSubject] = await ctx.db
        .select({ name: subjects.name, code: subjects.code })
        .from(subjects)
        .where(eq(subjects.id, id))
        .limit(1)
      if (!currentSubject)
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })

      if (name && name !== currentSubject.name) {
        currentSubject.name = name
        currentSubject.code = generateSubjectCode(name)
      }
      const [updatedSubject] = await ctx.db
        .update(subjects)
        .set(currentSubject)
        .where(eq(subjects.id, id))
        .returning({ id: subjects.id })
      return updatedSubject
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const { id } = input
    const deleteCount = await ctx.db.delete(subjects).where(eq(subjects.id, id))
    if (deleteCount.length === 0)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Subject not found' })
    return { success: true }
  }),
} satisfies TRPCRouterRecord

function generateSubjectCode(name: string): string {
  const prefix = name.slice(0, 3).toUpperCase()
  const suffix = Math.floor(100000 + Math.random() * 900000).toString()
  return `${prefix}${suffix}`
}
