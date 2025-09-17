import { SubjectModel } from '@kiriha/validators/subject'

import { SubjectService } from '../services/subject'
import { adminProcedure, createTRPCRouter } from '../trpc'

export const subjectRouter = createTRPCRouter({
  all: adminProcedure
    .input(SubjectModel.manyQuery)
    .query(async ({ input }) => SubjectService.findMany(input)),

  byId: adminProcedure
    .input(SubjectModel.oneQuery)
    .query(async ({ input }) => SubjectService.findOne(input)),

  create: adminProcedure
    .input(SubjectModel.createBody)
    .mutation(async ({ input }) => SubjectService.create(input)),

  update: adminProcedure
    .input(SubjectModel.updateBody)
    .mutation(async ({ input }) => SubjectService.update(input)),

  delete: adminProcedure
    .input(SubjectModel.oneQuery)
    .mutation(async ({ input }) => SubjectService.delete(input)),
})
