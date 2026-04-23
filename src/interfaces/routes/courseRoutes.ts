import { Router } from 'express';
import { CourseController } from '../controllers/CourseController';
import { CourseService } from '../../application/services/CourseService';
import { PrismaCourseRepository } from '../../infrastructure/database/repositories/PrismaCourseRepository';
import { prisma } from '../../infrastructure/database/prismaClient';
import { validateRequest } from '../middlewares/validateRequest';
import { createCourseSchema, updateCourseSchema, courseIdParamsSchema, getCoursesQuerySchema } from '../validators/courseValidators';

const courseRoutes = Router();

// Bağımlılıkları (Dependencies) çözümleme ve inject etme
const courseRepository = new PrismaCourseRepository(prisma);
const courseService = new CourseService(courseRepository);
const courseController = new CourseController(courseService);

// Route tanımları
courseRoutes.get('/', validateRequest(getCoursesQuerySchema), courseController.getAllCourses);
courseRoutes.get('/:id', validateRequest(courseIdParamsSchema), courseController.getCourseById);
courseRoutes.post('/', validateRequest(createCourseSchema), courseController.createCourse);
courseRoutes.put('/:id', validateRequest(updateCourseSchema), courseController.updateCourse);
courseRoutes.delete('/:id', validateRequest(courseIdParamsSchema), courseController.deleteCourse);

export { courseRoutes };

