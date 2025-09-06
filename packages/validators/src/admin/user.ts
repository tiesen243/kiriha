import * as z from 'zod'

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

export const createSchema = z.object({
  name: z.string().min(2).max(100),
  cardId: z.string().min(16).max(32),
  role: z.enum(['student', 'teacher', 'admin']).default('student'),
})
export type CreateInput = z.infer<typeof createSchema>

export const updateSchema = createSchema.partial().extend({
  id: z.cuid2(),
  email: z.email().optional(),
  image: z.url().optional(),
})
export type UpdateInput = z.infer<typeof updateSchema>
