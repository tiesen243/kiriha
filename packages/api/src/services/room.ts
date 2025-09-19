import { TRPCError } from '@trpc/server'

import type { RoomModel } from '@kiriha/validators/room'
import { and, db, desc, eq, ilike } from '@kiriha/db'
import { rooms } from '@kiriha/db/schema'

export abstract class RoomService {
  static async findMany(query: RoomModel.ManyQuery) {
    const { search, page, limit } = query

    const whereClauses = []
    if (search) whereClauses.push(ilike(rooms.name, search))

    const roomList = await db
      .select({
        id: rooms.id,
        name: rooms.name,
        capacity: rooms.capacity,
        createdAt: rooms.createdAt,
        updatedAt: rooms.updatedAt,
      })
      .from(rooms)
      .where(and(...whereClauses))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(rooms.updatedAt))
    const totalItems = await db.$count(rooms, and(...whereClauses))

    return {
      rooms: roomList,
      total: totalItems,
      page: page,
      totalPages: Math.ceil(totalItems / query.limit),
    }
  }

  static async findOne(query: RoomModel.OneQuery) {
    const { id } = query

    const [room] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)
    if (!room)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })

    return { room }
  }

  static async create(data: RoomModel.CreateBody) {
    const { name, capacity } = data

    const [newRoom] = await db
      .insert(rooms)
      .values({ name, capacity })
      .returning({ id: rooms.id })
    if (!newRoom)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create room',
      })

    return { roomId: newRoom.id }
  }

  static async update(data: RoomModel.UpdateBody) {
    const { id, name, capacity } = data

    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)
    if (!existingRoom)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })

    await db
      .update(rooms)
      .set({
        name: name ?? existingRoom.name,
        capacity: capacity ?? existingRoom.capacity,
      })
      .where(eq(rooms.id, id))

    return { roomId: id }
  }

  static async delete(data: RoomModel.OneQuery) {
    const { id } = data

    const [existingRoom] = await db
      .select()
      .from(rooms)
      .where(eq(rooms.id, id))
      .limit(1)
    if (!existingRoom)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Room not found' })

    await db.delete(rooms).where(eq(rooms.id, id))

    return { roomId: id }
  }
}
