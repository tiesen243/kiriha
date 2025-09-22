import { TRPCError } from '@trpc/server'

import type { UserModel } from '@kiriha/validators/user'
import { and, db, desc, eq, ilike, or } from '@kiriha/db'
import { students, teachers, users } from '@kiriha/db/schema'

import type { CacheEntry } from '../trpc'

export abstract class UserService {
  static CACHE_TTL = 30 * 60 * 1000 // 30 minutes
  static caches = new Map<string, CacheEntry<unknown>>()

  static async findMany(query: UserModel.ManyQuery) {
    const { search, role, limit, page } = query
    const cacheKey = JSON.stringify(['findMany', query])

    const cached = this.caches.get(cacheKey) as CacheEntry<typeof result>
    if (cached && cached.expires > Date.now()) return cached.result

    const whereClauses = []
    if (search)
      whereClauses.push(
        or(ilike(users.name, search), ilike(users.email, search)),
      )
    if (role) whereClauses.push(eq(users.role, role))

    const userList = db
      .select({
        id: users.id,
        cardId: users.cardId,
        ...(role === 'student' && { studentId: students.id }),
        ...(role === 'teacher' && { teacherId: teachers.id }),

        name: users.name,
        email: users.email,
        role: users.role,

        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(and(...whereClauses))
      .limit(limit)
      .offset((page - 1) * limit)
      .orderBy(desc(users.updatedAt))
    if (role === 'student')
      userList.leftJoin(students, eq(students.userId, users.id))
    else if (role === 'teacher')
      userList.leftJoin(teachers, eq(teachers.userId, users.id))

    const total = await db.$count(users, and(...whereClauses))

    const result = {
      users: await userList,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }
    this.caches.set(cacheKey, { result, expires: Date.now() + this.CACHE_TTL })
    return result
  }

  static async findOne(query: UserModel.OneQuery) {
    const { id } = query
    const cacheKey = JSON.stringify(['findOne', query])

    const cached = this.caches.get(cacheKey) as CacheEntry<typeof result>
    if (cached && cached.expires > Date.now()) return cached.result

    const [user] = await db
      .select({
        id: users.id,
        cardId: users.cardId,
        studentId: students.id,
        teacherId: teachers.id,

        name: users.name,
        email: users.email,
        role: users.role,
        image: users.image,

        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    const result = { user }
    this.caches.set(cacheKey, { result, expires: Date.now() + this.CACHE_TTL })
    return result
  }

  static async create(data: UserModel.CreateBody) {
    const { cardId, name, role } = data

    const [newUser] = await db
      .insert(users)
      .values({ cardId, name, role })
      .returning({ id: users.id })
    if (!newUser)
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create user',
      })

    if (data.role === 'student')
      await db.insert(students).values({ userId: newUser.id })
    else if (data.role === 'teacher')
      await db.insert(teachers).values({ userId: newUser.id })

    return { userId: newUser.id }
  }

  static async update(data: UserModel.UpdateBody) {
    const { id, ...updateData } = data
    const [updatedUser] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, id))
      .returning({ id: users.id })
    if (!updatedUser)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User not found',
      })

    return { userId: updatedUser.id }
  }

  static async delete(data: UserModel.OneQuery) {
    const { id } = data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    if (user.role === 'student')
      await db.delete(students).where(eq(students.userId, id))
    else if (user.role === 'teacher')
      await db.delete(teachers).where(eq(teachers.userId, id))

    await db.delete(users).where(eq(users.id, id))

    return { userId: id }
  }
}
