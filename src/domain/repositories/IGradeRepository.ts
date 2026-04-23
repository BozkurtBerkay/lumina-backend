import { Grade, CreateGradeDTO, UpdateGradeDTO } from '../entities/Grade';

export interface IGradeRepository {
  findAll(): Promise<Grade[]>;
  findById(id: string): Promise<Grade | null>;
  create(data: CreateGradeDTO): Promise<Grade>;
  update(id: string, data: UpdateGradeDTO): Promise<Grade>;
  delete(id: string): Promise<void>;
}
