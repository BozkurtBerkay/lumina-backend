import { ExtendedPrismaClient } from "../prismaClient";
import {
  Question,
  CreateQuestionDTO,
  UpdateQuestionDTO,
} from "../../../domain/entities/Question";
import { IQuestionRepository } from "../../../domain/repositories/IQuestionRepository";

export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: ExtendedPrismaClient) {}

  async findAll(unitId?: string): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: unitId ? { unitId } : undefined,
      orderBy: { orderIndex: "asc" },
    });
    return questions as Question[];
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });
    return question as Question | null;
  }

  async create(data: CreateQuestionDTO): Promise<Question> {
    const question = await this.prisma.question.create({
      data: {
        content: data.content,
        type: data.type ?? "MULTIPLE_CHOICE",
        options: (data.options as any) ?? null,
        correctAnswer: data.correctAnswer ?? null,
        imageUrl: data.imageUrl ?? null,
        imageAlt: data.imageAlt ?? null,
        orderIndex: data.orderIndex ?? 0,
        unitId: data.unitId,
      },
    });
    return question as Question;
  }

  async update(id: string, data: UpdateQuestionDTO): Promise<Question> {
    const question = await this.prisma.question.update({
      where: { id },
      data: {
        content: data.content,
        type: data.type,
        options: data.options as any,
        correctAnswer: data.correctAnswer,
        imageUrl: data.imageUrl,
        imageAlt: data.imageAlt,
        orderIndex: data.orderIndex,
      },
    });
    return question as Question;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({
      where: { id },
    });
  }

  async reorder(items: { id: string; orderIndex: number }[]): Promise<void> {
    await this.prisma.$transaction(
      items.map(({ id, orderIndex }) =>
        this.prisma.question.update({
          where: { id },
          data: { orderIndex },
        })
      )
    );
  }
}
