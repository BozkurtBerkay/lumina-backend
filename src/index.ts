import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import { globalRateLimiter } from "./interfaces/middlewares/rateLimiter";
import { prisma } from "./infrastructure/database/prismaClient";
import { xssSanitizer } from "./interfaces/middlewares/xssSanitizer";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security & Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xssSanitizer); // Sanitize bodies, queries, params
app.use(globalRateLimiter); // Prevent brute-force/DDoS

// Routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ message: "Lumina API is running smoothly." });
});

app.get("/api", (req: Request, res: Response) => {
  res.status(200).json({ message: "Lumina API is running smoothly." });
});

import { gradeRoutes } from "./interfaces/routes/gradeRoutes";
import { courseRoutes } from "./interfaces/routes/courseRoutes";
import { unitRoutes } from "./interfaces/routes/unitRoutes";
import { questionRoutes } from "./interfaces/routes/questionRoutes";
import { schoolRoutes } from "./interfaces/routes/schoolRoutes";
import { userRoutes } from "./interfaces/routes/userRoutes";
import { authRoutes } from "./interfaces/routes/authRoutes";
import resultRoutes from "./interfaces/routes/resultRoutes";

app.use("/api/grades", gradeRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/units", unitRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/results", resultRoutes);

// Start server
const server = app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("[server]: Shutting down gracefully...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("[server]: Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
