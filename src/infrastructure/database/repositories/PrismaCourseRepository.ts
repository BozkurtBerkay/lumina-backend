import { PrismaClient } from '../../../generated/prisma/client';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../../../domain/entities/Course';
import { ICourseRepository } from '../../../domain/repositories/ICourseRepository';

export class PrismaCourseRepository implements ICourseRepository {
  constructor(private readonly prisma: any) {}

  async findAll(gradeId?: string): Promise<Course[]> {
    return this.prisma.course.findMany({
      where: gradeId ? { gradeId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Course | null> {
    return this.prisma.course.findUnique({
      where: { id },
    });
  }

  async create(data: CreateCourseDTO): Promise<Course> {
    return this.prisma.course.create({
      data: {
        title: data.title,
        description: data.description,
        gradeId: data.gradeId,
      },
    });
  }

  async update(id: string, data: UpdateCourseDTO): Promise<Course> {
    return this.prisma.course.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.course.delete({
      where: { id },
    });
  }
}
