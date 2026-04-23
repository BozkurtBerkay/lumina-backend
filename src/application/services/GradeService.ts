import { IGradeRepository } from '../../domain/repositories/IGradeRepository';
import { Grade, CreateGradeDTO, UpdateGradeDTO } from '../../domain/entities/Grade';

export class GradeService {
  constructor(private readonly gradeRepository: IGradeRepository) {}

  async getAllGrades(): Promise<Grade[]> {
    return this.gradeRepository.findAll();
  }

  async getGradeById(id: string): Promise<Grade | null> {
    return this.gradeRepository.findById(id);
  }

  async createGrade(data: CreateGradeDTO): Promise<Grade> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('Grade name is required');
    }
    return this.gradeRepository.create(data);
  }

  async updateGrade(id: string, data: UpdateGradeDTO): Promise<Grade> {
    const existingGrade = await this.gradeRepository.findById(id);
    if (!existingGrade) {
      throw new Error('Grade not found');
    }
    return this.gradeRepository.update(id, data);
  }

  async deleteGrade(id: string): Promise<void> {
    const existingGrade = await this.gradeRepository.findById(id);
    if (!existingGrade) {
      throw new Error('Grade not found');
    }
    await this.gradeRepository.delete(id);
  }
}
