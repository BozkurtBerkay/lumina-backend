import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { AuthService } from "../../application/services/AuthService";
import { SecurityService } from "../../application/services/SecurityService";
import { PrismaUserRepository } from "../../infrastructure/database/repositories/PrismaUserRepository";
import { PrismaAccessTokenRepository } from "../../infrastructure/database/repositories/PrismaAccessTokenRepository";
import { prisma } from "../../infrastructure/database/prismaClient";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../validators/authValidators";

const authRoutes = Router();

// Bağımlılıkları (Dependencies) enjekte ediyoruz
const securityService = new SecurityService();
const userRepository = new PrismaUserRepository(prisma);
const accessTokenRepository = new PrismaAccessTokenRepository(prisma);
const authService = new AuthService(userRepository, accessTokenRepository, securityService);
const authController = new AuthController(authService);

// Rotaları tanımlıyoruz
authRoutes.post("/login", validateRequest(loginSchema), authController.login);

export { authRoutes };
