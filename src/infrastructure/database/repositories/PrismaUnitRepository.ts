import { PrismaClient } from '../../../generated/prisma/client';
import { Unit, CreateUnitDTO, UpdateUnitDTO } from '../../../domain/entities/Unit';
import { IUnitRepository } from '../../../domain/repositories/IUnitRepository';

export class PrismaUnitRepository implements IUnitRepository {
  constructor(private readonly prisma: any) {}

  async findAll(courseId?: string): Promise<Unit[]> {
    return this.prisma.unit.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findById(id: string): Promise<Unit | null> {
    return this.prisma.unit.findUnique({
      where: { id },
    });
  }

  async create(data: CreateUnitDTO): Promise<Unit> {
    return this.prisma.unit.create({
      data: {
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex ?? 0,
        courseId: data.courseId,
      },
    });
  }

  async update(id: string, data: UpdateUnitDTO): Promise<Unit> {
    return this.prisma.unit.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        orderIndex: data.orderIndex,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.unit.delete({
      where: { id },
    });
  }
}
