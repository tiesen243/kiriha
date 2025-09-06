import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ message: 'OK' })),

  nfc: (await import('./nfc')).nfcRouter,

  admin: {
    class: (await import('./admin/class-section')).classSectionRouter,
    room: (await import('./admin/room')).roomRouter,
    subject: (await import('./admin/subject')).subjectRouter,
    user: (await import('./admin/user')).userRouter,
  },
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
