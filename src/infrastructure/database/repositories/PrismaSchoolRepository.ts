import {
  School,
  CreateSchoolDTO,
  UpdateSchoolDTO,
} from "../../../domain/entities/School";
import { ISchoolRepository } from "../../../domain/repositories/ISchoolRepository";

export class PrismaSchoolRepository implements ISchoolRepository {
  // prisma nesnesini 'any' olarak alıyoruz çünkü ExtendedPrismaClient ile
  // standart PrismaClient arasındaki tip uyuşmazlığını bu şekilde aşıyoruz.
  constructor(private readonly prisma: any) {}

  async findAll(): Promise<School[]> {
    return this.prisma.school.findMany({
      orderBy: { name: "asc" }, // Okulları isme göre sıralayalım
    });
  }

  async findById(id: string): Promise<School | null> {
    return this.prisma.school.findUnique({
      where: { id },
    });
  }

  async create(data: CreateSchoolDTO): Promise<School> {
    return this.prisma.school.create({
      data: {
        name: data.name,
        city: data.city ?? null,
        district: data.district ?? null,
        address: data.address ?? null,
        phoneNumber: data.phoneNumber ?? null,
      },
    });
  }

  async update(id: string, data: UpdateSchoolDTO): Promise<School> {
    return this.prisma.school.update({
      where: { id },
      data: {
        name: data.name,
        city: data.city,
        district: data.district,
        address: data.address,
        phoneNumber: data.phoneNumber,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.school.delete({
      where: { id },
    });
  }
}
