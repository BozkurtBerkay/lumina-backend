import { PrismaClient } from '../../../generated/prisma/client';
import { Grade, CreateGradeDTO, UpdateGradeDTO } from '../../../domain/entities/Grade';
import { IGradeRepository } from '../../../domain/repositories/IGradeRepository';

export class PrismaGradeRepository implements IGradeRepository {
  constructor(private readonly prisma: any) {}

  async findAll(): Promise<Grade[]> {
    return this.prisma.grade.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findById(id: string): Promise<Grade | null> {
    return this.prisma.grade.findUnique({
      where: { id },
    });
  }

  async create(data: CreateGradeDTO): Promise<Grade> {
    return this.prisma.grade.create({
      data: {
        name: data.name,
        description: data.description,
        orderIndex: data.orderIndex ?? 0,
      },
    });
  }

  async update(id: string, data: UpdateGradeDTO): Promise<Grade> {
    return this.prisma.grade.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        orderIndex: data.orderIndex,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.grade.delete({
      where: { id },
    });
  }
}
