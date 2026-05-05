import { IQuestionRepository } from '../../domain/repositories/IQuestionRepository';
import { Question, CreateQuestionDTO, UpdateQuestionDTO } from '../../domain/entities/Question';

export class QuestionService {
  constructor(private readonly questionRepository: IQuestionRepository) {}

  async getAllQuestions(unitId?: string): Promise<Question[]> {
    return this.questionRepository.findAll(unitId);
  }

  async getQuestionById(id: string): Promise<Question | null> {
    return this.questionRepository.findById(id);
  }

  async createQuestion(data: CreateQuestionDTO): Promise<Question> {
    if (!data.content || data.content.trim() === '') {
      throw new Error('Question content is required');
    }
    if (!data.unitId || data.unitId.trim() === '') {
      throw new Error('Unit ID is required');
    }
    return this.questionRepository.create(data);
  }

  async updateQuestion(id: string, data: UpdateQuestionDTO): Promise<Question> {
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new Error('Question not found');
    }
    return this.questionRepository.update(id, data);
  }

  async deleteQuestion(id: string): Promise<void> {
    const existingQuestion = await this.questionRepository.findById(id);
    if (!existingQuestion) {
      throw new Error('Question not found');
    }
    await this.questionRepository.delete(id);
  }

  async reorderQuestions(items: { id: string; orderIndex: number }[]): Promise<void> {
    await this.questionRepository.reorder(items);
  }
}
