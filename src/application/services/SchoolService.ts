import { ISchoolRepository } from "../../domain/repositories/ISchoolRepository";
import {
  School,
  CreateSchoolDTO,
  UpdateSchoolDTO,
} from "../../domain/entities/School";

export class SchoolService {
  constructor(private readonly schoolRepository: ISchoolRepository) {}

  async getAllSchools(): Promise<School[]> {
    return this.schoolRepository.findAll();
  }

  async getSchoolById(id: string): Promise<School | null> {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new Error("School not found");
    }
    return school;
  }

  async createSchool(data: CreateSchoolDTO): Promise<School> {
    // Burada örneğin isim boş mu kontrolü veya okul ismi sistemde var mı
    // gibi kontroller eklenebilir. Şimdilik repository'ye paslıyoruz.
    return this.schoolRepository.create(data);
  }

  async updateSchool(id: string, data: UpdateSchoolDTO): Promise<School> {
    // Okulun var olduğundan emin olalım
    await this.getSchoolById(id);
    return this.schoolRepository.update(id, data);
  }

  async deleteSchool(id: string): Promise<void> {
    // Okulun var olduğundan emin olalım
    await this.getSchoolById(id);
    await this.schoolRepository.delete(id);
  }
}
