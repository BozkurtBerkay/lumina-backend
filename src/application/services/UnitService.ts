import { IUnitRepository } from '../../domain/repositories/IUnitRepository';
import { Unit, CreateUnitDTO, UpdateUnitDTO } from '../../domain/entities/Unit';

export class UnitService {
  constructor(private readonly unitRepository: IUnitRepository) {}

  async getAllUnits(courseId?: string): Promise<Unit[]> {
    return this.unitRepository.findAll(courseId);
  }

  async getUnitById(id: string): Promise<Unit | null> {
    return this.unitRepository.findById(id);
  }

  async createUnit(data: CreateUnitDTO): Promise<Unit> {
    if (!data.title || data.title.trim() === '') {
      throw new Error('Unit title is required');
    }
    if (!data.courseId || data.courseId.trim() === '') {
      throw new Error('Course ID is required');
    }
    return this.unitRepository.create(data);
  }

  async updateUnit(id: string, data: UpdateUnitDTO): Promise<Unit> {
    const existingUnit = await this.unitRepository.findById(id);
    if (!existingUnit) {
      throw new Error('Unit not found');
    }
    return this.unitRepository.update(id, data);
  }

  async deleteUnit(id: string): Promise<void> {
    const existingUnit = await this.unitRepository.findById(id);
    if (!existingUnit) {
      throw new Error('Unit not found');
    }
    await this.unitRepository.delete(id);
  }
}
