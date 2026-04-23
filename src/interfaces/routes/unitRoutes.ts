import { Router } from 'express';
import { UnitController } from '../controllers/UnitController';
import { UnitService } from '../../application/services/UnitService';
import { PrismaUnitRepository } from '../../infrastructure/database/repositories/PrismaUnitRepository';
import { prisma } from '../../infrastructure/database/prismaClient';
import { validateRequest } from '../middlewares/validateRequest';
import { createUnitSchema, updateUnitSchema, unitIdParamsSchema, getUnitsQuerySchema } from '../validators/unitValidators';

const unitRoutes = Router();

// Bağımlılıkları (Dependencies) çözümleme ve inject etme
const unitRepository = new PrismaUnitRepository(prisma);
const unitService = new UnitService(unitRepository);
const unitController = new UnitController(unitService);

// Route tanımları
unitRoutes.get('/', validateRequest(getUnitsQuerySchema), unitController.getAllUnits);
unitRoutes.get('/:id', validateRequest(unitIdParamsSchema), unitController.getUnitById);
unitRoutes.post('/', validateRequest(createUnitSchema), unitController.createUnit);
unitRoutes.put('/:id', validateRequest(updateUnitSchema), unitController.updateUnit);
unitRoutes.delete('/:id', validateRequest(unitIdParamsSchema), unitController.deleteUnit);

export { unitRoutes };
