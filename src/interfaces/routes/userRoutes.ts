import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserService } from "../../application/services/UserService";
import { SecurityService } from "../../application/services/SecurityService";
import { PrismaUserRepository } from "../../infrastructure/database/repositories/PrismaUserRepository";
import { prisma } from "../../infrastructure/database/prismaClient";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createUserSchema,
  updateUserSchema,
  userIdParamsSchema,
} from "../validators/userValidators";

const userRoutes = Router();

// Bağımlılıkları (Dependencies) enjekte ediyoruz
const securityService = new SecurityService();
const userRepository = new PrismaUserRepository(prisma);
const userService = new UserService(userRepository, securityService);
const userController = new UserController(userService);

// Rotaları tanımlıyoruz
userRoutes.get("/", userController.getAllUsers);
userRoutes.get(
  "/:id",
  validateRequest(userIdParamsSchema),
  userController.getUserById,
);
userRoutes.post(
  "/",
  validateRequest(createUserSchema),
  userController.createUser,
);
userRoutes.put(
  "/:id",
  validateRequest(updateUserSchema),
  userController.updateUser,
);
userRoutes.delete(
  "/:id",
  validateRequest(userIdParamsSchema),
  userController.deleteUser,
);

export { userRoutes };
