import { TRPCError } from '@trpc/server'

import type { UserModel } from '@kiriha/validators/user'
import { and, db, desc, eq, ilike, or } from '@kiriha/db'
import { students, teachers, users } from '@kiriha/db/schema'

export abstract class UserService {
  static async findMany(query: UserModel.ManyQuery) {
    const { search, role, limit, page } = query

    const whereClauses = []
    if (search)
      whereClauses.push(
        or(ilike(users.name, search), ilike(users.email, search)),
      )
    if (role) whereClauses.push(eq(users.role, role))

    const usersList = await db
      .select(this.userSelect)
      .from(users)
      .where(and(...whereClauses))
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .limit(query.limit)
      .offset((page - 1) * limit)
      .orderBy(desc(users.updatedAt))
    const totalCount = await db.$count(users)

    return {
      users: usersList,
      page,
      totalPages: Math.ceil(totalCount / limit),
    }
  }

  static async findOne(query: UserModel.OneQuery) {
    const [user] = await db
      .select(this.userSelect)
      .from(users)
      .where(eq(users.id, query.id))
      .leftJoin(students, eq(students.userId, users.id))
      .leftJoin(teachers, eq(teachers.userId, users.id))
      .limit(1)
    if (!user)
      throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' })

    return { user }
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

  static userSelect = {
    id: users.id,
    cardId: users.cardId,
    studentId: students.id,
    teacherId: teachers.id,

    name: users.name,
    email: users.email,
    role: users.role,

    createdAt: users.createdAt,
    updatedAt: users.updatedAt,
  }
}
