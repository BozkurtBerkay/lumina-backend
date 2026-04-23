import { Router } from "express";
import { SchoolController } from "../controllers/SchoolController";
import { SchoolService } from "../../application/services/SchoolService";
import { PrismaSchoolRepository } from "../../infrastructure/database/repositories/PrismaSchoolRepository";
import { prisma } from "../../infrastructure/database/prismaClient";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createSchoolSchema,
  updateSchoolSchema,
  schoolIdParamsSchema,
} from "../validators/schoolValidators";

const schoolRoutes = Router();

// Bağımlılıkları (Dependencies) enjekte ediyoruz
const schoolRepository = new PrismaSchoolRepository(prisma);
const schoolService = new SchoolService(schoolRepository);
const schoolController = new SchoolController(schoolService);

// Rotaları tanımlıyoruz
schoolRoutes.get("/", schoolController.getAllSchools);
schoolRoutes.get(
  "/:id",
  validateRequest(schoolIdParamsSchema),
  schoolController.getSchoolById,
);
schoolRoutes.post(
  "/",
  validateRequest(createSchoolSchema),
  schoolController.createSchool,
);
schoolRoutes.put(
  "/:id",
  validateRequest(updateSchoolSchema),
  schoolController.updateSchool,
);
schoolRoutes.delete(
  "/:id",
  validateRequest(schoolIdParamsSchema),
  schoolController.deleteSchool,
);

export { schoolRoutes };
