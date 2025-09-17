import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import { lazy } from '@trpc/server'

import { createTRPCRouter, publicProcedure } from '../trpc'

const appRouter = createTRPCRouter({
  health: publicProcedure.query(() => ({ message: 'OK' })),

  nfc: lazy(() => import('./nfc')),
  subject: lazy(() => import('./subject')),
  user: lazy(() => import('./user')),

  class: (await import('./admin/class-section')).classSectionRouter,
  room: (await import('./admin/room')).roomRouter,
})

type AppRouter = typeof appRouter

type RouterInputs = inferRouterInputs<AppRouter>
type RouterOutputs = inferRouterOutputs<AppRouter>

export type { AppRouter, RouterInputs, RouterOutputs }
export { appRouter }
