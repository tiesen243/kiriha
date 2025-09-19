import * as z from 'zod'

export namespace RoomModel {
  export const manyQuery = z.object({
    search: z.string().optional(),
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(1000).default(10),
  })
  export type ManyQuery = z.infer<typeof manyQuery>

  export const oneQuery = z.object({
    id: z.cuid2(),
  })
  export type OneQuery = z.infer<typeof oneQuery>

  export const createBody = z.object({
    name: z.string().min(1).max(100),
    capacity: z.number().min(1).max(1000),
  })
  export type CreateBody = z.infer<typeof createBody>

  export const updateBody = createBody.partial().extend({
    id: z.cuid2(),
  })
  export type UpdateBody = z.infer<typeof updateBody>
}
