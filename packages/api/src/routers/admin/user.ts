import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { desc, eq, ilike, or } from '@kiriha/db'
import { students, teachers, users } from '@kiriha/db/schema'
import {
  allSchema,
  byIdSchema,
  byRoleSchema,
  createSchema,
  updateSchema,
} from '@kiriha/validators/admin/user'

import { adminProcedure } from '../../trpc'

export const userRouter = {
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
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .orderBy(desc(users.updatedAt))

    const totalCount = await ctx.db.$count(users)

    return {
      users: usersList,
      total: totalCount,
      page: input.page,
      totalPages: Math.ceil(totalCount / input.limit),
    }
  }),

  byId: adminProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const { id } = input

    const [user] = await ctx.db
      .select(userSelect)
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return user
  }),

  byRole: adminProcedure.input(byRoleSchema).query(async ({ ctx, input }) => {
    const stmt = ctx.db
      .select({
        ...(input.role === 'student'
          ? { studentId: students.id }
          : input.role === 'teacher'
            ? { teacherId: teachers.id }
            : {}),
        id: users.id,
        name: users.name,
        email: users.email,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })

      .from(users)
      .where(eq(users.role, input.role))

    if (input.role === 'student')
      stmt.leftJoin(students, eq(students.userId, users.id))
    else if (input.role === 'teacher')
      stmt.leftJoin(teachers, eq(teachers.userId, users.id))

    stmt
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .orderBy(desc(users.updatedAt))

    const usersList = await stmt

    const totalCount = await ctx.db.$count(users, eq(users.role, input.role))

    return {
      users: usersList,
      total: totalCount,
      page: input.page,
      totalPages: Math.ceil(totalCount / input.limit),
    }
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      const { name, cardId, role } = input

      const [newUser] = await ctx.db
        .insert(users)
        .values({ name, cardId, role })
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

      return { success: true, userId: newUser.id }
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.update(users).set(data).where(eq(users.id, id))
      return { success: true }
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    const { id } = input

    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    if (user.role === 'student')
      await ctx.db.delete(students).where(eq(students.userId, id))
    else if (user.role === 'teacher')
      await ctx.db.delete(teachers).where(eq(teachers.userId, id))

    await ctx.db.delete(users).where(eq(users.id, id))

    return { success: true, userId: id }
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
