import { Request, Response, NextFunction } from "express";
import { SecurityService } from "../../application/services/SecurityService";
import { PrismaAccessTokenRepository } from "../../infrastructure/database/repositories/PrismaAccessTokenRepository";
import { prisma } from "../../infrastructure/database/prismaClient";

const securityService = new SecurityService();
const accessTokenRepository = new PrismaAccessTokenRepository(prisma);

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = securityService.verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }

  // DB'den token'ı kontrol et
  const dbToken = await accessTokenRepository.findByToken(token);
  if (!dbToken || dbToken.expiresAt < new Date()) {
    res.status(401).json({ message: "Token not found or expired in database" });
    return;
  }

  req.user = decoded;
  next();
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Not authorized" });
      return;
    }

    next();
  };
};
