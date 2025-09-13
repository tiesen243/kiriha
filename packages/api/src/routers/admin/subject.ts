import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { desc, eq, ilike } from '@kiriha/db'
import { subjects } from '@kiriha/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  updateSchema,
} from '@kiriha/validators/admin/subject'

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
      .orderBy(desc(subjects.updatedAt))

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
      const { name, credit } = input
      await ctx.db.insert(subjects).values({ name, credit })
      return { success: true }
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, credit } = input
      await ctx.db
        .update(subjects)
        .set({ name, credit })
        .where(eq(subjects.id, id))
      return { success: true }
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(subjects).where(eq(subjects.id, input.id))
    return { success: true }
  }),
} satisfies TRPCRouterRecord
