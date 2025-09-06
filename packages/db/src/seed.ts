import { db, sql } from '.'
import { rooms, students, subjects, teachers, users } from './schema'

async function main() {
  await db.execute(sql`SELECT 1`)

  const newStudents = await db
    .insert(users)
    .values([
      { name: 'Alice Johnson', role: 'student' },
      { name: 'Bob Smith', role: 'student' },
      { name: 'Charlie Brown', role: 'student' },
      { name: 'Diana Prince', role: 'student' },
      { name: 'Ethan Hunt', role: 'student' },
    ])
    .returning()
  await db
    .insert(students)
    .values(newStudents.map((user) => ({ userId: user.id })))

  const newTeachers = await db
    .insert(users)
    .values([
      { name: 'Professor Xavier', role: 'teacher' },
      { name: 'Dr. Strange', role: 'teacher' },
    ])
    .returning()
  await db
    .insert(teachers)
    .values(newTeachers.map((user) => ({ userId: user.id })))

  await db.insert(rooms).values([
    { name: 'I0735', capacity: 52 },
    { name: 'E0111', capacity: 109 },
    { name: 'R0345', capacity: 42 },
    { name: 'C0243', capacity: 177 },
    { name: 'I0125', capacity: 78 },
    { name: 'U0416', capacity: 168 },
    { name: 'H0442', capacity: 115 },
    { name: 'J0335', capacity: 158 },
    { name: 'P0906', capacity: 66 },
    { name: 'Y0303', capacity: 132 },
  ])

  await db
    .insert(subjects)
    .values([
      { name: 'Mathematics' },
      { name: 'Data Structures and Algorithms' },
      { name: 'Operating Systems' },
      { name: 'Database Systems' },
      { name: 'Computer Networks' },
      { name: 'Software Engineering' },
      { name: 'Artificial Intelligence' },
      { name: 'Machine Learning' },
      { name: 'Web Development' },
      { name: 'Mobile App Development' },
    ])
}

main()
  .catch(console.error)
  .finally(() => {
    console.log('Seeding finished.')
    process.exit()
  })
