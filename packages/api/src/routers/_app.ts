import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ message: 'OK' })),

  nfc: (await import('./nfc')).nfcRouter,

  admin: {
    user: (await import('./admin/user')).adminUserRouter,
  },
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
