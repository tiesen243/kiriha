import { UserModel } from '@kiriha/validators/user'

import { UserService } from '../services/user'
import { adminProcedure, createTRPCRouter } from '../trpc'

export const userRouter = createTRPCRouter({
  all: adminProcedure
    .input(UserModel.manyQuery)
    .query(async ({ input }) => UserService.findMany(input)),

  byId: adminProcedure
    .input(UserModel.oneQuery)
    .query(async ({ input }) => UserService.findOne(input)),

  create: adminProcedure
    .input(UserModel.createBody)
    .mutation(async ({ input }) => UserService.create(input)),

  update: adminProcedure
    .input(UserModel.updateBody)
    .mutation(async ({ input }) => UserService.update(input)),

  delete: adminProcedure
    .input(UserModel.oneQuery)
    .mutation(async ({ input }) => UserService.delete(input)),
})
