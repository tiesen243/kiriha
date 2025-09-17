import * as z from 'zod'

export namespace UserModel {
  export const manyQuery = z.object({
    search: z.string().min(1).max(100).optional(),
    role: z.enum(['student', 'teacher', 'admin']).optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(100).default(10),
  })
  export type ManyQuery = z.infer<typeof manyQuery>

  export const oneQuery = z.object({
    id: z.cuid2(),
  })
  export type OneQuery = z.infer<typeof oneQuery>

  export const createBody = z.object({
    name: z.string().min(2).max(100),
    cardId: z.string().min(16).max(32),
    role: z.enum(['student', 'teacher', 'admin']).default('student'),
  })
  export type CreateBody = z.infer<typeof createBody>

  export const updateBody = createBody.partial().extend({
    id: z.cuid2(),
    email: z.email().optional(),
    image: z.url().optional(),
  })
  export type UpdateBody = z.infer<typeof updateBody>
}
