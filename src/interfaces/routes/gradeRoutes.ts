import { Router } from 'express';
import { GradeController } from '../controllers/GradeController';
import { GradeService } from '../../application/services/GradeService';
import { PrismaGradeRepository } from '../../infrastructure/database/repositories/PrismaGradeRepository';
import { prisma } from '../../infrastructure/database/prismaClient';
import { validateRequest } from '../middlewares/validateRequest';
import { createGradeSchema, updateGradeSchema, gradeIdParamsSchema } from '../validators/gradeValidators';

const gradeRoutes = Router();

// Bağımlılıkları (Dependencies) çözümleme ve inject etme
const gradeRepository = new PrismaGradeRepository(prisma);
const gradeService = new GradeService(gradeRepository);
const gradeController = new GradeController(gradeService);

// Route tanımları
gradeRoutes.get('/', gradeController.getAllGrades);
gradeRoutes.get('/:id', validateRequest(gradeIdParamsSchema), gradeController.getGradeById);
gradeRoutes.post('/', validateRequest(createGradeSchema), gradeController.createGrade);
gradeRoutes.put('/:id', validateRequest(updateGradeSchema), gradeController.updateGrade);
gradeRoutes.delete('/:id', validateRequest(gradeIdParamsSchema), gradeController.deleteGrade);

export { gradeRoutes };
