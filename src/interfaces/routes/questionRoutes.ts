import { Router } from 'express';
import { QuestionController } from '../controllers/QuestionController';
import { QuestionService } from '../../application/services/QuestionService';
import { PrismaQuestionRepository } from '../../infrastructure/database/repositories/PrismaQuestionRepository';
import { prisma } from '../../infrastructure/database/prismaClient';
import { validateRequest } from '../middlewares/validateRequest';
import { createQuestionSchema, updateQuestionSchema, questionIdParamsSchema, getQuestionsQuerySchema } from '../validators/questionValidators';

const questionRoutes = Router();

// Bağımlılıkları (Dependencies) çözümleme ve inject etme
const questionRepository = new PrismaQuestionRepository(prisma);
const questionService = new QuestionService(questionRepository);
const questionController = new QuestionController(questionService);

// Route tanımları
questionRoutes.get('/', validateRequest(getQuestionsQuerySchema), questionController.getAllQuestions);
questionRoutes.get('/:id', validateRequest(questionIdParamsSchema), questionController.getQuestionById);
questionRoutes.post('/', validateRequest(createQuestionSchema), questionController.createQuestion);
questionRoutes.put('/:id', validateRequest(updateQuestionSchema), questionController.updateQuestion);
questionRoutes.delete('/:id', validateRequest(questionIdParamsSchema), questionController.deleteQuestion);

export { questionRoutes };
