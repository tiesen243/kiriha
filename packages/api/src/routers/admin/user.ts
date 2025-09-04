import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { desc, eq, ilike, or } from '@attendify/db'
import { students, teachers, users } from '@attendify/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  updateSchema,
} from '@attendify/validators/admin/user'

import { adminProcedure } from '../../trpc'

export const adminUserRouter = {
  all: adminProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const whereClause = input.search
      ? or(ilike(users.name, input.search), ilike(users.email, input.search))
      : undefined
    const usersList = await ctx.db
      .select(userSelect)
      .from(users)
      .where(whereClause)
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .orderBy(desc(users.createdAt))
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)

    const totalCount = await ctx.db.$count(users)

    return {
      users: usersList,
      total: totalCount,
      page: input.page,
      totalPages: Math.ceil(totalCount / input.limit),
    }
  }),

  byId: adminProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const [user] = await ctx.db
      .select(userSelect)
      .from(users)
      .where(eq(users.id, input.id))
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })
    return user
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const [newUser] = await ctx.db
        .insert(users)
        .values({ name: input.name, cardId: input.cardId, role: input.role })
        .returning({ id: users.id })
      if (!newUser)
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
        })
      if (input.role === 'student')
        await ctx.db.insert(students).values({ userId: newUser.id })
      else if (input.role === 'teacher')
        await ctx.db.insert(teachers).values({ userId: newUser.id })

      return { id: newUser.id }
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.update(users).set(data).where(eq(users.id, id))
      return { success: true }
    }),
} satisfies TRPCRouterRecord

const userSelect = {
  id: users.id,
  cardId: users.cardId,
  studentId: students.id,
  teacherId: teachers.id,

  role: users.role,
  name: users.name,
  email: users.email,

  createdAt: users.createdAt,
  updatedAt: users.updatedAt,
}
