import { seed } from 'drizzle-seed'

import { Password } from '@kiriha/auth'
import { env } from '@kiriha/validators/env'

import { createId, db, eq, generateSubjectCode } from '.'
import { accounts, rooms, students, subjects, teachers, users } from './schema'

async function main() {
  await seed(db, { rooms, subjects, users }).refine((f) => ({
    subjects: {
      columns: {
        id: f.valuesFromArray({
          values: Array.from({ length: 100 }, () => createId()),
          isUnique: true,
        }),
        code: f.valuesFromArray({
          values: Array.from({ length: 100 }, () => generateSubjectCode()),
        }),
        name: f.jobTitle(),
        credit: f.int({ minValue: 2, maxValue: 4 }),
      },
      count: 50,
    },
    rooms: {
      columns: {
        id: f.valuesFromArray({
          values: Array.from({ length: 100 }, () => createId()),
          isUnique: true,
        }),
        name: f.valuesFromArray({
          values: Array.from({ length: 100 }, () => {
            const building = String.fromCharCode(
              65 + Math.floor(Math.random() * 26),
            )
            const floor = String(Math.floor(Math.random() * 100)).padStart(
              2,
              '0',
            )
            const room = String(Math.floor(Math.random() * 100)).padStart(
              2,
              '0',
            )
            return `${building}${floor}${room}`
          }),
          isUnique: true,
        }),
        capacity: f.int({ minValue: 20, maxValue: 100 }),
      },
      count: 50,
    },
    users: {
      columns: {
        id: f.valuesFromArray({
          values: Array.from({ length: 100 }, () => createId()),
          isUnique: true,
        }),
        cardId: f.default({ defaultValue: null }),
        name: f.fullName(),
        image: f.default({ defaultValue: null }),
        email: f.email(),
        role: f.valuesFromArray({
          values: [
            { weight: 0.8, values: ['student'] },
            { weight: 0.2, values: ['teacher'] },
          ],
        }),
      },
      count: 100,
    },
  }))

  const studentList = await db
    .select()
    .from(users)
    .where(eq(users.role, 'student'))
  await db
    .insert(students)
    .values(studentList.map((user) => ({ userId: user.id })))

  const teacherList = await db
    .select()
    .from(users)
    .where(eq(users.role, 'teacher'))
  await db
    .insert(teachers)
    .values(teacherList.map((user) => ({ userId: user.id })))

  const userList = await db.select().from(users)
  const passwordHash = await Password.hash(env.DEFAULT_PASSWORD)
  await db.insert(accounts).values(
    userList.map((user) => ({
      userId: user.id,
      provider: 'credentials',
      accountId: user.id,
      password: passwordHash,
    })),
  )
}

main()
  .catch(console.error)
  .finally(() => {
    console.log('Seeding finished.')
    process.exit()
  })
