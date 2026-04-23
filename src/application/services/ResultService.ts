import { PrismaClient } from "../../generated/prisma/client";
import * as crypto from "crypto";

export class ResultService {
  constructor(private readonly prisma: PrismaClient) {}

  async syncResults(userId: string, results: any[]) {
    // Sınavın bütünü tek seferde gönderildiğini varsayarak hepsine tek bir attemptId (deneme kimliği) veriyoruz.
    const attemptId = crypto.randomUUID();

    if (!results || results.length === 0) return { count: 0 };

    for (const r of results) {
      const id = crypto.randomUUID();
      const timeSpent = parseInt(r.timeSpent, 10) || 0;
      const isCorrect = r.isCorrect ? true : false;
      const createdAt = r.timestamp ? new Date(r.timestamp).toISOString() : new Date().toISOString();

      await this.prisma.$executeRawUnsafe(
        `INSERT INTO "UserQuestionResult" ("id", "userId", "questionId", "userResponse", "timeSpent", "isCorrect", "attemptId", "createdAt") VALUES ($1, $2, $3, $4, $5, $6, $7, $8::timestamp)`,
        id,
        userId,
        r.questionId,
        r.userResponse,
        timeSpent,
        isCorrect,
        attemptId,
        createdAt
      );
    }
    
    return { count: results.length };
  }

  async getUnitResultsForCSV(unitId: string) {
    return await this.prisma.userQuestionResult.findMany({
      where: {
        question: {
          unitId: unitId,
        },
      },
      include: {
        user: {
          include: {
            school: true,
          },
        },
        question: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }

  async getUnitQuestions(unitId: string) {
    return await this.prisma.question.findMany({
      where: { unitId },
      orderBy: { orderIndex: "asc" },
    });
  }
}
