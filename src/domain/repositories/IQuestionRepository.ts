import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '../entities/Question';

export interface IQuestionRepository {
  findAll(unitId?: string): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
  create(data: CreateQuestionDTO): Promise<Question>;
  update(id: string, data: UpdateQuestionDTO): Promise<Question>;
  delete(id: string): Promise<void>;
  reorder(items: { id: string; orderIndex: number }[]): Promise<void>;
}
