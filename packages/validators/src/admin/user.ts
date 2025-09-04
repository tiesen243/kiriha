import * as z from 'zod/v4'

export const allSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().min(1).max(100).optional(),
})
export type AllInput = z.infer<typeof allSchema>

export const byIdSchema = z.object({
  id: z.cuid2(),
})
export type ByIdInput = z.infer<typeof byIdSchema>

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  cardId: z.string().min(16).max(32),
  role: z.enum(['student', 'teacher', 'admin']).default('student'),
})
export type CreateUserInput = z.infer<typeof createUserSchema>

export const updateUserSchema = z.object({
  id: z.cuid2(),
  cardId: z.string().min(16).max(32).optional(),
  role: z.enum(['student', 'teacher', 'admin']).optional(),
  name: z.string().min(2).max(100).optional(),
  email: z.email().optional(),
  image: z.url().optional(),
})
export type UpdateUserInput = z.infer<typeof updateUserSchema>
