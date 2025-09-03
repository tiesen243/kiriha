import * as z from 'zod/v4'

export const scanSchema = z.object({
  cardId: z.string().min(1),
  roomId: z.string().optional(),
})
export type ScanInput = z.infer<typeof scanSchema>
