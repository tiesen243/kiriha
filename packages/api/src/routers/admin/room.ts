import type { TRPCRouterRecord } from '@trpc/server'
import { TRPCError } from '@trpc/server'

import { desc, eq, ilike } from '@kiriha/db'
import { rooms } from '@kiriha/db/schema'
import {
  allSchema,
  byIdSchema,
  createSchema,
  updateSchema,
} from '@kiriha/validators/admin/room'

import { adminProcedure } from '../../trpc'

export const roomRouter = {
  all: adminProcedure.input(allSchema).query(async ({ ctx, input }) => {
    const whereClause = input.search
      ? ilike(rooms.name, `%${input.search}%`)
      : undefined

    const roomList = await ctx.db
      .select()
      .from(rooms)
      .where(whereClause)
      .limit(input.limit)
      .offset((input.page - 1) * input.limit)
      .orderBy(desc(rooms.updatedAt))
    const totalItems = await ctx.db.$count(rooms)

    return {
      rooms: roomList,
      total: totalItems,
      page: input.page,
      totalPages: Math.ceil(totalItems / input.limit),
    }
  }),

  byId: adminProcedure.input(byIdSchema).query(async ({ ctx, input }) => {
    const [room] = await ctx.db
      .select()
      .from(rooms)
      .where(eq(rooms.id, input.id))
      .limit(1)
    if (!room)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })

    return room
  }),

  create: adminProcedure
    .input(createSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(rooms)
        .values({ name: input.name, capacity: input.capacity })
      return { success: true }
    }),

  update: adminProcedure
    .input(updateSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      await ctx.db.update(rooms).set(data).where(eq(rooms.id, id))
      return { success: true }
    }),

  delete: adminProcedure.input(byIdSchema).mutation(async ({ ctx, input }) => {
    await ctx.db.delete(rooms).where(eq(rooms.id, input.id))
    return { success: true }
  }),
} satisfies TRPCRouterRecord
