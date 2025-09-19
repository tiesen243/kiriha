import { SubjectModel } from '@kiriha/validators/subject'

import { SubjectService } from '../services/subject'
import { adminProcedure, createTRPCRouter } from '../trpc'

export const subjectRouter = createTRPCRouter({
  all: adminProcedure
    .input(SubjectModel.manyQuery)
    .query(({ input }) => SubjectService.findMany(input)),

  byId: adminProcedure
    .input(SubjectModel.oneQuery)
    .query(({ input }) => SubjectService.findOne(input)),

  create: adminProcedure
    .input(SubjectModel.createBody)
    .mutation(({ input }) => SubjectService.create(input)),

  update: adminProcedure
    .input(SubjectModel.updateBody)
    .mutation(({ input }) => SubjectService.update(input)),

  delete: adminProcedure
    .input(SubjectModel.oneQuery)
    .mutation(({ input }) => SubjectService.delete(input)),
})
