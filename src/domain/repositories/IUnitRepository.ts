import { Unit, CreateUnitDTO, UpdateUnitDTO } from '../entities/Unit';

export interface IUnitRepository {
  findAll(courseId?: string): Promise<Unit[]>;
  findById(id: string): Promise<Unit | null>;
  create(data: CreateUnitDTO): Promise<Unit>;
  update(id: string, data: UpdateUnitDTO): Promise<Unit>;
  delete(id: string): Promise<void>;
}
