import * as z from 'zod/v4'

export const allSchema = z.object({
  id: z.cuid2(),
  search: z.string().optional(),

  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
})
export type AllInput = z.infer<typeof allSchema>

export const byIdSchema = z.object({
  id: z.cuid2(),
})
export type ByIdInput = z.infer<typeof byIdSchema>

export const createSchema = z.object({
  name: z.string().min(1).max(100),
  capacity: z.number().min(1).max(1000),
})
export type CreateInput = z.infer<typeof createSchema>

export const updateSchema = createSchema.partial().extend({
  id: z.cuid2(),
})
export type UpdateInput = z.infer<typeof updateSchema>
