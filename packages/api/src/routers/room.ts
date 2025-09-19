import { RoomModel } from '@kiriha/validators/room'

import { RoomService } from '../services/room'
import { adminProcedure, createTRPCRouter } from '../trpc'

export const roomRouter = createTRPCRouter({
  all: adminProcedure
    .input(RoomModel.manyQuery)
    .query(({ input }) => RoomService.findMany(input)),

  byId: adminProcedure
    .input(RoomModel.oneQuery)
    .query(({ input }) => RoomService.findOne(input)),

  create: adminProcedure
    .input(RoomModel.createBody)
    .mutation(({ input }) => RoomService.create(input)),

  update: adminProcedure
    .input(RoomModel.updateBody)
    .mutation(({ input }) => RoomService.update(input)),

  delete: adminProcedure
    .input(RoomModel.oneQuery)
    .mutation(({ input }) => RoomService.delete(input)),
})
