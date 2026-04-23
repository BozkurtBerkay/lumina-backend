import { Router } from 'express';
import { ResultController } from '../controllers/ResultController';
import { ResultService } from '../../application/services/ResultService';
import { authenticate } from '../middlewares/authMiddleware';
import { prisma } from '../../infrastructure/database/prismaClient';

const router = Router();
const resultService = new ResultService(prisma as any);
const resultController = new ResultController(resultService);

// Tüm sonuç işlemleri için giriş yapmış olmak gerekir
router.use(authenticate);

router.post('/sync', resultController.syncResults);
router.get('/export/:unitId', resultController.exportToCSV);

export default router;
