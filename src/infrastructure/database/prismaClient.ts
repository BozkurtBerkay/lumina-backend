import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { QuestionOptions } from '../../domain/entities/Question';

/**
 * Prisma Client Singleton
 * Geliştirme ortamında hot-reload sırasında birden fazla
 * PrismaClient instance oluşmasını engeller.
 */

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL!;
  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
};

const baseClient = createPrismaClient();

export const prisma = baseClient.$extends({
  result: {
    question: {
      options: {
        needs: { options: true },
        compute(question) {
          return question.options as QuestionOptions | null;
        },
      },
    },
  },
});

export type ExtendedPrismaClient = typeof prisma;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}




