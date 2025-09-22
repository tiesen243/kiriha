import { ClassSectionModel } from '@kiriha/validators/class-section'

import { ClassSectionService } from '../services/class-section'
import { adminProcedure, createTRPCRouter } from '../trpc'

export const classSectionRouter = createTRPCRouter({
  all: adminProcedure
    .input(ClassSectionModel.manyQuery)
    .query(({ input }) => ClassSectionService.findMany(input)),

  byId: adminProcedure
    .input(ClassSectionModel.oneQuery)
    .query(({ input }) => ClassSectionService.findOne(input)),

  create: adminProcedure
    .input(ClassSectionModel.createBody)
    .mutation(({ input }) => ClassSectionService.create(input)),

  update: adminProcedure
    .input(ClassSectionModel.updateBody)
    .mutation(({ input }) => ClassSectionService.update(input)),

  delete: adminProcedure
    .input(ClassSectionModel.deleteQuery)
    .mutation(({ input }) => ClassSectionService.delete(input)),
})
