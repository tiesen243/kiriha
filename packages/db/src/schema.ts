import { relations } from 'drizzle-orm'
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

import { generateSubjectCode, generateUserCode } from './utils'

/**
 * ENUMS
 */
export const roleEnums = pgEnum('role', ['admin', 'teacher', 'student'])
export const classStatusEnums = pgEnum('class_section_status', [
  'waiting',
  'locked',
  'completed',
  'cancelled',
])
export const attendanceStatusEnums = pgEnum('attendance_status', [
  'present',
  'absent',
  'late',
  'excused',
])

const createdAt = timestamp({ mode: 'date', withTimezone: true })
  .defaultNow()
  .notNull()
const updatedAt = timestamp({ mode: 'date', withTimezone: true })
  .defaultNow()
  .$onUpdateFn(() => new Date())
  .notNull()

/**
 * USERS
 * --------------------------------------------------------------
 */
export const users = pgTable('users', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  cardId: t.varchar({ length: 32 }).unique(),

  role: roleEnums().default('student'),
  name: t.varchar({ length: 255 }).notNull(),

  email: t.varchar({ length: 320 }).unique(),
  image: t.varchar({ length: 255 }),

  createdAt,
  updatedAt,
}))

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),

  student: many(students),
  teacher: many(teachers),
}))

/**
 * STUDENTS & TEACHERS
 * --------------------------------------------------------------
 * Students have a shorter, custom ID (e.g., 24001234) for easier attendance marking
 * Link to users table via userId
 */
export const students = pgTable(
  'students',
  (t) => ({
    id: t
      .varchar({ length: 10 })
      .$defaultFn(() => generateUserCode())
      .primaryKey()
      .notNull(),
    userId: t
      .uuid()
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    enrolledAt: t.timestamp().defaultNow().notNull(),
  }),
  (t) => [index('student_userId_idx').on(t.userId)],
)

export const studentRelations = relations(students, ({ one, many }) => ({
  user: one(users, { fields: [students.userId], references: [users.id] }),
  attendances: many(attendances),
}))

export const teachers = pgTable(
  'teachers',
  (t) => ({
    id: t
      .varchar({ length: 10 })
      .$defaultFn(() => generateUserCode())
      .primaryKey()
      .notNull(),
    userId: t
      .uuid()
      .unique()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    hiredAt: t.timestamp().defaultNow().notNull(),
  }),
  (t) => [index('teacher_userId_idx').on(t.userId)],
)

export const teacherRelations = relations(teachers, ({ one, many }) => ({
  user: one(users, { fields: [teachers.userId], references: [users.id] }),
  classes: many(classSections),
}))

/**
 * AUTH
 * --------------------------------------------------------------
 * - Accounts link users to external auth providers
 * - Sessions manage user login states
 */
export const accounts = pgTable(
  'accounts',
  (t) => ({
    provider: t.varchar({ length: 255 }).notNull(),
    accountId: t.varchar({ length: 255 }).notNull(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    password: t.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({ columns: [t.provider, t.accountId] }),
    index('account_userId_idx').on(t.userId),
  ],
)

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}))

export const sessions = pgTable(
  'sessions',
  (t) => ({
    token: t.varchar({ length: 255 }).primaryKey().notNull(),
    expires: t.timestamp({ mode: 'date', withTimezone: true }).notNull(),
    userId: t
      .uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  }),
  (t) => [index('session_userId_idx').on(t.userId)],
)

export const sessionRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}))

/**
 * SCHOOL ENTITIES
 * --------------------------------------------------------------
 * - Rooms have a capacity to limit the number of students
 * - Subjects have a unique code for easy identification
 * - Classes link subjects, teachers, and rooms together with a status and time slots
 * - Enrollments link students to classes with a composite primary key
 * - Attendances track student presence in classes with unique constraints to prevent duplicates
 */
export const rooms = pgTable('rooms', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  name: t.varchar({ length: 255 }).notNull(),
  capacity: t.integer().notNull(),
  createdAt,
  updatedAt,
}))

export const roomsRelations = relations(rooms, ({ many }) => ({
  classes: many(classSections),
}))

export const subjects = pgTable('subjects', (t) => ({
  id: t.uuid().primaryKey().defaultRandom().notNull(),
  code: t
    .varchar({ length: 7 })
    .$defaultFn(() => generateSubjectCode())
    .unique()
    .notNull(),
  name: t.varchar({ length: 255 }).notNull(),
  credit: t.integer().notNull(),
  createdAt,
  updatedAt,
}))

export const subjectRelations = relations(subjects, ({ many }) => ({
  classes: many(classSections),
}))

export const classSections = pgTable(
  'class_sections',
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom().notNull(),
    code: t.varchar({ length: 12 }).notNull(),
    subjectId: t
      .uuid()
      .notNull()
      .references(() => subjects.id, { onDelete: 'restrict' }),
    teacherId: t
      .varchar({ length: 10 })
      .notNull()
      .references(() => teachers.id, { onDelete: 'restrict' }),
    roomId: t
      .uuid()
      .notNull()
      .references(() => rooms.id, { onDelete: 'restrict' }),
    status: classStatusEnums().default('waiting').notNull(),

    date: t.date({ mode: 'date' }).notNull(),
    startTime: t.time({ withTimezone: true }).notNull(),
    endTime: t.time({ withTimezone: true }).notNull(),

    createdAt,
    updatedAt,
  }),
  (t) => [
    index('class_section_code_idx').on(t.code),
    index('class_section_subjectId_idx').on(t.subjectId),
    index('class_section_teacherId_idx').on(t.teacherId),
    index('class_section_roomId_idx').on(t.roomId),
  ],
)

export const classRelations = relations(classSections, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [classSections.subjectId],
    references: [subjects.id],
  }),
  teacher: one(teachers, {
    fields: [classSections.teacherId],
    references: [teachers.id],
  }),
  room: one(rooms, { fields: [classSections.roomId], references: [rooms.id] }),
  attendances: many(attendances),
  enrollments: many(enrollments),
}))

export const enrollments = pgTable(
  'enrollments',
  (t) => ({
    studentId: t
      .varchar({ length: 10 })
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    classId: t
      .uuid()
      .notNull()
      .references(() => classSections.id, { onDelete: 'cascade' }),
  }),
  (enrollment) => [
    primaryKey({ columns: [enrollment.studentId, enrollment.classId] }),
  ],
)

export const enrollmentRelations = relations(enrollments, ({ one }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  class: one(classSections, {
    fields: [enrollments.classId],
    references: [classSections.id],
  }),
}))

export const attendances = pgTable(
  'attendances',
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom().notNull(),
    classId: t
      .uuid()
      .notNull()
      .references(() => classSections.id, { onDelete: 'cascade' }),
    studentId: t
      .varchar({ length: 10 })
      .notNull()
      .references(() => students.id, { onDelete: 'cascade' }),
    status: attendanceStatusEnums().notNull(),
    recordedAt: createdAt,
    note: t.varchar({ length: 500 }),
  }),
  (t) => [
    index('attendance_classId_idx').on(t.classId),
    index('attendance_studentId_idx').on(t.studentId),
    uniqueIndex('attendance_classId_studentId_uq_idx').on(
      t.classId,
      t.studentId,
    ),
  ],
)

export const attendanceRelations = relations(attendances, ({ one }) => ({
  class: one(classSections, {
    fields: [attendances.classId],
    references: [classSections.id],
  }),
  student: one(students, {
    fields: [attendances.studentId],
    references: [students.id],
  }),
}))
